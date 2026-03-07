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
      <div className="space-y-8">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">
            Signed in as <span className="font-semibold text-[var(--color-bright-orange)]">{email ?? "admin"}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="/admin/landingsettings"
            className="admin-card block p-6 hover:border-[var(--color-gold-accent)]/50 transition-colors group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-gold-accent)]/20 flex items-center justify-center text-[var(--color-gold-accent)] group-hover:bg-[var(--color-gold-accent)]/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--main-text)] mb-1">Landing Settings</h3>
                <p className="text-sm text-[var(--main-text)] opacity-70">
                  Manage the featured video and hero content on your homepage.
                </p>
              </div>
            </div>
          </a>
          <a
            href="/admin/sponsors"
            className="admin-card block p-6 hover:border-[var(--color-gold-accent)]/50 transition-colors group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--color-gold-accent)]/20 flex items-center justify-center text-[var(--color-gold-accent)] group-hover:bg-[var(--color-gold-accent)]/30 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--main-text)] mb-1">Sponsors</h3>
                <p className="text-sm text-[var(--main-text)] opacity-70">
                  Add and manage partner logos displayed on the landing page.
                </p>
              </div>
            </div>
          </a>
        </div>

        <div className="admin-card p-6">
          <h3 className="font-semibold text-[var(--main-text)] mb-2">Quick start</h3>
          <p className="text-sm text-[var(--main-text)] opacity-80">
            Use the navigation menu to access Landing Settings or Sponsors. Changes are saved to the database and reflected on the public site immediately.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
