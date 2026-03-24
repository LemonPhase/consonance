from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import CurrentUser, get_current_user
from app.database import get_db
from app.schemas.common import CursorPage, PolicyStatus
from app.schemas.policy import PolicyCreate, PolicyRead
from app.services.policy_service import create_policy, get_policy, get_policy_by_slug, list_policies

router = APIRouter(prefix="/v1/policies", tags=["policies"])


@router.get("", response_model=CursorPage[PolicyRead])
async def get_policies(
    policy_status: PolicyStatus | None = Query(default=None, alias="status"),
    search: str | None = Query(default=None),
    cursor: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> CursorPage[PolicyRead]:
    return await list_policies(db, policy_status.value if policy_status else None, search, cursor, limit)


@router.post("", response_model=PolicyRead, status_code=status.HTTP_201_CREATED)
async def post_policy(
    payload: PolicyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> PolicyRead:
    try:
        return await create_policy(
            db,
            slug=payload.slug,
            title=payload.title,
            question=payload.question,
            description=payload.description,
            created_by_user_id=current_user.id,
        )
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Policy slug already exists")


@router.get("/slug/{slug}", response_model=PolicyRead)
async def get_policy_with_slug(slug: str, db: AsyncSession = Depends(get_db)) -> PolicyRead:
    policy = await get_policy_by_slug(db, slug)
    if not policy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Policy not found")
    return policy


@router.get("/{policy_id}", response_model=PolicyRead)
async def get_policy_by_id(policy_id: str, db: AsyncSession = Depends(get_db)) -> PolicyRead:
    policy = await get_policy(db, policy_id)
    if not policy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Policy not found")
    return policy
