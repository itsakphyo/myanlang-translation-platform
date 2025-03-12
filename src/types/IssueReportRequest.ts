export interface IssueReportRequest {
    freelancer_id: number;
    issue_type: string;
    task_id?: number;
    description?: string;
    withdrawalId?: number;
    documentationUrl?: string;
    source_language_id?: number;
    target_language_id?: number;
  }