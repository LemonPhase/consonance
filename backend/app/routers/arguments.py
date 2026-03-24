from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import CurrentUser, get_current_user
from app.schemas.argument import ArgumentCreate, ArgumentRead, ArgumentUpdate
from app.schemas.common import CursorPage, DebateSide
from app.services.argument_service import (
    create_argument,
    get_argument,
    list_arguments,
    update_argument,
)

router = APIRouter(tags=["arguments"])


@router.get("/v1/policies/{policy_id}/arguments", response_model=CursorPage[ArgumentRead])
async def get_arguments_for_policy(
    policy_id: str,
    side: DebateSide | None = Query(default=None),
    parent_argument_id: str | None = Query(default=None),
    sort: str = Query(default="top", pattern="^(top|new)$"),
    cursor: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> CursorPage[ArgumentRead]:
    return await list_arguments(
        db,
        policy_id=policy_id,
        side=side.value if side else None,
        parent_argument_id=parent_argument_id,
        sort=sort,
        cursor=cursor,
        limit=limit,
    )


@router.post("/v1/arguments", response_model=ArgumentRead, status_code=status.HTTP_201_CREATED)
async def post_argument(
    payload: ArgumentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> ArgumentRead:
    return await create_argument(
        db,
        policy_id=payload.policy_id,
        author_user_id=current_user.id,
        side=payload.side.value,
        claim=payload.claim,
        reasoning=payload.reasoning,
        counterarguments_addressed=payload.counterarguments_addressed,
        parent_argument_id=payload.parent_argument_id,
        relation_to_parent=payload.relation_to_parent,
    )


@router.patch("/v1/arguments/{argument_id}", response_model=ArgumentRead)
async def patch_argument(
    argument_id: str,
    payload: ArgumentUpdate,
    db: AsyncSession = Depends(get_db),
) -> ArgumentRead:
    argument = await get_argument(db, argument_id)
    if not argument:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Argument not found")

    return await update_argument(
        db,
        argument=argument,
        claim=payload.claim,
        reasoning=payload.reasoning,
        counterarguments_addressed=payload.counterarguments_addressed,
        status=payload.status.value if payload.status else None,
    )
