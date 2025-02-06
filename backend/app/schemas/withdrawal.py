from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from .base import Base
from .enums import PaymentMethod, WithdrawalStatus

class Withdrawal(Base):
    __tablename__ = "withdrawal"


    withdrawal_id = Column(Integer, primary_key=True, autoincrement=True)
    freelancer_id = Column(Integer, ForeignKey("freelancer.freelancer_id"), nullable=False, index=True)
    admin_id = Column(Integer, ForeignKey("admin.admin_id"), nullable=True, index=True)
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    amount = Column(Float, nullable=False)
    requested_at = Column(DateTime, nullable=False)
    withdrawal_status = Column(Enum(WithdrawalStatus), nullable=False)
    processed_at = Column(DateTime, nullable=True)

    freelancer = relationship("Freelancer", back_populates="withdrawals")
    admin = relationship("Admin", back_populates="withdrawals")