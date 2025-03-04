import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { TaskInfo } from "@/types/taskInfoForQA";

const API_URL = import.meta.env.VITE_API_URL;

export const useTaskInfo = () => {
  return useQuery<TaskInfo, Error>({
    queryKey: ["taskInfo"],
    queryFn: async () => {
      const response = await axios.get<TaskInfo>(`${API_URL}/task/get_all_task_info`);
      localStorage.setItem("taskInfo", JSON.stringify(response.data)); // Store in localStorage
      return response.data;
    },
  });
};

export const getStoredTaskInfo = (): TaskInfo | null => {
  const data = localStorage.getItem("taskInfo");
  return data ? JSON.parse(data) : null;
};
