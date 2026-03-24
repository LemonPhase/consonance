from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import CurrentUser, get_current_user
from app.schemas.comment import CommentCreate, CommentRead
from app.schemas.common import CursorPage
from app.services.comment_service import create_comment, list_comments

router = APIRouter(tags=["comments"])


@router.get("/v1/arguments/{argument_id}/comments", response_model=CursorPage[CommentRead])
async def get_comments(
    argument_id: str,
    cursor: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> CursorPage[CommentRead]:
    return await list_comments(db, argument_id=argument_id, cursor=cursor, limit=limit)


@router.post(
    "/v1/arguments/{argument_id}/comments", response_model=CommentRead, status_code=status.HTTP_201_CREATED
)
async def post_comment(
    argument_id: str,
    payload: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> CommentRead:
    return await create_comment(
        db,
        argument_id=argument_id,
        author_user_id=current_user.id,
        body=payload.body,
    )
