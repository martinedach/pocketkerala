export const dynamic = "force-dynamic";

async function getViewer() {
  const res = await fetch("http://localhost:3000/api/linear/me", {
    cache: "no-store",
  });
  return res.json();
}

export default async function LinearPage() {
  const viewer = await getViewer();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Linear</h1>
      <p className="mt-2 text-zinc-600">
        Demo call to <code className="rounded bg-zinc-100 px-1">/api/linear/me</code>.
      </p>

      <pre className="mt-6 overflow-auto rounded-lg border border-zinc-200 bg-white p-4 text-sm">
        {JSON.stringify(viewer, null, 2)}
      </pre>

      <p className="mt-6 text-sm text-zinc-600">
        Set <code className="rounded bg-zinc-100 px-1">LINEAR_API_KEY</code> in{" "}
        <code className="rounded bg-zinc-100 px-1">.env.local</code>.
      </p>
    </div>
  );
}

