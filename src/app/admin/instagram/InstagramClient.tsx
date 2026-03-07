"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AdminShell } from "../AdminShell";

type AuthState = "checking" | "unauthenticated" | "authenticated";

type Profile = {
  id: string;
  username: string;
  name?: string;
  biography?: string;
  website?: string;
  profile_picture_url?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
};

type MediaItem = {
  id: string;
  media_type: string;
  media_url: string;
  permalink?: string;
  thumbnail_url?: string;
  caption?: string;
  timestamp?: string;
  like_count?: number;
  comments_count?: number;
};

type InsightMetric = {
  name: string;
  period: string;
  values: { value: string; end_time: string }[];
};

export function InstagramClient() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [email, setEmail] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mediaPaging, setMediaPaging] = useState<{ next?: string }>({});
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const [insights, setInsights] = useState<InsightMetric[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"media" | "insights" | "publish">("media");

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

    let cancelled = false;
    setProfileLoading(true);
    setProfileError(null);

    fetch("/api/admin/instagram/profile")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setProfileError(data.error);
          setProfile(null);
        } else {
          setProfile(data);
          setProfileError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProfileError("Failed to load profile");
          setProfile(null);
        }
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });

    return () => { cancelled = true; };
  }, [authState]);

  useEffect(() => {
    if (authState !== "authenticated" || profileError) return;

    let cancelled = false;
    setMediaLoading(true);
    setMediaError(null);

    fetch("/api/admin/instagram/media?limit=12")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setMediaError(data.error);
          setMedia([]);
        } else {
          setMedia(data.data ?? []);
          setMediaPaging(data.paging ?? {});
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMediaError("Failed to load media");
          setMedia([]);
        }
      })
      .finally(() => {
        if (!cancelled) setMediaLoading(false);
      });

    return () => { cancelled = true; };
  }, [authState, profileError]);

  const loadInsights = () => {
    setInsightsLoading(true);
    setInsightsError(null);
    fetch("/api/admin/instagram/insights?metric=impressions,reach,profile_views&period=day")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setInsightsError(data.error);
          setInsights([]);
        } else {
          setInsights(data.data ?? []);
        }
      })
      .catch(() => {
        setInsightsError("Failed to load insights");
        setInsights([]);
      })
      .finally(() => setInsightsLoading(false));
  };

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
          <h1 className="admin-page-title">Instagram</h1>
          <p className="admin-page-subtitle">
            Manage your Instagram account via the Graph API.
          </p>
        </div>

        {/* Connection status & profile */}
        <div className="admin-card overflow-hidden">
          <div className="admin-card-header">
            <h3>Account</h3>
            <p>Connected Instagram Business or Creator account.</p>
          </div>
          <div className="p-4 sm:p-6">
            {profileLoading && (
              <div className="flex items-center gap-3 text-sm opacity-70 animate-pulse">
                Loading profile...
              </div>
            )}
            {profileError && !profileLoading && (
              <div className="p-4 rounded-lg bg-[var(--color-red-danger)]/10 border border-[var(--color-red-danger)]/30 text-[var(--color-red-danger)] text-sm">
                {profileError}
                <p className="mt-2 text-xs opacity-80">
                  Add INSTAGRAM_USER_ID and INSTAGRAM_ACCESS_TOKEN to .env. Use a Meta for Developers app with Instagram Basic or Business permissions.
                </p>
              </div>
            )}
            {profile && !profileLoading && (
              <div className="flex flex-col sm:flex-row gap-6">
                {profile.profile_picture_url && (
                  <img
                    src={profile.profile_picture_url}
                    alt={profile.username}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[var(--border-color)] object-cover flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <h4 className="font-semibold text-lg">{profile.name ?? profile.username}</h4>
                    <a
                      href={`https://instagram.com/${profile.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--color-gold-accent)] hover:underline"
                    >
                      @{profile.username}
                    </a>
                  </div>
                  {profile.biography && (
                    <p className="text-sm opacity-90">{profile.biography}</p>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--color-gold-accent)] hover:underline block truncate"
                    >
                      {profile.website}
                    </a>
                  )}
                  <div className="flex flex-wrap gap-4 pt-2">
                    {profile.followers_count != null && (
                      <span className="text-sm font-medium">{profile.followers_count.toLocaleString()} followers</span>
                    )}
                    {profile.follows_count != null && (
                      <span className="text-sm opacity-75">{profile.follows_count.toLocaleString()} following</span>
                    )}
                    {profile.media_count != null && (
                      <span className="text-sm opacity-75">{profile.media_count.toLocaleString()} posts</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs: Media, Insights, Publish */}
        {profile && (
          <div className="admin-card overflow-hidden">
            <div className="admin-card-header">
              <h3>Manage</h3>
              <p>View media, insights, and publish content.</p>
            </div>
            <div className="border-b border-[var(--border-color)] px-4 sm:px-6">
              <div className="flex gap-1">
                {(["media", "insights", "publish"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      if (tab === "insights") loadInsights();
                    }}
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
            <div className="p-4 sm:p-6">
              {activeTab === "media" && (
                <>
                  {mediaLoading && (
                    <div className="flex items-center gap-3 text-sm opacity-70 animate-pulse py-8">
                      Loading media...
                    </div>
                  )}
                  {mediaError && !mediaLoading && (
                    <div className="p-4 rounded-lg bg-[var(--color-red-danger)]/10 text-[var(--color-red-danger)] text-sm">
                      {mediaError}
                    </div>
                  )}
                  {!mediaLoading && !mediaError && media.length === 0 && (
                    <p className="text-sm opacity-70 py-8">No media found.</p>
                  )}
                  {!mediaLoading && !mediaError && media.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {media.map((item) => (
                        <a
                          key={item.id}
                          href={item.permalink ?? item.media_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative aspect-square rounded-lg overflow-hidden border border-[var(--border-color)] hover:border-[var(--color-gold-accent)]/50 transition-colors bg-[var(--secondary-card-bg)]"
                        >
                          <img
                            src={item.thumbnail_url ?? item.media_url}
                            alt={item.caption ?? "Media"}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-white text-xs flex gap-3">
                            {item.like_count != null && <span>{item.like_count} likes</span>}
                            {item.comments_count != null && <span>{item.comments_count} comments</span>}
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                  {mediaPaging.next && !mediaLoading && (
                    <p className="text-xs opacity-60 mt-4">More posts available via API. Pagination coming soon.</p>
                  )}
                </>
              )}

              {activeTab === "insights" && (
                <>
                  {insightsLoading && (
                    <div className="flex items-center gap-3 text-sm opacity-70 animate-pulse py-8">
                      Loading insights...
                    </div>
                  )}
                  {insightsError && !insightsLoading && (
                    <div className="p-4 rounded-lg bg-[var(--color-red-danger)]/10 text-[var(--color-red-danger)] text-sm">
                      {insightsError}
                    </div>
                  )}
                  {!insightsLoading && !insightsError && insights.length > 0 && (
                    <div className="space-y-4">
                      {insights.map((metric) => (
                        <div key={metric.name} className="p-4 rounded-lg bg-[var(--secondary-card-bg)] border border-[var(--border-color)]">
                          <p className="text-xs font-medium uppercase tracking-wider opacity-60 mb-2">
                            {metric.name.replace(/_/g, " ")}
                          </p>
                          <div className="space-y-1">
                            {metric.values.slice(0, 7).map((v, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="opacity-75">{new Date(v.end_time).toLocaleDateString()}</span>
                                <span className="font-medium">{parseInt(v.value, 10).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {!insightsLoading && !insightsError && insights.length === 0 && (
                    <p className="text-sm opacity-70 py-8">No insights data available for this period.</p>
                  )}
                </>
              )}

              {activeTab === "publish" && (
                <div className="py-8 text-center">
                  <p className="text-sm opacity-70 mb-4">
                    Content publishing via the Graph API requires additional setup: create containers, then publish.
                  </p>
                  <p className="text-xs opacity-60">
                    Use the Content Publishing API to post images, videos, and reels. Coming soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
