from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..schemas.freelancer import *
from ..schemas.withdrawal import Withdrawal
from ..core.database import get_db
from datetime import datetime
from ..schemas.enums import WithdrawalStatus


router = APIRouter()


class PaymentRequestBody(BaseModel):
    freelancer_id: int
    payment_method: str
    amount: float
    paypal_link: str = None
    payoneer_email: str = None
    wavepay_phone: str = None
    kpay_phone: str = None
    account_holder_name: str = None
    bank_name: str = None
    account_number: str = None


VALID_PAYMENT_METHODS = ["paypal", "payoneer", "wavepay", "kpay", "bank"]

@router.post("/request_new_payment")
def request_new_payment(request_body: PaymentRequestBody, db: Session = Depends(get_db)):
    freelancer_id = request_body.freelancer_id
    payment_method = request_body.payment_method
    amount = request_body.amount

    freelancer = db.query(Freelancer).filter(Freelancer.freelancer_id == freelancer_id).first()

    if amount > freelancer.current_balance:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    if payment_method.lower() not in VALID_PAYMENT_METHODS:
        raise HTTPException(status_code=400, detail="Invalid payment method")

    if payment_method.lower() == "paypal":
        if request_body.paypal_link is None:
            raise HTTPException(status_code=400, detail="PayPal email is not set")
        else:
            db_withdrawal = Withdrawal(
                freelancer_id=freelancer_id,
                payment_method=payment_method,
                amount=amount,
                requested_at=datetime.now(),
                withdrawal_status= WithdrawalStatus.UNDER_PROCESSING,
                paypal_link=request_body.paypal_link
            )
            db.add(db_withdrawal)
            freelancer.current_balance -= amount
            freelancer.pending_withdrawal += amount
            db.commit()

    if payment_method.lower() == "payoneer":
        if request_body.payoneer_email is None:
            raise HTTPException(status_code=400, detail="Payoneer email is not set")
        else:
            db_withdrawal = Withdrawal(
                freelancer_id=freelancer_id,
                payment_method=payment_method,
                amount=amount,
                requested_at=datetime.now(),
                withdrawal_status=WithdrawalStatus.UNDER_PROCESSING,
                payoneer_email=request_body.payoneer_email
            )

            db.add(db_withdrawal)
            freelancer.current_balance -= amount
            freelancer.pending_withdrawal += amount
            db.commit()
    
    if payment_method.lower() == "wavepay":
        if request_body.wavepay_phone is None or request_body.account_holder_name is None:
            raise HTTPException(status_code=400, detail="Wavepay phone is not set")
        else:
            db_withdrawal = Withdrawal(
                freelancer_id=freelancer_id,
                payment_method=payment_method,
                amount=amount,
                requested_at=datetime.now(),
                withdrawal_status=WithdrawalStatus.UNDER_PROCESSING,
                wavepay_phone=request_body.wavepay_phone,
                account_holder_name=request_body.account_holder_name
            )

            db.add(db_withdrawal)
            freelancer.current_balance -= amount
            freelancer.pending_withdrawal += amount
            db.commit()
    
    if payment_method.lower() == "kpay":
        if request_body.kpay_phone is None or request_body.account_holder_name is None:
            raise HTTPException(status_code=400, detail="Kpay phone is not set")
        else:
            db_withdrawal = Withdrawal(
                freelancer_id=freelancer_id,
                payment_method=payment_method,
                amount=amount,
                requested_at=datetime.now(),
                withdrawal_status=WithdrawalStatus.UNDER_PROCESSING,
                kpay_phone=request_body.kpay_phone,
                account_holder_name=request_body.account_holder_name
            )

            db.add(db_withdrawal)
            freelancer.current_balance -= amount
            freelancer.pending_withdrawal += amount
            db.commit()

    if payment_method.lower() == "bank":
        if request_body.account_holder_name is None or request_body.bank_name is None or request_body.account_number is None:
            raise HTTPException(status_code=400, detail="Bank details are not set")
        else:
            db_withdrawal = Withdrawal(
                freelancer_id=freelancer_id,
                payment_method=payment_method,
                amount=amount,
                requested_at=datetime.now(),
                withdrawal_status=WithdrawalStatus.UNDER_PROCESSING,
                account_holder_name=request_body.account_holder_name,
                bank_name=request_body.bank_name,
                account_number=request_body.account_number
            )
            db.add(db_withdrawal)
            freelancer.current_balance -= amount
            freelancer.pending_withdrawal += amount
            db.commit()

    db.refresh(db_withdrawal)
    return db_withdrawal


@router.get("/get_all_withdrawals")
def get_withdrawals(db: Session = Depends(get_db)):
    withdrawals = db.query(Withdrawal).all()
    return withdrawals

@router.get("/get_withdrawal/{withdrawal_id}")
def get_withdrawal(withdrawal_id: int, db: Session = Depends(get_db)):
    withdrawal = db.query(Withdrawal).filter(Withdrawal.withdrawal_id == withdrawal_id).first()
    return withdrawal

@router.get("/get_withdrawals_by_freelancer/{freelancer_id}")
def get_withdrawals_by_freelancer(freelancer_id: int, db: Session = Depends(get_db)):
    withdrawals = db.query(Withdrawal).filter(Withdrawal.freelancer_id == freelancer_id).all()
    return withdrawals

@router.get("/get_current_balance/{freelancer_id}")
def get_current_balance(freelancer_id: int, db: Session = Depends(get_db)):
    freelancer = db.query(Freelancer).filter(Freelancer.freelancer_id == freelancer_id).first()
    return {"current_balance": freelancer.current_balance}



class UpdateWithdrawalRequestBody(BaseModel):
    withdrawal_id: int
    admin_id: int
    proof_of_payment: str


@router.post("/update_withdrawal/")
def update_withdrawal(request_body: UpdateWithdrawalRequestBody, db: Session = Depends(get_db)):
    withdrawal_id = request_body.withdrawal_id
    admin_id = request_body.admin_id
    proof_of_payment = request_body.proof_of_payment

    withdrawal = db.query(Withdrawal).filter(Withdrawal.withdrawal_id == withdrawal_id).first()
    if withdrawal is None:
        raise HTTPException(status_code=404, detail="Withdrawal not found")

    withdrawal.proof_of_payment = proof_of_payment
    withdrawal.withdrawal_status = WithdrawalStatus.PROCESSED
    withdrawal.processed_at = datetime.now()
    withdrawal.admin_id = admin_id

    freelancer = db.query(Freelancer).filter(Freelancer.freelancer_id == withdrawal.freelancer_id).first()
    freelancer.total_withdrawn += withdrawal.amount
    freelancer.pending_withdrawal -= withdrawal.amount

    db.commit()
    db.refresh(withdrawal)
    return withdrawal