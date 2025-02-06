# from sqlalchemy.orm import Session
# from . import models, schemas
# from .auth import get_password_hash

# def get_user_by_email(db: Session, email: str):
#     return db.query(models.User).filter(models.User.email == email).first()

# def create_user(db: Session, user: schemas.UserCreate):
#     hashed_password = get_password_hash(user.password)
#     db_user = models.User(
#         email=user.email,
#         full_name=user.full_name,
#         age=user.age,
#         phone_number=user.phone_number,
#         password_hash=hashed_password
#     )
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user 