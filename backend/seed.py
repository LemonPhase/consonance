import asyncio
import random

from sqlalchemy import delete, select

from app.database import Base, SessionLocal, engine
from app.models.argument import Argument
from app.models.comment import Comment
from app.models.policy import Policy
from app.models.source import Source
from app.models.summary import PolicySummary
from app.models.vote import Vote
from app.services.summary_service import generate_policy_summary


SEED_USER_IDS = [
    "mock-user-001",
    "mock-user-002",
    "mock-user-003",
    "mock-user-004",
    "mock-user-005",
    "mock-user-006",
    "mock-user-007",
    "mock-user-008",
    "mock-user-009",
    "mock-user-010",
]


POLICY_BLUEPRINTS = [
    {
        "slug": "national-housing-targets",
        "title": "National Housing Targets: Reforming Macro-Planning Constraints",
        "question": "Should England enforce mandatory annual housing delivery targets?",
        "description": (
            "A statutory mandate for local authorities to meet minimum delivery thresholds, "
            "with debate over affordability, planning autonomy, and infrastructure capacity."
        ),
        "status": "published",
        "domain": "housing",
        "arguments": {
            "for": [
                (
                    "Mandatory targets reduce planning uncertainty for builders.",
                    "Predictable planning approvals lower financing risk and encourage long-horizon investment.",
                ),
                (
                    "Higher supply is required to stabilize rent growth.",
                    "Sustained underbuilding relative to household growth pushes rents above wage growth in many regions.",
                ),
                (
                    "National targets can align transport and housing planning.",
                    "A clear pipeline helps agencies coordinate rail, bus, and utility expansion with housing starts.",
                ),
                (
                    "Delivery benchmarks improve accountability.",
                    "Comparable annual metrics make it easier to identify bottlenecks and underperforming jurisdictions.",
                ),
                (
                    "Young households benefit from increased market entry.",
                    "Greater stock turnover improves access for first-time buyers and renters.",
                ),
                (
                    "Clear targets reduce policy oscillation.",
                    "Frequent local plan reversals create volatility that delays delivery and increases cost.",
                ),
            ],
            "against": [
                (
                    "Uniform targets ignore regional infrastructure constraints.",
                    "Areas with strained schools, GPs, and roads may struggle to absorb accelerated delivery.",
                ),
                (
                    "Local democratic legitimacy may be weakened.",
                    "Top-down quotas can conflict with locally negotiated plans and place-based priorities.",
                ),
                (
                    "Housing quality may suffer under pressure to hit quotas.",
                    "Numeric targets can incentivize smaller units and lower design quality if safeguards are weak.",
                ),
                (
                    "Land release without utilities is ineffective.",
                    "Approvals do not translate into completions when grid, water, and transport upgrades lag.",
                ),
                (
                    "Targets can distort green-belt trade-offs.",
                    "Hard quotas may push development toward politically easier but environmentally sensitive sites.",
                ),
                (
                    "Construction capacity is cyclical.",
                    "Labor shortages and financing costs can make strict annual quotas unrealistic in downturns.",
                ),
            ],
        },
    },
    {
        "slug": "levelling-up-evaluation",
        "title": "Levelling Up White Paper 2025 Evaluation",
        "question": "Has regional investment policy reduced geographic inequality?",
        "description": (
            "Assessment of transport, skills, and productivity outcomes following place-based public investment."
        ),
        "status": "published",
        "domain": "education",
        "arguments": {
            "for": [
                (
                    "Transport upgrades have improved labor market access.",
                    "Reduced commute times broaden job matching and raise participation in peripheral towns.",
                ),
                (
                    "Skills funding increased technical qualification uptake.",
                    "Further-education partnerships expanded enrollment in high-demand vocational tracks.",
                ),
                (
                    "Institutional capacity improved in combined authorities.",
                    "Multi-year settlements enabled better planning and procurement sequencing.",
                ),
                (
                    "Targeted regeneration crowded in private capital.",
                    "Public anchor investments lowered perceived risk for commercial redevelopment.",
                ),
                (
                    "Digital infrastructure narrowed service gaps.",
                    "Fiber expansion supported remote work and SME productivity outside major city cores.",
                ),
                (
                    "Place-based metrics improved policy transparency.",
                    "Comparable indicators now allow clearer scrutiny of region-by-region outcomes.",
                ),
            ],
            "against": [
                (
                    "Headline outcomes remain concentrated in already resilient regions.",
                    "Marginal gains in leading cities can mask weak progress in structurally lagging localities.",
                ),
                (
                    "Short funding cycles undermine continuity.",
                    "Competitive bid rounds create stop-start delivery and high administrative overhead.",
                ),
                (
                    "Productivity effects are not yet robust.",
                    "Many indicators improve slowly and remain sensitive to national macroeconomic trends.",
                ),
                (
                    "Local capacity is uneven.",
                    "Authorities with fewer technical staff struggle to design and execute complex projects.",
                ),
                (
                    "Evaluation methods are inconsistent.",
                    "Differing baselines and outcome windows reduce comparability across programs.",
                ),
                (
                    "The policy may rebrand rather than structurally reform.",
                    "Without fiscal devolution, localities still face limited control over growth levers.",
                ),
            ],
        },
    },
    {
        "slug": "nhs-staffing-subsidies",
        "title": "NHS External Staffing Subsidies",
        "question": "Should government subsidize temporary staffing to cut waiting lists faster?",
        "description": (
            "Debate over short-term capacity relief versus long-term workforce retention and cost efficiency."
        ),
        "status": "published",
        "domain": "healthcare",
        "arguments": {
            "for": [
                (
                    "Temporary staff can reduce peak waiting-list pressure.",
                    "Rapid deployment in bottleneck specialties prevents backlog compounding.",
                ),
                (
                    "Patients benefit from shorter diagnostic delays.",
                    "Timely diagnostics reduce downstream acute admissions and clinical deterioration.",
                ),
                (
                    "Targeted subsidies can be geographically precise.",
                    "Funding can prioritize trusts with the largest treatment-time variance.",
                ),
                (
                    "Flexible staffing supports winter resilience.",
                    "Seasonal surges can be managed without permanent overstaffing in lower-demand periods.",
                ),
                (
                    "Operational pilots can inform permanent workforce reform.",
                    "Short-term interventions generate utilization data for redesigning rota and training pathways.",
                ),
                (
                    "Specialist agency pools can reduce cancellation rates.",
                    "Filling short-notice gaps prevents avoidable elective surgery cancellations.",
                ),
            ],
            "against": [
                (
                    "Agency dependence can weaken permanent retention.",
                    "Differential pay structures may incentivize internal churn toward temporary contracts.",
                ),
                (
                    "Cost per treatment can rise materially.",
                    "Temporary staffing often commands premium rates relative to equivalent in-house labor.",
                ),
                (
                    "Continuity of care may decline.",
                    "Frequent team rotation can reduce care coordination in complex cases.",
                ),
                (
                    "Subsidies risk becoming structurally permanent.",
                    "Short-term crisis tools can persist without addressing training pipeline constraints.",
                ),
                (
                    "Management overhead increases.",
                    "Procurement, onboarding, and supervision burdens can absorb clinical leadership time.",
                ),
                (
                    "Equity concerns arise across trusts.",
                    "Regions with stronger procurement capacity may capture disproportionate subsidy benefit.",
                ),
            ],
        },
    },
    {
        "slug": "universal-basic-income-pilot",
        "title": "Universal Basic Income Pilot",
        "question": "Should the UK expand city-scale UBI pilots?",
        "description": (
            "Evaluation of unconditional cash transfers for poverty reduction, labor incentives, and fiscal sustainability."
        ),
        "status": "published",
        "domain": "economy",
        "arguments": {
            "for": [
                (
                    "Unconditional transfers reduce extreme income volatility.",
                    "Households gain predictable liquidity that improves budgeting and debt servicing.",
                ),
                (
                    "Simplified eligibility lowers administrative friction.",
                    "Universal criteria reduce exclusion errors and claims-processing overhead.",
                ),
                (
                    "Pilots can improve evidence quality before national rollout.",
                    "Randomized or phased designs reveal heterogeneous effects across demographics.",
                ),
                (
                    "Income floors may improve mental health outcomes.",
                    "Financial stability reduces chronic stress linked to health-service demand.",
                ),
                (
                    "UBI supports entrepreneurial risk-taking.",
                    "Basic security can encourage business formation and career transitions.",
                ),
                (
                    "Household bargaining power may improve.",
                    "Independent income streams can reduce financial coercion in vulnerable settings.",
                ),
            ],
            "against": [
                (
                    "Fiscal cost remains the central constraint.",
                    "Meaningful payment levels imply major tax changes or reallocation from existing services.",
                ),
                (
                    "Opportunity cost versus targeted support is high.",
                    "Universal transfers may dilute resources that could be concentrated on highest-need households.",
                ),
                (
                    "Labor-supply effects are uncertain at scale.",
                    "Pilot outcomes may not generalize when policy becomes economy-wide.",
                ),
                (
                    "Inflationary pressures are contested.",
                    "Cash expansion without supply-side responses can raise prices in constrained local markets.",
                ),
                (
                    "Political durability is unclear.",
                    "A future fiscal consolidation cycle could reverse gains and destabilize expectations.",
                ),
                (
                    "Integration with disability and housing support is complex.",
                    "Poor benefit harmonization can inadvertently reduce net support for vulnerable groups.",
                ),
            ],
        },
    },
]


