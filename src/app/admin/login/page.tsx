"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--main-bg)] px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-xl border border-[var(--border-color)] overflow-hidden">
          <div className="px-5 sm:px-8 pt-8 sm:pt-10 pb-5 sm:pb-6 border-b border-[var(--border-color)]">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img
                src="/images/logo.jpg"
                alt="Pocket Kerala"
                className="w-14 h-14 rounded-full border-2 border-[var(--color-gold-accent)] object-cover"
              />
              <div className="text-left">
                <h1 className="text-xl font-bold text-[var(--main-text)] tracking-tight">
                  Pocket Kerala
                </h1>
                <p className="text-sm text-[var(--main-text)] opacity-70">
                  Admin Portal
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--main-text)] opacity-80 text-center">
              Sign in with your admin credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-medium text-[var(--main-text)] mb-2"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input w-full"
                placeholder="admin@pocketkerala.in"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-[var(--main-text)] mb-2"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input w-full"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-[var(--color-red-danger)]/10 border border-[var(--color-red-danger)]/30 text-[var(--color-red-danger)] text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="admin-btn-primary w-full py-3"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--main-text)] opacity-50">
          Authorized personnel only. All access is logged.
        </p>
      </div>
    </main>
  );
}

