import { PRIVACY_LEVELS } from "@/types/database";

export function PrivacySelect({
  name,
  defaultValue,
  id = "privacy_level",
}: {
  name?: string;
  defaultValue?: string;
  id?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-ink-muted uppercase tracking-wide"
      >
        Privacy
      </label>
      <select
        id={id}
        name={name ?? "privacy_level"}
        defaultValue={defaultValue ?? "normal"}
        className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-stone-300"
      >
        {PRIVACY_LEVELS.map((level) => (
          <option key={level} value={level}>
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </option>
        ))}
      </select>
      <p className="text-xs text-ink-faint leading-snug">
        Normal and sensitive can feed the assistant later; frozen only when you
        ask; temporary pairs well with an expiry.
      </p>
    </div>
  );
}
