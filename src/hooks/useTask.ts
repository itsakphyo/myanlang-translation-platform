import axios from "axios";
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { LanguagePair } from "@/types/language";
import { OpenTask } from "@/types/task";

const API_URL = import.meta.env.VITE_API_URL;



export const useTask = () => {
  // Example query for all language pairs.
  const getAllLanguagePairs = useQuery<LanguagePair[], Error>({
    queryKey: ["languagePairs"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/task/get_all_languages_pairs`);
      return response.data;
    },
  });

  // The inner hook for open tasks.
  // Here we use Omit to remove `queryKey` from the options type.
  const useOpenTask = (
    freelancerId: number,
    sourceLanguageId: number,
    targetLanguageId: number,
    options?: Omit<UseQueryOptions<OpenTask, Error, OpenTask, [string, number, number, number]>, "queryKey">
  ): UseQueryResult<OpenTask, Error> => {
    return useQuery<OpenTask, Error, OpenTask, [string, number, number, number]>({
      queryKey: ["openTask", freelancerId, sourceLanguageId, targetLanguageId],
      queryFn: async (): Promise<OpenTask> => {
        const response = await axios.get<OpenTask>(
          `${API_URL}/task/task/open?freelancer_id=${freelancerId}&source_language_id=${sourceLanguageId}&target_language_id=${targetLanguageId}`
        );
        return response.data;
      },
      ...options,
    });
  };

  return { getAllLanguagePairs, useOpenTask };
};


