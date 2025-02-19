import os
import uuid
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.models import User
from db.database import get_db
from core.security import get_password_hash, verify_password, create_access_token

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