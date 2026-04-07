import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const MEMORY_CATEGORIES = [
  {
    key: "my_truths",
    title: "My Truths",
    description: "Beliefs, preferences, patterns & values",
  },
  {
    key: "context",
    title: "Context",
    description: "Life background, relationships, work & current situation",
  },
  {
    key: "goals",
    title: "Goals",
    description: "What I’m building toward, improving or planning",
  },
  {
    key: "core_memories",
    title: "Lessons",
    description: "Important experiences, insights, learnings & milestones",
  },
];

type MemoryCountMap = Record<string, number>;

export default async function MemoriesPage() {
  const supabase = await createClient();

  const { data: memories } = await supabase.from("memories").select("category");

  let counts: MemoryCountMap = {
    my_truths: 0,
    context: 0,
    goals: 0,
    core_memories: 0,
  };

  if (memories) {
    counts = memories.reduce<MemoryCountMap>(
      (acc, memory) => {
        const category = memory.category;
        if (category && category in acc) {
          acc[category] += 1;
        }
        return acc;
      },
      {
        my_truths: 0,
        context: 0,
        goals: 0,
        core_memories: 0,
      }
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Memories</h1>
        <p className="text-sm text-muted-foreground">
          My truths, context, goals &amp; lessons
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {MEMORY_CATEGORIES.map((category) => (
          <Link
            key={category.key}
            href={`/memories/category/${category.key}`}
            className="group rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-full flex-col justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold leading-tight group-hover:underline">
                    {category.title}
                  </h2>
                  <span className="shrink-0 rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
                    {counts[category.key] ?? 0}
                  </span>
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                  {category.description}
                </p>
              </div>

              <div className="text-sm font-medium text-muted-foreground">
                Open folder →
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
