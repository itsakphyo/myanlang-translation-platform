export interface Task {
    taskId: number;
    originalText: string;
    submittedText: string;
}

export interface ReviewData {
    taskid: number;
    originalText: string;
    submittedText: string;
    status: 'approved' | 'rejected';
}

export interface CheckSubmitRequest {
    data: ReviewData[];
    fl_id: number;
    qa_id: number | null;
    source_lang_id: number;
    target_lang_id: number;
}