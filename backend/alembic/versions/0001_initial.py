"""initial

Revision ID: 0001_initial
Revises:
Create Date: 2026-03-24 18:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "policies",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("slug", sa.String(length=120), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("question", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("created_by_user_id", sa.String(length=36), nullable=False),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.CheckConstraint("status IN ('draft', 'published', 'archived')", name="check_policy_status"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index(op.f("ix_policies_slug"), "policies", ["slug"], unique=False)

    op.create_table(
        "arguments",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("policy_id", sa.String(length=36), nullable=False),
        sa.Column("author_user_id", sa.String(length=36), nullable=False),
        sa.Column("side", sa.String(length=20), nullable=False),
        sa.Column("parent_argument_id", sa.String(length=36), nullable=True),
        sa.Column("relation_to_parent", sa.String(length=20), nullable=True),
        sa.Column("claim", sa.String(length=280), nullable=False),
        sa.Column("reasoning", sa.Text(), nullable=False),
        sa.Column("counterarguments_addressed", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("quality_score", sa.Integer(), nullable=False),
        sa.Column("ai_clarity_score", sa.Float(), nullable=False),
        sa.Column("source_credibility_score", sa.Float(), nullable=False),
        sa.Column("upvotes", sa.Integer(), nullable=False),
        sa.Column("downvotes", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.CheckConstraint("ai_clarity_score >= 0 AND ai_clarity_score <= 1", name="check_ai_clarity_score"),
        sa.CheckConstraint("quality_score >= 0 AND quality_score <= 100", name="check_quality_score"),
        sa.CheckConstraint("side IN ('for', 'against')", name="check_argument_side"),
        sa.CheckConstraint(
            "source_credibility_score >= 0 AND source_credibility_score <= 1",
            name="check_source_credibility_score",
        ),
        sa.ForeignKeyConstraint(["parent_argument_id"], ["arguments.id"]),
        sa.ForeignKeyConstraint(["policy_id"], ["policies.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_arguments_created_at"), "arguments", ["created_at"], unique=False)
    op.create_index(op.f("ix_arguments_policy_id"), "arguments", ["policy_id"], unique=False)
    op.create_index(op.f("ix_arguments_side"), "arguments", ["side"], unique=False)

    op.create_table(
        "comments",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("argument_id", sa.String(length=36), nullable=False),
        sa.Column("author_user_id", sa.String(length=36), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.CheckConstraint("status IN ('active', 'hidden', 'removed')", name="check_comment_status"),
        sa.ForeignKeyConstraint(["argument_id"], ["arguments.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_comments_argument_id"), "comments", ["argument_id"], unique=False)
    op.create_index(op.f("ix_comments_created_at"), "comments", ["created_at"], unique=False)

    op.create_table(
        "policy_summaries",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("policy_id", sa.String(length=36), nullable=False),
        sa.Column("strongest_for", sa.JSON(), nullable=False),
        sa.Column("strongest_against", sa.JSON(), nullable=False),
        sa.Column("supporting_argument_ids_for", sa.JSON(), nullable=False),
        sa.Column("supporting_argument_ids_against", sa.JSON(), nullable=False),
        sa.Column("model_name", sa.String(length=120), nullable=False),
        sa.Column("generated_from_argument_count", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(["policy_id"], ["policies.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_policy_summaries_created_at"), "policy_summaries", ["created_at"], unique=False)
    op.create_index(op.f("ix_policy_summaries_policy_id"), "policy_summaries", ["policy_id"], unique=False)

    op.create_table(
        "sources",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("url", sa.Text(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("publisher", sa.String(length=255), nullable=True),
        sa.Column("source_type", sa.String(length=40), nullable=False),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("credibility_score", sa.Float(), nullable=False),
        sa.Column("created_by_user_id", sa.String(length=36), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.CheckConstraint("credibility_score >= 0 AND credibility_score <= 1", name="check_credibility_score"),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "votes",
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("argument_id", sa.String(length=36), nullable=False),
        sa.Column("value", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.CheckConstraint("value IN (-1, 1)", name="check_vote_value"),
        sa.ForeignKeyConstraint(["argument_id"], ["arguments.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("user_id", "argument_id"),
        sa.UniqueConstraint("user_id", "argument_id", name="uq_vote_user_argument"),
    )


def downgrade() -> None:
    op.drop_table("votes")
    op.drop_table("sources")
    op.drop_index(op.f("ix_policy_summaries_policy_id"), table_name="policy_summaries")
    op.drop_index(op.f("ix_policy_summaries_created_at"), table_name="policy_summaries")
    op.drop_table("policy_summaries")
    op.drop_index(op.f("ix_comments_created_at"), table_name="comments")
    op.drop_index(op.f("ix_comments_argument_id"), table_name="comments")
    op.drop_table("comments")
    op.drop_index(op.f("ix_arguments_side"), table_name="arguments")
    op.drop_index(op.f("ix_arguments_policy_id"), table_name="arguments")
    op.drop_index(op.f("ix_arguments_created_at"), table_name="arguments")
    op.drop_table("arguments")
    op.drop_index(op.f("ix_policies_slug"), table_name="policies")
    op.drop_table("policies")
