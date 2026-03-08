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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    setSidebarOpen(false);
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
        className={`admin-nav-item ${isActive ? "admin-nav-item-active" : ""}`}
      >
        <span className={`${isActive ? "text-black" : "opacity-80"}`}>
          {icon}
        </span>
        <span>{label}</span>
      </button>
    );
  };

  return (
    <main className="h-screen overflow-hidden bg-[var(--main-bg)] flex flex-col md:flex-row font-sans">
      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between gap-3 px-4 py-3 bg-[var(--sidebar-bg)] text-[#ffffff] border-b-2 border-black flex-shrink-0 z-20">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-black/20 transition-colors border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_#000000]"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <img src="/images/logo.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-[var(--color-gold-accent)] object-cover flex-shrink-0" />
          <span className="font-semibold text-sm truncate">Pocket Kerala</span>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="p-2 -mr-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          aria-label="Sign out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
        </button>
      </header>

      {/* Sidebar - overlay on mobile, inline on desktop */}
      <div
        className={`fixed inset-0 z-30 md:hidden transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!sidebarOpen}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
        <aside
          className={`absolute top-0 left-0 bottom-0 w-[min(280px,85vw)] admin-sidebar text-[var(--main-text)] flex flex-col transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 flex items-center justify-between border-b-2 border-black bg-[var(--sidebar-bg)]">
            <div className="flex items-center gap-3">
              <img src="/images/logo.jpg" alt="Pocket Kerala" className="w-10 h-10 border-2 border-black shadow-[2px_2px_0px_#000000] object-cover flex-shrink-0" />
              <div>
                <span className="font-bold text-white text-sm">Pocket</span>
                <span className="font-bold text-[var(--color-gold-accent)] text-shadow-sm text-sm ml-0.5">Kerala</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" x2="6" y1="6" y2="18" />
                <line x1="6" x2="18" y1="6" y2="18" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <p className="px-4 mb-2 text-[10px] font-semibold text-white/40 uppercase tracking-wider">Navigation</p>
            <NavItem path="/admin/dashboard" label="Dashboard" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>} />
            <NavItem path="/admin/landingsettings" label="Landing Settings" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>} />
            <NavItem path="/admin/sponsors" label="Sponsors" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>} />
            <NavItem path="/admin/instagram" label="Instagram" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.451" y1="6.5" y2="6.549"/></svg>} />
            <NavItem path="/admin/razorpay" label="Razorpay" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>} />
            <NavItem path="/admin/shop" label="Shop Store" icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>} />
          </nav>
          <div className="p-4 border-t-2 border-black space-y-3 bg-[var(--sidebar-bg)] mt-auto">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-white opacity-60 uppercase tracking-wider">Signed in</p>
                <p className="text-xs font-bold text-white truncate" title={email ?? "admin"}>{email ?? "admin"}</p>
              </div>
              <button type="button" className="flex-shrink-0 w-10 h-6 rounded-full bg-white/20" onClick={toggleTheme} aria-label="Toggle theme">
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 flex items-center justify-center ${effectiveTheme === "dark" ? "translate-x-4" : "translate-x-0.5"}`}>
                  {effectiveTheme === "dark" ? <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-800"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>}
                </div>
              </button>
            </div>
            <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-black/20 hover:bg-[var(--color-red-danger)] text-xs font-bold text-white border-2 border-black shadow-[2px_2px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
              Sign out
            </button>
          </div>
        </aside>
      </div>

      {/* Sidebar - desktop */}
      <aside className="hidden md:flex w-64 lg:w-72 admin-sidebar flex-col flex-shrink-0 overflow-y-auto z-10">
        <div className="p-5 flex items-center gap-3 border-b-2 border-black bg-[var(--sidebar-bg)]">
          <img
            src="/images/logo.jpg"
            alt="Pocket Kerala"
            className="w-10 h-10 border-2 border-black shadow-[2px_2px_0px_#000000] object-cover flex-shrink-0"
          />
          <div>
            <span className="font-bold text-white text-sm tracking-tight">Pocket</span>
            <span className="font-bold text-[var(--color-gold-accent)] text-shadow-sm text-sm ml-0.5">Kerala</span>
            <p className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">Admin</p>
          </div>
        </div>

        <nav className="flex-1 py-4">
          <p className="px-4 mb-2 text-[10px] font-semibold text-white/40 uppercase tracking-wider">
            Navigation
          </p>
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
          <NavItem
            path="/admin/instagram"
            label="Instagram"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.451" y1="6.5" y2="6.549"/>
              </svg>
            }
          />
          <NavItem
            path="/admin/razorpay"
            label="Razorpay"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2"/>
                <line x1="2" x2="22" y1="10" y2="10"/>
              </svg>
            }
          />
          <NavItem
            path="/admin/shop"
            label="Shop"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            }
          />
        </nav>

        <div className="p-4 border-t-2 border-black space-y-3 bg-[var(--sidebar-bg)] mt-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-white opacity-60 uppercase tracking-wider">Signed in</p>
              <p className="text-xs font-bold text-white truncate" title={email ?? "admin"}>{email ?? "admin"}</p>
            </div>
            <button
              type="button"
              className="flex-shrink-0 w-10 h-6 rounded-full bg-white/20 transition-colors hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-accent)] focus:ring-offset-2 focus:ring-offset-[var(--sidebar-bg)]"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 flex items-center justify-center ${
                  effectiveTheme === "dark" ? "translate-x-4" : "translate-x-0.5"
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
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-black/20 hover:bg-[var(--color-red-danger)] text-xs font-bold text-white border-2 border-black shadow-[2px_2px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      <section className="flex-1 overflow-auto min-h-0 bg-[var(--main-bg)]">
        <div className="p-4 sm:p-6 lg:p-8 w-full">
          {children}
        </div>
      </section>
    </main>
  );
}

