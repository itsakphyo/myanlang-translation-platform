import { SystemLanguageCode, defaultSystemLanguage } from "@/types/systemLanguages";
import { translations } from "@/contexts/translation";

export const getSystemLanguage = (): SystemLanguageCode => {
    const storedSystemLanguage = localStorage.getItem("selectedSystemLanguage");
    return storedSystemLanguage && translations[storedSystemLanguage as SystemLanguageCode] 
      ? storedSystemLanguage as SystemLanguageCode 
      : defaultSystemLanguage;
  };