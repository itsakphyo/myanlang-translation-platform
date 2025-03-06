from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..schemas.assessment_attempt import AssessmentAttempt, AssessmentAttemptInput
from ..schemas.freelancer_language_pair import FreelancerLanguagePair
from ..schemas.task import Task  
from typing import Any
from ..schemas.enums import AssSubmission, AssTaskStatus

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
    source_lang_id: int
    target_lang_id: int

router = APIRouter()

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


@router.post("/update_ass_reviewed_data")
async def update_ass_reviewed_data(reviews: CheckSubmitRequest, db: Session = Depends(get_db)):
    # Calculate accuracy (percentage-based)
    total_reviews = len(reviews.data)
    if total_reviews == 0:
        raise HTTPException(status_code=400, detail="No review data provided.")
    
    approved_reviews = sum(1 for review in reviews.data if review.status == 'approved')
    # accuracy = (approved_reviews / total_reviews) * 100  

    fl_id = reviews.fl_id
    source_lang_id = reviews.source_lang_id
    target_lang_id = reviews.target_lang_id

    # Update assessment attempts (Set all related attempts to COMPLETE)
    task_ids = [review.taskid for review in reviews.data]
    assessment_attempts = db.query(AssessmentAttempt).filter(
        AssessmentAttempt.freelancer_id == fl_id,
        AssessmentAttempt.task_id.in_(task_ids)
    ).all()

    if not assessment_attempts:
        raise HTTPException(status_code=404, detail="No assessment attempts found for this freelancer.")

    for attempt in assessment_attempts:
        attempt.attempt_status = AssTaskStatus.COMPLETE

    # Update FreelancerLanguagePair records
    if source_lang_id == target_lang_id:
        # Non-translation task: update single row
        freelancer_language_pair = db.query(FreelancerLanguagePair).filter(
            FreelancerLanguagePair.freelancer_id == fl_id,
            FreelancerLanguagePair.source_language_id == source_lang_id,
            FreelancerLanguagePair.target_language_id == target_lang_id,
        ).first()

        if not freelancer_language_pair:
            raise HTTPException(status_code=404, detail="Freelancer language pair record not found.")

        previous_complete_task = freelancer_language_pair.complete_task or 0
        previous_rejected_task = freelancer_language_pair.rejected_task or 0
        freelancer_language_pair.status = AssSubmission.COMPLETE
        freelancer_language_pair.accuracy_rate = ((approved_reviews + (previous_complete_task - previous_rejected_task)) / (total_reviews + previous_complete_task)) * 100
        freelancer_language_pair.complete_task = previous_complete_task + total_reviews
        freelancer_language_pair.rejected_task = previous_rejected_task + (total_reviews - approved_reviews)

    else:
        # Translation task: update three rows

        # 1. (fl_id, source_lang_id, target_lang_id) – update accuracy and status.
        pair_original = db.query(FreelancerLanguagePair).filter(
            FreelancerLanguagePair.freelancer_id == fl_id,
            FreelancerLanguagePair.source_language_id == source_lang_id,
            FreelancerLanguagePair.target_language_id == target_lang_id,
        ).first()
        if not pair_original:
            raise HTTPException(status_code=404, detail="Freelancer language pair (source-target) record not found.")
        pair_original.status = AssSubmission.COMPLETE
        previous_complete_task = pair_original.complete_task or 0
        previous_rejected_task = pair_original.rejected_task or 0
        pair_original.accuracy_rate = ((approved_reviews + (previous_complete_task - previous_rejected_task)) / (total_reviews + previous_complete_task)) * 100
        pair_original.complete_task = previous_complete_task + total_reviews
        pair_original.rejected_task = previous_rejected_task + (total_reviews - approved_reviews)

        # 2. (fl_id, target_lang_id, target_lang_id) – update status.
        pair_target = db.query(FreelancerLanguagePair).filter(
            FreelancerLanguagePair.freelancer_id == fl_id,
            FreelancerLanguagePair.source_language_id == target_lang_id,
            FreelancerLanguagePair.target_language_id == target_lang_id,
        ).first()
        if not pair_target:
            raise HTTPException(status_code=404, detail="Freelancer language pair (target-target) record not found.")
        pair_target.status = AssSubmission.COMPLETE
        previous_complete_task = pair_target.complete_task or 0
        previous_rejected_task = pair_target.rejected_task or 0
        pair_target.accuracy_rate = ((approved_reviews + (previous_complete_task - previous_rejected_task)) / (total_reviews + previous_complete_task)) * 100
        pair_target.complete_task = previous_complete_task + total_reviews
        pair_target.rejected_task = previous_rejected_task + (total_reviews - approved_reviews)

        # 3. (fl_id, source_lang_id, source_lang_id) – update status.
        pair_source = db.query(FreelancerLanguagePair).filter(
            FreelancerLanguagePair.freelancer_id == fl_id,
            FreelancerLanguagePair.source_language_id == source_lang_id,
            FreelancerLanguagePair.target_language_id == source_lang_id,
        ).first()
        if not pair_source:
            raise HTTPException(status_code=404, detail="Freelancer language pair (source-source) record not found.")
        pair_source.status = AssSubmission.COMPLETE
        previous_complete_task = pair_source.complete_task or 0
        previous_rejected_task = pair_source.rejected_task or 0
        pair_source.accuracy_rate = ((approved_reviews + (previous_complete_task - previous_rejected_task)) / (total_reviews + previous_complete_task)) * 100
        pair_source.complete_task = previous_complete_task + total_reviews
        pair_source.rejected_task = previous_rejected_task + (total_reviews - approved_reviews)

    db.commit()
    return {"message": "Data updated successfully"}