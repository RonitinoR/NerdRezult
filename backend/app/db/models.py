from sqlalchemy import Column, DateTime, Integer, Numeric, String, Boolean, ForeignKey, Text, ARRAY
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)  # Make email nullable for phone-only users
    name = Column(String, nullable=True)
    role = Column(String)
    hashed_password = Column(String, nullable=True)  # Make password nullable for phone/oauth users
    profile_pic_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    provider = Column(String, default="email")  # 'email', 'github', 'google', 'phone'
    provider_id = Column(String, nullable=True)
    phone_number = Column(String, unique=True, nullable=True)
    auth_method = Column(String)

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    bio = Column(Text)
    skills = Column(ARRAY(String))
    hourly_rate = Column(Numeric)
