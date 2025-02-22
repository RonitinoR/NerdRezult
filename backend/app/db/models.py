from sqlalchemy import Column, DateTime, Integer, Numeric, String, Boolean, ForeignKey, Text, ARRAY
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key = True, index = True)
    email = Column(String, unique = True, index = True)
    name = Column(String)
    role = Column(String)
    hashed_password = Column(String)
    profile_pic_url = Column(String)
    is_active = Column(Boolean, default = True)
    provider = Column(String, default = "email") # 'email', 'github', 'google'
    provider_id = Column(String)
    phone_number = Column(String, unique=True, index=True)
    otp = Column(String)
    otp_valid_until = Column(DateTime)

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey('users.id'))
    bio = Column(Text)
    skills = Column(ARRAY(String))
    hourly_rate = Column(Numeric)
