"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type AdminShellProps = {
  email: string | null;
  children: ReactNode;
};

export function AdminShell({ email, children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (path: string) => {
    if (pathname === path) return;
    router.push(path);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  return (
    <main className="admin-main-root">
      <div className="admin-layout">
        <aside className="admin-sidenav">
          <div>
            <div className="admin-brand">
              <img
                src="/images/logo.jpg"
                alt="Pocket Kerala logo"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "2px solid var(--color-gold-accent)",
                  objectFit: "cover",
                  marginRight: 10,
                }}
              />
              <div className="admin-brand-text">
                <div>Pocket</div>
                <div>Kerala</div>
              </div>
            </div>
            <nav className="admin-nav">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className={`admin-nav-button${
                  pathname === "/admin" ? " active" : ""
                }`}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/homepage")}
                className={`admin-nav-button${
                  pathname === "/admin/homepage" ? " active" : ""
                }`}
              >
                Homepage settings
              </button>
            </nav>
          </div>

          <div className="admin-sidenav-footer">
            <div className="admin-user-email">
              Signed in as {email ?? "admin"}
            </div>
            <button
              type="button"
              className="admin-signout-button"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </aside>

        <section className="admin-main">
          <div className="admin-content-card">{children}</div>
        </section>
      </div>
    </main>
  );
}

