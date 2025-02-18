from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..schemas.language import Language, LanguageCreate
from ..core.database import get_db

router = APIRouter()

@router.get("/all_languages")
async def get_all_languages(db: Session = Depends(get_db)):
    languages = db.query(Language).all()
    return languages


@router.post("/create_language")
async def create_language(
    language: LanguageCreate,
    db: Session = Depends(get_db)
):
    language_name = language.language_name
    all_languages = db.query(Language).all()
    for lang in all_languages:
        if lang.language_name.lower() == language_name.lower():
            return {"error": "Language already exists"}
    new_language = Language(language_name=language_name)
    db.add(new_language)
    db.commit()
    db.refresh(new_language)
    return new_language