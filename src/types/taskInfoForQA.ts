// src/types/task.ts

export interface TaskByLanguagePair {
    sourcelanguage_id: number;
    targetlanguage_id: number;
    count: number;
  }
  
  export interface TaskInfo {
    assessmenttask: {
      total: number;
      task_by_language_pair: TaskByLanguagePair[];
    };
    task: {
      total: number;
      task_by_language_pair: TaskByLanguagePair[];
    };
  }
  