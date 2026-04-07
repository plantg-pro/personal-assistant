export type PrivacyLevel = "normal" | "sensitive" | "frozen" | "temporary";

export type MemoryStatus = "active" | "archived";

export type MemorySource = "manual" | "chat_suggested" | "import";

export type EntryCategory =
  | "work"
  | "health"
  | "relationships"
  | "finance"
  | "goals"
  | "habits"
  | "emotions"
  | "ideas"
  | "logistics"
  | "personal_growth";

export interface Profile {
  id: string;
  display_name: string | null;
  timezone: string;
  privacy_level: string;
  is_used_in_ai: boolean;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  body: string;
  privacy_level: PrivacyLevel;
  is_used_in_ai: boolean;
  category: EntryCategory | null;
  tags: string[] | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Memory {
  id: string;
  user_id: string;
  content: string;
  label: string | null;
  privacy_level: PrivacyLevel;
  is_used_in_ai: boolean;
  status: MemoryStatus;
  source: MemorySource;
  category: EntryCategory | null;
  tags: string[] | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export const PRIVACY_LEVELS: PrivacyLevel[] = [
  "normal",
  "sensitive",
  "frozen",
  "temporary",
];

export const ENTRY_CATEGORIES: EntryCategory[] = [
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
];