from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class PolicySummary(Base):
    __tablename__ = "policy_summaries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    policy_id: Mapped[str] = mapped_column(String(36), ForeignKey("policies.id"), nullable=False, index=True)
    strongest_for: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    strongest_against: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    supporting_argument_ids_for: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    supporting_argument_ids_against: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    model_name: Mapped[str] = mapped_column(String(120), nullable=False)
    generated_from_argument_count: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), index=True
    )
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
