from __future__ import annotations

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.policy import Policy
from app.schemas.common import CursorPage, decode_cursor, encode_cursor


async def list_policies(
    db: AsyncSession, status: str | None, search: str | None, cursor: str | None, limit: int
) -> CursorPage[Policy]:
    stmt: Select[tuple[Policy]] = select(Policy)

    if status:
        stmt = stmt.where(Policy.status == status)
    if search:
        like = f"%{search}%"
        stmt = stmt.where((Policy.title.ilike(like)) | (Policy.question.ilike(like)))

    stmt = stmt.order_by(Policy.created_at.desc(), Policy.id.desc())

    if cursor:
        payload = decode_cursor(cursor)
        stmt = stmt.where(
            (Policy.created_at < payload.created_at)
            | ((Policy.created_at == payload.created_at) & (Policy.id < payload.id))
        )

    rows = (await db.execute(stmt.limit(limit + 1))).scalars().all()
    items = rows[:limit]

    next_cursor = None
    if len(rows) > limit and items:
        last = items[-1]
        next_cursor = encode_cursor(last.created_at, last.id)

    return CursorPage(items=items, next_cursor=next_cursor)


async def get_policy(db: AsyncSession, policy_id: str) -> Policy | None:
    return await db.get(Policy, policy_id)


async def get_policy_by_slug(db: AsyncSession, slug: str) -> Policy | None:
    return (await db.execute(select(Policy).where(Policy.slug == slug).limit(1))).scalar_one_or_none()


async def create_policy(
    db: AsyncSession,
    slug: str,
    title: str,
    question: str,
    description: str | None,
    created_by_user_id: str,
) -> Policy:
    policy = Policy(
        slug=slug,
        title=title,
        question=question,
        description=description,
        status="published",
        created_by_user_id=created_by_user_id,
    )
    db.add(policy)
    await db.commit()
    await db.refresh(policy)
    return policy
