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
        <p className="secondary-bio-text">Loading homepage settings...</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell email={email}>
      <h2 className="milestone-title">Homepage settings</h2>
      <p className="secondary-bio-text">
        Update the YouTube video shown on the landing page.
      </p>

      <div className="admin-section-card">
        <form
          onSubmit={handleSubmit}
          style={{ textAlign: "left", maxWidth: 840 }}
        >
          <label
            className="secondary-bio-text"
            style={{ display: "block", marginBottom: 8 }}
          >
            YouTube video URL
          </label>
          <input
            type="url"
            required
            value={videoUrl}
            onChange={(event) => setVideoUrl(event.target.value)}
            placeholder="https://www.youtube.com/embed/..."
            style={{
              width: "100%",
              padding: "10px 14px",
              marginBottom: 16,
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: "0.95rem",
              fontFamily: "monospace",
            }}
          />

          {error && (
            <p
              className="secondary-bio-text"
              style={{ color: "#b00020", marginBottom: 12 }}
            >
              {error}
            </p>
          )}
          {success && (
            <p
              className="secondary-bio-text"
              style={{ color: "#2e7d32", marginBottom: 12 }}
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="about-nav-btn"
            style={{ padding: "8px 18px" }}
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>

      {history.length > 0 && (
        <div className="admin-section-card">
          <h3
            className="secondary-bio-text"
            style={{ fontWeight: 700, marginBottom: 8 }}
          >
            Recent video URLs
          </h3>
          <p className="secondary-bio-text" style={{ marginBottom: 12 }}>
            These are the most recent URLs that were used (up to 10). Click
            &quot;Use this&quot; to copy one back into the field above.
          </p>

          <ul className="admin-history-list">
            {history.map((item) => (
              <li key={item.id} className="admin-history-item">
                <div
                  style={{
                    fontSize: "0.9rem",
                    opacity: 0.8,
                    marginBottom: 4,
                  }}
                >
                  {new Date(item.changed_at).toLocaleString()}
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.9rem",
                    wordBreak: "break-all",
                    marginBottom: 4,
                  }}
                  title={item.video_url}
                >
                  {item.video_url}
                </div>
                <button
                  type="button"
                  className="about-nav-btn"
                  style={{ padding: "4px 10px", fontSize: "0.8rem" }}
                  onClick={() => setVideoUrl(item.video_url)}
                >
                  Use this
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminShell>
  );
}

