from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import CurrentUser, get_current_user
from app.schemas.common import VoteValue
from app.schemas.vote import CastVoteRequest, CastVoteResponse
from app.services.argument_service import get_argument
from app.services.vote_service import cast_vote

router = APIRouter(tags=["votes"])


@router.post("/v1/arguments/{argument_id}/vote", response_model=CastVoteResponse)
async def post_vote(
    argument_id: str,
    payload: CastVoteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> CastVoteResponse:
    argument = await get_argument(db, argument_id)
    if not argument:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Argument not found")

    vote = await cast_vote(db, argument, current_user.id, int(payload.value.value))

    return CastVoteResponse(
        argument_id=argument.id,
        upvotes=argument.upvotes,
        downvotes=argument.downvotes,
        my_vote=VoteValue(vote.value) if vote else None,
    )
