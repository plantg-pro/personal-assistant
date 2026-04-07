import Link from "next/link";
import { signOut } from "@/lib/auth-actions";

const navLink =
  "text-sm text-ink-muted hover:text-ink transition-colors py-1";

export function AppChrome({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b border-stone-200/90 bg-surface/95 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-4 sm:justify-start sm:gap-6">
          <span className="font-semibold tracking-tight">🤫 Aimee</span>
            <nav className="flex items-center gap-5" aria-label="Main">
              <Link href="/journal" className={navLink}>
                Journal
              </Link>
              <Link href="/memories" className={navLink}>
                Memories
              </Link>
            </nav>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            {email ? (
              <span className="text-xs text-ink-faint truncate max-w-[12rem] sm:max-w-[10rem]">
                {email}
              </span>
            ) : null}
            <form action={signOut}>
              <button
                type="submit"
                className="text-xs text-ink-muted hover:text-ink border border-stone-200 rounded-md px-2.5 py-1.5 bg-white"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 pb-16">
        {children}
      </main>
    </div>
  );
}
