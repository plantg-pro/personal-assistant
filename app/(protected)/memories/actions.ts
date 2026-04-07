"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
