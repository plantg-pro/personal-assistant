import { createClient } from "@/lib/supabase/server";
import {
  updateJournalEntry,
  deleteJournalEntry,
  saveJournalEntryToMemory,
} from "../actions";

const JOURNAL_CATEGORIES = [
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

const MEMORY_CATEGORY_OPTIONS = [
  { value: "my_truths", label: "My Truths" },
  { value: "context", label: "Context" },
  { value: "goals", label: "Goals" },
  { value: "core_memories", label: "Lessons" },
] as const;

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: entry } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("id", id)
    .single();

  if (!entry) {
    return <div className="p-6">Entry not found</div>;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-5 sm:px-6 sm:py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit entry
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Revisit, refine, or save this thought as a memory.
        </p>
      </div>

      <form action={updateJournalEntry} className="space-y-5">
        <input type="hidden" name="id" value={entry.id} />

        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            defaultValue={entry.title || ""}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none transition focus:border-black"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="mb-2 block text-sm font-medium"
          >
            Journal entry
          </label>
          <textarea
            id="content"
            name="content"
            defaultValue={entry.content || ""}
            className="min-h-[320px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none transition focus:border-black"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={entry.category || ""}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none transition focus:border-black"
          >
            <option value="">Let AI choose</option>
            {JOURNAL_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="tags"
            className="mb-2 block text-sm font-medium"
          >
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            defaultValue={Array.isArray(entry.tags) ? entry.tags.join(", ") : ""}
            placeholder="Comma-separated tags"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none transition focus:border-black"
          />
        </div>

        {Array.isArray(entry.tags) && entry.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {entry.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
          <button
            type="submit"
            className="w-full rounded-lg bg-black px-4 py-3 text-base font-medium text-white transition active:scale-[0.99]"
          >
            Save changes
          </button>

          <button
            formAction={async () => {
              "use server";
              await deleteJournalEntry(entry.id);
            }}
            className="w-full rounded-lg bg-red-500 px-4 py-3 text-base font-medium text-white transition active:scale-[0.99]"
          >
            Delete entry
          </button>
        </div>
      </form>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="mb-3">
          <h2 className="text-base font-medium">Save to memory</h2>
          <p className="mt-1 text-sm text-gray-500">
            Turn this journal entry into a reusable memory for future recall.
          </p>
        </div>

        <div className="space-y-3">
          <form
            action={async () => {
              "use server";
              await saveJournalEntryToMemory(entry.id);
            }}
          >
            <button className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white transition active:scale-[0.99]">
              Save to Memory
            </button>
          </form>

          <details className="rounded-lg border border-gray-200 bg-white">
            <summary className="cursor-pointer list-none rounded-lg px-4 py-3 text-sm font-medium text-gray-800">
              Save to a specific memory category
            </summary>

            <div className="space-y-2 border-t border-gray-100 px-3 py-3">
              {MEMORY_CATEGORY_OPTIONS.map((option) => (
                <form
                  key={option.value}
                  action={async () => {
                    "use server";
                    await saveJournalEntryToMemory(entry.id, option.value);
                  }}
                >
                  <button className="w-full rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50 active:scale-[0.99]">
                    {option.label}
                  </button>
                </form>
              ))}
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
