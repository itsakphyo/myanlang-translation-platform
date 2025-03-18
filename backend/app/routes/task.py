from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Body
from fastapi.responses import StreamingResponse
from ..core.database import get_db
from sqlalchemy.orm import Session
from ..schemas.task import *
from ..schemas.enums import TaskStatus as TaskStatus
from ..schemas.enums import AssTaskStatus as AssTaskStatus
from ..schemas.freelancer import Freelancer
from ..schemas.assessment_attempt import AssessmentAttempt
from ..schemas.freelancer_language_pair import FreelancerLanguagePair
from ..schemas.qa_member import QAMember
from ..schemas.job import Job
from ..schemas.language import Language
from sqlalchemy.sql import func
from typing import Optional
import pandas as pd
import io
from sqlalchemy.exc import SQLAlchemyError
import logging
from datetime import datetime, timezone
from sqlalchemy import text
from zoneinfo import ZoneInfo
from sqlalchemy.orm import aliased

logger = logging.getLogger(__name__)


router = APIRouter()

@router.get("/download_tasks")
async def download_tasks(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.job_id == job_id).first()
    if not job:
        return {"error": "Job not found"}

    source_language = db.query(Language).filter(Language.language_id == job.source_language_id).first()
    target_language = db.query(Language).filter(Language.language_id == job.target_language_id).first()
    
    tasks = db.query(Task).filter(Task.job_id == job_id).all()

    if not tasks:
        return {"error": "No tasks found"}

    task_dicts = [
        {
            "job_id": task.job_id,
            "task_id": task.task_id,
            "task_status": task.task_status.value if task.task_status else None,
            "max_time_per_task": task.max_time_per_task,
            "task_price": task.task_price,
            "submitted_freelancer_id": task.submitted_by_id,
            "qa_reviewer_id": task.qa_reviewed_by_id,
            "source_text": task.source_text,
            "translated_text": task.translated_text,
        }
        for task in tasks
    ]

    tasks_df = pd.DataFrame(task_dicts)

    source_text_column_name = f"{source_language.language_name}_text (Source)"
    target_text_column_name = f"{target_language.language_name}_text (Translated)"

    tasks_df.rename(columns={"source_text": source_text_column_name, "translated_text": target_text_column_name}, inplace=True)

    csv_data = tasks_df.to_csv(index=False)

    response_stream = io.StringIO(csv_data)
    return StreamingResponse(response_stream, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=tasks.csv"})



@router.get("/get_all_languages_pairs")
async def get_all_languages_pairs(db: Session = Depends(get_db)):
    try:
        unique_pairs_diff = db.query(Job.source_language_id, Job.target_language_id).filter(Job.source_language_id != Job.target_language_id, Job.is_assessment == "t").distinct()

        unique_pairs_same = db.query(Job.source_language_id, Job.target_language_id).filter(Job.source_language_id == Job.target_language_id, Job.is_assessment == "t").distinct()

        unique_pairs = unique_pairs_diff.union(unique_pairs_same).all()

        if not unique_pairs:
            logger.warning("No language pairs found.")
            return []

        languages_query = db.query(Language).all()

        if not languages_query:
            logger.warning("Language table is empty.")
            raise HTTPException(status_code=404, detail="No languages found in the database.")

        languages = {lang.language_id: lang.language_name.lower() for lang in languages_query}

        language_pairs = [
            {
                "source_id": pair[0],
                "target_id": pair[1],
                "source": languages.get(pair[0], "unknown"),
                "target": languages.get(pair[1], "unknown")
            }
            for pair in unique_pairs
        ]

        logger.info(f"Retrieved {len(language_pairs)} language pairs.")

        return language_pairs

    except SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error. Please try again later.")

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")

from sqlalchemy.orm import aliased

@router.get("/get_assessment_tasks_up_to_5")
async def get_assessment_tasks_up_to_5(source_language_id: int, target_language_id: int, db: Session = Depends(get_db)):
    try:
        # Define table aliases for source and target languages
        SourceLanguage = aliased(Language)
        TargetLanguage = aliased(Language)

        # Join Task with Job and Language tables to fetch language names
        tasks = (
            db.query(
                Task.task_id,
                Task.source_text,
                Task.translated_text,
                Task.max_time_per_task,
                Job.instructions.label("instruction"),
                SourceLanguage.language_name.label("source_language_name"),
                TargetLanguage.language_name.label("target_language_name"),
            )
            .join(Job, Task.job_id == Job.job_id)
            .join(SourceLanguage, Task.source_language_id == SourceLanguage.language_id)
            .join(TargetLanguage, Task.target_language_id == TargetLanguage.language_id)
            .filter(
                Task.source_language_id == source_language_id,
                Task.target_language_id == target_language_id,
                Task.is_assessment == "t"
            )
            .limit(5)
            .all()
        )

        if not tasks:
            return None

        # Convert results to dictionaries
        task_dicts = [
            {
                "task_id": t.task_id,
                "instruction": t.instruction,
                "max_time_per_task": t.max_time_per_task,
                "source_text": t.source_text,
                "translated_text": t.translated_text,
                "source_language_name": t.source_language_name,
                "target_language_name": t.target_language_name,
            }
            for t in tasks
        ]

        logger.info(f"Retrieved {len(task_dicts)} assessment tasks.")
        return task_dicts

    except SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error. Please try again later.")

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")



@router.get("/open", response_model=Optional[OpenTaskResponse])
def get_open_task(
    params: OpenTaskRequest = Depends(),
    db: Session = Depends(get_db)
):
    try:
        now = datetime.now(timezone.utc)
        SourceLanguage = aliased(Language)
        TargetLanguage = aliased(Language)

        task_data = (
            db.query(
                    Task.task_id,
                    Task.source_text,
                    Task.translated_text,
                    Task.max_time_per_task,
                    Task.task_price,
                    Job.instructions.label("instruction"),
                    SourceLanguage.language_name.label("source_language_name"),
                    TargetLanguage.language_name.label("target_language_name"),
                    Task.task_status,
                )
                .join(Job, Task.job_id == Job.job_id)
                .join(SourceLanguage, Task.source_language_id == SourceLanguage.language_id)
                .join(TargetLanguage, Task.target_language_id == TargetLanguage.language_id)
                .filter(
                    Task.source_language_id == params.source_language_id,
                    Task.target_language_id == params.target_language_id,
                    Task.is_assessment == "f",
                    (
                        (Task.task_status == "OPEN")
                        |
                        (
                            (Task.task_status == "ASSIGNED_TO_FL") &
                            (Task.assigned_at.isnot(None)) &
                            text("(task.assigned_at + (task.max_time_per_task || ' minutes')::interval) < now()")
                        )
                    )
                )
                .order_by(Task.task_id)
                .with_for_update(skip_locked=True)
                .first()
            )
        
        if not task_data:
            return 
        
        task_to_update = db.query(Task).filter(Task.task_id == task_data.task_id).first()
        task_to_update.assigned_freelancer_id = params.freelancer_id
        task_to_update.assigned_at = now
        task_to_update.task_status = "ASSIGNED_TO_FL"
        db.commit()

        return OpenTaskResponse(
            task_id=task_data.task_id,
            instruction=task_data.instruction,
            max_time_per_task=task_data.max_time_per_task,
            price=task_data.task_price,
            source_text=task_data.source_text,
            translated_text=task_data.translated_text,
            source_language_name=task_data.source_language_name,
            target_language_name=task_data.target_language_name,
        )

    except SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error. Please try again later.")

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")



@router.post("/submit", response_model=SubmitTaskResponse)
def submit_task(
    submission: SubmitTaskRequest,
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    
    task = db.query(Task).filter(
        Task.task_id == submission.task_id,
        Task.assigned_freelancer_id == submission.freelancer_id,
        Task.task_status == "ASSIGNED_TO_FL"
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or not assigned to you")
    
    if task.assigned_at is None:
        raise HTTPException(status_code=400, detail="Task has no assignment time set")
    
    local_tz = ZoneInfo("Asia/Bangkok")
    assigned_local = task.assigned_at.replace(tzinfo=local_tz)
    assigned_at_aware = assigned_local.astimezone(timezone.utc)
    
    elapsed_initial = (now - assigned_at_aware).total_seconds() / 60  # elapsed time in minutes
    elapsed = elapsed_initial
    
    if elapsed > task.max_time_per_task:
        task.task_status = "OPEN"
        db.commit()
        return SubmitTaskResponse(message="Time to complete the task has expired")
    
    task.translated_text = submission.translated_text
    task.submitted_by_id = submission.freelancer_id
    task.submitted_at = now
    task.task_status = "UNDER_REVIEW"
    db.commit()
    
    return SubmitTaskResponse(message="Task submitted successfully")

@router.get("/get_all_task_info")
def get_all_task_info(db: Session = Depends(get_db)):
    assessment_total = (
        db.query(func.count(AssessmentAttempt.attempt_id))
          .join(Task, Task.task_id == AssessmentAttempt.task_id)
          .filter(AssessmentAttempt.attempt_status == AssTaskStatus.UNDER_REVIEW)
          .scalar()
    )

    assessment_pairs = (
        db.query(
            func.least(Task.source_language_id, Task.target_language_id).label("lang1"),
            func.greatest(Task.source_language_id, Task.target_language_id).label("lang2"),
            func.count(AssessmentAttempt.attempt_id).label("pair_count")
        )
        .join(Task, Task.task_id == AssessmentAttempt.task_id)
        .filter(AssessmentAttempt.attempt_status == AssTaskStatus.UNDER_REVIEW)
        .group_by("lang1", "lang2")
        .all()
    )

    submission_total = (
        db.query(func.count(Task.task_id))
          .filter(Task.is_assessment.is_(False), Task.task_status == TaskStatus.UNDER_REVIEW, Task.qa_assigned_id == None)
          .scalar()
    )

    submission_pairs = (
        db.query(
            func.least(Task.source_language_id, Task.target_language_id).label("lang1"),
            func.greatest(Task.source_language_id, Task.target_language_id).label("lang2"),
            func.count(Task.task_id).label("pair_count")
        )
        .filter(Task.is_assessment.is_(False), Task.task_status == TaskStatus.UNDER_REVIEW)
        .group_by("lang1", "lang2")
        .all()
    )

    result = {
        "assessmenttask": {
            "total": assessment_total,
            "task_by_language_pair": [
                {
                    "sourcelanguage_id": row.lang1,
                    "targetlanguage_id": row.lang2,
                    "count": row.pair_count
                }
                for row in assessment_pairs
            ]
        },
        "task": {
            "total": submission_total,
            "task_by_language_pair": [
                {
                    "sourcelanguage_id": row.lang1,
                    "targetlanguage_id": row.lang2,
                    "count": row.pair_count
                }
                for row in submission_pairs
            ]
        }
    }

    return result

@router.get("/get_assessment_tasks")
def get_assessment_tasks(source_language_id: int, target_language_id: int, db: Session = Depends(get_db)):
    """
    Returns grouped assessment tasks for each unique combination of
    (freelancer_id, source_language_id, target_language_id) where the assessment
    attempt status is UNDER_REVIEW.
    """
    try:
        source_lang_alias = aliased(Language)
        target_lang_alias = aliased(Language)

        results = (
            db.query(Task, AssessmentAttempt, source_lang_alias, target_lang_alias)
            .join(AssessmentAttempt, Task.task_id == AssessmentAttempt.task_id)
            .join(source_lang_alias, Task.source_language_id == source_lang_alias.language_id)
            .join(target_lang_alias, Task.target_language_id == target_lang_alias.language_id)
            .filter(
                Task.source_language_id == source_language_id,
                Task.target_language_id == target_language_id,
                AssessmentAttempt.attempt_status == AssTaskStatus.UNDER_REVIEW
            )
            .all()
        )

        if not results:
            return None

        grouped_data = {}
        for task, attempt, src_lang, tgt_lang in results:
            key = (attempt.freelancer_id, task.source_language_id, task.target_language_id)
            if key not in grouped_data:
                grouped_data[key] = {
                    "userId": attempt.freelancer_id,
                    "sourceLanguageId": task.source_language_id,
                    "targetLanguageId": task.target_language_id,
                    "sourceLanguage": src_lang.language_name,
                    "targetLanguage": tgt_lang.language_name,
                    "tasks": []
                }
            grouped_data[key]["tasks"].append({
                "taskId": task.task_id,
                "originalText": task.source_text,
                "submittedText": attempt.submission_text
            })

        return list(grouped_data.values())

    except SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/get_submitted_tasks")
async def get_submitted_tasks(
    qa_id: int, source_language_id: int, target_language_id: int, db: Session = Depends(get_db)
):
    try:
        qa_member = db.query(QAMember).filter(QAMember.qa_member_id == qa_id).first()
        if not qa_member:
            raise HTTPException(status_code=400, detail="QA Member not found")

        task = db.query(Task).filter(
            Task.source_language_id == source_language_id,
            Task.target_language_id == target_language_id,
            Task.is_assessment.is_(False),
            Task.task_status == "UNDER_REVIEW",
            Task.qa_assigned_at.is_(None),
            Task.qa_assigned_id.is_(None)
        ).first()

        if task is None:
            return None

        # Assign the task to the QA member
        task.qa_assigned_at = datetime.now(timezone.utc)
        task.qa_assigned_id = qa_id
        db.commit()
        db.refresh(task)

        source_language = db.query(Language).filter(Language.language_id == source_language_id).first()
        target_language = db.query(Language).filter(Language.language_id == target_language_id).first()

        if not source_language or not target_language:
            raise HTTPException(status_code=404, detail="One or both languages not found")

        return {
            "task": task,
            "source_language": source_language.language_name,
            "target_language": target_language.language_name
        }

    except SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")



from pydantic import BaseModel

class QaReviewSubmit(BaseModel):
    task_id: int
    qa_id: int
    decision: bool

@router.post("/submit_qa_review")
def submit_qa_review(
    review_data: QaReviewSubmit,
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    
    task = db.query(Task).filter(
        Task.task_id == review_data.task_id,
        Task.qa_assigned_id == review_data.qa_id,
        Task.task_status == "UNDER_REVIEW"
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or not assigned to you")

    submitted_fl_id = task.submitted_by_id
    source_language_id = task.source_language_id
    target_language_id = task.target_language_id

    freelancer_language_pair = db.query(FreelancerLanguagePair).filter(
            FreelancerLanguagePair.freelancer_id == submitted_fl_id,
            FreelancerLanguagePair.source_language_id == source_language_id,
            FreelancerLanguagePair.target_language_id == target_language_id
        ).first()

    review_qa = db.query(QAMember).filter(QAMember.qa_member_id == review_data.qa_id).first()

    previoue_complete_of_qa = review_qa.total_tasks_reviewed or 0
    previous_reject_of_qa = review_qa.total_tasks_rejected or 0
    review_qa.total_tasks_reviewed = previoue_complete_of_qa + 1
    
    # For an approved task:
    if review_data.decision:
        task.task_status = TaskStatus.COMPLETE
        task.qa_reviewed_by_id = review_data.qa_id
        task.qa_reviewed_at = now

        freelancer = db.query(Freelancer).filter(Freelancer.freelancer_id == submitted_fl_id).first()
        task_price = task.task_price
        freelancer.total_earnings += task_price
        freelancer.current_balance += task_price

        # Increment complete tasks
        previous_complete_task = freelancer_language_pair.complete_task or 0
        freelancer_language_pair.complete_task = previous_complete_task + 1

        # Recalculate accuracy: (approved tasks / total complete tasks) * 100
        current_rejected = freelancer_language_pair.rejected_task or 0
        freelancer_language_pair.accuracy_rate = (((previous_complete_task + 1) - current_rejected) / (previous_complete_task + 1)) * 100

    else:
        task.task_status = TaskStatus.OPEN
        task.assigned_freelancer_id = None
        task.assigned_at = None
        task.submitted_by_id = None
        task.translated_text = None
        task.submitted_at = None
        task.qa_assigned_id = None
        task.qa_assigned_at = None

        review_qa.total_tasks_rejected = previous_reject_of_qa + 1

        # For a rejected task, complete_task remains unchanged; only update rejected count
        previous_complete_task = freelancer_language_pair.complete_task or 0
        freelancer_language_pair.complete_task = previous_complete_task + 1
        previous_rejected_task = freelancer_language_pair.rejected_task or 0
        freelancer_language_pair.rejected_task = previous_rejected_task + 1

        freelancer_language_pair.accuracy_rate = (((previous_complete_task + 1) - (previous_rejected_task + 1)) / (previous_complete_task + 1)) * 100


    db.commit()
    
    return "QA review submitted successfully"