import re
import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from app.db.models import User
from app.db.database import get_db
from app.core.config import settings
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.security import PhoneNumber, OTP, validate_phone_number, generate_otp

UPLOAD_DIR = Path("uploads/profile_pic")
UPLOAD_DIR.mkdir(parents = True, exist_ok = True)

router = APIRouter()

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
    content = await file.read
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
        profile_pic_url=profile_pic_url
    )
    db.add(new_user)
    await db.commit
    await db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user_id": new_user.id
    }

@router.post("/login")
async def login(
    email: str = Form(...),
    password: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    user = await db.execute(
        select(User).where(User.email == email)
    )
    user = user.scalar()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED, 
            detail = "Invalid credential"
        )
    access_token = create_access_token(data = {"sub": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_id": user.id,
        "role": user.role
    }
# OTP endpoints
@router.post("/send-otp")
async def send_otp(phone: PhoneNumber, db: AsyncSession = Depends(get_db)):
    phone_number = validate_phone_number(phone.phone_number)
    otp = generate_otp()
    await db.execute(
        text("""
            INSERT INTO users (phone_number, otp, otp_valid_until) 
            VALUES (:phone_number, :otp, NOW() + INTERVAL '5 minutes')
            ON CONFLICT (phone_number) DO UPDATE 
            SET otp = EXCLUDED.otp, otp_valid_until = EXCLUDED.otp_valid_until;
        """), 
        {"phone_number": phone_number, "otp": otp}
    )
    await db.commit()
    # Here, you'd send the OTP via an SMS API
    return {"message": "OTP sent successfully"}

@router.post("/verify-otp")
async def verify_otp(otp_data: OTP, db: AsyncSession = Depends(get_db)):
    phone_number = validate_phone_number(otp_data.phone_number)
    result = await db.execute(
        text("""
            SELECT otp FROM users 
            WHERE phone_number = :phone_number AND otp = :otp AND otp_valid_until > NOW();
        """), 
        {"phone_number": phone_number, "otp": otp_data.otp}
    )
    user = result.fetchone()
    if user is None:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    access_token = create_access_token(data={"sub": phone_number})
    return {"access_token": access_token, "token_type": "bearer"}
