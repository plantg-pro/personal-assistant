"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createMemory(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const labelRaw = formData.get("label");
  const contentRaw = formData.get("content");
  const expiresAtRaw = formData.get("expires_at");

  const label =
    typeof labelRaw === "string" && labelRaw.trim()
      ? labelRaw.trim()
      : null;

  const content =
    typeof contentRaw === "string" ? contentRaw.trim() : "";

  const expires_at =
    typeof expiresAtRaw === "string" && expiresAtRaw
      ? new Date(expiresAtRaw).toISOString()
      : null;

  if (!content) {
    throw new Error("Memory content is required");
  }

  const { error } = await supabase.from("memories").insert({
    user_id: user.id,
    title: label,
    content,
    expires_at,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/memories");
}

export async function deleteMemory(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("memories")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/memories");
}
