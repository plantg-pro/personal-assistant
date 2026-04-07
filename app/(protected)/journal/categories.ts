export const JOURNAL_CATEGORIES = [
    "work",
    "health",
    "relationships",
    "finance",
    "goals",
    "habits",
    "emotions",
    "ideas",
    "logistics",
    "personal_growth",
  ] as const;
  
  export type JournalCategory = (typeof JOURNAL_CATEGORIES)[number];