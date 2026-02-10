"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type AdminShellProps = {
  email: string | null;
  children: ReactNode;
};

export function AdminShell({ email, children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // 1. Check system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handler);

    // 2. Check local storage
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    }

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const effectiveTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = () => {
    const newTheme = effectiveTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const navigate = (path: string) => {
    if (pathname === path) return;
    router.push(path);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const NavItem = ({
    path,
    label,
    icon,
  }: {
    path: string;
    label: string;
    icon: ReactNode;
  }) => {
    const isActive = pathname === path;
    return (
      <button
        type="button"
        onClick={() => navigate(path)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 border-l-4 ${
          isActive
            ? "bg-white/10 border-[var(--color-gold-accent)] font-bold text-white shadow-lg"
            : "border-transparent hover:bg-white/5 text-gray-100 hover:text-white"
        }`}
      >
        <span className={`${isActive ? "text-[var(--color-gold-accent)]" : "opacity-80"}`}>
          {icon}
        </span>
        <span>{label}</span>
      </button>
    );
  };

  return (
    <main className="min-h-screen bg-[var(--main-bg)] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[var(--sidebar-bg)] text-white flex flex-col shadow-2xl z-10 relative overflow-hidden">
        {/* Decorative background accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-4 relative z-10">
          <div className="relative">
             <div className="absolute inset-0 rounded-full bg-[var(--color-gold-accent)] blur-sm opacity-50"></div>
             <img
              src="/images/logo.jpg"
              alt="Pocket Kerala logo"
              className="relative w-12 h-12 rounded-full border-2 border-[var(--color-gold-accent)] object-cover shadow-md"
            />
          </div>
          <div className="flex flex-row items-baseline gap-1.5 leading-tight">
            <span className="font-bold text-xl tracking-wide text-white">Pocket</span>
            <span className="font-serif italic text-xl text-[var(--color-gold-accent)]">Kerala</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 space-y-1 relative z-10">
          <div className="px-4 mb-2 text-xs font-bold text-white/40 uppercase tracking-wider">
            Menu
          </div>
          <NavItem
            path="/admin/dashboard"
            label="Dashboard"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
            }
          />
          <NavItem
            path="/admin/landingsettings"
            label="Landing Settings"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            }
          />
          <NavItem
            path="/admin/sponsors"
            label="Sponsors"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            }
          />
        </nav>

        {/* Footer */}
        <div className="p-6 bg-black/10 border-t border-white/10 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-white/70">
              <div className="font-medium text-white mb-0.5">Signed in as</div>
              <div className="truncate max-w-[140px]" title={email ?? "admin"}>{email ?? "admin"}</div>
            </div>
            
            {/* Theme Toggle */}
            <button
              type="button"
              className="relative w-12 h-6 rounded-full bg-black/30 transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-accent)]"
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 flex items-center justify-center ${
                  effectiveTheme === "dark" ? "translate-x-6" : "translate-x-0"
                }`}
              >
                {effectiveTheme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                )}
              </div>
            </button>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold tracking-wide transition-all border border-white/10 hover:border-white/20 text-white"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
             </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="w-full text-left">
            {children}
        </div>
      </section>
    </main>
  );
}

