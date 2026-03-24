from __future__ import annotations

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.argument import Argument
from app.schemas.common import CursorPage, decode_cursor, encode_cursor


async def list_arguments(
    db: AsyncSession,
    policy_id: str,
    side: str | None,
    parent_argument_id: str | None,
    sort: str,
    cursor: str | None,
    limit: int,
) -> CursorPage[Argument]:
    stmt: Select[tuple[Argument]] = select(Argument).where(Argument.policy_id == policy_id)

    if side:
        stmt = stmt.where(Argument.side == side)

    if parent_argument_id:
        stmt = stmt.where(Argument.parent_argument_id == parent_argument_id)
    else:
        stmt = stmt.where(Argument.parent_argument_id.is_(None))

    if sort == "top":
        stmt = stmt.order_by((Argument.upvotes - Argument.downvotes).desc(), Argument.created_at.desc())
    else:
        stmt = stmt.order_by(Argument.created_at.desc(), Argument.id.desc())

    if cursor and sort == "new":
        payload = decode_cursor(cursor)
        stmt = stmt.where(
            (Argument.created_at < payload.created_at)
            | ((Argument.created_at == payload.created_at) & (Argument.id < payload.id))
        )

    rows = (await db.execute(stmt.limit(limit + 1))).scalars().all()
    items = rows[:limit]
    next_cursor = None
    if sort == "new" and len(rows) > limit and items:
        last = items[-1]
        next_cursor = encode_cursor(last.created_at, last.id)

    return CursorPage(items=items, next_cursor=next_cursor)


async def create_argument(
    db: AsyncSession,
    policy_id: str,
    author_user_id: str,
    side: str,
    claim: str,
    reasoning: str,
    counterarguments_addressed: str | None,
    parent_argument_id: str | None,
    relation_to_parent: str | None,
) -> Argument:
    argument = Argument(
        policy_id=policy_id,
        author_user_id=author_user_id,
        side=side,
        claim=claim,
        reasoning=reasoning,
        counterarguments_addressed=counterarguments_addressed,
        parent_argument_id=parent_argument_id,
        relation_to_parent=relation_to_parent,
        status="active",
        quality_score=50,
        ai_clarity_score=0.5,
        source_credibility_score=0.5,
    )
    db.add(argument)
    await db.commit()
    await db.refresh(argument)
    return argument


async def get_argument(db: AsyncSession, argument_id: str) -> Argument | None:
    return await db.get(Argument, argument_id)


async def update_argument(
    db: AsyncSession,
    argument: Argument,
    claim: str | None,
    reasoning: str | None,
    counterarguments_addressed: str | None,
    status: str | None,
) -> Argument:
    if claim is not None:
        argument.claim = claim
    if reasoning is not None:
        argument.reasoning = reasoning
    if counterarguments_addressed is not None:
        argument.counterarguments_addressed = counterarguments_addressed
    if status is not None:
        argument.status = status

    await db.commit()
    await db.refresh(argument)
    return argument
