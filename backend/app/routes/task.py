from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Body
from fastapi.responses import StreamingResponse
from ..core.database import get_db
from sqlalchemy.orm import Session
from ..schemas.task import Task
from ..schemas.job import Job
from ..schemas.language import Language
import pandas as pd
import io


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

    # Convert task objects to dictionary format while excluding SQLAlchemy instance state
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

    # Rename columns
    tasks_df.rename(columns={"source_text": source_text_column_name, "translated_text": target_text_column_name}, inplace=True)

    # Convert DataFrame to CSV
    csv_data = tasks_df.to_csv(index=False)

    # Create a streamable response
    response_stream = io.StringIO(csv_data)
    return StreamingResponse(response_stream, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=tasks.csv"})

from fastapi import HTTPException, Depends
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

@router.get("/get_all_languages_pairs")
async def get_all_languages_pairs(db: Session = Depends(get_db)):
    try:
        unique_pairs_diff = db.query(Job.source_language_id, Job.target_language_id).filter(Job.source_language_id != Job.target_language_id, Job.is_assessment == "t").distinct()

        unique_pairs_same = db.query(Job.source_language_id, Job.target_language_id).filter(Job.source_language_id == Job.target_language_id, Job.is_assessment == "t").distinct()

        unique_pairs = unique_pairs_diff.union(unique_pairs_same).all()

        if not unique_pairs:
            logger.warning("No language pairs found.")
            return []

        # Fetch all languages and create an ID-to-name mapping
        languages_query = db.query(Language).all()

        if not languages_query:
            logger.warning("Language table is empty.")
            raise HTTPException(status_code=404, detail="No languages found in the database.")

        languages = {lang.language_id: lang.language_name.lower() for lang in languages_query}

        # Convert language IDs to names, handling missing IDs
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
            logger.warning("No pending assessment tasks found.")
            return []

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
