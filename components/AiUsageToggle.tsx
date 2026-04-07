export function AiUsageToggle({
  defaultChecked = true,
  id = "is_used_in_ai",
}: {
  defaultChecked?: boolean;
  id?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="flex items-start gap-2.5 text-sm text-ink cursor-pointer"
      >
        <input
          id={id}
          name="is_used_in_ai"
          type="checkbox"
          value="true"
          defaultChecked={defaultChecked}
          className="mt-0.5 rounded border-stone-300 text-ink focus:ring-stone-300"
        />
        <span>
          <span className="font-medium">Use in AI later</span>
          <span className="block text-xs text-ink-faint leading-snug mt-0.5">
            When you add an assistant, it may only use rows you allow. Uncheck
            to keep this row out.
          </span>
        </span>
      </label>
    </div>
  );
}
