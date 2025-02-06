import axios from "axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Language } from "@/types/language";

const API_URL = import.meta.env.VITE_API_URL;

export const useLanguage = () => {
  const { data, isLoading, error }: UseQueryResult<Language[], Error> = useQuery({
    queryKey: ['languages'],
    queryFn: async () => {
      const response = await axios.get<Language[]>(`${API_URL}/all_languages/all_languages`);
      return response.data;
    }
  });

  return { data, isLoading, error };
};
