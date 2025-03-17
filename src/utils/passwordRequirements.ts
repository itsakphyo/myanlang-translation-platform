import { translations } from "@/contexts/translation";
import { SystemLanguageCode } from "@/types/systemLanguages";

type PasswordRequirement = {
  text: string;
  valid: boolean;
  checked: boolean;
};

export const getPasswordRequirements = (
  password: string,
  systemLanguage: SystemLanguageCode
): PasswordRequirement[] => [
  {
    text: translations[systemLanguage]?.password_characters ?? "Must have at least 8 characters",
    valid: password.length >= 8,
    checked: password.length >= 8,
  },
  {
    text: translations[systemLanguage]?.password_uppercase ?? "Must include an uppercase letter",
    valid: /[A-Z]/.test(password),
    checked: /[A-Z]/.test(password),
  },
  {
    text: translations[systemLanguage]?.password_lowercase ?? "Must include a lowercase letter",
    valid: /[a-z]/.test(password),
    checked: /[a-z]/.test(password),
  },
  {
    text: translations[systemLanguage]?.password_number ?? "Must include a number",
    valid: /[0-9]/.test(password),
    checked: /[0-9]/.test(password),
  },
  {
    text: translations[systemLanguage]?.password_special ?? "Must include a special character",
    valid: /[!@#$%^&*]/.test(password),
    checked: /[!@#$%^&*]/.test(password),
  },
];
