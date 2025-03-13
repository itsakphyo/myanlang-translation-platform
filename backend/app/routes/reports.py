from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..schemas.enums import Issues, RPstatus
from ..core.database import get_db
from ..schemas.freelancer import Freelancer
from ..schemas.issue_report import IssueReport, IssueResolveRequest, IssueReportRequest
from ..schemas.task import Task
from ..schemas.freelancer_language_pair import FreelancerLanguagePair
from ..schemas.admin import Admin
from ..schemas.enums import TaskStatus

router = APIRouter()

@router.post("/report_issue")
async def report_issue(request_body: IssueReportRequest, db: Session = Depends(get_db)):
    freelancer = db.query(Freelancer).filter(Freelancer.freelancer_id == request_body.freelancer_id).first()
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer not found")

    issue_report = IssueReport(
        freelancer_id=request_body.freelancer_id,
        reported_at=datetime.now(),
        report_status=RPstatus.UNDER_REVIEW,
        description=request_body.description,
        taskId=request_body.task_id,
        withdrawalId=request_body.withdrawalId,
        documentationUrl=request_body.documentationUrl,
        issue_type=Issues(request_body.issue_type),
        source_language_id=request_body.source_language_id,
        target_language_id=request_body.target_language_id
    )

    db.add(issue_report)
    db.commit()
    db.refresh(issue_report)

    return issue_report

@router.get("/get_issue_reports")
async def get_issue_reports(db: Session = Depends(get_db)):
    issue_reports = db.query(IssueReport).all()
    result = []
    for issue in issue_reports:
        # Convert SQLAlchemy model to a dict, excluding internal state.
        issue_data = issue.__dict__.copy()
        issue_data.pop("_sa_instance_state", None)

        # If there is a taskId, fetch the corresponding Task.
        if issue.taskId:
            task = db.query(Task).filter(Task.task_id == issue.taskId).first()
            if task:
                task_data = task.__dict__.copy()
                task_data.pop("_sa_instance_state", None)
                # Include language names from Task's relationships.
                task_data["source_language_name"] = (
                    task.source_language.language_name if task.source_language else None
                )
                task_data["target_language_name"] = (
                    task.target_language.language_name if task.target_language else None
                )
                issue_data["task"] = task_data

        # If source_language_id and target_language_id are provided on the issue,
        # retrieve the language pair information.
        if issue.source_language_id and issue.target_language_id:
            language_pair = db.query(FreelancerLanguagePair).filter(
                FreelancerLanguagePair.freelancer_id == issue.freelancer_id,
                FreelancerLanguagePair.source_language_id == issue.source_language_id,
                FreelancerLanguagePair.target_language_id == issue.target_language_id,
            ).first()
            if language_pair:
                language_pair_data = {
                    "language_pair_id": language_pair.language_pair_id,
                    "source_language_id": language_pair.source_language_id,
                    "target_language_id": language_pair.target_language_id,
                    "source_language_name": (
                        language_pair.source_language.language_name if language_pair.source_language else None
                    ),
                    "target_language_name": (
                        language_pair.target_language.language_name if language_pair.target_language else None
                    ),
                    "accuracy_rate": language_pair.accuracy_rate,
                    "complete_task": language_pair.complete_task,
                    "rejected_task": language_pair.rejected_task,
                }
                issue_data["language_pair"] = language_pair_data

        result.append(issue_data)

    return result

@router.post("/resolve_issue")
async def resolve_issue(request_body: IssueResolveRequest, db: Session = Depends(get_db)):
    issue_report = db.query(IssueReport).filter(IssueReport.report_id == request_body.report_id).first()
    if not issue_report:
        raise HTTPException(status_code=404, detail="Issue report not found")

    admin = db.query(Admin).filter(Admin.admin_id == request_body.admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    if request_body.decision:
        issue_report.report_status = RPstatus.PROCEED
        issue_report.resolved_at = datetime.now()

        if request_body.task_id:
            task = db.query(Task).filter(Task.task_id == request_body.task_id).first()
            if task:
                if request_body.added_min is not None:
                    task.max_time_per_task = request_body.added_min
                else:
                    task.task_status = TaskStatus.COMPLETE
                    task.translated_text = "Admin closed this task"

        if request_body.language_pair_id:
            language_pair = db.query(FreelancerLanguagePair).filter(
                FreelancerLanguagePair.language_pair_id == request_body.language_pair_id
            ).first()
            if language_pair:
                db.delete(language_pair)

    else:
        issue_report.report_status = RPstatus.REJECTED

    db.commit()
    return issue_report