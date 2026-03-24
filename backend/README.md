# Consonance Backend (MVP)

FastAPI backend for the Consonance MVP.

## Stack

- FastAPI
- SQLAlchemy (async)
- SQLite
- Pydantic v2
- Optional OpenAI summary generation

## Quick start

1. Create env file:

```bash
cp .env.example .env
```

2. Sync dependencies with uv:

```bash
uv sync --extra dev
```

3. Run the API:

```bash
uv run uvicorn app.main:app --reload --port 8000
```

Health check: `GET http://localhost:8000/healthz`

If you prefer an isolated in-project virtual env, run:

```bash
uv venv
uv sync --extra dev
```

## Seed demo data

```bash
uv run python seed.py
```

This inserts sample policies and arguments if the database is empty.

## Environment variables

- `DATABASE_URL` (default: `sqlite+aiosqlite:///./consonance.db`)
- `OPENAI_API_KEY` (optional)
- `OPENAI_MODEL` (default: `gpt-4o-mini`)
- `FRONTEND_ORIGIN` (default: `http://localhost:3000`)

If `OPENAI_API_KEY` is missing, summary generation uses a deterministic fallback ranker.

## API surface (MVP)

- `GET /v1/policies`
- `POST /v1/policies`
- `GET /v1/policies/{policy_id}`
- `GET /v1/policies/slug/{slug}`
- `GET /v1/policies/{policy_id}/arguments`
- `POST /v1/arguments`
- `PATCH /v1/arguments/{argument_id}`
- `POST /v1/arguments/{argument_id}/vote`
- `GET /v1/arguments/{argument_id}/comments`
- `POST /v1/arguments/{argument_id}/comments`
- `POST /v1/sources`
- `POST /v1/policies/{policy_id}/summaries/generate`
- `GET /v1/policies/{policy_id}/summaries/latest`

## Tests

Run:

```bash
uv run pytest
```

## Alembic migrations

Create revision from models:

```bash
uv run alembic revision --autogenerate -m "init"
```

Apply latest migration:

```bash
uv run alembic upgrade head
```

Rollback one migration:

```bash
uv run alembic downgrade -1
```
