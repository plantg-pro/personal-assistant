"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email.includes("@")) {
    redirect(
      "/auth/sign-in?error=" + encodeURIComponent("Enter a valid email address.")
    );
  }

  const supabase = await createClient();
  const origin = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/$/, "");

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect("/auth/sign-in?error=" + encodeURIComponent(error.message));
  }

  redirect("/auth/sign-in?check=1");
}
