from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import PolicyStatus


class PolicyBase(BaseModel):
    slug: str = Field(..., pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    title: str
    question: str
    description: str | None = None


class PolicyCreate(PolicyBase):
    pass


class PolicyRead(PolicyBase):
    id: str
    status: PolicyStatus
    created_by_user_id: str
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
