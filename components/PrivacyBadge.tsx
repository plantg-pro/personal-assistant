import type { PrivacyLevel } from "@/types/database";

const styles: Record<PrivacyLevel, string> = {
  normal: "bg-stone-200/90 text-stone-800",
  sensitive: "bg-amber-100 text-amber-900",
  frozen: "bg-slate-200 text-slate-800",
  temporary: "bg-rose-100 text-rose-900",
};

const labels: Record<PrivacyLevel, string> = {
  normal: "Normal",
  sensitive: "Sensitive",
  frozen: "Frozen",
  temporary: "Temporary",
};

export function PrivacyBadge({ level }: { level: PrivacyLevel }) {
  return (
    <span
      className={`inline-block text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded ${styles[level]}`}
    >
      {labels[level]}
    </span>
  );
}
