from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import ArgumentStatus, DebateSide


class ArgumentBase(BaseModel):
    policy_id: str
    side: DebateSide
    claim: str = Field(..., max_length=280)
    reasoning: str
    counterarguments_addressed: str | None = None
    parent_argument_id: str | None = None
    relation_to_parent: str | None = None
    source_ids: list[str] | None = None


class ArgumentCreate(ArgumentBase):
    pass


class ArgumentUpdate(BaseModel):
    claim: str | None = Field(default=None, max_length=280)
    reasoning: str | None = None
    counterarguments_addressed: str | None = None
    status: ArgumentStatus | None = None


class ArgumentRead(BaseModel):
    id: str
    policy_id: str
    author_user_id: str
    side: DebateSide
    parent_argument_id: str | None
    relation_to_parent: str | None
    claim: str
    reasoning: str
    counterarguments_addressed: str | None
    status: ArgumentStatus
    quality_score: int
    ai_clarity_score: float
    source_credibility_score: float
    upvotes: int
    downvotes: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
