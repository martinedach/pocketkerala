import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">PocketKerala</h1>
          <p className="text-zinc-600">
            Next.js starter with Linear + GitHub integration hooks.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Project links</h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-white hover:bg-zinc-800"
              href="/linear"
            >
              Linear API demo
            </Link>
            <a
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 px-4 py-2 text-zinc-900 hover:bg-zinc-50"
              href="/api/linear/me"
            >
              /api/linear/me
            </a>
          </div>
          <p className="mt-4 text-sm text-zinc-600">
            Add <code className="rounded bg-zinc-100 px-1">LINEAR_API_KEY</code>{" "}
            in <code className="rounded bg-zinc-100 px-1">.env.local</code>.
          </p>
        </div>
      </main>
    </div>
  );
}
