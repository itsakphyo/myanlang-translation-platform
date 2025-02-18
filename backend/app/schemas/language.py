from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .base import Base
from pydantic import BaseModel

class Language(Base):
    __tablename__ = "language"

    language_id = Column(Integer, primary_key=True, autoincrement=True)
    language_name = Column(String, nullable=False, unique=True)
    
    source_tasks = relationship(
        "Task", 
        foreign_keys="Task.source_language_id", 
        back_populates="source_language", 
        overlaps="target_tasks"
    )
    target_tasks = relationship(
        "Task", 
        foreign_keys="Task.target_language_id", 
        back_populates="target_language", 
        overlaps="source_tasks"
    )
    freelancer_language_pairs_source = relationship(
        "FreelancerLanguagePair", 
        foreign_keys="FreelancerLanguagePair.source_language_id", 
        back_populates="source_language", 
        overlaps="freelancer_language_pairs_target"
    )
    freelancer_language_pairs_target = relationship(
        "FreelancerLanguagePair", 
        foreign_keys="FreelancerLanguagePair.target_language_id", 
        back_populates="target_language", 
        overlaps="freelancer_language_pairs_source"
    )

class LanguageCreate(BaseModel):
    language_name: str