EVIDENCE_POOL = {
    "housing": [
        "CMA Housebuilding Market Study (2024)",
        "DLUHC Housing Supply Statistics (2023)",
        "ONS Private Rental Price Index (2024)",
        "LSE Housing Elasticity Working Paper",
        "National Infrastructure Commission Capacity Note",
    ],
    "education": [
        "ONS Regional Productivity Release (2024)",
        "DfE Skills Bootcamps Progress Report",
        "NAO Levelling Up Programme Review",
        "Institute for Government Devolution Tracker",
        "Treasury Green Book Place-Based Evaluation Annex",
    ],
    "healthcare": [
        "NHS England Referral to Treatment Statistics",
        "Health Foundation Workforce Analysis",
        "King's Fund Agency Staffing Brief",
        "BMJ Waiting List Outcome Study",
        "Nuffield Trust Elective Recovery Review",
    ],
    "economy": [
        "IFS Distributional Impact Brief",
        "OECD Income Support Policy Survey",
        "Finland Basic Income Experiment Final Report",
        "Bank of England Household Resilience Bulletin",
        "Resolution Foundation Welfare Simplification Paper",
    ],
}


def status_to_card_status(status: str) -> tuple[str, str]:
    if status == "published":
        return ("active-disagreement", "Active Expert Disagreement")
    if status == "archived":
        return ("settled", "Broadly Settled")
    return ("uncertain", "Draft / Early Stage")


