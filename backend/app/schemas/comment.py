from datetime import datetime

from pydantic import BaseModel, Field


class CommentCreate(BaseModel):
    body: str = Field(..., min_length=1, max_length=2000)


class CommentRead(BaseModel):
    id: str
    argument_id: str
    author_user_id: str
    body: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
