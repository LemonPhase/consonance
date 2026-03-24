from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Argument(Base):
    __tablename__ = "arguments"
    __table_args__ = (
        CheckConstraint("side IN ('for', 'against')", name="check_argument_side"),
        CheckConstraint("quality_score >= 0 AND quality_score <= 100", name="check_quality_score"),
        CheckConstraint("ai_clarity_score >= 0 AND ai_clarity_score <= 1", name="check_ai_clarity_score"),
        CheckConstraint(
            "source_credibility_score >= 0 AND source_credibility_score <= 1",
            name="check_source_credibility_score",
        ),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    policy_id: Mapped[str] = mapped_column(String(36), ForeignKey("policies.id"), nullable=False, index=True)
    author_user_id: Mapped[str] = mapped_column(String(36), nullable=False)
    side: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    parent_argument_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("arguments.id"), nullable=True
    )
    relation_to_parent: Mapped[str | None] = mapped_column(String(20), nullable=True)
    claim: Mapped[str] = mapped_column(String(280), nullable=False)
    reasoning: Mapped[str] = mapped_column(Text, nullable=False)
    counterarguments_addressed: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active")
    quality_score: Mapped[int] = mapped_column(Integer, nullable=False, default=50)
    ai_clarity_score: Mapped[float] = mapped_column(nullable=False, default=0.5)
    source_credibility_score: Mapped[float] = mapped_column(nullable=False, default=0.5)
    upvotes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    downvotes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )
