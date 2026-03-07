"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AdminShell } from "../AdminShell";

type AuthState = "checking" | "unauthenticated" | "authenticated";

type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  order_id: string | null;
  description?: string;
  email?: string;
  contact?: string;
  created_at: number;
  amount_refunded?: number;
};

type Order = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: number;
  amount_paid?: number;
  amount_due?: number;
};

function formatAmount(amount: number, currency: string): string {
  const value = amount / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatStatus(status: string): string {
  const colors: Record<string, string> = {
    captured: "bg-[var(--color-green-deep)]/20 text-[var(--color-green-deep)]",
    authorized: "bg-amber-500/20 text-amber-600",
    created: "bg-gray-500/20 text-gray-600",
    failed: "bg-[var(--color-red-danger)]/20 text-[var(--color-red-danger)]",
    refunded: "bg-purple-500/20 text-purple-600",
    paid: "bg-[var(--color-green-deep)]/20 text-[var(--color-green-deep)]",
    attempted: "bg-amber-500/20 text-amber-600",
  };
  const c = colors[status] ?? "bg-gray-500/20 text-gray-600";
  return `px-2 py-0.5 rounded text-xs font-medium ${c}`;
}

export default function AdminRazorpayPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [email, setEmail] = useState<string | null>(null);

  const [connected, setConnected] = useState<boolean | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);

  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"payments" | "orders">("payments");

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

  useEffect(() => {
    if (authState !== "authenticated") return;

    fetch("/api/admin/razorpay/account")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setConfigError(data.error);
          setConnected(false);
        } else {
          setConfigError(null);
          setConnected(true);
        }
      })
      .catch(() => {
        setConfigError("Failed to connect");
        setConnected(false);
      });
  }, [authState]);

  useEffect(() => {
    if (authState !== "authenticated" || !connected) return;

    setPaymentsLoading(true);
    setPaymentsError(null);
    fetch("/api/admin/razorpay/payments?count=25")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setPaymentsError(data.error);
          setPayments([]);
        } else {
          setPayments(data.items ?? []);
        }
      })
      .catch(() => {
        setPaymentsError("Failed to load payments");
        setPayments([]);
      })
      .finally(() => setPaymentsLoading(false));
  }, [authState, connected]);

  useEffect(() => {
    if (authState !== "authenticated" || !connected) return;

    setOrdersLoading(true);
    setOrdersError(null);
    fetch("/api/admin/razorpay/orders?count=25")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setOrdersError(data.error);
          setOrders([]);
        } else {
          setOrders(data.items ?? []);
        }
      })
      .catch(() => {
        setOrdersError("Failed to load orders");
        setOrders([]);
      })
      .finally(() => setOrdersLoading(false));
  }, [authState, connected]);

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
      <div className="space-y-8 text-[var(--main-text)]">
        <div>
          <h1 className="admin-page-title">Razorpay</h1>
          <p className="admin-page-subtitle">
            View payments and orders from your Razorpay account.
          </p>
        </div>

        {/* Connection status */}
        <div className="admin-card overflow-hidden">
          <div className="admin-card-header">
            <h3>Connection</h3>
            <p>Razorpay API connection status.</p>
          </div>
          <div className="p-4 sm:p-6">
            {connected === null && (
              <div className="text-sm opacity-70 animate-pulse">Checking connection...</div>
            )}
            {configError && connected === false && (
              <div className="p-4 rounded-lg bg-[var(--color-red-danger)]/10 border border-[var(--color-red-danger)]/30 text-[var(--color-red-danger)] text-sm">
                {configError}
                <p className="mt-2 text-xs opacity-80">
                  Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env. Get them from your Razorpay Dashboard under Settings &gt; API Keys.
                </p>
              </div>
            )}
            {connected && (
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[var(--color-green-deep)]" />
                <span className="font-medium text-[var(--color-green-deep)]">Connected</span>
              </div>
            )}
          </div>
        </div>

        {/* Payments & Orders */}
        {connected && (
          <div className="admin-card overflow-hidden">
            <div className="admin-card-header">
              <h3>Transactions</h3>
              <p>Recent payments and orders.</p>
            </div>
            <div className="border-b border-[var(--border-color)] px-4 sm:px-6">
              <div className="flex gap-1">
                {(["payments", "orders"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors capitalize ${
                      activeTab === tab
                        ? "border-[var(--color-gold-accent)] text-[var(--color-gold-accent)]"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 sm:p-6 overflow-x-auto">
              {activeTab === "payments" && (
                <>
                  {paymentsLoading && (
                    <div className="py-8 text-sm opacity-70 animate-pulse">Loading payments...</div>
                  )}
                  {paymentsError && !paymentsLoading && (
                    <div className="p-4 rounded-lg bg-[var(--color-red-danger)]/10 text-[var(--color-red-danger)] text-sm">
                      {paymentsError}
                    </div>
                  )}
                  {!paymentsLoading && !paymentsError && payments.length === 0 && (
                    <p className="py-8 text-sm opacity-70">No payments found.</p>
                  )}
                  {!paymentsLoading && !paymentsError && payments.length > 0 && (
                    <div className="divide-y divide-[var(--border-color)] min-w-[600px]">
                      {payments.map((p) => (
                        <div
                          key={p.id}
                          className="py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-[var(--secondary-card-bg)]/50 transition-colors -mx-2 px-2 rounded-lg"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-mono text-sm truncate">{p.id}</p>
                            <p className="text-xs opacity-60 mt-0.5">
                              {new Date(p.created_at * 1000).toLocaleString()}
                            </p>
                            {p.email && (
                              <p className="text-xs opacity-75 mt-1 truncate">{p.email}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="font-semibold">
                              {formatAmount(p.amount, p.currency || "INR")}
                            </span>
                            <span className={formatStatus(p.status)}>{p.status}</span>
                            <span className="text-xs opacity-60 capitalize">{p.method}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === "orders" && (
                <>
                  {ordersLoading && (
                    <div className="py-8 text-sm opacity-70 animate-pulse">Loading orders...</div>
                  )}
                  {ordersError && !ordersLoading && (
                    <div className="p-4 rounded-lg bg-[var(--color-red-danger)]/10 text-[var(--color-red-danger)] text-sm">
                      {ordersError}
                    </div>
                  )}
                  {!ordersLoading && !ordersError && orders.length === 0 && (
                    <p className="py-8 text-sm opacity-70">No orders found.</p>
                  )}
                  {!ordersLoading && !ordersError && orders.length > 0 && (
                    <div className="divide-y divide-[var(--border-color)] min-w-[600px]">
                      {orders.map((o) => (
                        <div
                          key={o.id}
                          className="py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-[var(--secondary-card-bg)]/50 transition-colors -mx-2 px-2 rounded-lg"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-mono text-sm truncate">{o.id}</p>
                            <p className="text-xs opacity-60 mt-0.5">
                              {new Date(o.created_at * 1000).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="font-semibold">
                              {formatAmount(o.amount, o.currency || "INR")}
                            </span>
                            <span className={formatStatus(o.status)}>{o.status}</span>
                            {o.amount_paid != null && o.amount_paid > 0 && (
                              <span className="text-xs opacity-75">
                                Paid: {formatAmount(o.amount_paid, o.currency || "INR")}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
