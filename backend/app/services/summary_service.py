from __future__ import annotations

import json
import re

from openai import OpenAI
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.models.argument import Argument
from app.models.summary import PolicySummary


POLICY_CHAT_SYSTEM_PROMPT = (
    "You are the Consonance Policy Analyst.\\n"
    "Your role is to help users understand a policy using only the provided context.\\n"
    "Rules:\\n"
    "1. Use POLICY_CONTEXT as the primary source of truth.\\n"
    "2. Treat ARGUMENTS as participant claims, not guaranteed facts.\\n"
    "3. If context is missing, say what is uncertain instead of inventing details.\\n"
    "4. Be neutral, clear, and concise.\\n"
    "5. Return strict JSON only with keys: answer, supporting_argument_ids.\\n"
    "6. supporting_argument_ids must contain only ids present in ARGUMENTS."
)


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


def _tokenize(text: str) -> set[str]:
    return {token for token in re.findall(r"[a-zA-Z0-9']+", text.lower()) if len(token) > 2}


def _rank_relevant_arguments(arguments: list[Argument], query: str, limit: int = 3) -> list[Argument]:
    query_tokens = _tokenize(query)

    def score(arg: Argument) -> tuple[int, int, int]:
        arg_tokens = _tokenize(f"{arg.claim} {arg.reasoning}")
        overlap = len(query_tokens.intersection(arg_tokens))
        vote_signal = arg.upvotes - arg.downvotes
        return (overlap, vote_signal, arg.quality_score)

    ranked = sorted(arguments, key=score, reverse=True)
    return ranked[:limit]


def _fallback_policy_answer(
    policy_title: str,
    policy_question: str,
    policy_description: str | None,
    query: str,
    arguments: list[Argument],
) -> dict[str, str | list[str]]:
    context = policy_description or policy_question
    relevant = _rank_relevant_arguments(arguments, query, limit=3)
    ids = [arg.id for arg in relevant]

    bullets = []
    for arg in relevant:
        side = "For" if arg.side == "for" else "Against"
        bullets.append(f"- {side}: {arg.claim}")

    answer = (
        f"Policy: {policy_title}.\\n"
        f"Question: {policy_question}\\n\\n"
        f"Context summary: {context}\\n\\n"
        "Most relevant debate points:\\n"
        + ("\\n".join(bullets) if bullets else "- No active arguments were available.")
        + "\\n\\n"
        "Note: This answer used fallback mode because OPENAI_API_KEY is not configured."
    )

    return {"answer": answer, "supporting_argument_ids": ids}


def _build_policy_chat_prompt(
    policy_title: str,
    policy_question: str,
    policy_description: str | None,
    query: str,
    arguments: list[Argument],
) -> str:
    serialized_args = [
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

    policy_context = {
        "title": policy_title,
        "question": policy_question,
        "description": policy_description or "",
    }

    return (
        f"POLICY_CONTEXT: {json.dumps(policy_context)}\\n"
        f"ARGUMENTS: {json.dumps(serialized_args)}\\n"
        f"USER_QUERY: {query}\\n"
        "TASK: Explain the policy in context of the query and debate points. "
        "Return JSON with keys answer and supporting_argument_ids only."
    )


def _generate_policy_chat_answer(
    policy_title: str,
    policy_question: str,
    policy_description: str | None,
    query: str,
    arguments: list[Argument],
) -> dict[str, str | list[str] | bool]:
    if not settings.openai_api_key:
        fallback = _fallback_policy_answer(policy_title, policy_question, policy_description, query, arguments)
        return {
            "answer": fallback["answer"],
            "supporting_argument_ids": fallback["supporting_argument_ids"],
            "model_name": "fallback-ranker",
            "used_fallback": True,
        }

    client = OpenAI(api_key=settings.openai_api_key)
    response = client.responses.create(
        model=settings.openai_model,
        temperature=0.2,
        input=[
            {"role": "system", "content": POLICY_CHAT_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": _build_policy_chat_prompt(
                    policy_title=policy_title,
                    policy_question=policy_question,
                    policy_description=policy_description,
                    query=query,
                    arguments=arguments,
                ),
            },
        ],
    )

    content = response.output_text
    try:
        parsed = json.loads(content)
    except json.JSONDecodeError:
        fallback = _fallback_policy_answer(policy_title, policy_question, policy_description, query, arguments)
        return {
            "answer": fallback["answer"],
            "supporting_argument_ids": fallback["supporting_argument_ids"],
            "model_name": "fallback-ranker",
            "used_fallback": True,
        }

    answer = parsed.get("answer") if isinstance(parsed.get("answer"), str) else ""
    ids = parsed.get("supporting_argument_ids") if isinstance(parsed.get("supporting_argument_ids"), list) else []
    valid_ids = {arg.id for arg in arguments}
    normalized_ids = [str(arg_id) for arg_id in ids if str(arg_id) in valid_ids]

    if not answer.strip():
        fallback = _fallback_policy_answer(policy_title, policy_question, policy_description, query, arguments)
        return {
            "answer": fallback["answer"],
            "supporting_argument_ids": fallback["supporting_argument_ids"],
            "model_name": "fallback-ranker",
            "used_fallback": True,
        }

    return {
        "answer": answer,
        "supporting_argument_ids": normalized_ids,
        "model_name": settings.openai_model,
        "used_fallback": False,
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


async def ask_about_policy(
    db: AsyncSession,
    policy_id: str,
    policy_title: str,
    policy_question: str,
    policy_description: str | None,
    query: str,
) -> dict[str, str | list[str] | bool]:
    arguments = (
        await db.execute(select(Argument).where(Argument.policy_id == policy_id).where(Argument.status == "active"))
    ).scalars().all()

    return _generate_policy_chat_answer(
        policy_title=policy_title,
        policy_question=policy_question,
        policy_description=policy_description,
        query=query,
        arguments=arguments,
    )
