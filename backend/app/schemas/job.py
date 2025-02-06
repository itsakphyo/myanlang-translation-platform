from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from .base import Base
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from .enums import JobStatus
from typing import Optional

class Job(Base):
    __tablename__ = "job"


    job_id = Column(Integer, primary_key=True, autoincrement=True)
    job_title = Column(String, nullable=False)
    source_language_id = Column(Integer, ForeignKey("language.language_id"), nullable=False, index=True)
    target_language_id = Column(Integer, ForeignKey("language.language_id"), nullable=False, index=True)
    total_tasks = Column(Integer, nullable=True)
    job_status = Column(Enum(JobStatus, name="jobstatus"), nullable=False, default=JobStatus.IN_PROGRESS)
    max_time_per_task = Column(Integer, nullable=False, default=10)
    created_at = Column(DateTime, nullable=False)
    task_price = Column(Float, nullable=False)
    instructions = Column(String, nullable=False)
    notes = Column(String, nullable=True)

    tasks = relationship("Task", back_populates="job", cascade="all, delete-orphan")
    source_language = relationship("Language", foreign_keys=[source_language_id])
    target_language = relationship("Language", foreign_keys=[target_language_id])

class JobCreateInput(BaseModel):
    job_title: str
    source_language_id: int
    target_language_id: int
    max_time_per_task: int
    created_at: datetime
    task_price: float
    instructions: str
    notes: str
    model_config = ConfigDict(from_attributes=True)

class JobProgress(BaseModel):
    job_id: int
    total_tasks: int
    completed_tasks: int
    under_review_tasks: int
    model_config = ConfigDict(from_attributes=True)


class JobUpdateInput(BaseModel):
    job_title: str
    source_language_id: int
    target_language_id: int
    max_time_per_task: int
    task_price: float
    instructions: str
    notes: Optional[str] = None  

    model_config = ConfigDict(from_attributes=True)