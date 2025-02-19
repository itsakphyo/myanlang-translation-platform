export interface Language {
  language_id: number;
  language_name: string;
}


export interface LanguagePair {
  source_id: number;
  target_id: number;
  source: string;
  target: string;
}