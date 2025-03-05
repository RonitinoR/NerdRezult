from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from contextlib import asynccontextmanager
from app.routes import auth, oauth
from app.db.database import get_db, engine
from app.db.models import Base
from app.core.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)

# Add SessionMiddleware BEFORE CORSMiddleware
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,  # Use the same secret key you already have
    max_age=3600  # Session expiry time in seconds (1 hour)
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(oauth.router, prefix="/api/oauth", tags=["oauth"])
