import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { AssTask } from "@/types/task"; // Adjust the import path as needed

const API_URL = import.meta.env.VITE_API_URL;

export const useAssessmentTasks = (source_language_id: number, target_language_id: number,   enabled?: boolean) => {
  return useQuery<AssTask[]>({
    queryKey: ["assessmentTasks", source_language_id, target_language_id],
    queryFn: async (): Promise<AssTask[]> => {
      const response = await axios.get<AssTask[]>(
        `${API_URL}/task/get_assessment_tasks_up_to_5?source_language_id=${source_language_id}&target_language_id=${target_language_id}`
      );
      // Using the generic type ensures that response.data is typed as AssTask[]
      return response.data;
    },
    enabled: enabled,
  });
};
