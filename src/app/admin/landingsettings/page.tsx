"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { AdminShell } from "../AdminShell";

type AuthState = "checking" | "unauthenticated" | "authenticated";

export default function AdminHomepageSettingsPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [email, setEmail] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [history, setHistory] = useState<
    { id: number; video_url: string; changed_at: string }[]
  >([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const [channelData, setChannelData] = useState<{
    title: string;
    thumbnail: string;
    subscriberCount: number;
    videoCount: number;
    viewCount: number;
    channelUrl: string;
  } | null>(null);
  const [channelLoading, setChannelLoading] = useState(false);
  const [channelError, setChannelError] = useState<string | null>(null);

  const [channelVideos, setChannelVideos] = useState<
    {
      videoId: string;
      embedUrl: string;
      title: string;
      thumbnail: string;
      publishedAt: string;
      viewCount?: number;
      likeCount?: number;
      commentCount?: number;
      duration?: string;
    }[]
  >([]);
  const [channelVideosLoading, setChannelVideosLoading] = useState(false);

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

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    const { error: deleteError } = await supabase
      .from("homepage_video_history")
      .delete()
      .eq("id", itemToDelete);

    if (deleteError) {
      // eslint-disable-next-line no-console
      console.error("Error deleting history item:", deleteError);
      setError("Failed to delete history item.");
    } else {
      setHistory(history.filter((item) => item.id !== itemToDelete));
      setSuccess("History item deleted.");
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

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

  useEffect(() => {
    if (authState !== "authenticated") return;

    const loadSettings = async () => {
      setLoading(true);
      const { data, error: loadError } = await supabase
        .from("homepage_settings")
        .select("video_url")
        .eq("id", "default")
        .maybeSingle();

      if (loadError) {
        // eslint-disable-next-line no-console
        console.warn("Failed to load homepage settings", loadError);
      } else if (data?.video_url) {
        setVideoUrl(data.video_url);
      }

      const { data: historyRows, error: historyError } = await supabase
        .from("homepage_video_history")
        .select("id, video_url, changed_at")
        .eq("settings_id", "default")
        .order("changed_at", { ascending: false })
        .limit(10);

      if (historyError) {
        // eslint-disable-next-line no-console
        console.warn("Failed to load homepage video history", historyError);
      } else if (historyRows) {
        setHistory(historyRows);
      }

      setLoading(false);
    };

    loadSettings();
  }, [authState]);

  useEffect(() => {
    const videoId = getYoutubeVideoId(videoUrl);
    if (!videoId) {
      setChannelData(null);
      setChannelError(null);
      return;
    }

    let cancelled = false;
    setChannelLoading(true);
    setChannelError(null);

    fetch(`/api/admin/youtube-channel?videoId=${encodeURIComponent(videoId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setChannelError(data.error);
          setChannelData(null);
        } else {
          setChannelData({
            title: data.title,
            thumbnail: data.thumbnail,
            subscriberCount: data.subscriberCount,
            videoCount: data.videoCount,
            viewCount: data.viewCount,
            channelUrl: data.channelUrl,
          });
          setChannelError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setChannelError("Failed to load channel data");
          setChannelData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setChannelLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [videoUrl]);

  useEffect(() => {
    const videoId = getYoutubeVideoId(videoUrl);
    if (!videoId) {
      setChannelVideos([]);
      return;
    }

    let cancelled = false;
    setChannelVideosLoading(true);

    fetch(`/api/admin/youtube-channel-videos?videoId=${encodeURIComponent(videoId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.videos) {
          setChannelVideos(data.videos);
        } else {
          setChannelVideos([]);
        }
      })
      .catch(() => {
        if (!cancelled) setChannelVideos([]);
      })
      .finally(() => {
        if (!cancelled) setChannelVideosLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [videoUrl]);

  const handleUseVideo = async (embedUrl: string) => {
    setVideoUrl(embedUrl);
    setError(null);
    setSuccess(null);

    const { error: upsertError } = await supabase
      .from("homepage_settings")
      .upsert(
        { id: "default", video_url: embedUrl },
        { onConflict: "id" },
      );

    if (upsertError) {
      setError(upsertError.message);
      return;
    }

    const { error: insertError } = await supabase
      .from("homepage_video_history")
      .insert({
        settings_id: "default",
        video_url: embedUrl,
      });

    if (insertError) {
      // eslint-disable-next-line no-console
      console.warn("Failed to add to history", insertError);
    } else {
      setHistory((prev) => [
        {
          id: Date.now(),
          video_url: embedUrl,
          changed_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    setSuccess("Featured video updated.");
  };

  if (authState === "checking" || loading) {
    return (
      <AdminShell email={email}>
        <div className="flex items-center justify-center p-12 text-[var(--main-text)] font-medium animate-pulse opacity-70">
          Loading landing settings...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell email={email}>
      <div className="space-y-8 text-[var(--main-text)]">
        <div>
          <h1 className="admin-page-title">Landing Settings</h1>
          <p className="admin-page-subtitle">
            Manage the content displayed on your landing page.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-[var(--color-red-danger)]/10 text-[var(--color-red-danger)] text-sm font-medium border border-[var(--color-red-danger)]/30">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 rounded-lg bg-[var(--color-green-deep)]/10 text-[var(--color-green-deep)] text-sm font-medium border border-[var(--color-green-deep)]/30">
            {success}
          </div>
        )}

        {!videoUrl && history.length === 0 && (
          <div className="admin-card overflow-hidden">
            <div className="admin-card-header">
              <h3>Add Featured Video</h3>
              <p>Paste a YouTube URL to get started.</p>
            </div>
            <div className="p-6">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const input = e.currentTarget.querySelector<HTMLInputElement>('input[name="video-url"]');
                  const url = input?.value?.trim();
                  if (!url) return;
                  const videoId = getYoutubeVideoId(url);
                  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : url;
                  await handleUseVideo(embedUrl);
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  name="video-url"
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or https://www.youtube.com/embed/..."
                  className="admin-input flex-1 font-mono text-sm"
                />
                <button type="submit" className="admin-btn-primary px-6 py-2.5 shrink-0">
                  Add Video
                </button>
              </form>
            </div>
          </div>
        )}

        {(videoUrl || channelLoading || channelData) && (
          <div className="admin-card overflow-hidden">
            <div className="admin-card-header">
              <h3>Channel Stats</h3>
              <p>Stats from the channel of the featured video.</p>
            </div>
            <div className="p-6">
              {channelLoading && (
                <div className="flex items-center gap-3 text-sm text-[var(--main-text)] opacity-70">
                  <span className="animate-pulse">Loading channel data...</span>
                </div>
              )}
              {channelError && !channelLoading && (
                <div className="p-3 rounded-lg bg-[var(--color-red-danger)]/10 text-[var(--color-red-danger)] text-sm">
                  {channelError}
                </div>
              )}
              {channelData && !channelLoading && (
                <div className="flex flex-col sm:flex-row gap-6">
                  {channelData.thumbnail && (
                    <a
                      href={channelData.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-[var(--border-color)] hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={channelData.thumbnail}
                        alt={channelData.title}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  )}
                  <div className="flex-1 min-w-0 space-y-4">
                    <div>
                      <p className="text-xs font-medium text-[var(--main-text)] opacity-60 uppercase tracking-wider mb-1">Channel</p>
                      <a
                        href={channelData.channelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[var(--color-gold-accent)] hover:underline"
                      >
                        {channelData.title}
                      </a>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-2xl font-bold text-[var(--main-text)]">
                          {channelData.subscriberCount.toLocaleString()}
                        </p>
                        <p className="text-xs text-[var(--main-text)] opacity-60">Subscribers</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[var(--main-text)]">
                          {channelData.videoCount.toLocaleString()}
                        </p>
                        <p className="text-xs text-[var(--main-text)] opacity-60">Videos</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[var(--main-text)]">
                          {channelData.viewCount.toLocaleString()}
                        </p>
                        <p className="text-xs text-[var(--main-text)] opacity-60">Total views</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[var(--main-text)] opacity-60 uppercase tracking-wider mb-1">Current embed URL</p>
                      <code className="block text-sm font-mono text-[var(--main-text)] bg-[var(--secondary-card-bg)] px-3 py-2 rounded border border-[var(--border-color)] truncate">
                        {videoUrl}
                      </code>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {(videoUrl || channelVideosLoading || channelVideos.length > 0) && (
          <div className="admin-card overflow-hidden">
            <div className="admin-card-header">
              <h3>Channel Videos</h3>
              <p>All videos from the featured video&apos;s channel. Use any as the featured video.</p>
            </div>
            <div className="p-6">
              {channelVideosLoading && (
                <div className="flex items-center gap-3 text-sm text-[var(--main-text)] opacity-70">
                  <span className="animate-pulse">Loading channel videos...</span>
                </div>
              )}
              {!channelVideosLoading && channelVideos.length === 0 && videoUrl && (
                <p className="text-sm text-[var(--main-text)] opacity-60">No channel videos found.</p>
              )}
              {!channelVideosLoading && channelVideos.length > 0 && (
                <div className="divide-y divide-[var(--border-color)]">
                  {channelVideos.map((v) => (
                    <div
                      key={v.videoId}
                      className="py-4 flex flex-col sm:flex-row sm:items-start gap-4 hover:bg-[var(--secondary-card-bg)]/50 transition-colors -mx-2 px-2 rounded-lg"
                    >
                      <a
                        href={v.embedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 relative w-40 aspect-video rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--secondary-card-bg)]"
                      >
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          className="w-full h-full object-cover"
                        />
                        {v.duration && (
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-xs font-semibold bg-black/80 text-white rounded">
                            {v.duration}
                          </span>
                        )}
                      </a>
                      <div className="min-w-0 flex-1 text-left">
                        <a
                          href={v.embedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block font-medium text-[var(--main-text)] line-clamp-2 hover:text-[var(--color-gold-accent)] transition-colors text-left"
                        >
                          {v.title}
                        </a>
                        <div className="flex flex-wrap gap-3 mt-2 justify-start text-left">
                          {v.viewCount != null && (
                            <span className="inline-flex items-center gap-1 text-xs text-[var(--main-text)] opacity-75">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                              {v.viewCount >= 1000000
                                ? `${(v.viewCount / 1000000).toFixed(1)}M views`
                                : v.viewCount >= 1000
                                  ? `${(v.viewCount / 1000).toFixed(1)}K views`
                                  : `${v.viewCount.toLocaleString()} views`}
                            </span>
                          )}
                          {v.likeCount != null && v.likeCount > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs text-[var(--main-text)] opacity-75">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                              </svg>
                              {v.likeCount >= 1000
                                ? `${(v.likeCount / 1000).toFixed(1)}K likes`
                                : `${v.likeCount.toLocaleString()} likes`}
                            </span>
                          )}
                          {v.commentCount != null && v.commentCount > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs text-[var(--main-text)] opacity-75">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                              </svg>
                              {v.commentCount >= 1000
                                ? `${(v.commentCount / 1000).toFixed(1)}K comments`
                                : `${v.commentCount.toLocaleString()} comments`}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--main-text)] opacity-60 mt-1 text-left">
                          {new Date(v.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex-shrink-0 min-w-[100px] flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleUseVideo(v.embedUrl)}
                          className="admin-btn-primary px-4 py-2 text-sm"
                        >
                          Use this
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="admin-card overflow-hidden">
            <div className="admin-card-header">
              <h3>Update History</h3>
              <p>Previously used video URLs.</p>
            </div>
            
            <div className="divide-y divide-[var(--border-color)]">
              {history.map((item) => {
                const videoId = getYoutubeVideoId(item.video_url);
                const thumbUrl = videoId
                  ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                  : null;
                return (
                <div 
                  key={item.id} 
                  className="p-4 hover:bg-[var(--secondary-card-bg)] transition-colors flex flex-col sm:flex-row sm:items-center gap-4 group"
                >
                  {thumbUrl && (
                    <a
                      href={item.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 w-40 h-[72px] rounded-lg overflow-hidden border border-[var(--border-color)] hover:opacity-90 transition-opacity bg-[var(--secondary-card-bg)]"
                      title="Open video"
                    >
                      <img
                        src={thumbUrl}
                        alt="Video preview"
                        className="w-full h-full object-cover"
                      />
                    </a>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs opacity-60 font-medium mb-1">
                      {new Date(item.changed_at).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                        <a 
                            href={item.video_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm font-mono truncate opacity-90 hover:text-[var(--color-gold-accent)] hover:underline decoration-[var(--color-gold-accent)] underline-offset-4 transition-all"
                            title="Open video in new tab"
                        >
                            {item.video_url}
                        </a>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 flex-shrink-0">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        type="button"
                        onClick={() => handleDeleteClick(item.id)}
                        className="p-2 text-[var(--main-text)] opacity-40 hover:opacity-100 hover:text-[var(--color-red-danger)] hover:bg-[var(--color-red-danger)]/10 rounded-md transition-all"
                        title="Delete this entry"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleUseVideo(item.video_url)}
                        className="admin-btn-primary shrink-0 px-3 py-1.5 text-sm"
                    >
                        Use this
                    </button>
                  </div>
                </div>
              );
              })}
            </div>
          </div>
        )}
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="admin-card max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[var(--main-text)] mb-2">Confirm deletion</h3>
            <p className="text-sm text-[var(--main-text)] opacity-80 mb-6">
              Are you sure you want to delete this history item? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={cancelDelete} className="admin-btn-secondary">
                Cancel
              </button>
              <button onClick={confirmDelete} className="admin-btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

