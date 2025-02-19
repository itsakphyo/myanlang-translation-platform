from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    Float,
)
from pydantic import BaseModel, EmailStr, ConfigDict, Field
from typing import Optional
from sqlalchemy.orm import relationship
from .task import Task
from .base import Base

class Freelancer(Base):
    __tablename__ = "freelancer"

    freelancer_id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    age = Column(Integer)
    phone_number = Column(String)
    password_hash = Column(String, nullable=False)
    total_earnings = Column(Float, default=0.0)
    total_withdrawn = Column(Float, default=0.0)
    current_balance = Column(Float, default=0.0)
    pending_withdrawal = Column(Float, default=0.0)
    
    tasks_assigned = relationship(
        "Task", 
        foreign_keys="[Task.assigned_freelancer_id]", 
        back_populates="assigned_freelancer"
    )
    tasks_submitted = relationship(
        "Task", 
        foreign_keys="[Task.submitted_by_id]", 
        back_populates="submitted_by"
    )
    language_pairs = relationship(
        "FreelancerLanguagePair", 
        back_populates="freelancer", 
        cascade="all, delete-orphan"
    )
    withdrawals = relationship("Withdrawal", back_populates="freelancer")
    reports = relationship("IssueReport", back_populates="freelancer")


class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str
    age: int
    phone_number: Optional[str] = None
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class FreelancerResponse(BaseModel):
    freelancer_id: int
    full_name: str
    email: EmailStr
    age: int
    phone_number: Optional[str] = None
    total_earnings: float = Field(0.0)
    total_withdrawn: float = Field(0.0)
    current_balance: float = Field(0.0)
    pending_withdrawal: float = Field(0.0)

    model_config = ConfigDict(from_attributes=True)

class EmailVerification(BaseModel):
    email: EmailStr

class CodeVerification(BaseModel):
    email: EmailStr
    code: int

class Token(BaseModel):
    access_token: str
    token_type: str
    user_type: str

class TokenData(BaseModel):
    email: str

class PasswordReset(BaseModel):
    email: str
    new_password: str
    confirm_password: str