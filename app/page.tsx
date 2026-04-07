import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type JournalEntry = {
  id: string;
  title: string | null;
  content: string | null;
  category: string | null;
  tags: string[] | null;
  privacy_level: string | null;
  created_at: string | null;
};

type GroupedEntries = {
  label: string;
  entries: JournalEntry[];
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date: Date) {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return startOfDay(addDays(date, diff));
}

function formatWeekLabel(date: Date) {
  return `Week of ${new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(startOfWeek(date))}`;
}

function formatEntryDate(dateString: string | null) {
  if (!dateString) return "";

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function getGroupLabel(dateString: string | null) {
  if (!dateString) return "Older";

  const entryDate = new Date(dateString);
  const today = startOfDay(new Date());
  const yesterday = addDays(today, -1);
  const thisWeekStart = startOfWeek(today);
  const entryDay = startOfDay(entryDate);

  if (entryDay.getTime() === today.getTime()) return "Today";
  if (entryDay.getTime() === yesterday.getTime()) return "Yesterday";
  if (entryDay >= thisWeekStart) return "This Week";

  return formatWeekLabel(entryDate);
}

function groupEntries(entries: JournalEntry[]): GroupedEntries[] {
  const grouped = new Map<string, JournalEntry[]>();

  for (const entry of entries) {
    const label = getGroupLabel(entry.created_at);
    const existing = grouped.get(label) ?? [];
    existing.push(entry);
    grouped.set(label, existing);
  }

  const priority = new Map<string, number>([
    ["Today", 0],
    ["Yesterday", 1],
    ["This Week", 2],
  ]);

  return Array.from(grouped.entries())
    .map(([label, groupedEntries]) => ({
      label,
      entries: groupedEntries,
    }))
    .sort((a, b) => {
      const aPriority = priority.get(a.label);
      const bPriority = priority.get(b.label);

      if (aPriority !== undefined && bPriority !== undefined) {
        return aPriority - bPriority;
      }

      if (aPriority !== undefined) return -1;
      if (bPriority !== undefined) return 1;

      const aNewest = new Date(a.entries[0]?.created_at ?? 0).getTime();
      const bNewest = new Date(b.entries[0]?.created_at ?? 0).getTime();
      return bNewest - aNewest;
    });
}

function fallbackTitle(entry: JournalEntry) {
  const title = entry.title?.trim();
  if (title) return title;

  const content = entry.content?.trim().replace(/\s+/g, " ") ?? "";
  if (!content) return "Untitled";

  return content.length > 60 ? `${content.slice(0, 60)}...` : content;
}

function normalizeTags(tags: string[] | null) {
  if (!Array.isArray(tags)) return [];
  return tags.filter((tag) => typeof tag === "string" && tag.trim().length > 0);
}

export default async function JournalPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

//  if (!user) {
//    return <div className="p-6">Not authenticated</div>;
//  }

  const { data: entries, error } = await supabase
  .from("journal_entries")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false })
  .limit(50);

  if (error) {
    return <div className="p-6">Failed to load journal entries</div>;
  }

  const groupedEntries = groupEntries((entries ?? []) as JournalEntry[]);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-6">
      {/* Header */}
      <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Journal</h1>
          <p className="mt-1 text-sm text-gray-500">
            diary, thoughts & inspirations
          </p>
        </div>

        <Link
          href="/journal/new"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-black px-4 text-sm font-medium text-white transition active:scale-[0.99]"
        >
          New entry
        </Link>
      </section>

      {/* Empty state */}
      {groupedEntries.length === 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white px-5 py-10">
          <h2 className="text-sm font-medium">No journal entries yet.</h2>
        </section>
      ) : (
        <div className="space-y-8">
          {groupedEntries.map((group) => (
            <section key={group.label} className="space-y-3">
              {/* Group Header */}
              <div className="sticky top-0 z-10 -mx-1 bg-white/95 px-1 py-1 backdrop-blur">
                <h2 className="text-sm font-medium text-gray-500">
                  {group.label}
                </h2>
              </div>

              {/* Entries */}
              <div className="space-y-3">
                {group.entries.map((entry) => {
                  const tags = normalizeTags(entry.tags);

                  return (
                    <Link
                      key={entry.id}
                      href={`/journal/${entry.id}`}
                      className="block rounded-2xl border border-gray-200 bg-white p-4 transition hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          
                          {/* 🔥 FIXED TITLE */}
                          <div className="text-base font-semibold text-gray-900">
                            {fallbackTitle(entry)}
                          </div>

                          {/* Content preview */}
                          {entry.content && (
                            <div className="mt-1 line-clamp-2 text-sm text-gray-600">
                              {entry.content}
                            </div>
                          )}

                          {/* Tags */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {entry.category && (
                              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                                {entry.category}
                              </span>
                            )}

                            {tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Date */}
                          <div className="mt-3 text-xs text-gray-400">
                            {formatEntryDate(entry.created_at)}
                          </div>
                        </div>

                        {/* Privacy */}
                        <div className="shrink-0">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                            {entry.privacy_level || "normal"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}