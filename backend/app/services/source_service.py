from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.source import Source


async def create_source(
    db: AsyncSession,
    url: str,
    title: str,
    publisher: str | None,
    source_type: str,
    published_at,
    created_by_user_id: str,
) -> Source:
    source = Source(
        url=url,
        title=title,
        publisher=publisher,
        source_type=source_type,
        published_at=published_at,
        credibility_score=0.5,
        created_by_user_id=created_by_user_id,
    )
    db.add(source)
    await db.commit()
    await db.refresh(source)
    return source
