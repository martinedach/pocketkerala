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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [history, setHistory] = useState<
    { id: number; video_url: string; changed_at: string }[]
  >([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    const { error: upsertError } = await supabase
      .from("homepage_settings")
      .upsert(
        {
          id: "default",
          video_url: videoUrl,
        },
        { onConflict: "id" },
      );

    setSaving(false);

    if (upsertError) {
      setError(upsertError.message);
      return;
    }

    setSuccess("Homepage video URL updated.");
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
      <div className="w-full space-y-8 text-[var(--main-text)] text-left">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-green-deep)] dark:text-[var(--color-gold-accent)] mb-2" style={{ textShadow: "1px 1px 2px var(--shadow-color)" }}>
            Landing Settings
          </h2>
          <p className="opacity-80 text-lg font-serif">
            Manage the content displayed on your landing page.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-[var(--color-red-danger)]/10 text-[var(--color-red-danger)] text-sm font-medium border border-[var(--color-red-danger)]/20 animate-in fade-in slide-in-from-top-2 duration-300">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-4 rounded-lg bg-[var(--color-green-deep)]/10 text-[var(--color-green-deep)] text-sm font-medium border border-[var(--color-green-deep)]/20 animate-in fade-in slide-in-from-top-2 duration-300">
            {success}
          </div>
        )}

        {/* Video URL Card */}
        <div className="bg-[var(--card-bg)] rounded-xl shadow-md border border-[var(--border-color)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border-color)]">
            <h3 className="text-xl font-semibold text-[var(--color-green-deep)]">
              Featured Video
            </h3>
            <p className="text-sm opacity-70 mt-1">
              Update the YouTube video shown in the hero section.
            </p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  YouTube Embed URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={videoUrl}
                    onChange={(event) => setVideoUrl(event.target.value)}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--secondary-card-bg)] text-[var(--main-text)] focus:ring-2 focus:ring-[var(--color-gold-accent)] focus:border-[var(--color-gold-accent)] outline-none transition-all font-mono text-sm"
                  />
                </div>
              </div>



              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-[var(--color-gold-accent)] to-[#FFC107] hover:brightness-110 text-black font-bold rounded-lg shadow-md hover:shadow-lg transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving Changes..." : "Save Configuration"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* History Card */}
        {history.length > 0 && (
          <div className="bg-[var(--card-bg)] rounded-xl shadow-md border border-[var(--border-color)] overflow-hidden">
            <div className="p-6 border-b border-[var(--border-color)]">
              <h3 className="text-xl font-semibold text-[var(--color-green-deep)]">
                Update History
              </h3>
              <p className="text-sm opacity-70 mt-1">
                Previously used video URLs.
              </p>
            </div>
            
            <div className="divide-y divide-[var(--border-color)]">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 hover:bg-[var(--secondary-card-bg)] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
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
                        onClick={() => setVideoUrl(item.video_url)}
                        className="shrink-0 px-3 py-1.5 text-xs font-medium text-[var(--main-text)] bg-[var(--color-gold-accent)] hover:brightness-110 rounded-md transition-all shadow-sm font-bold text-black"
                    >
                        Use this
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-[var(--main-text)] mb-2">Confirm Deletion</h3>
            <p className="text-[var(--main-text)] opacity-80 mb-6">
              Are you sure you want to delete this history item? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--main-text)] hover:bg-[var(--secondary-card-bg)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-red-danger)] text-white hover:brightness-110 shadow-md transition-all active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

