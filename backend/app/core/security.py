from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from core.config import settings
import pyotp
from pydantic import BaseModel
from fastapi import HTTPException 
from phonenumbers import parse, is_valid_number, format_number, PhoneNumberFormat
pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm = settings.ALGORITHM)

class PhoneNumber(BaseModel):
    phone_number: str

class OTP(BaseModel):
    phone_number: str
    otp: str

def validate_phone_number(phone_number: str) -> str:
    number = parse(phone_number, None)
    if not is_valid_number(number):
        raise HTTPException(status_code=400, detail="Invalid phone number")
    return format_number(number, PhoneNumberFormat.E164)

def generate_otp() -> str:
    totp = pyotp.TOTP(pyotp.random_base32(), interval=300)
    return totp.now()
