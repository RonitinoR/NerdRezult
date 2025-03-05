import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
load_dotenv()
class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:nerdrezult123@db.kkvdtsxvpnexyrciayay.supabase.co:5432/postgres"
    SECRET_KEY: str = "216d27677a59b05c38680a47c87232e7c24256aa9dd0bad3eb806531a16a1e7364f21bf79315e40c114e4fe4d23f050a0ee0c1c0a6d6963b13af40ab672476ef363c6d4e15c4c881757bd06329c91b436c0cca2f776f6b27120d7b4a0a8684d2f8f83ddb9e21c303db51645d351f1f7f2037c5d7e908896d1fa37d422da6266f"
    ALGORITHM: str = "HS512"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # google authentication
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET")
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/oauth/auth/google/callback"

    # Github authentication
    GITHUB_CLIENT_ID: str = os.getenv("GITHUB_CLIENT_ID")
    GITHUB_CLIENT_SECRET: str = os.getenv("GITHUB_CLIENT_SECRET")
    GITHUB_REDIRECT_URI: str = "http://localhost:8000/api/oauth/auth/github/callback"

settings = Settings()
