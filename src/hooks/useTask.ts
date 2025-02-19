import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { LanguagePair } from "@/types/language";

const API_URL = import.meta.env.VITE_API_URL;

export const useTask = () => {
  const getAllLanguagePairs = useQuery<LanguagePair[]>({
    queryKey: ["languagePairs"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/task/get_all_languages_pairs`);
      return response.data;
    },
  });

  return { getAllLanguagePairs };
};
