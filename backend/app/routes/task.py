from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Body
from fastapi.responses import StreamingResponse
from ..core.database import get_db
from sqlalchemy.orm import Session
from ..schemas.task import Task
from ..schemas.job import Job
from ..schemas.language import Language
from ..schemas.task import Task
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
        # Fetch unique language pairs (IDs)
        unique_pairs = db.query(Task.source_language_id, Task.target_language_id).distinct().all()

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

