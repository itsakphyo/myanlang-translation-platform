from datetime import datetime, timedelta, UTC
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from fastapi import HTTPException
from ..core.database import get_db
from ..core.config import get_settings
from ..schemas.freelancer import Freelancer
from ..schemas.admin import Admin
from ..schemas.qa_member import QAMember

settings = get_settings()
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=int(settings.MAIL_PORT),
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    TEMPLATE_FOLDER=settings.TEMPLATE_FOLDER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def send_verification_email(email: str, verification_code: str):
    message = MessageSchema(
        subject="Email Verification Code",
        recipients=[email],
        template_body={
            "verification_code": verification_code
        },
        subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message, template_name="email_verify.html")

async def check_existing_user(db: Session, email: str):
    try:
        admin = db.query(Admin).filter(Admin.email == email).first()
        freelancer = db.query(Freelancer).filter(Freelancer.email == email).first()
        qa_member = db.query(QAMember).filter(QAMember.email == email).first()

        if admin:
            return admin, "admin"
        elif freelancer:
            return freelancer, "freelancer"
        elif qa_member:
            return qa_member, "qa_member"
        else:
            return None, None  

    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
