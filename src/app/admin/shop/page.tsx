"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AdminShell } from "../AdminShell";
import Link from "next/link";

type AuthState = "checking" | "unauthenticated" | "authenticated";

export default function AdminShopPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

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
          Loading shop dashboard...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell email={email}>
      <div className="space-y-8 text-[var(--main-text)]">
        <div>
          <h1 className="admin-page-title">Shop Management</h1>
          <p className="admin-page-subtitle">
            Manage your store&apos;s catalog, inventory, and categories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Categories Card */}
          <Link href="/admin/shop/categories" className="block group">
            <div className="admin-card h-full transition-transform group-hover:-translate-y-1">
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-green-deep)]/10 text-[var(--color-green-deep)] flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--color-gold-accent)] transition-colors">Categories</h3>
                <p className="text-sm opacity-70">
                  Organize your products into logical sections like T-Shirts, Mugs, or Accessories.
                </p>
              </div>
            </div>
          </Link>

          {/* Products Card */}
          <Link href="/admin/shop/products" className="block group">
            <div className="admin-card h-full transition-transform group-hover:-translate-y-1">
              <div className="p-6">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-green-deep)]/10 text-[var(--color-green-deep)] flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--color-gold-accent)] transition-colors">Products</h3>
                <p className="text-sm opacity-70">
                  Manage individual items, designs, and base products available in your store.
                </p>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </AdminShell>
  );
}
