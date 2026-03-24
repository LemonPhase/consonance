# Consonance Backend (MVP)

FastAPI backend for the Consonance MVP.

## Stack

- FastAPI
- SQLAlchemy (async)
- SQLite
- Pydantic v2
- Optional OpenAI summary generation

## Quick start

1. Create and activate a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install dependencies:

```bash
python -m pip install -e ".[dev]"
```

3. Create env file:

```bash
cp .env.example .env
```

4. Run the API:

```bash
uvicorn app.main:app --reload --port 8000
```

Health check: `GET http://localhost:8000/healthz`

## Seed demo data

```bash
python seed.py
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
pytest
```

## Alembic migrations

Create revision from models:

```bash
alembic revision --autogenerate -m "init"
```

Apply latest migration:

```bash
alembic upgrade head
```

Rollback one migration:

```bash
alembic downgrade -1
```
