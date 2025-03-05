# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from typing import List
# from ..core.database import get_db
# from ..schemas.assessment_attempt import AssessmentAttempt, AssessmentAttemptInput
# from ..schemas.freelancer_language_pair import FreelancerLanguagePair
# from ..schemas.task import *


# router = APIRouter()

# @router.post("/assessment_attempts")
# async def create_assessment_attempts(
#     attempts: List[AssessmentAttemptInput],
#     db: Session = Depends(get_db)
# ):
#     if not attempts:
#         raise HTTPException(status_code=400, detail="No assessment attempts provided")

#     for attempt_data in attempts:
#         new_attempt = AssessmentAttempt(
#             freelancer_id=attempt_data.freelancer_id,
#             task_id=attempt_data.task_id,
#             submission_text=attempt_data.submission_text,
#             # attempt_status will be set by default to UNDER_REVIEW
#         )
#         db.add(new_attempt)

#     new_language_pairs = FreelancerLanguagePair(
#         freelancer_id=attempts[0].freelancer_id,
#         source_language_id=1, # get source langauge id form task table 's task id 's source language id
#         target_language_id=2, # get target langauge id form task table 's task id 's target language id
#         accuracy_rate=0.0
#     )

#     db.add(new_language_pairs)
#     db.commit()
#     return {"message": f"{len(attempts)} assessment attempt(s) created successfully"}

# # @router.get("/check_route_health")
# # async def check_route_health():
# #     return {"message": "Route is healthy"}


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..schemas.assessment_attempt import AssessmentAttempt, AssessmentAttemptInput
from ..schemas.freelancer_language_pair import FreelancerLanguagePair
from ..schemas.task import Task  # ensure Task model is imported
from typing import Any

from pydantic import BaseModel
from typing import List

class ReviewData(BaseModel):
    taskid: int
    originalText: str
    submittedText: str
    status: str

class CheckSubmitRequest(BaseModel):
    data: List[ReviewData]
    fl_id: int
    source_lang_id: int  # Corrected from 'source_lang_id'
    target_lang_id: int  # Corrected from 'target_lang_id'

router = APIRouter()
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair

def add_language_pair(db: Session, freelancer_id: int, source_language_id: int, target_language_id: int):
    """Helper function to add a freelancer's language pair if it doesn't already exist."""
    exists = db.query(FreelancerLanguagePair).filter_by(
        freelancer_id=freelancer_id,
        source_language_id=source_language_id,
        target_language_id=target_language_id
    ).first()

    if not exists:
        new_pair = FreelancerLanguagePair(
            freelancer_id=freelancer_id,
            source_language_id=source_language_id,
            target_language_id=target_language_id,
            accuracy_rate=0.0
        )
        db.add(new_pair)

@router.post("/assessment_attempts")
async def create_assessment_attempts(
    attempts: List[AssessmentAttemptInput],
    db: Session = Depends(get_db)
):
    if not attempts:
        raise HTTPException(status_code=400, detail="No assessment attempts provided")

    freelancer_id = attempts[0].freelancer_id  # Assuming all attempts are from the same freelancer

    # Process each assessment attempt
    for attempt_data in attempts:
        # Query the task table using task_id from the attempt data
        task = db.query(Task).filter(Task.task_id == attempt_data.task_id).first()
        if not task:
            raise HTTPException(status_code=404, detail=f"Task with id {attempt_data.task_id} not found")

        new_attempt = AssessmentAttempt(
            freelancer_id=attempt_data.freelancer_id,
            task_id=attempt_data.task_id,
            submission_text=attempt_data.submission_text,
            # attempt_status will be set by default to UNDER_REVIEW
        )
        db.add(new_attempt)

    # Retrieve the first task for language pair assignment
    first_task = db.query(Task).filter(Task.task_id == attempts[0].task_id).first()

    # Add primary language pair
    add_language_pair(db, freelancer_id, first_task.source_language_id, first_task.target_language_id)

    # Add additional language pairs if source and target languages are different
    if first_task.source_language_id != first_task.target_language_id:
        add_language_pair(db, freelancer_id, first_task.source_language_id, first_task.source_language_id)
        add_language_pair(db, freelancer_id, first_task.target_language_id, first_task.target_language_id)

    db.commit()

    return {"message": f"{len(attempts)} assessment attempt(s) created successfully"}

@router.post("/check_submit_data")
async def check_submit_data(reviews: CheckSubmitRequest):
    print(reviews)
    return {"message": "Data received successfully"}


    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
    # when qa reviewing assessment attempt, update for both same language pair
