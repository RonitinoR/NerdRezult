from fastapi import APIRouter, Request, Depends, HTTPException
from authlib.integrations.starlette_client import OAuth
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.config import settings
from app.core.security import create_access_token
from app.db.database import get_db
from app.db.models import User
from starlette.responses import RedirectResponse

router = APIRouter()
oauth = OAuth()

# Configure Google Auth
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# Configure Github Auth
oauth.register(
    name='github',
    client_id=settings.GITHUB_CLIENT_ID,
    client_secret=settings.GITHUB_CLIENT_SECRET,
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'},
)

@router.get("/auth/google")
async def google_auth(request: Request):
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google/callback")
async def google_callback(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to get user info")

        user = await db.execute(
            select(User).where(User.email == user_info["email"])
        )
        user = user.scalar()
        
        if not user:
            user = User(
                email=user_info["email"],
                provider="google",
                provider_id=user_info["sub"]
            )
            db.add(user)
            await db.commit()

        access_token = create_access_token(data={"sub": user.email})
        
        # Redirect to frontend with token
        frontend_url = "http://localhost:3000/oauth-callback"
        return RedirectResponse(
            url=f"{frontend_url}?token={access_token}&provider=google"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/auth/github")
async def github_auth(request: Request):
    redirect_uri = settings.GITHUB_REDIRECT_URI
    return await oauth.github.authorize_redirect(request, redirect_uri)

@router.get("/auth/github/callback")
async def github_callback(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        token = await oauth.github.authorize_access_token(request)
        resp = await oauth.github.get('user', token=token)
        user_info = resp.json()
        
        # Get email
        resp = await oauth.github.get('user/emails', token=token)
        emails = resp.json()
        primary_email = next(e['email'] for e in emails if e['primary'])

        user = await db.execute(
            select(User).where(User.email == primary_email)
        )
        user = user.scalar()

        if not user:
            user = User(
                email=primary_email,
                provider="github",
                provider_id=str(user_info["id"])
            )
            db.add(user)
            await db.commit()

        access_token = create_access_token(data={"sub": user.email})
        
        # Redirect to frontend with token
        frontend_url = "http://localhost:3000/oauth-callback"
        return RedirectResponse(
            url=f"{frontend_url}?token={access_token}&provider=github"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
