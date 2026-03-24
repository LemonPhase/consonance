from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.summary import AskPolicyRequest, AskPolicyResponse, GenerateSummaryRequest, PolicySummaryRead
from app.services.policy_service import get_policy
from app.services.summary_service import ask_about_policy, generate_policy_summary, get_latest_summary

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


@router.post("/v1/policies/{policy_id}/ask", response_model=AskPolicyResponse)
async def ask_policy_question(
    policy_id: str,
    payload: AskPolicyRequest,
    db: AsyncSession = Depends(get_db),
) -> AskPolicyResponse:
    policy = await get_policy(db, policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    cleaned_query = payload.query.strip()
    if not cleaned_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    result = await ask_about_policy(
        db,
        policy_id=policy_id,
        policy_title=policy.title,
        policy_question=policy.question,
        policy_description=policy.description,
        query=cleaned_query,
    )

    return AskPolicyResponse(
        answer=str(result["answer"]),
        supporting_argument_ids=[str(arg_id) for arg_id in result["supporting_argument_ids"]],
        model_name=str(result["model_name"]),
        used_fallback=bool(result["used_fallback"]),
    )
