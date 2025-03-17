// contexts/language-context.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { SystemLanguageCode, defaultSystemLanguage } from "@/types/systemLanguages"
import { getSystemLanguage } from "@/utils/languageCode"

type SystemLanguageContextType = {
  systemLanguage: SystemLanguageCode
  setSystemLanguage: (lang: SystemLanguageCode) => void
}

const SystemLanguageContext = createContext<SystemLanguageContextType>({
    systemLanguage: defaultSystemLanguage,
    setSystemLanguage: () => {}
})

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [systemLanguage, setSystemLanguage] = useState<SystemLanguageCode>(defaultSystemLanguage)

  useEffect(() => {
    setSystemLanguage(getSystemLanguage())
  }, [])

  return (
    <SystemLanguageContext.Provider value={{ systemLanguage, setSystemLanguage }}>
      {children}
    </SystemLanguageContext.Provider>
  )
}

export const useSystemLanguage = () => useContext(SystemLanguageContext)