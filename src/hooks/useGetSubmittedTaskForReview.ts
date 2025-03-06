import axios from "axios";
import { useQuery, UseQueryOptions, UseQueryResult, useMutation } from "@tanstack/react-query";
import { LanguagePair } from "@/types/language";
import { SubmittedTaskForReview } from "@/types/task";

const API_URL = import.meta.env.VITE_API_URL;

export const useGetSubmittedTaskForReview = (
  source_language_id: number,
  target_language_id: number,
  qa_id: number,
  enabled?: boolean
) => {
  const queryResult = useQuery<SubmittedTaskForReview>({
    queryKey: ["oneSubmittedTasks", source_language_id, target_language_id, qa_id],
    queryFn: async (): Promise<SubmittedTaskForReview> => {
      const response = await axios.get<SubmittedTaskForReview>(
        `${API_URL}/task/get_submitted_tasks?source_language_id=${source_language_id}&target_language_id=${target_language_id}&qa_id=${qa_id}`
      );
      return response.data;
    },
    enabled: enabled,
  });

  // Return the refetch and remove functions along with existing data, error, and loading states
  return {
    ...queryResult,
    refetch: queryResult.refetch,
  };
};


export const useSubTaskdecision = () => {

  const sentDecision = useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await axios.post(`${API_URL}/task/submit_qa_review`, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Submission error:", error.response?.data || error.message);
        } else {
          console.error("Submission error:", error);
        }
        throw error;
      }
    },
  });

  return sentDecision;
};