import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useAssessmentTasksForReview = (sourceLanguageId: number, targetLanguageId: number, enabled: boolean) => {
  return useQuery({
    queryKey: ['assessmentTasks', sourceLanguageId, targetLanguageId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/task/get_assessment_tasks`, {
        params: {
          source_language_id: sourceLanguageId,
          target_language_id: targetLanguageId,
        },
      });
      return response.data;
    },
    enabled: enabled, 
    retry: false,
  });
};
