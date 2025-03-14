from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from ..core.database import get_db
from ..schemas.freelancer import *
from ..schemas.qa_member import *
from ..services.auth import get_password_hash, send_verification_email, generate_code
from ..schemas.verification_code import VerificationCode
from datetime import datetime, timedelta

router = APIRouter()

@router.post("/auth/send-code")
async def send_verification_code(email_data: EmailVerification, db: Session = Depends(get_db)):
    user = db.query(Freelancer).filter(Freelancer.email == email_data.email).first()
    qa_member = db.query(QAMember).filter(QAMember.email == email_data.email).first()
    if not (user or qa_member):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    if qa_member:
        if qa_member.initial_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please change your initial password before proceeding"
            )
    code = generate_code()
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    existing_entry = db.query(VerificationCode).filter(VerificationCode.email == email_data.email).first()

    if existing_entry:
        existing_entry.code = code
        existing_entry.expires_at = expires_at
        existing_entry.is_verified = False
    else:
        new_entry = VerificationCode(email=email_data.email, code=code, expires_at=expires_at)
        db.add(new_entry)

    db.commit()
    
    await send_verification_email(email_data.email, code)
    
    return {"message": "Verification code sent"}

@router.post("/auth/verify-code")
async def verify_code(verification: CodeVerification, db: Session = Depends(get_db)):
    entry = db.query(VerificationCode).filter(VerificationCode.email == verification.email).first()

    if not entry:
        raise HTTPException(status_code=400, detail="Email not found")

    if entry.is_verified:
        raise HTTPException(status_code=400, detail="Email already verified")

    if entry.code != str(verification.code):
        raise HTTPException(status_code=400, detail="Invalid verification code")

    if datetime.utcnow() > entry.expires_at:
        raise HTTPException(status_code=400, detail="Verification code expired")

    entry.is_verified = True
    db.commit()

    return {"message": "Code verified successfully"}

@router.post("/auth/reset-password")
async def reset_password(reset_data: PasswordReset, db: Session = Depends(get_db)):
    if reset_data.new_password != reset_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )
    
    user = db.query(Freelancer).filter(Freelancer.email == reset_data.email).first()
    qa_member = db.query(QAMember).filter(QAMember.email == reset_data.email).first()
    
    if not (user or qa_member):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    

    hashed_password = get_password_hash(reset_data.new_password)

    try:
        if user:
            user.password_hash = hashed_password
        
        if qa_member:
            qa_member.password_hash = hashed_password

        db.commit()
        return {"message": "Password reset successful"}
                    
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while resetting password"
        )
    
    
