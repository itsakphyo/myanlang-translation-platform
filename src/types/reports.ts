"use client";

import type { ReactElement } from "react"

export interface Report {
    report_id: number
    report_status: "under_review" | "approved" | "rejected" | "resolved"
    withdrawalId: number | null
    taskId: number | null
    source_language_id: number | null
    admin_id: number | null
    freelancer_id: number
    issue_type: "accuracy_appeal" | "not_enough_time" | "wrong_source_language" | "payment_delay"
    reported_at: string
    resolved_at: string | null
    description: string | null
    documentationUrl: string | null
    target_language_id: number | null
    language_pair?: {
        language_pair_id: number
        source_language_id: number
        target_language_id: number
        source_language_name: string
        target_language_name: string
        accuracy_rate: number
        complete_task: number
        rejected_task: number
    }
    task?: {
        job_status: string
        task_price: number
        qa_assigned_at: string
        source_language_id: number
        qa_reviewed_at: string
        source_text: string
        target_language_id: number
        task_id: number
        job_id: number
        is_assessment: boolean
        max_time_per_task: number
        submitted_by_id: number
        assigned_at: string
        task_status: string
        qa_assigned_id: number
        submitted_at: string
        translated_text: string
        assigned_freelancer_id: number
        qa_reviewed_by_id: number
        source_language_name: string
        target_language_name: string
    }
}

export interface IssueTypeConfig {
    icon: ReactElement
    color: "info" | "warning" | "error" | "secondary" | "default"
    label: string
}

export interface StatusColors {
    [key: string]: "warning" | "success" | "error" | "info" | "default"
}

export interface SnackbarState {
    open: boolean
    message: string
    severity: "success" | "error" | "warning" | "info"
}

export interface Stats {
    total: number
    underReview: number
    approved: number
    rejected: number
}