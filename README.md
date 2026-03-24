# Consonance

Consonance is a full-stack MVP for structured public-policy deliberation.

It includes:
- a React + TypeScript frontend with a landing page, policy archive, and discussion workspace
- a FastAPI backend with policy/argument/comment/vote/source APIs plus AI-assisted summary and Q&A endpoints

## Repository Layout

```text
consonance/
├── frontend/          # React + Vite + Tailwind client
├── backend/           # FastAPI + SQLAlchemy async API
├── schemas.md         # Data model notes
├── implementation.md  # Implementation notes
├── masterplan.md      # Product direction notes
└── CONVERSION_GUIDE.md
```

## Current Product Surface

Frontend (`frontend/src/App.tsx`) currently has three views:
- `landing`: new marketing/entry page (`frontend/src/pages/LandingPage.tsx`)
- `main`: policy archive (`frontend/src/pages/ArchivePage.tsx`)
- `discussion`: policy-specific debate workspace (`frontend/src/pages/DiscussionPage.tsx`)

Main user flows:
- browse published/seeded policy threads in the archive
- open a policy and view structured for/against arguments
- post new arguments
- vote on arguments
- read/post comments on arguments
- generate and view AI summaries for a policy
- use policy Q&A endpoint support in API layer

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- Backend: FastAPI, SQLAlchemy async, SQLite, Pydantic v2
- AI integration: OpenAI (optional; deterministic fallback behavior when key is missing)

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- `uv` for Python dependency/workflow management: https://docs.astral.sh/uv/

## Quick Start (Run Full Stack Locally)

### 1) Backend setup

```bash
cd backend
cp .env.example .env
uv sync --extra dev
uv run python seed.py
uv run uvicorn app.main:app --reload --port 8000
```

Backend endpoints available at:
- API root: `http://127.0.0.1:8000/`
- Swagger docs: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/healthz`

### 2) Frontend setup

In a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at `http://localhost:3000` by default.

## Environment Configuration

### Frontend env (`frontend/.env`)

- `VITE_API_BASE_URL` (default in example: `http://127.0.0.1:8000`)

### Backend env (`backend/.env`)

- `DATABASE_URL` (default: `sqlite+aiosqlite:///./consonance.db`)
- `OPENAI_API_KEY` (optional)
- `OPENAI_MODEL` (default: `gpt-4o-mini`)
- `FRONTEND_ORIGIN` (default: `http://localhost:3000`)
- `FRONTEND_ORIGINS` (optional CSV override)

Notes:
- if `OPENAI_API_KEY` is unset, summary/Q&A use fallback logic
- backend currently uses a mock current user dependency (`mock-user-001`) for authenticated write operations

## Frontend Scripts

Run from `frontend/`:

- `npm run dev` - start Vite dev server (port 3000)
- `npm run build` - type-check + production build
- `npm run preview` - preview production bundle
- `npm run lint` - run ESLint on `src`
- `npm run type-check` - run TypeScript checks only

## Backend Commands

Run from `backend/`:

- `uv sync --extra dev` - install runtime + dev dependencies
- `uv run uvicorn app.main:app --reload --port 8000` - run API locally
- `uv run python seed.py` - seed demo policies/arguments (when DB is empty)
- `uv run pytest` - run backend test suite
- `uv run alembic upgrade head` - apply migrations

## API Overview

Current backend routes include:

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

For request/response details, use live docs at `http://127.0.0.1:8000/docs`.

## Key Frontend Files

- `frontend/src/App.tsx` - top-level view state and data orchestration
- `frontend/src/pages/LandingPage.tsx` - landing/marketing entry page
- `frontend/src/pages/ArchivePage.tsx` - policy list and domain filters
- `frontend/src/pages/DiscussionPage.tsx` - argument board, comments, votes, summary UI
- `frontend/src/lib/api.ts` - API client functions and endpoint mapping
- `frontend/src/types/index.ts` - shared frontend domain types

## Data and Persistence

- default DB is SQLite file at `backend/consonance.db`
- SQLAlchemy models and Alembic migration live under `backend/app/models` and `backend/alembic`
- app startup creates tables via metadata as part of FastAPI lifespan

## Testing and Validation

Recommended checks before merging changes:

```bash
# frontend
cd frontend && npm run type-check && npm run build

# backend
cd backend && uv run pytest
```

## Additional Documentation

- Backend-focused setup/details: `backend/README.md`
- Domain/schema notes: `schemas.md`
- Product and implementation notes: `masterplan.md`, `implementation.md`

## Status

This repository is an MVP/prototype in active iteration. Interfaces and schemas may evolve as the product direction is refined.