async def clear_existing_data() -> None:
    async with SessionLocal() as session:
        await session.execute(delete(Comment))
        await session.execute(delete(Vote))
        await session.execute(delete(PolicySummary))
        await session.execute(delete(Argument))
        await session.execute(delete(Source))
        await session.execute(delete(Policy))
        await session.commit()


async def seed() -> None:
    random.seed(42)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    await clear_existing_data()

    async with SessionLocal() as session:
        created_policies: list[Policy] = []

        for idx, blueprint in enumerate(POLICY_BLUEPRINTS):
            policy = Policy(
                slug=blueprint["slug"],
                title=blueprint["title"],
                question=blueprint["question"],
                description=blueprint["description"],
                status=blueprint["status"],
                created_by_user_id=SEED_USER_IDS[idx % len(SEED_USER_IDS)],
            )
            session.add(policy)
            created_policies.append(policy)

        await session.flush()

        for blueprint, policy in zip(POLICY_BLUEPRINTS, created_policies):
            policy_arguments: list[Argument] = []
            policy_sources = EVIDENCE_POOL.get(blueprint["domain"], [])
            policy_source_records: list[tuple[str, str]] = []

            for source_title in policy_sources:
                source_url = f"https://example.org/{blueprint['slug']}/{source_title.lower().replace(' ', '-')}"
                policy_source_records.append((source_title, source_url))
                session.add(
                    Source(
                        url=source_url,
                        title=source_title,
                        publisher="Consonance Demo Corpus",
                        source_type="independent_analysis",
                        credibility_score=round(random.uniform(0.68, 0.93), 2),
                        created_by_user_id="mock-user-001",
                    )
                )

            for side in ("for", "against"):
                for claim, reasoning in blueprint["arguments"][side]:
                    upvotes = random.randint(18, 220)
                    downvotes = random.randint(4, 70)
                    include_sources = random.random() < 0.62
                    source_count = random.randint(1, 2) if include_sources else 0
                    selected_sources = (
                        random.sample(policy_source_records, k=source_count) if source_count else []
                    )
                    source_note = (
                        "Sources: " + "; ".join(f"{title}|{url}" for title, url in selected_sources)
                        if selected_sources
                        else None
                    )
                    argument = Argument(
                        policy_id=policy.id,
                        author_user_id=random.choice(SEED_USER_IDS),
                        side=side,
                        claim=claim,
                        reasoning=reasoning,
                        counterarguments_addressed=source_note,
                        status="active",
                        quality_score=random.randint(58, 92),
                        ai_clarity_score=round(random.uniform(0.62, 0.94), 2),
                        source_credibility_score=round(random.uniform(0.58, 0.91), 2),
                        upvotes=upvotes,
                        downvotes=downvotes,
                    )
                    session.add(argument)
                    policy_arguments.append(argument)

            await session.flush()

            for argument in policy_arguments:
                comment_count = random.randint(3, 9)
                voters = random.sample(SEED_USER_IDS, k=random.randint(4, 9))

                for user_id in voters:
                    session.add(
                        Vote(
                            user_id=user_id,
                            argument_id=argument.id,
                            value=random.choice([1, -1]),
                        )
                    )

                opening_templates_for = [
                    "This point is persuasive because",
                    "Strong argument overall, especially",
                    "I agree with the direction here;",
                    "This aligns with the evidence that",
                    "Reasonable take. One thing worth highlighting is",
                ]
                opening_templates_against = [
                    "I think this overstates the case because",
                    "I'm not convinced, mainly since",
                    "Important concern, but we should consider that",
                    "This claim seems incomplete because",
                    "Potentially true, but the downside is that",
                ]
                closing_templates = [
                    "the implementation details will determine the outcome.",
                    "regional differences could materially change the result.",
                    "the fiscal assumptions need to be explicit.",
                    "this should be tested with phased rollout evidence.",
                    "it depends heavily on local delivery capacity.",
                    "we need stronger causal evidence, not just correlation.",
                ]

                claim_fragment = argument.claim.rstrip(".").lower()
                openings = opening_templates_for if argument.side == "for" else opening_templates_against

                for _ in range(comment_count):
                    comment_text = (
                        f"{random.choice(openings)} {claim_fragment}; "
                        f"{random.choice(closing_templates)}"
                    )
                    session.add(
                        Comment(
                            argument_id=argument.id,
                            author_user_id=random.choice(SEED_USER_IDS),
                            body=comment_text,
                            status="active",
                        )
                    )

            await session.commit()

    async with SessionLocal() as session:
        policies = (await session.execute(select(Policy))).scalars().all()
        for policy in policies:
            await generate_policy_summary(
                session,
                policy_id=policy.id,
                policy_question=policy.question,
                max_points_per_side=5,
            )


if __name__ == "__main__":
    asyncio.run(seed())
