import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AssTask } from "@/types/task";

const API_URL = import.meta.env.VITE_API_URL;

export const useAssessmentTasks = (source_language_id: number, target_language_id: number,   enabled?: boolean) => {
  return useQuery<AssTask[]>({
    queryKey: ["assessmentTasks", source_language_id, target_language_id],
    queryFn: async (): Promise<AssTask[]> => {
      const response = await axios.get<AssTask[]>(
        `${API_URL}/task/get_assessment_tasks_up_to_5?source_language_id=${source_language_id}&target_language_id=${target_language_id}`
      );
      return response.data;
    },
    enabled: enabled,
  });
};

export const useAssReviewedSubmit = () => {
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(
        `${API_URL}/assessment/update_ass_reviewed_data`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
  });

  return {
    mutate: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError, 
    error: mutation.error, 
    isSuccess: mutation.isSuccess, 
  };
};