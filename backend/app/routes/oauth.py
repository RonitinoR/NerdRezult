from fastapi import APIRouter, Request, Depends
from authlib.integrations.starlette_client import OAuth
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from core.config import settings
from core.security import create_access_token
from db.database import get_db
from db.models import User

router = APIRouter()
oauth = OAuth()

# Configure Google Auth
oauth.register(
    name = 'google',
    client_id = settings.GOOGLE_CLIENT_ID,
    client_secret = settings.GOOGLE_CLIENT_SECRET,
    access_token_url = 'https://accounts.google.com/o/oauth2/token',
    authorize_url = 'https://accounts.google.com/o/oauth2/auth',
    api_base_url = 'https://www.googleapis.com/oauth2/v1/',
    client_kwargs = {'scope': 'email profile'},
)

#configure Github Auth
oauth.register(
    name = 'github',
    client_id = settings.GITHUB_CLIENT_ID,
    client_secret = settings.GITHUB_CLIENT_SECRET,
    access_token_url = 'https://github.com/login/oauth/access_token',
    authorize_url = 'https://github.com/loging/oauth/authorize',
    api_base_url = 'https://api.github.com/',
    client_kwargs = {'scope': 'user:email'},
)

@router.get("auth/google")
async def google_auth(request: Request):
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("auth/google/callback")
async def google_callback(request: Request, db: AsyncSession = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    user_info = await oauth.google.parse_id_token(request, token)

    # create or update user
    user = await db.execute(
        select(User).where(User.email == user_info["email"])
    )
    user = user.scalar()
    if not user:
        user = User(
            email = user_info["email"],
            provider = "google",
            provider_id = user_info["sub"]
        )
        db.add(user)
        await db.commit()
    access_token = create_access_token(data = {"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("auth/github")
async def github_auth(request: Request):
    redirect_uri = settings.GITHUB_REDIRECT_URI
    return await oauth.github.authorize_redirect(request, redirect_uri)

@router.get("auth/github/callback")
async def github_callback(request: Request, db: AsyncSession = Depends(get_db)):
    
    return