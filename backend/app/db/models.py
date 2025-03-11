from sqlalchemy import Column, DateTime, Integer, Numeric, String, Boolean, ForeignKey, Text, ARRAY, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

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
    projects = relationship("Projects", back_populates="client")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    bio = Column(Text)
    skills = Column(ARRAY(String))
    hourly_rate = Column(Numeric)

class Projects(Base):
    __tablename__ = "projects"

    project_id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"))
    project_name = Column(String)
    client_name = Column(String)
    details = Column(Text)
    skill_required = Column(ARRAY(String))
    payment_type = Column(String)  # Changed from Payment_Type
    project_status = Column(String)
    github_link = Column(String, nullable=True)  # Changed from Github_link
    start_date = Column(TIMESTAMP(timezone=True), nullable=True)
    end_date = Column(TIMESTAMP(timezone=True), nullable=True)
    pay_per_hour = Column(Numeric, nullable=True)
    pay_per_project = Column(Numeric, nullable=True)
    duration = Column(Integer, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Define the relationship with User
    client = relationship("User", back_populates="projects")
