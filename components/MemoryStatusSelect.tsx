import type { MemoryStatus } from "@/types/database";

const options: { value: MemoryStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

export function MemoryStatusSelect({
  name = "status",
  defaultValue,
  id = "status",
}: {
  name?: string;
  defaultValue?: MemoryStatus;
  id?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-ink-muted uppercase tracking-wide"
      >
        Status
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue ?? "active"}
        className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-stone-300"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-ink-faint leading-snug">
        Archived stays in your history but can be hidden from lists later.
      </p>
    </div>
  );
}
