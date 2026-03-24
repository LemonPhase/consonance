import asyncio

from sqlalchemy import select

from app.database import Base, SessionLocal, engine
from app.models.argument import Argument
from app.models.policy import Policy


async def seed() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as session:
        existing = (await session.execute(select(Policy.id).limit(1))).first()
        if existing:
            return

        policies = [
            Policy(
                slug="ubi",
                title="Universal Basic Income",
                question="Should Universal Basic Income be implemented?",
                description="A universal cash transfer policy proposal.",
                status="published",
                created_by_user_id="mock-user-001",
            ),
            Policy(
                slug="rent-control",
                title="Rent Control",
                question="Should cities expand rent control policies?",
                description="Debate over affordability and housing supply impacts.",
                status="published",
                created_by_user_id="mock-user-001",
            ),
        ]
        session.add_all(policies)
        await session.flush()

        arguments = [
            Argument(
                policy_id=policies[0].id,
                author_user_id="mock-user-001",
                side="for",
                claim="UBI creates a guaranteed floor against extreme poverty.",
                reasoning="Direct cash support prevents households from falling below subsistence.",
                status="active",
                quality_score=72,
                ai_clarity_score=0.79,
                source_credibility_score=0.74,
                upvotes=8,
                downvotes=2,
            ),
            Argument(
                policy_id=policies[0].id,
                author_user_id="mock-user-001",
                side="against",
                claim="UBI could require unsustainably high tax revenue.",
                reasoning="Funding universal transfers at meaningful levels can strain public budgets.",
                status="active",
                quality_score=69,
                ai_clarity_score=0.75,
                source_credibility_score=0.71,
                upvotes=7,
                downvotes=3,
            ),
            Argument(
                policy_id=policies[1].id,
                author_user_id="mock-user-001",
                side="for",
                claim="Rent control can reduce displacement in high-demand neighborhoods.",
                reasoning="Price caps provide stability for long-term tenants facing rapid rent increases.",
                status="active",
                quality_score=66,
                ai_clarity_score=0.71,
                source_credibility_score=0.68,
                upvotes=5,
                downvotes=2,
            ),
            Argument(
                policy_id=policies[1].id,
                author_user_id="mock-user-001",
                side="against",
                claim="Strict rent control can reduce long-term housing supply.",
                reasoning="Developers may build less when expected returns are constrained.",
                status="active",
                quality_score=70,
                ai_clarity_score=0.77,
                source_credibility_score=0.73,
                upvotes=6,
                downvotes=2,
            ),
        ]
        session.add_all(arguments)
        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
