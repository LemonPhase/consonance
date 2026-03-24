from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.argument import Argument
from app.models.vote import Vote


async def cast_vote(db: AsyncSession, argument: Argument, user_id: str, value: int) -> Vote | None:
    existing = (
        await db.execute(select(Vote).where(Vote.user_id == user_id, Vote.argument_id == argument.id))
    ).scalar_one_or_none()

    if existing and existing.value == value:
        existing.value = 0
        if value == 1:
            argument.upvotes = max(0, argument.upvotes - 1)
        else:
            argument.downvotes = max(0, argument.downvotes - 1)
        await db.delete(existing)
        await db.commit()
        await db.refresh(argument)
        return None

    if existing:
        if existing.value == 1:
            argument.upvotes = max(0, argument.upvotes - 1)
        elif existing.value == -1:
            argument.downvotes = max(0, argument.downvotes - 1)
        existing.value = value
    else:
        existing = Vote(user_id=user_id, argument_id=argument.id, value=value)
        db.add(existing)

    if value == 1:
        argument.upvotes += 1
    else:
        argument.downvotes += 1

    await db.commit()
    await db.refresh(argument)
    return existing
