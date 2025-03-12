import axios from "axios";
import { useMutation, useQuery, UseQueryResult, useQueryClient } from "@tanstack/react-query";
import { Language } from "@/types/language";

const API_URL = import.meta.env.VITE_API_URL;

export const useLanguage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error }: UseQueryResult<Language[], Error> = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const response = await axios.get<Language[]>(`${API_URL}/all_languages/all_languages`);
      return response.data;
    }
  });

  const createLanguage = useMutation({
    mutationFn: async (data: string) => {
      const response = await axios.post(`${API_URL}/all_languages/create_language`, {
        language_name: data,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["languages"] });
    }
  });

  return { data, isLoading, error, createLanguage };
};