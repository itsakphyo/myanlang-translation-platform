from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..schemas.language import Language
from ..core.database import get_db

router = APIRouter()

@router.get("/all_languages")
async def get_all_languages(db: Session = Depends(get_db)):
    languages = db.query(Language).all()
    return languages
