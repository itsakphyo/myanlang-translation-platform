export interface AssTask {

    task_id: number;
    instruction: string;
    max_time_per_task: number;
    source_text: string;
    translated_text: string;
    source_language_name: string;
    target_language_name: string;

}

