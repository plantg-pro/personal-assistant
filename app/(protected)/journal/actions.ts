"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function parseTags(raw: FormDataEntryValue | null): string[] {
  if (!raw || typeof raw !== "string") return [];

  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function fallbackTitle(content: string): string {
  const trimmed = content.trim().replace(/\s+/g, " ");
  if (!trimmed) return "Untitled";

  return trimmed.length > 60 ? `${trimmed.slice(0, 60)}...` : trimmed;
}

export async function createJournalEntry(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const titleRaw = formData.get("title");
  const contentRaw = formData.get("content");
  const categoryRaw = formData.get("category");
  const tagsRaw = formData.get("tags");
  const privacyLevelRaw = formData.get("privacy_level");

  const title =
    typeof titleRaw === "string" && titleRaw.trim() ? titleRaw.trim() : null;

  const content =
    typeof contentRaw === "string" ? contentRaw.trim() : "";

  const category =
    typeof categoryRaw === "string" && categoryRaw.trim()
      ? categoryRaw.trim()
      : null;

  const tags = parseTags(tagsRaw);

  const privacyLevel =
    typeof privacyLevelRaw === "string" && privacyLevelRaw.trim()
      ? privacyLevelRaw.trim()
      : "normal";

  if (!content) {
    throw new Error("Journal entry content is required");
  }

  const { error } = await supabase.from("journal_entries").insert({
    user_id: user.id,
    title,
    content,
    category,
    tags,
    privacy_level: privacyLevel,
  });

  if (error) {
    throw new Error(`Failed to create journal entry: ${error.message}`);
  }

  revalidatePath("/journal");
  redirect("/journal");
}

export async function updateJournalEntry(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const idRaw = formData.get("id");
  const titleRaw = formData.get("title");
  const contentRaw = formData.get("content");
  const categoryRaw = formData.get("category");
  const tagsRaw = formData.get("tags");

  const id = typeof idRaw === "string" ? idRaw : "";
  const title =
    typeof titleRaw === "string" && titleRaw.trim() ? titleRaw.trim() : null;
  const content =
    typeof contentRaw === "string" ? contentRaw.trim() : "";
  const category =
    typeof categoryRaw === "string" && categoryRaw.trim()
      ? categoryRaw.trim()
      : null;
  const tags = parseTags(tagsRaw);

  if (!id) {
    throw new Error("Missing journal entry id");
  }

  if (!content) {
    throw new Error("Journal entry content is required");
  }

  const { error } = await supabase
    .from("journal_entries")
    .update({
      title,
      content,
      category,
      tags,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to update journal entry: ${error.message}`);
  }

  revalidatePath("/journal");
  revalidatePath(`/journal/${id}`);
  redirect(`/journal/${id}`);
}

export async function deleteJournalEntry(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  if (!id) {
    throw new Error("Missing journal entry id");
  }

  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to delete journal entry: ${error.message}`);
  }

  revalidatePath("/journal");
  redirect("/journal");
}

export async function saveJournalEntryToMemory(
  entryId: string,
  overrideCategory?: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  if (!entryId) {
    throw new Error("Missing journal entry id");
  }

  const { data: entry, error: fetchError } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("id", entryId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !entry) {
    throw new Error(
      `Failed to fetch journal entry: ${fetchError?.message ?? "Entry not found"}`
    );
  }

  const memoryTitle =
    entry.title?.trim() || fallbackTitle(entry.content || "");

  const memoryCategory =
    overrideCategory || entry.category || "context";

  const memoryTags = Array.isArray(entry.tags) ? entry.tags : [];

  const memoryPrivacyLevel = entry.privacy_level || "normal";

  const { data: insertedMemory, error: insertError } = await supabase
    .from("memories")
    .insert({
      user_id: user.id,
      title: memoryTitle,
      content: entry.content || "",
      category: memoryCategory,
      tags: memoryTags,
      privacy_level: memoryPrivacyLevel,
      source_journal_entry_id: entry.id,
    })
    .select("id")
    .single();

  if (insertError) {
    throw new Error(`Failed to save memory: ${insertError.message}`);
  }

  revalidatePath("/journal");
  revalidatePath(`/journal/${entryId}`);
  revalidatePath("/memories");

  if (insertedMemory?.id) {
    revalidatePath(`/memories/${insertedMemory.id}`);
  }

  redirect("/memories");
}
