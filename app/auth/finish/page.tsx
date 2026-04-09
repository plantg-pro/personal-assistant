"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthFinishPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function finishSignIn() {
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/journal";

      if (!code) {
        if (mounted) {
          setError("Missing auth code.");
        }
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        if (mounted) {
          setError(error.message);
        }
        return;
      }

      router.replace(next);
      router.refresh();
    }

    finishSignIn();

    return () => {
      mounted = false;
    };
  }, [router, searchParams, supabase]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center">
        {error ? (
          <>
            <h1 className="text-lg font-semibold text-gray-900">
              Sign-in failed
            </h1>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold text-gray-900">
              Signing you in...
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we complete your login.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
