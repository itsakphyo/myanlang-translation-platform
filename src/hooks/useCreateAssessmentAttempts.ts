import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AssessmentAttempt } from "@/types/task";

const API_URL = import.meta.env.VITE_API_URL;

export const useCreateAssessmentAttempts = () => {
  const queryClient = useQueryClient();

  const createAssessmentAttempts = useMutation({
    mutationFn: async (data: AssessmentAttempt[]) => {
      const response = await axios.post(
        `${API_URL}/assessment/assessment_attempts`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate or refetch any queries that might be affected
      queryClient.invalidateQueries({ queryKey: ["assessmentAttempts"] });
    },
  });

  return { createAssessmentAttempts };
};
