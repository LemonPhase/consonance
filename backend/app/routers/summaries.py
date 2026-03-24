from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.summary import GenerateSummaryRequest, PolicySummaryRead
from app.services.policy_service import get_policy
from app.services.summary_service import generate_policy_summary, get_latest_summary

router = APIRouter(tags=["summaries"])


@router.post("/v1/policies/{policy_id}/summaries/generate", response_model=PolicySummaryRead)
async def generate_summary(
    policy_id: str,
    payload: GenerateSummaryRequest,
    db: AsyncSession = Depends(get_db),
) -> PolicySummaryRead:
    policy = await get_policy(db, policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    return await generate_policy_summary(
        db,
        policy_id=policy_id,
        policy_question=policy.question,
        max_points_per_side=max(1, min(payload.max_points_per_side, 10)),
    )


@router.get("/v1/policies/{policy_id}/summaries/latest", response_model=PolicySummaryRead | None)
async def get_latest_policy_summary(
    policy_id: str,
    db: AsyncSession = Depends(get_db),
) -> PolicySummaryRead | None:
    return await get_latest_summary(db, policy_id)
