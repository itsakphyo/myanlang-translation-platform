from fastapi import APIRouter
from ..core.database import get_db

router = APIRouter()

@router.get("/health-db-check")
async def check_health():
    try:
        db = next(get_db())
        return {"message": "db is alive!"}
    except Exception as e:
        return {"message": "db is dead!"}