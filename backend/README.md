# Consonance Backend

FastAPI backend for the Consonance MVP.

## Stack

- FastAPI
- SQLAlchemy (async)
- SQLite
- Pydantic v2
- OpenAI integration for summaries/Q&A (optional)

## Requirements

- Python 3.11+
- `uv` (recommended for dependency and run management)

## Quick Start

```bash
cp .env.example .env
uv sync --extra dev
uv run python seed.py
uv run uvicorn app.main:app --reload --port 8000
```

Local URLs:
- API root: `http://127.0.0.1:8000/`
- Docs: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/healthz`

Optional in-project virtualenv workflow:

```bash
uv venv
uv sync --extra dev
```

## Environment Variables

Defined in `.env.example`:

- `DATABASE_URL` (default: `sqlite+aiosqlite:///./consonance.db`)
- `OPENAI_API_KEY` (optional)
- `OPENAI_MODEL` (default: `gpt-4o-mini`)
- `FRONTEND_ORIGIN` (default: `http://localhost:3000`)
- `FRONTEND_ORIGINS` (optional CSV override, e.g. `http://localhost:3000,http://127.0.0.1:3000`)

Notes:
- if `OPENAI_API_KEY` is missing, AI features use fallback logic
- current auth dependency is mocked (`mock-user-001`) for write endpoints

## Data and Migrations

- default DB file: `backend/consonance.db`
- SQLAlchemy models: `app/models/`
- Alembic config/migrations: `alembic/`

Common migration commands:

```bash
uv run alembic revision --autogenerate -m "your message"
uv run alembic upgrade head
uv run alembic downgrade -1
```

## API Surface

- `GET /`
- `GET /healthz`
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
- `POST /v1/policies/{policy_id}/ask`

Use `http://127.0.0.1:8000/docs` for request/response schemas.

## Development Commands

- `uv sync --extra dev` - install dependencies
- `uv run uvicorn app.main:app --reload --port 8000` - run dev server
- `uv run python seed.py` - seed sample data
- `uv run pytest` - run tests

## Project Structure

```text
backend/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── deps.py
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   └── services/
├── alembic/
├── tests/
├── pyproject.toml
└── seed.py
```
