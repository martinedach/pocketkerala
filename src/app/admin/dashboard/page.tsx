"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AdminShell } from "../AdminShell";

type AuthState = "checking" | "unauthenticated" | "authenticated";

type VideoStats = {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
};

type ChannelStats = {
  title: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
};

type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: number;
  amount_paid?: number;
};

function getYoutubeVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.pathname.includes("/embed/")) {
      return u.pathname.split("/embed/")[1]?.split("?")[0] ?? null;
    }
    if (u.hostname.includes("youtube.com") && u.searchParams.has("v")) {
      return u.searchParams.get("v");
    }
    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1).split("?")[0] || null;
    }
  } catch {
    return null;
  }
  return null;
}

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
    paid: "bg-[var(--color-green-deep)]/20 text-[var(--color-green-deep)]",
    created: "bg-gray-500/20 text-gray-600",
    attempted: "bg-amber-500/20 text-amber-600",
  };
  const c = colors[status] ?? "bg-gray-500/20 text-gray-600";
  return `px-2 py-0.5 rounded text-xs font-medium ${c}`;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [email, setEmail] = useState<string | null>(null);

  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoStats, setVideoStats] = useState<VideoStats | null>(null);
  const [channelStats, setChannelStats] = useState<ChannelStats | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);

  const [orders, setOrders] = useState<RazorpayOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

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

    const loadSettings = async () => {
      const { data } = await supabase
        .from("homepage_settings")
        .select("video_url")
        .eq("id", "default")
        .maybeSingle();

      setVideoUrl(data?.video_url ?? "");
    };
    loadSettings();
  }, [authState]);

  useEffect(() => {
    if (authState !== "authenticated") return;

    const videoId = getYoutubeVideoId(videoUrl);
    if (!videoId) {
      setVideoStats(null);
      setChannelStats(null);
      setVideoError(null);
      setVideoLoading(false);
      return;
    }

    let cancelled = false;
    setVideoLoading(true);
    setVideoError(null);

    Promise.all([
      fetch(`/api/admin/youtube-video?videoId=${encodeURIComponent(videoId)}`).then((r) => r.json()),
      fetch(`/api/admin/youtube-channel?videoId=${encodeURIComponent(videoId)}`).then((r) => r.json()),
    ])
      .then(([videoRes, channelRes]) => {
        if (cancelled) return;
        if (videoRes.error && channelRes.error) {
          setVideoError(videoRes.error);
          setVideoStats(null);
          setChannelStats(null);
        } else {
          setVideoError(null);
          if (!videoRes.error) {
            setVideoStats(videoRes);
          } else {
            setVideoStats(null);
          }
          if (!channelRes.error) {
            setChannelStats({
              title: channelRes.title,
              subscriberCount: channelRes.subscriberCount,
              videoCount: channelRes.videoCount,
              viewCount: channelRes.viewCount,
            });
          } else {
            setChannelStats(null);
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setVideoError("Failed to load video data");
          setVideoStats(null);
          setChannelStats(null);
        }
      })
      .finally(() => {
        if (!cancelled) setVideoLoading(false);
      });

    return () => { cancelled = true; };
  }, [authState, videoUrl]);

  useEffect(() => {
    if (authState !== "authenticated") return;

    let cancelled = false;
    setOrdersLoading(true);
    setOrdersError(null);

    fetch("/api/admin/razorpay/orders?count=10")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setOrdersError(data.error);
          setOrders([]);
        } else {
          setOrders(data.items ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOrdersError("Failed to load orders");
          setOrders([]);
        }
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });

    return () => { cancelled = true; };
  }, [authState]);

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
        <div className="text-left">
          <h1 className="admin-page-title">Dashboard</h1>
        </div>

        {/* YouTube channel overview + featured video */}
        <div className="admin-card overflow-hidden">
          <div className="admin-card-header">
            <h3>YouTube Channel</h3>
            <p>Channel stats and the video currently on the landing page.</p>
          </div>
          <div className="p-4 sm:p-6">
            {videoLoading && (
              <div className="flex items-center gap-3 text-sm opacity-70 animate-pulse py-8">
                Loading...
              </div>
            )}
            {videoError && !videoLoading && (
              <div className="p-4 rounded-lg bg-[var(--color-red-danger)]/10 text-[var(--color-red-danger)] text-sm">
                {videoError}
              </div>
            )}
            {!videoUrl && !videoLoading && (
              <p className="text-sm opacity-70 py-4">No featured video set. <a href="/admin/landingsettings" className="text-[var(--color-gold-accent)] hover:underline">Add one in Landing Settings</a>.</p>
            )}
            {videoUrl && !videoLoading && (
              <div className="space-y-6 text-left">
                {/* Channel overview - prominent */}
                {channelStats && (
                  <div className="p-4 rounded-lg bg-[var(--secondary-card-bg)] border border-[var(--border-color)] text-left">
                    <p className="text-xs font-medium uppercase tracking-wider opacity-60 mb-3">Channel overview</p>
                    <p className="font-semibold text-[var(--main-text)] mb-4">{channelStats.title}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-left">
                        <p className="text-2xl font-bold text-[var(--color-green-deep)]">{channelStats.subscriberCount.toLocaleString()}</p>
                        <p className="text-xs opacity-60">Subscribers</p>
                      </div>
                      <div className="text-left">
                        <p className="text-2xl font-bold">{channelStats.videoCount.toLocaleString()}</p>
                        <p className="text-xs opacity-60">Videos</p>
                      </div>
                      <div className="text-left">
                        <p className="text-2xl font-bold">{channelStats.viewCount.toLocaleString()}</p>
                        <p className="text-xs opacity-60">Total views</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Current featured video - compact */}
                <div className="text-left">
                  <p className="text-xs font-medium uppercase tracking-wider opacity-60 mb-3">Currently on landing page</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {(videoStats?.thumbnail || videoUrl) && (
                      <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 block w-32 sm:w-40 aspect-video rounded-lg overflow-hidden border border-[var(--border-color)] hover:border-[var(--color-gold-accent)]/50 transition-colors bg-[var(--secondary-card-bg)]"
                      >
                        {videoStats?.thumbnail ? (
                          <img
                            src={videoStats.thumbnail}
                            alt={videoStats.title}
                            className="block w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs opacity-60">
                            Video
                          </div>
                        )}
                      </a>
                    )}
                    <div className="min-w-0 flex-1">
                      {videoStats ? (
                        <>
                          <h4 className="font-medium text-sm line-clamp-2">{videoStats.title}</h4>
                          <div className="flex flex-wrap gap-3 mt-2 text-xs opacity-75">
                            <span>{videoStats.viewCount.toLocaleString()} views</span>
                            <span>{videoStats.likeCount.toLocaleString()} likes</span>
                            <span>{videoStats.commentCount.toLocaleString()} comments</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm opacity-70">Could not load video metrics.</p>
                      )}
                      <a
                        href="/admin/landingsettings"
                        className="inline-block text-xs text-[var(--color-gold-accent)] hover:underline mt-2"
                      >
                        Change featured video
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Razorpay orders */}
        <div className="admin-card overflow-hidden">
          <div className="admin-card-header">
            <h3>Recent Orders</h3>
            <p>Latest Razorpay orders.</p>
          </div>
          <div className="p-4 sm:p-6">
            {ordersLoading && (
              <div className="py-8 text-sm opacity-70 animate-pulse">Loading orders...</div>
            )}
            {ordersError && !ordersLoading && (
              <div className="p-4 rounded-lg bg-[var(--color-red-danger)]/10 text-[var(--color-red-danger)] text-sm">
                {ordersError}
              </div>
            )}
            {!ordersLoading && !ordersError && orders.length === 0 && (
              <p className="text-sm opacity-70 py-8">No orders found.</p>
            )}
            {!ordersLoading && !ordersError && orders.length > 0 && (
              <div className="divide-y divide-[var(--border-color)]">
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
            {!ordersLoading && !ordersError && orders.length > 0 && (
              <a
                href="/admin/razorpay"
                className="inline-block text-sm text-[var(--color-gold-accent)] hover:underline mt-4"
              >
                View all orders
              </a>
            )}
          </div>
        </div>

      </div>
    </AdminShell>
  );
}
