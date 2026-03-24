from datetime import datetime

from pydantic import BaseModel


class GenerateSummaryRequest(BaseModel):
    max_points_per_side: int = 5


class AskPolicyRequest(BaseModel):
    query: str


class AskPolicyResponse(BaseModel):
    answer: str
    supporting_argument_ids: list[str]
    model_name: str
    used_fallback: bool


class PolicySummaryRead(BaseModel):
    id: str
    policy_id: str
    strongest_for: list[str]
    strongest_against: list[str]
    supporting_argument_ids_for: list[str]
    supporting_argument_ids_against: list[str]
    model_name: str
    generated_from_argument_count: int
    created_at: datetime
    is_active: bool

    model_config = {"from_attributes": True}
