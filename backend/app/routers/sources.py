from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import CurrentUser, get_current_user
from app.schemas.source import SourceCreate, SourceRead
from app.services.source_service import create_source

router = APIRouter(prefix="/v1/sources", tags=["sources"])


@router.post("", response_model=SourceRead, status_code=status.HTTP_201_CREATED)
async def post_source(
    payload: SourceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> SourceRead:
    return await create_source(
        db,
        url=str(payload.url),
        title=payload.title,
        publisher=payload.publisher,
        source_type=payload.source_type.value,
        published_at=payload.published_at,
        created_by_user_id=current_user.id,
    )
