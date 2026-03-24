from pydantic import BaseModel

from app.schemas.common import VoteValue


class CastVoteRequest(BaseModel):
    value: VoteValue


class CastVoteResponse(BaseModel):
    argument_id: str
    upvotes: int
    downvotes: int
    my_vote: VoteValue | None
