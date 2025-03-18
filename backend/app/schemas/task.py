from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from .base import Base
from .job import JobStatus
from .enums import TaskStatus
from pydantic import BaseModel
from typing import Optional

class Task(Base):
    __tablename__ = "task"

    task_id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(Integer, ForeignKey("job.job_id", ondelete="CASCADE"), nullable=False, index=True)
    job_status = Column(Enum(JobStatus, name="jobstatus"), nullable=False, default=JobStatus.IN_PROGRESS)
    source_language_id = Column(Integer, ForeignKey("language.language_id"), nullable=False, index=True)
    source_text = Column(String, nullable=False)
    target_language_id = Column(Integer, ForeignKey("language.language_id"), nullable=False, index=True)
    translated_text = Column(String, nullable=True)
    max_time_per_task = Column(Integer, nullable=False)
    task_status = Column(Enum(TaskStatus), nullable=False, default=TaskStatus.OPEN)
    assigned_freelancer_id = Column(Integer, ForeignKey("freelancer.freelancer_id"), nullable=True, index=True)
    submitted_by_id = Column(Integer, ForeignKey("freelancer.freelancer_id"), nullable=True, index=True)
    qa_assigned_id = Column(Integer, ForeignKey("qa_member.qa_member_id"), nullable=True, index=True)
    qa_reviewed_by_id = Column(Integer, ForeignKey("qa_member.qa_member_id"), nullable=True, index=True)
    task_price = Column(Float, nullable=False)
    is_assessment = Column(Boolean, nullable=False, default=False)
    assigned_at = Column(DateTime, nullable=True)
    submitted_at = Column(DateTime, nullable=True)
    qa_assigned_at = Column(DateTime, nullable=True)
    qa_reviewed_at = Column(DateTime, nullable=True)

    job = relationship("Job", back_populates="tasks")
    source_language = relationship("Language", foreign_keys=[source_language_id])
    target_language = relationship("Language", foreign_keys=[target_language_id])
    assigned_freelancer = relationship("Freelancer", foreign_keys=[assigned_freelancer_id])
    submitted_by = relationship("Freelancer", foreign_keys=[submitted_by_id])
    qa_assigned = relationship("QAMember", foreign_keys=[qa_assigned_id])
    qa_reviewed = relationship("QAMember", foreign_keys=[qa_reviewed_by_id])

class OpenTaskRequest(BaseModel):
    freelancer_id: int
    source_language_id: int
    target_language_id: int

class OpenTaskResponse(BaseModel):
    task_id: int
    instruction: str
    max_time_per_task: int
    price: Optional[float]
    source_text: str
    translated_text: Optional[str]
    source_language_name: str
    target_language_name: str

class SubmitTaskRequest(BaseModel):
    freelancer_id: int
    task_id: int
    translated_text: str

class SubmitTaskResponse(BaseModel):
    message: str