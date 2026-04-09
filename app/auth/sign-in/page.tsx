import Link from "next/link";
import { signInWithMagicLink } from "./actions";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ check?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const check = sp.check === "1";
  const error = sp.error ? decodeURIComponent(sp.error) : null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-medium tracking-tight">Sign in</h1>
          <p className="text-sm leading-relaxed text-gray-600">
            We&apos;ll email you a magic link. No password.
          </p>
        </div>

        {check ? (
          <p
            className="rounded-lg border bg-white p-3 text-center text-sm text-gray-600"
            role="status"
          >
            Check your inbox for the link to continue.
          </p>
        ) : null}

        {error ? (
          <p
            className="rounded-lg border bg-red-50 p-3 text-center text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <form action={signInWithMagicLink} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-black py-2 text-white"
          >
            Send magic link
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Private to you. <Link href="/">Home</Link>
        </p>
      </div>
    </main>
  );
}
