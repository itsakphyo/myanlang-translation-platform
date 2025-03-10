from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Enum, String
from sqlalchemy.orm import relationship
from .base import Base
from .enums import PaymentMethod, WithdrawalStatus

class Withdrawal(Base):
    __tablename__ = "withdrawal"


    withdrawal_id = Column(Integer, primary_key=True, autoincrement=True)
    freelancer_id = Column(Integer, ForeignKey("freelancer.freelancer_id"), nullable=False, index=True)
    admin_id = Column(Integer, ForeignKey("admin.admin_id"), nullable=True, index=True)
    payment_method = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    requested_at = Column(DateTime, nullable=False)
    withdrawal_status = Column(Enum(WithdrawalStatus), nullable=False)
    processed_at = Column(DateTime, nullable=True)
    paypal_link = Column(String, nullable=True)
    payoneer_email = Column(String, nullable=True)
    wavepay_phone = Column(String, nullable=True)
    kpay_phone = Column(String, nullable=True)
    account_holder_name = Column(String, nullable=True)
    bank_name = Column(String, nullable=True)
    account_number = Column(String, nullable=True)

    freelancer = relationship("Freelancer", back_populates="withdrawals")
    admin = relationship("Admin", back_populates="withdrawals")