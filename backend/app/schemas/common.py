from __future__ import annotations

import base64
import json
from datetime import datetime
from enum import Enum
from typing import Generic, TypeVar

from pydantic import BaseModel


class DebateSide(str, Enum):
    FOR = "for"
    AGAINST = "against"


class PolicyStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class ArgumentStatus(str, Enum):
    ACTIVE = "active"
    HIDDEN = "hidden"
    REMOVED = "removed"


class VoteValue(int, Enum):
    UPVOTE = 1
    DOWNVOTE = -1


class SourceType(str, Enum):
    PEER_REVIEWED = "peer_reviewed"
    GOVERNMENT_DATA = "government_data"
    MAJOR_JOURNALISM = "major_journalism"
    INDEPENDENT_ANALYSIS = "independent_analysis"
    BLOG_OPINION = "blog_opinion"
    SOCIAL_MEDIA = "social_media"
    OTHER = "other"


class ApiErrorCode(str, Enum):
    BAD_REQUEST = "BAD_REQUEST"
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"
    NOT_FOUND = "NOT_FOUND"
    CONFLICT = "CONFLICT"
    RATE_LIMITED = "RATE_LIMITED"
    VALIDATION_ERROR = "VALIDATION_ERROR"
    INTERNAL_ERROR = "INTERNAL_ERROR"


class ApiError(BaseModel):
    code: ApiErrorCode
    message: str
    details: dict[str, object] | None = None


T = TypeVar("T")


class CursorPage(BaseModel, Generic[T]):
    items: list[T]
    next_cursor: str | None


class CursorPayload(BaseModel):
    created_at: datetime
    id: str


def encode_cursor(created_at: datetime, record_id: str) -> str:
    payload = CursorPayload(created_at=created_at, id=record_id).model_dump(mode="json")
    encoded = base64.urlsafe_b64encode(json.dumps(payload).encode("utf-8"))
    return encoded.decode("utf-8")


def decode_cursor(cursor: str) -> CursorPayload:
    raw = base64.urlsafe_b64decode(cursor.encode("utf-8")).decode("utf-8")
    data = json.loads(raw)
    return CursorPayload.model_validate(data)
