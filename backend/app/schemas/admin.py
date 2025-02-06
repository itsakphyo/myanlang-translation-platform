from sqlalchemy import (
    Column,
    Integer,
    String,
)
from sqlalchemy.orm import relationship
from .base import Base
class Admin(Base):
    __tablename__ = "admin"

    admin_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    password_hash = Column(String, nullable=False)

    withdrawals = relationship("Withdrawal", back_populates="admin")
    reports = relationship("IssueReport", back_populates="admin")