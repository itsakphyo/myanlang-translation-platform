from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from .base import Base
from .enums import AssTaskStatus


class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempt"

    attempt_id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(Integer, ForeignKey("task.task_id", ondelete="CASCADE"), nullable=False, index=True)
    freelancer_id = Column(Integer, ForeignKey("freelancer.freelancer_id"), nullable=False, index=True)
    submission_text = Column(String, nullable=True) 
    attempt_status = Column(Enum(AssTaskStatus, name="ass_task_status"), nullable=False, default=AssTaskStatus.UNDER_REVIEW)

    task = relationship("Task", back_populates="assessment_attempts")
    freelancer = relationship("Freelancer", foreign_keys=[freelancer_id])