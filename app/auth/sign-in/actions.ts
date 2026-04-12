"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !email.includes("@")) {
    redirect(
      `/auth/sign-in?error=${encodeURIComponent("Please enter a valid email address.")}`
    );
  }

  const supabase = await createClient();

  const redirectTo = "https://aimee-ten.vercel.app/auth/callback?next=/journal";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    redirect(`/auth/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/auth/sign-in?check=1");
}
