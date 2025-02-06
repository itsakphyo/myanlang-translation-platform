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
