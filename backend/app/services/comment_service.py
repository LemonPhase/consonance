from __future__ import annotations

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.comment import Comment
from app.schemas.common import CursorPage, decode_cursor, encode_cursor


async def list_comments(
    db: AsyncSession, argument_id: str, cursor: str | None, limit: int
) -> CursorPage[Comment]:
    stmt: Select[tuple[Comment]] = (
        select(Comment)
        .where(Comment.argument_id == argument_id)
        .where(Comment.status == "active")
        .order_by(Comment.created_at.desc(), Comment.id.desc())
    )

    if cursor:
        payload = decode_cursor(cursor)
        stmt = stmt.where(
            (Comment.created_at < payload.created_at)
            | ((Comment.created_at == payload.created_at) & (Comment.id < payload.id))
        )

    rows = (await db.execute(stmt.limit(limit + 1))).scalars().all()
    items = rows[:limit]
    next_cursor = None
    if len(rows) > limit and items:
        last = items[-1]
        next_cursor = encode_cursor(last.created_at, last.id)

    return CursorPage(items=items, next_cursor=next_cursor)


async def create_comment(db: AsyncSession, argument_id: str, author_user_id: str, body: str) -> Comment:
    comment = Comment(argument_id=argument_id, author_user_id=author_user_id, body=body, status="active")
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return comment
