from __future__ import annotations

from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Vote(Base):
    __tablename__ = "votes"
    __table_args__ = (
        UniqueConstraint("user_id", "argument_id", name="uq_vote_user_argument"),
        CheckConstraint("value IN (-1, 1)", name="check_vote_value"),
    )

    user_id: Mapped[str] = mapped_column(String(36), primary_key=True)
    argument_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("arguments.id", ondelete="CASCADE"), primary_key=True
    )
    value: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()
    )
