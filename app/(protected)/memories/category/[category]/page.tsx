import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const CATEGORY_CONFIG = {
  my_truths: {
    title: "My Truths",
    description: "Beliefs, preferences, patterns & values",
    emptyTitle: "No truths saved yet.",
    emptyBody:
      "Start capturing the beliefs, patterns and values that matter to you.",
  },
  context: {
    title: "Context",
    description: "Life background, relationships, work & current situation",
    emptyTitle: "No context saved yet.",
    emptyBody:
      "Save the background, circumstances and life details you want to remember.",
  },
  goals: {
    title: "Goals",
    description: "What I’m building toward, improving or planning",
    emptyTitle: "No goals saved yet.",
    emptyBody:
      "Start saving the goals, plans and habits you want to keep in focus.",
  },
  core_memories: {
    title: "Lessons",
    description: "Experiences, insights & things learned",
    emptyTitle: "No lessons saved yet.",
    emptyBody: "Start capturing insights and takeaways from your journal.",
  },
} as const;

type CategoryKey = keyof typeof CATEGORY_CONFIG;

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

type MemoryRow = {
  id: string;
  title: string | null;
  content: string | null;
  created_at: string | null;
  category: string | null;
  tags: string[] | null;
};

function isValidCategory(category: string): category is CategoryKey {
  return category in CATEGORY_CONFIG;
}

function formatDate(dateString: string | null) {
  if (!dateString) return "";

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function fallbackTitleFromContent(content: string | null) {
  if (!content) return "Untitled memory";

  const trimmed = content.trim();
  if (!trimmed) return "Untitled memory";

  const firstLine = trimmed.split("\n")[0]?.trim() || "";
  if (!firstLine) return "Untitled memory";

  return firstLine.length > 60
    ? `${firstLine.slice(0, 60).trim()}...`
    : firstLine;
}

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.filter(
    (tag): tag is string => typeof tag === "string" && tag.trim().length > 0
  );
}

export default async function MemoryCategoryPage({ params }: PageProps) {
  const { category } = await params;

  if (!isValidCategory(category)) {
    notFound();
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("memories")
    .select("id, title, content, created_at, category, tags")
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("MEMORY CATEGORY PAGE ERROR:", error);
  }

  const memories: MemoryRow[] = error || !data ? [] : (data as MemoryRow[]);
  const config = CATEGORY_CONFIG[category];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
      <section className="space-y-4">
        <Link
          href="/memories"
          className="inline-block text-sm text-muted-foreground hover:underline"
        >
          ← Back to Memories
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              {config.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
          </div>

          <Link
            href="/journal/new"
            className="inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            New Entry
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border bg-card">
        {memories.length === 0 ? (
          <div className="px-5 py-10">
            <div className="space-y-2">
              <h2 className="text-sm font-medium">{config.emptyTitle}</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {config.emptyBody}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {memories.map((memory) => {
              const tags = normalizeTags(memory.tags);

              return (
                <Link
                  key={memory.id}
                  href={`/memories/${memory.id}`}
                  className="block px-5 py-4 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-2">
                      <h2 className="truncate text-sm font-medium sm:text-base">
                        {memory.title?.trim() ||
                          fallbackTitleFromContent(memory.content)}
                      </h2>

                      {tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div className="shrink-0 pt-0.5 text-xs text-muted-foreground">
                      {formatDate(memory.created_at)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
