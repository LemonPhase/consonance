import importlib
import sys

from fastapi.testclient import TestClient


def _fresh_app(monkeypatch, db_path: str):
    monkeypatch.setenv("DATABASE_URL", f"sqlite+aiosqlite:///{db_path}")
    monkeypatch.setenv("OPENAI_API_KEY", "")
    monkeypatch.setenv("OPENAI_MODEL", "gpt-4o-mini")

    for module_name in list(sys.modules.keys()):
        if module_name.startswith("app"):
            del sys.modules[module_name]

    app_module = importlib.import_module("app.main")
    return app_module.app


def test_mvp_flow(tmp_path, monkeypatch):
    app = _fresh_app(monkeypatch, str(tmp_path / "test.db"))

    with TestClient(app) as client:
        health = client.get("/healthz")
        assert health.status_code == 200
        assert health.json()["status"] == "ok"

        created_policy = client.post(
            "/v1/policies",
            json={
                "slug": "ubi",
                "title": "Universal Basic Income",
                "question": "Should Universal Basic Income be implemented?",
                "description": "MVP policy prompt",
            },
        )
        assert created_policy.status_code == 201
        policy = created_policy.json()
        policy_id = policy["id"]

        list_policies = client.get("/v1/policies")
        assert list_policies.status_code == 200
        assert len(list_policies.json()["items"]) == 1

        policy_by_slug = client.get("/v1/policies/slug/ubi")
        assert policy_by_slug.status_code == 200
        assert policy_by_slug.json()["id"] == policy_id

        created_argument = client.post(
            "/v1/arguments",
            json={
                "policy_id": policy_id,
                "side": "for",
                "claim": "UBI reduces poverty.",
                "reasoning": "Guaranteed floor income helps vulnerable households.",
            },
        )
        assert created_argument.status_code == 201
        argument = created_argument.json()
        argument_id = argument["id"]

        list_arguments = client.get(f"/v1/policies/{policy_id}/arguments?side=for")
        assert list_arguments.status_code == 200
        assert len(list_arguments.json()["items"]) == 1

        cast_vote = client.post(f"/v1/arguments/{argument_id}/vote", json={"value": 1})
        assert cast_vote.status_code == 200
        assert cast_vote.json()["upvotes"] == 1
        assert cast_vote.json()["my_vote"] == 1

        create_comment = client.post(
            f"/v1/arguments/{argument_id}/comments",
            json={"body": "Interesting point."},
        )
        assert create_comment.status_code == 201

        list_comments = client.get(f"/v1/arguments/{argument_id}/comments")
        assert list_comments.status_code == 200
        assert len(list_comments.json()["items"]) == 1

        generate_summary = client.post(
            f"/v1/policies/{policy_id}/summaries/generate",
            json={"max_points_per_side": 3},
        )
        assert generate_summary.status_code == 200
        assert generate_summary.json()["policy_id"] == policy_id

        latest_summary = client.get(f"/v1/policies/{policy_id}/summaries/latest")
        assert latest_summary.status_code == 200
        assert latest_summary.json() is not None
