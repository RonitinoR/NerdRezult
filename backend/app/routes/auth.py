import re
import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
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

@router.post("/signup")
async def store_file(file: UploadFile):
    #generate unique filename
    file_ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = UPLOAD_DIR / filename

    # validate file path
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(400, "only JPEG/PNG allowed")
    
    # validate file size max 2MB
    if file.size > 2 * 1024 * 1024:
        raise HTTPException(400, "File too large (max allowed size upto 2MB)")
    
    # save the file
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    return f"/static/profile_pics/{filename}"

async def signup(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form(...),
    profile_pic: UploadFile = File(None),
    db: AsyncSession = Depends(get_db)
):
    existing_user = await db.execute(
        select(User).where(User.email == email)
    )
    if existing_user.scalar():
        raise HTTPException(status_code = 400, detail = "Email already registered")
    hashed_password = get_password_hash(password)
    profile_pic_url = None
    if profile_pic:
        profile_pic_url = await store_file(profile_pic)
    new_user = User(
        email = email, 
        hashed_password = hashed_password,
        name = name,
        role = role,
        profile_pic_url = profile_pic_url
    )
    db.add(new_user)
    return {"message": "User created successfully"}

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    user = await db.execute(
        select(User).where(User.email == form_data.username)
    )
    user = user.scalar()
    if not user or verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code = 401, detail = "Invalid credential")
    access_token = create_access_token(data = {"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

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
