from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from .base import Base

class QAMember(Base):
    __tablename__ = "qa_member"

    qa_member_id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    initial_password = Column(Boolean, nullable=False, default=True)
    password_hash = Column(String, nullable=False)
    total_tasks_reviewed = Column(Integer, nullable=False, default=0)
    total_tasks_rejected = Column(Integer, nullable=False, default=0)
    
    tasks_assigned = relationship(
        "Task", 
        foreign_keys="[Task.qa_assigned_id]", 
        back_populates="qa_assigned"
    )
    tasks_reviewed = relationship(
        "Task", 
        foreign_keys="[Task.qa_reviewed_by_id]", 
        back_populates="qa_reviewed"
    )

class QAMemberCreate(BaseModel):
    full_name: str
    email: str
    password: str

class QAPasswordReset(BaseModel):
    qa_member_id: int
    password: str

class QACreatePassword(BaseModel):
    qa_member_id: int
    new_password: str
    confirm_password: str
