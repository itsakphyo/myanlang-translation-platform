export interface JobFormData {
  title: string;
  source_language_id: number;
  target_language_id: number;
  max_time_per_task: number;
  task_price: number;
  instructions: string;
  notes?: string;
  csv: File;
}

export interface Job {
  job_id: number;
  job_title: string;
  job_status?: string;
  instructions: string;
  source_language_id: number;
  source_language_name?: string;
  target_language_id: number;
  target_language_name?: string;
  total_tasks: number;
  max_time_per_task: number;
  task_price: number;
  created_at: string;
  notes: string;
}

export interface JobEdit{
  job_id: number;
  job_title: string;
  source_language_id: number;
  target_language_id: number;
  max_time_per_task: number;
  task_price: number;
  instructions: string;
  notes?: string;
}

export interface AssJob {
  job_id: number;
  job_title: string;
  job_status?: string;
  instructions: string;
  source_language_id: number;
  source_language_name?: string;
  target_language_id: number;
  target_language_name?: string;
  total_tasks: number;
  max_time_per_task: number;
  task_price: number;
  created_at: string;
  notes: string;
  is_assessment: boolean;
}