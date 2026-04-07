import { createJournalEntry } from "../actions";
import { JOURNAL_CATEGORIES } from "../categories";

export default function NewJournalPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-5 sm:px-6 sm:py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">New entry</h1>
        <p className="mt-1 text-sm text-gray-500">
          Capture a thought before it slips away.
        </p>
      </div>

      <form action={createJournalEntry} className="space-y-5">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            placeholder="Optional"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none transition focus:border-black"
          />
        </div>

        <div>
          <label htmlFor="content" className="mb-2 block text-sm font-medium">
            Journal entry
          </label>
          <textarea
            id="content"
            name="content"
            placeholder="Write here..."
            required
            className="min-h-[320px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none transition focus:border-black"
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue=""
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
          <label htmlFor="tags" className="mb-2 block text-sm font-medium">
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            placeholder="Optional, comma-separated"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base outline-none transition focus:border-black"
          />
        </div>

        <input type="hidden" name="privacy_level" value="normal" />

        <div className="pt-2">
          <button
            type="submit"
            className="w-full rounded-lg bg-black px-4 py-3 text-base font-medium text-white transition active:scale-[0.99]"
          >
            Save entry
          </button>
        </div>
      </form>
    </div>
  );
}
