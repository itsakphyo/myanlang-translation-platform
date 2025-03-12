from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..schemas.enums import Issues, ReportStatus
from ..core.database import get_db
from ..schemas.freelancer import Freelancer
from ..schemas.issue_report import IssueReport

router = APIRouter()

class IssueReportRequest(BaseModel):
    freelancer_id: int
    issue_type: str
    task_id: Optional[int] = None
    description: Optional[str] = None
    withdrawalId: Optional[int] = None
    documentationUrl: Optional[str] = None
    source_language_id: Optional[int] = None
    target_language_id: Optional[int] = None

@router.post("/report_issue")
async def report_issue(request_body: IssueReportRequest, db: Session = Depends(get_db)):
    freelancer = db.query(Freelancer).filter(Freelancer.freelancer_id == request_body.freelancer_id).first()
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer not found")

    issue_report = IssueReport(
        freelancer_id=request_body.freelancer_id,
        reported_at=datetime.now(),
        report_status=ReportStatus.UNDER_REVIEW,
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
    return db.query(IssueReport).all()

