import { backfillJournalEntries } from "../actions";

export default function JournalBackfillPage() {
  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Backfill journal entries</h1>
      <p className="text-sm text-gray-600">
        This runs once for your existing entries. It will copy old body text into
        content where needed, then fill missing title, category, and tags.
      </p>

      <form action={backfillJournalEntries}>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Run backfill
        </button>
      </form>
    </div>
  );
}
