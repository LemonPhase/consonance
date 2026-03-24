from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.models import Argument, Comment, Policy, PolicySummary, Source, Vote
from app.routers.arguments import router as arguments_router
from app.routers.comments import router as comments_router
from app.routers.policies import router as policies_router
from app.routers.sources import router as sources_router
from app.routers.summaries import router as summaries_router
from app.routers.votes import router as votes_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(title="Consonance MVP API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(policies_router)
app.include_router(arguments_router)
app.include_router(votes_router)
app.include_router(comments_router)
app.include_router(sources_router)
app.include_router(summaries_router)
