"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AdminShell } from "./AdminShell";

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  if (authState === "checking") {
    return (
      <main className="kerala-main">
        <section className="announcement-section">
          <p className="secondary-bio-text">Checking admin session...</p>
        </section>
      </main>
    );
  }

  return (
    <AdminShell email={email}>
      <h2 className="milestone-title">Admin dashboard</h2>
      <p className="secondary-bio-text">
        You are signed in as{" "}
        <span className="highlight-orange">{email ?? "admin"}</span>.
      </p>

      <p className="secondary-bio-text">
        This is a basic admin area placeholder. You can start by updating the
        landing page video URL.
      </p>
    </AdminShell>
  );
}

