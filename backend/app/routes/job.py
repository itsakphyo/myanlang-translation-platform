from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Body
from ..core.database import get_db
from sqlalchemy.orm import Session
from typing import List, Optional
from ..schemas.job import Job
from ..schemas.task import Task
from ..schemas.language import Language
from ..schemas.task import TaskStatus
from ..schemas.job import JobProgress, JobUpdateInput
import pandas as pd
from datetime import datetime
import io

router = APIRouter()

@router.post("/create")
async def create_job(
    job_title: str = Form(...),
    source_language_id: int = Form(...),
    target_language_id: int = Form(...),
    max_time_per_task: int = Form(...),
    task_price: float = Form(...),
    instructions: str = Form(...),
    notes: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    csv_content = await file.read()
    csv_file = io.BytesIO(csv_content)
    df = pd.read_csv(csv_file, header=None)
    
    new_job = Job(
        job_title=job_title,
        source_language_id=source_language_id,
        target_language_id=target_language_id,
        total_tasks=len(df),
        max_time_per_task=max_time_per_task,
        created_at=datetime.now(),
        task_price=task_price,
        instructions=instructions,
        notes=notes or "",
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    for _, row in df.iterrows():
        task = Task(
            job_id=new_job.job_id,
            source_language_id=source_language_id,
            source_text=row.iloc[0], 
            target_language_id=target_language_id,
            max_time_per_task=max_time_per_task,
            task_price=task_price,
            is_assessment=False
        )
        db.add(task)
        db.commit()
        db.refresh(task)

    return {"message": "Job created successfully"}

@router.get("/get_all_jobs")
async def get_all_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(Job.is_assessment == "f").all()
    for job in jobs:
        job.source_language_name = db.query(Language).filter(Language.language_id == job.source_language_id).first().language_name
        job.target_language_name = db.query(Language).filter(Language.language_id == job.target_language_id).first().language_name
    return jobs


@router.get("/get_job_progress/{job_id}")
async def get_job_progress(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.job_id == job_id).first()
    total_tasks = db.query(Task).filter(Task.job_id == job_id).count()
    completed_tasks = db.query(Task).filter(Task.job_id == job_id, Task.task_status == "COMPLETE").count()
    under_review_tasks = db.query(Task).filter(Task.job_id == job_id, Task.task_status == "UNDER_REVIEW").count()
    return JobProgress(job_id=job.job_id, total_tasks=total_tasks, completed_tasks=completed_tasks, under_review_tasks=under_review_tasks)


@router.delete("/delete_job/{job_id}")
async def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"message": "Job and its related tasks deleted successfully"}

@router.get("/get_job/{job_id}")
async def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.job_id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/update_job/{job_id}")
async def update_job(job_id: int, job: JobUpdateInput, db: Session = Depends(get_db)):
    db_job = db.query(Job).filter(Job.job_id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Track fields that need to be propagated to tasks
    update_task_fields = {}

    if job.source_language_id != db_job.source_language_id:
        update_task_fields["source_language_id"] = job.source_language_id

    if job.target_language_id != db_job.target_language_id:
        update_task_fields["target_language_id"] = job.target_language_id

    if job.task_price != db_job.task_price:
        update_task_fields["task_price"] = job.task_price

    if job.max_time_per_task != db_job.max_time_per_task:
        update_task_fields["max_time_per_task"] = job.max_time_per_task

    # Update the job
    for key, value in job.model_dump().items():
        setattr(db_job, key, value)

    db.commit()
    db.refresh(db_job)

    # Update related tasks if necessary
    if update_task_fields:
        db.query(Task).filter(Task.job_id == job_id).update(update_task_fields, synchronize_session=False)
        db.commit()

    return {"message": "Job and related tasks updated successfully", "updated_job": db_job}



@router.post("/create_assessment_job")
async def create_assessment_job(
    job_title: str = Form(...),
    source_language_id: int = Form(...),
    target_language_id: int = Form(...),
    max_time_per_task: int = Form(...),
    instructions: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    csv_content = await file.read()
    csv_file = io.BytesIO(csv_content)
    df = pd.read_csv(csv_file, header=None)

    task_price = 0 
    
    new_job = Job(
        job_title=job_title,
        source_language_id=source_language_id,
        target_language_id=target_language_id,
        total_tasks=len(df),
        max_time_per_task=max_time_per_task,
        created_at=datetime.now(),
        task_price=task_price,
        instructions=instructions,
        notes="",
        is_assessment=True
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    for _, row in df.iterrows():
        task = Task(
            job_id=new_job.job_id,
            source_language_id=source_language_id,
            source_text=row.iloc[0], 
            target_language_id=target_language_id,
            max_time_per_task=max_time_per_task,
            task_price=task_price,
            is_assessment=True
        )
        db.add(task)
        db.commit()
        db.refresh(task)

    return {"message": "Job created successfully"}

@router.get("/get_all_ass_jobs")
async def get_all_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(Job.is_assessment == "t").all()
    for job in jobs:
        job.source_language_name = db.query(Language).filter(Language.language_id == job.source_language_id).first().language_name
        job.target_language_name = db.query(Language).filter(Language.language_id == job.target_language_id).first().language_name
    return jobs