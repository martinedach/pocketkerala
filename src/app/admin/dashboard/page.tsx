"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AdminShell } from "../AdminShell";

type AuthState = "checking" | "unauthenticated" | "authenticated";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAuthState("unauthenticated");
        router.replace("/admin/login");
        return;
      }

      setEmail(user.email ?? null);
      setAuthState("authenticated");
    };

    checkAuth();
  }, [router]);

  if (authState === "checking") {
    return (
      <AdminShell email={email}>
        <div className="flex items-center justify-center p-12 text-[var(--main-text)] font-medium animate-pulse opacity-70">
          Checking admin session...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell email={email}>
      <div>
        <h2 className="text-3xl font-bold text-[var(--color-green-deep)] dark:text-[var(--color-gold-accent)] mb-2" style={{ textShadow: "1px 1px 2px var(--shadow-color)" }}>
          Admin Dashboard
        </h2>
        <p className="opacity-80 text-lg font-serif mb-8 text-[var(--main-text)]">
          You are signed in as <span className="font-bold text-[var(--color-bright-orange)]">{email ?? "admin"}</span>.
        </p>

        <div className="bg-[var(--card-bg)] rounded-xl shadow-md border border-[var(--border-color)] p-8 text-[var(--main-text)]">
          <p className="opacity-80">
            Welcome to your new dashboard. Select "Landing Settings" from the sidebar to manage your landing page video.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
