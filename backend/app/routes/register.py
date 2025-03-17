from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from ..schemas.freelancer import *
from ..core.database import get_db
from sqlalchemy.orm import Session
from ..services.auth import get_current_user, generate_code, send_verification_email, get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, check_existing_user
from datetime import datetime, timedelta
from ..schemas.verification_code import VerificationCode

router = APIRouter()    

@router.post("/auth/register", response_model=FreelancerResponse)
async def register(freelancer: RegisterRequest, db: Session = Depends(get_db)):
    existing_user, _ = await check_existing_user(db, freelancer.email)
    if existing_user is not None:
        raise HTTPException(status_code=409, detail="Email already registered")
    
    hashed_password = get_password_hash(freelancer.password)
    db_freelancer = Freelancer(
        email=freelancer.email,
        full_name=freelancer.full_name,
        age=freelancer.age,
        phone_number=freelancer.phone_number,
        password_hash=hashed_password,
        total_earnings=0.0,
        total_withdrawn=0.0,
        current_balance=0.0,
        pending_withdrawal=0.0
    )
    db.add(db_freelancer)
    db.commit()
    db.refresh(db_freelancer)
    return db_freelancer

@router.post("/auth/send-code")
async def send_verification_code(email_data: EmailVerification, db: Session = Depends(get_db)):
    existing_user, _ = await check_existing_user(db, email_data.email)
    if existing_user is not None:
        raise HTTPException(status_code=409, detail="Email already registered")

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

    return {"message", code}

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


@router.post("/auth/login")
async def login(form_data: LoginRequest, db: Session = Depends(get_db)):
    existing_user, user_type = await check_existing_user(db, form_data.email)

    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(form_data.password, existing_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": existing_user.email}, expires_delta=access_token_expires
    )

    response_data = {
        "access_token": access_token,
        "token_type": "bearer",
        "user_type": user_type,
    }

    if user_type == "admin":
        response_data["userId"] = existing_user.admin_id
    if user_type == "freelancer":
        response_data["userId"] = existing_user.freelancer_id
        response_data["full_name"] = existing_user.full_name
    if user_type == "qa_member":
        response_data["userId"] = existing_user.qa_member_id
        response_data["full_name"] = existing_user.full_name
        response_data["initial_password"] = existing_user.initial_password
        response_data["user_id"] = existing_user.qa_member_id

    return response_data

@router.get("/auth/me")
async def read_current_user(current_user: Freelancer = Depends(get_current_user)):
    """
    This endpoint returns the current user's information.
    It ensures the user info is always fresh by querying the database.
    """
    user_dict = {key: value for key, value in current_user.__dict__.items() if key != "password_hash"}
    
    user_dict.pop('_sa_instance_state', None)
    
    return user_dict


@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    """
    This endpoint is used for the OAuth2 flow (Swagger UI).
    It accepts form data (username and password) and returns the access token.
    """
    # Use form_data.username as the email
    existing_user, user_type = await check_existing_user(db, form_data.username)
    
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(form_data.password, existing_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": existing_user.email}, expires_delta=access_token_expires
    )

    response_data = {
        "access_token": access_token,
        "token_type": "bearer",
        "user_type": user_type,
    }

    if user_type == "qa_member":
        response_data["initial_password"] = existing_user.initial_password
        response_data["user_id"] = existing_user.qa_member_id

    return response_data