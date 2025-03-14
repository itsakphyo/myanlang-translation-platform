from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..schemas.freelancer import *
from ..schemas.withdrawal import Withdrawal
from ..core.database import get_db
from datetime import datetime
from ..schemas.enums import WithdrawalStatus
import asyncio
from ..services.email import send_payment_email, send_payment_request_email

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
def request_new_payment(
    request_body: PaymentRequestBody, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    freelancer_id = request_body.freelancer_id
    payment_method = request_body.payment_method.lower()
    amount = request_body.amount

    freelancer = db.query(Freelancer).filter(Freelancer.freelancer_id == freelancer_id).first()
    
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer not found")

    if amount > freelancer.current_balance:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    if payment_method not in VALID_PAYMENT_METHODS:
        raise HTTPException(status_code=400, detail="Invalid payment method")

    withdrawal_data = {
        "freelancer_id": freelancer_id,
        "payment_method": payment_method,
        "amount": amount,
        "requested_at": datetime.now(),
        "withdrawal_status": WithdrawalStatus.UNDER_PROCESSING,
    }

    if payment_method == "paypal":
        if not request_body.paypal_link:
            raise HTTPException(status_code=400, detail="PayPal link is required")
        withdrawal_data["paypal_link"] = request_body.paypal_link

    elif payment_method == "payoneer":
        if not request_body.payoneer_email:
            raise HTTPException(status_code=400, detail="Payoneer email is required")
        withdrawal_data["payoneer_email"] = request_body.payoneer_email

    elif payment_method == "wavepay":
        if not request_body.wavepay_phone or not request_body.account_holder_name:
            raise HTTPException(status_code=400, detail="Wavepay phone and account holder name are required")
        withdrawal_data["wavepay_phone"] = request_body.wavepay_phone
        withdrawal_data["account_holder_name"] = request_body.account_holder_name

    elif payment_method == "kpay":
        if not request_body.kpay_phone or not request_body.account_holder_name:
            raise HTTPException(status_code=400, detail="Kpay phone and account holder name are required")
        withdrawal_data["kpay_phone"] = request_body.kpay_phone
        withdrawal_data["account_holder_name"] = request_body.account_holder_name

    elif payment_method == "bank":
        if not all([request_body.account_holder_name, request_body.bank_name, request_body.account_number]):
            raise HTTPException(status_code=400, detail="Bank details are required")
        withdrawal_data["account_holder_name"] = request_body.account_holder_name
        withdrawal_data["bank_name"] = request_body.bank_name
        withdrawal_data["account_number"] = request_body.account_number

    db_withdrawal = Withdrawal(**withdrawal_data)
    db.add(db_withdrawal)

    freelancer.current_balance -= amount
    freelancer.pending_withdrawal += amount
    db.commit()
    db.refresh(db_withdrawal)

    # Prepare email parameters
    email_params = {
        "freelancer_name": freelancer.full_name,
        "payment_method": payment_method,
        "amount": amount,
    }

    # Send email in the background
    background_tasks.add_task(lambda: asyncio.run(send_payment_request_email(**email_params)))

    return {"message": "Payment request submitted successfully"}


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
def update_withdrawal(
    request_body: UpdateWithdrawalRequestBody,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Updates the withdrawal status, adjusts the freelancer's balance,
    and sends an email notification for the processed payment.
    """
    # Fetch the withdrawal record from the database.
    withdrawal = db.query(Withdrawal).filter(
        Withdrawal.withdrawal_id == request_body.withdrawal_id
    ).first()
    if not withdrawal:
        raise HTTPException(status_code=404, detail="Withdrawal not found")

    # Update withdrawal record.
    withdrawal.proof_of_payment = request_body.proof_of_payment
    withdrawal.withdrawal_status = WithdrawalStatus.PROCESSED
    withdrawal.processed_at = datetime.now()
    withdrawal.admin_id = request_body.admin_id

    # Update freelancer's balance.
    freelancer = db.query(Freelancer).filter(
        Freelancer.freelancer_id == withdrawal.freelancer_id
    ).first()
    freelancer.total_withdrawn += withdrawal.amount
    freelancer.pending_withdrawal -= withdrawal.amount

    db.commit()
    db.refresh(withdrawal)

    # Prepare common email parameters.
    email = freelancer.email
    freelancer_name = freelancer.full_name
    amount = withdrawal.amount
    processed_at = withdrawal.processed_at
    withdrawal_id = withdrawal.withdrawal_id
    payment_method = withdrawal.payment_method  # e.g., 'paypal', 'bank', etc.
    proof_of_payment = withdrawal.proof_of_payment

    email_params = {
        "email": email,
        "freelancer_name": freelancer_name,
        "amount": amount,
        "payment_method": payment_method,
        "processed_at": processed_at,
        "withdrawal_id": withdrawal_id,
        "proof_of_payment": proof_of_payment,
    }

    # Include payment method–specific details.
    if payment_method == "paypal":
        email_params["paypal_link"] = withdrawal.paypal_link
    elif payment_method == "payoneer":
        email_params["payoneer_email"] = withdrawal.payoneer_email
    elif payment_method == "wavepay":
        email_params["wavepay_phone"] = withdrawal.wavepay_phone
        email_params["account_holder_name"] = withdrawal.account_holder_name
    elif payment_method == "kpay":
        email_params["kpay_phone"] = withdrawal.kpay_phone
        email_params["account_holder_name"] = withdrawal.account_holder_name
    elif payment_method == "bank":
        email_params["bank_name"] = withdrawal.bank_name
        email_params["account_holder_name"] = withdrawal.account_holder_name
        email_params["account_number"] = withdrawal.account_number

    background_tasks.add_task(lambda: asyncio.run(send_payment_email(**email_params)))

    return withdrawal