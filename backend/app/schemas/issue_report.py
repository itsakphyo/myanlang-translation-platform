from sqlalchemy import Column, Integer, DateTime, ForeignKey, Enum, String
from sqlalchemy.orm import relationship
from .base import Base
from .enums import Issues, RPstatus

class IssueReport(Base):
    __tablename__ = "issue_report"

    report_id = Column(Integer, primary_key=True, autoincrement=True)
    freelancer_id = Column(Integer, ForeignKey("freelancer.freelancer_id"), nullable=False, index=True)
    admin_id = Column(Integer, ForeignKey("admin.admin_id"), nullable=True, index=True)
    issue_type = Column(Enum(Issues), nullable=False)
    reported_at = Column(DateTime, nullable=False)
    report_status = Column(Enum(RPstatus), nullable=False)
    resolved_at = Column(DateTime, nullable=True)
    withdrawalId = Column(Integer, nullable=True)
    description = Column(String, nullable=True)
    taskId = Column(Integer, nullable=True)
    documentationUrl = Column(String, nullable=True)
    source_language_id = Column(Integer, nullable=True)
    target_language_id = Column(Integer, nullable=True)

    freelancer = relationship("Freelancer", back_populates="reports")
    admin = relationship("Admin", back_populates="reports")