import re
import uuid
import logging
from typing import Annotated
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from app.db.models import User
from app.db.database import get_db
from app.core.config import settings
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)
from pydantic import BaseModel
from app.core.twilio_client import twilio_service

UPLOAD_DIR = Path("uploads/profile_pic")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

router = APIRouter()
logger = logging.getLogger(__name__)

class PhoneNumberRequest(BaseModel):
    phone_number: str

class VerifyOTPRequest(BaseModel):
    phone_number: str
    otp: str  # Changed from 'code' to 'otp' to match frontend

# Helper function for profile pic upload
async def store_file(file: UploadFile):

    # validate file path
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST, 
            detail = "Only JPEG/PNG images allowed"
        )
    
    # validate file size max 2MB
    max_size = 2 * 1024 * 1024
    content = await file.read()
    if len(content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail = "File too large (max allowed size upto 2MB)"
        )
    
    # generate unique filename
    file_ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = UPLOAD_DIR / filename

    
    # save the file
    with open(file_path, "wb") as buffer:
        buffer.write(content)
    
    return f"/static/profile_pics/{filename}"

@router.post("/signup")
async def signup(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form(...),
    profile_pic: UploadFile = File(None),
    db: AsyncSession = Depends(get_db)
):
    # validating email format
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "Invalid email format" 
        )
    # checking for existing user
    existing_user = await db.execute(
        select(User).where(User.email == email)
    )
    if existing_user.scalar():
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST, 
            detail = "Email already registered"
        )
    hashed_password = get_password_hash(password)

    # process profile picture
    profile_pic_url = None
    if profile_pic:
        profile_pic_url = await store_file(profile_pic)
    
    # creating new user
    new_user = User(
        name=name,
        email=email,
        hashed_password = hashed_password,
        role=role,
        profile_pic_url=profile_pic_url,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user_id": new_user.id
    }

@router.post("/login")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: AsyncSession = Depends(get_db)
):
    try:
        user = await db.execute(
            select(User).where(User.email == form_data.username)
        )
        user = user.scalar()
        
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_access_token(data={"sub": user.email})
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "user_id": user.id
        }

    except SQLAlchemyError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred. Please try again."
        )

@router.post("/phone/start")
async def start_phone_verification(
    request: PhoneNumberRequest,
    db: AsyncSession = Depends(get_db)
):
    """Start phone verification process"""
    try:
        # Validate and format phone number
        phone_number = request.phone_number.strip()
        if not phone_number.startswith('+'):
            phone_number = f"+1{phone_number}"  # Assuming US numbers

        # Send verification code
        await twilio_service.send_verification(phone_number)
        
        return {"message": "Verification code sent successfully"}
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send verification code"
        )

@router.post("/phone/verify")
async def verify_phone(request: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    try:
        # Format phone number
        phone_number = request.phone_number.strip()
        if not phone_number.startswith('+'):
            phone_number = f"+1{phone_number}"
        
        # Verify code with Twilio
        try:
            is_valid = await twilio_service.check_verification(phone_number, request.otp)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification code"
            )

        # Get or create user - Note: removed auth_method from select
        stmt = select(User).where(User.phone_number == phone_number)
        result = await db.execute(stmt)
        user = result.scalar()

        if not user:
            # Create new user
            user = User(
                phone_number=phone_number,
                provider="phone",
                is_active=True,
                role="user"
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

        # Generate access token
        access_token = create_access_token(
            data={"sub": phone_number, "user_id": str(user.id)}
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user.id
        }

    except Exception as e:
        logger.error(f"Phone verification error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
