import Link from "next/link";
import { AiUsageToggle } from "@/components/AiUsageToggle";
import { PrivacySelect } from "@/components/PrivacySelect";
import { createMemory } from "../actions";

export default async function NewMemoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const error = sp.error ? decodeURIComponent(sp.error) : null;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/memories"
          className="text-xs text-ink-muted hover:text-ink mb-2 inline-block"
        >
          ← Back to memories
        </Link>
        <h1 className="text-lg font-medium text-ink tracking-tight">
          New memory
        </h1>
      </div>

      {error ? (
        <p
          className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <form action={createMemory} className="space-y-5">
        <div>
          <label
            htmlFor="label"
            className="block text-xs font-medium text-ink-muted uppercase tracking-wide mb-1.5"
          >
            Label (optional)
          </label>
          <input
            id="label"
            name="label"
            type="text"
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-stone-300"
            placeholder="e.g. Medication schedule"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-xs font-medium text-ink-muted uppercase tracking-wide mb-1.5"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            required
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-stone-300 resize-y min-h-[120px]"
            placeholder="What should the assistant remember?"
          />
        </div>
        <PrivacySelect />
        <AiUsageToggle />
        <div>
          <label
            htmlFor="expires_at"
            className="block text-xs font-medium text-ink-muted uppercase tracking-wide mb-1.5"
          >
            Expires (optional)
          </label>
          <input
            id="expires_at"
            name="expires_at"
            type="datetime-local"
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-stone-300"
          />
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-ink text-surface text-sm font-medium px-4 py-2.5 hover:bg-stone-800 transition-colors"
          >
            Save
          </button>
          <Link
            href="/memories"
            className="rounded-lg border border-stone-200 bg-white text-sm text-ink-muted px-4 py-2.5 hover:bg-surface-muted transition-colors inline-flex items-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
