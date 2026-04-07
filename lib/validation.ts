import type { MemoryStatus, PrivacyLevel } from "@/types/database";
import { PRIVACY_LEVELS } from "@/types/database";

const MEMORY_STATUSES: MemoryStatus[] = ["active", "archived"];

export function parsePrivacyLevel(value: unknown): PrivacyLevel | null {
  const s = String(value ?? "");
  return PRIVACY_LEVELS.includes(s as PrivacyLevel)
    ? (s as PrivacyLevel)
    : null;
}

export function parseMemoryStatus(value: unknown): MemoryStatus | null {
  const s = String(value ?? "");
  return MEMORY_STATUSES.includes(s as MemoryStatus)
    ? (s as MemoryStatus)
    : null;
}

export function optionalIsoTimestamp(value: unknown): string | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

/** HTML checkbox: present and value "true" when checked; absent when unchecked. */
export function parseIsUsedInAi(value: unknown): boolean {
  return String(value ?? "") === "true";
}
