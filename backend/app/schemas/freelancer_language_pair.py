from sqlalchemy import Column, Integer, Float, ForeignKey, UniqueConstraint, Enum
from sqlalchemy.orm import relationship
from .base import Base
from .enums import AssSubmission

class FreelancerLanguagePair(Base):
    __tablename__ = "freelancer_language_pair"
    __table_args__ = (
        UniqueConstraint(
            "freelancer_id", 
            "source_language_id", 
            "target_language_id", 
            name="unique_language_pair_per_freelancer"
        ),
    )

    language_pair_id = Column(Integer, primary_key=True, autoincrement=True)
    freelancer_id = Column(Integer, ForeignKey("freelancer.freelancer_id"), nullable=False, index=True)
    source_language_id = Column(Integer, ForeignKey("language.language_id"), nullable=False, index=True)
    target_language_id = Column(Integer, ForeignKey("language.language_id"), nullable=False, index=True)
    status = Column(Enum(AssSubmission, name="ass_submission_status"), nullable=False, default=AssSubmission.UNDER_REVIEW)
    accuracy_rate = Column(Float, nullable=False, default=100.0)
    
    freelancer = relationship("Freelancer", back_populates="language_pairs")
    source_language = relationship(
        "Language", 
        foreign_keys=[source_language_id], 
        back_populates="freelancer_language_pairs_source"
    )
    target_language = relationship(
        "Language", 
        foreign_keys=[target_language_id], 
        back_populates="freelancer_language_pairs_target"
    )