from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..schemas.qa_member import QAMember, QAMemberCreate, QAPasswordReset, QACreatePassword
from ..core.database import get_db
from ..services.auth import get_password_hash, check_existing_user


router = APIRouter()

@router.post("/create_qa_member")
async def create_qa_member(qa_member: QAMemberCreate, db: Session = Depends(get_db)):
    existing_user, _ = await check_existing_user(db, qa_member.email)
    if existing_user is not None:
        raise HTTPException(status_code=409, detail="Email already registered")
    
    hashed_password = get_password_hash(qa_member.password)
    db_qa_member = QAMember(
        email=qa_member.email,
        full_name=qa_member.full_name,
        initial_password=True,
        password_hash=hashed_password,
        total_tasks_reviewed=0,
        total_tasks_rejected=0
    )

    db.add(db_qa_member)
    db.commit()
    db.refresh(db_qa_member)
    return db_qa_member


@router.get("/get_all_qa_members")
async def get_all_qa_members(db: Session = Depends(get_db)):
    return db.query(QAMember).all()

@router.delete("/remove_qa_member/{qa_member_id}")
async def remove_qa_member(qa_member_id: int, db: Session = Depends(get_db)):
    qa_member = db.query(QAMember).filter(QAMember.qa_member_id == qa_member_id).first()
    if not qa_member:
        raise HTTPException(status_code=404, detail="QA Member not found")
    db.delete(qa_member)
    db.commit()
    return {"message": "QA Member deleted successfully"}

@router.put("/password_reset/{qa_member_id}")
async def password_reset(data: QAPasswordReset, db: Session = Depends(get_db)):
    qa_member = db.query(QAMember).filter(QAMember.qa_member_id == data.qa_member_id).first()
    if not qa_member:
        raise HTTPException(status_code=404, detail="QA Member not found")
    hashed_password = get_password_hash(data.password)
    qa_member.password_hash = hashed_password
    qa_member.initial_password = True
    db.commit()
    return {"message": "Password reset successfully"}

@router.put("/create_password/{qa_member_id}")
async def create_password(data: QACreatePassword, db: Session = Depends(get_db)):
    qa_member = db.query(QAMember).filter(QAMember.qa_member_id == data.qa_member_id).first()
    if not qa_member:
        raise HTTPException(status_code=404, detail="QA Member not found")
    hashed_password = get_password_hash(data.new_password)
    qa_member.password_hash = hashed_password
    qa_member.initial_password = False
    db.commit()
    return {"message": "Password created successfully"}