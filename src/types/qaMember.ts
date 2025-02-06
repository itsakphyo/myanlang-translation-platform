export interface QAMemberCreate {
    full_name: string;
    email: string;
    password: string;
    }

export interface QAMember {
    qa_member_id: number;
    full_name: string;
    email: string;
    password: string;
    created_at: string;
    total_tasks_reviewed: number;
    total_tasks_rejected: number;
    }

export interface QAMemberUpdate {
    qa_member_id: number;
    password: string;
    }