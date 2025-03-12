import axios from "axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { LanguagePairResponse } from "@/types/language";

const API_URL = import.meta.env.VITE_API_URL;


export const useFreelancerLanguagePair = (
  freelancerId: number,
  sourceLanguageId: number,
  targetLanguageId: number,
  enabled?: boolean
): UseQueryResult<LanguagePairResponse, Error> => {
  return useQuery<LanguagePairResponse, Error>({
    // Query key ensures caching per unique combination of parameters.
    queryKey: ["freelancerLanguagePair", freelancerId, sourceLanguageId, targetLanguageId],
    queryFn: async () => {
      const response = await axios.get<LanguagePairResponse>(`${API_URL}/freelancer/language-pair/`, {
        params: {
          freelancer_id: freelancerId,
          source_language_id: sourceLanguageId,
          target_language_id: targetLanguageId,
        },
      });
      return response.data;
    },
    // Enable the query only if all parameters are provided.
    enabled: enabled,
  });
};
