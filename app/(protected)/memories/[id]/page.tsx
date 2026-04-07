import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MemoryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: memory, error } = await supabase
    .from("memories")
    .select(
      `
        *,
        journal_entries (
          id,
          title,
          content,
          created_at
        )
      `
    )
    .eq("id", id)
    .single();

  if (error || !memory) {
    return notFound();
  }

  const source = memory.journal_entries;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 space-y-6">
      {/* Back */}
      <Link
        href="/memories"
        className="text-sm text-gray-500 hover:underline"
      >
        ← Back to Memories
      </Link>

      {/* Memory */}
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">
          {memory.title || "Untitled memory"}
        </h1>

        <p className="text-sm text-gray-500">
          {memory.category}
        </p>

        <div className="whitespace-pre-wrap text-base leading-7">
          {memory.content}
        </div>
      </section>

      {/* Source Entry */}
      {source ? (
        <section className="border-t pt-6 space-y-3">
          <h2 className="text-sm font-medium text-gray-700">
            Source entry
          </h2>

          <div className="rounded-lg border p-4 space-y-2 bg-gray-50">
            <div className="font-medium text-sm">
              {source.title || "Untitled entry"}
            </div>

            <div className="text-sm text-gray-600 line-clamp-3">
              {source.content}
            </div>

            <Link
              href={`/journal/${source.id}`}
              className="text-sm text-blue-600 hover:underline"
            >
              View original entry →
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
