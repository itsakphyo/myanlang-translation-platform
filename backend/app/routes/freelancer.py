from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from ..core.database import get_db
from ..schemas.freelancer_language_pair import FreelancerLanguagePair

router = APIRouter()

@router.get("/language-pair/")
async def get_language_pair(
    freelancer_id: int,
    source_language_id: int,
    target_language_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve the language pair for a freelancer.
    The source and target language IDs can be swapped.
    """
    language_pair = db.query(FreelancerLanguagePair).filter(
        FreelancerLanguagePair.freelancer_id == freelancer_id,
        or_(
            and_(
                FreelancerLanguagePair.source_language_id == source_language_id,
                FreelancerLanguagePair.target_language_id == target_language_id
            ),
            and_(
                FreelancerLanguagePair.source_language_id == target_language_id,
                FreelancerLanguagePair.target_language_id == source_language_id
            )
        )
    ).first()

    if language_pair:
        return {
            "accuracy_rate": language_pair.accuracy_rate,
            "status": language_pair.status
        }
    else:
        return {"status": "not_found"}
