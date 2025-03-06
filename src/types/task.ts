export interface AssTask {
    task_id: number;
    instruction: string;
    max_time_per_task: number;
    source_text: string;
    translated_text: string;
    source_language_name: string;
    target_language_name: string;

}

export interface AssessmentAttempt {
    freelancer_id: number;
    task_id: number;
    submission_text: string;
}

export interface OpenTask {
    task_id: number;
    instruction: string;
    max_time_per_task: number;
    price?: number;
    source_text: string;
    translated_text?: string;
    source_language_name: string;
    target_language_name: string;
}

export interface SubmittedTask {
    source_text: string;
    target_language_id: number;
    task_id: number;
    job_id: number;
    is_assessment: boolean;
    max_time_per_task: number;
    submitted_by_id: number;
    assigned_at: string; // ISO date string
    task_status: string;
    qa_assigned_id: number;
    submitted_at: string; // ISO date string
    translated_text: string;
    assigned_freelancer_id: number;
    qa_reviewed_by_id: number | null;
    qa_assigned_at: string; // ISO date string
    job_status: string;
    task_price: number;
    qa_reviewed_at: string | null; // ISO date string or null
    source_language_id: number;
}

export interface SubmittedTaskForReview {
    task: SubmittedTask;
    source_language: string;
    target_language: string;
}
