from __future__ import annotations

import json

from openai import OpenAI
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.argument import Argument
from app.models.summary import PolicySummary


def _build_prompt(policy_question: str, arguments: list[Argument], max_points_per_side: int) -> str:
    serialized = [
        {
            "id": arg.id,
            "side": arg.side,
            "claim": arg.claim,
            "reasoning": arg.reasoning,
            "upvotes": arg.upvotes,
            "downvotes": arg.downvotes,
            "quality_score": arg.quality_score,
        }
        for arg in arguments
    ]

    return (
        "You are summarizing a policy debate.\n"
        "Return strict JSON with keys: strongest_for, strongest_against, "
        "supporting_argument_ids_for, supporting_argument_ids_against.\n"
        f"Each strongest_* list must have at most {max_points_per_side} bullet strings.\n"
        "Only include argument ids that are present in input.\n"
        f"Policy question: {policy_question}\n"
        f"Arguments: {json.dumps(serialized)}"
    )


def _fallback_summary(arguments: list[Argument], max_points_per_side: int) -> dict[str, list[str]]:
    for_args = [a for a in arguments if a.side == "for"]
    against_args = [a for a in arguments if a.side == "against"]

    for_sorted = sorted(for_args, key=lambda a: (a.upvotes - a.downvotes, a.quality_score), reverse=True)
    against_sorted = sorted(
        against_args, key=lambda a: (a.upvotes - a.downvotes, a.quality_score), reverse=True
    )

    return {
        "strongest_for": [a.claim for a in for_sorted[:max_points_per_side]],
        "strongest_against": [a.claim for a in against_sorted[:max_points_per_side]],
        "supporting_argument_ids_for": [a.id for a in for_sorted[:max_points_per_side]],
        "supporting_argument_ids_against": [a.id for a in against_sorted[:max_points_per_side]],
    }


def _generate_summary_payload(policy_question: str, arguments: list[Argument], max_points_per_side: int):
    if not settings.openai_api_key:
        return _fallback_summary(arguments, max_points_per_side)

    client = OpenAI(api_key=settings.openai_api_key)
    response = client.responses.create(
        model=settings.openai_model,
        temperature=0.2,
        input=[
            {"role": "system", "content": "You produce concise structured JSON only."},
            {"role": "user", "content": _build_prompt(policy_question, arguments, max_points_per_side)},
        ],
    )

    content = response.output_text
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        return _fallback_summary(arguments, max_points_per_side)

    required_keys = {
        "strongest_for",
        "strongest_against",
        "supporting_argument_ids_for",
        "supporting_argument_ids_against",
    }
    if not required_keys.issubset(parsed.keys()):
        return _fallback_summary(arguments, max_points_per_side)

    return parsed


async def generate_policy_summary(
    db: AsyncSession,
    policy_id: str,
    policy_question: str,
    max_points_per_side: int,
) -> PolicySummary:
    arguments = (
        await db.execute(select(Argument).where(Argument.policy_id == policy_id).where(Argument.status == "active"))
    ).scalars().all()

    payload = _generate_summary_payload(policy_question, arguments, max_points_per_side)

    await db.execute(
        update(PolicySummary)
        .where(PolicySummary.policy_id == policy_id)
        .where(PolicySummary.is_active.is_(True))
        .values(is_active=False)
    )

    summary = PolicySummary(
        policy_id=policy_id,
        strongest_for=payload["strongest_for"],
        strongest_against=payload["strongest_against"],
        supporting_argument_ids_for=payload["supporting_argument_ids_for"],
        supporting_argument_ids_against=payload["supporting_argument_ids_against"],
        model_name=settings.openai_model if settings.openai_api_key else "fallback-ranker",
        generated_from_argument_count=len(arguments),
        is_active=True,
    )
    db.add(summary)
    await db.commit()
    await db.refresh(summary)
    return summary


async def get_latest_summary(db: AsyncSession, policy_id: str) -> PolicySummary | None:
    return (
        await db.execute(
            select(PolicySummary)
            .where(PolicySummary.policy_id == policy_id)
            .where(PolicySummary.is_active.is_(True))
            .order_by(PolicySummary.created_at.desc())
            .limit(1)
        )
    ).scalar_one_or_none()
