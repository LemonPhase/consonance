from datetime import datetime

from pydantic import BaseModel, HttpUrl

from app.schemas.common import SourceType


class SourceBase(BaseModel):
    url: HttpUrl
    title: str
    publisher: str | None = None
    source_type: SourceType
    published_at: datetime | None = None


class SourceCreate(SourceBase):
    pass


class SourceRead(BaseModel):
    id: str
    url: str
    title: str
    publisher: str | None
    source_type: SourceType
    published_at: datetime | None
    credibility_score: float
    created_by_user_id: str
    created_at: datetime

    model_config = {"from_attributes": True}
