from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Comment(Base):
    __tablename__ = "comments"
    __table_args__ = (
        CheckConstraint("status IN ('active', 'hidden', 'removed')", name="check_comment_status"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    argument_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("arguments.id", ondelete="CASCADE"), nullable=False, index=True
    )
    author_user_id: Mapped[str] = mapped_column(String(36), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )
