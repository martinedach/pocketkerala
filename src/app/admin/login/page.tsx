"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/admin");
  };

  return (
    <main
      className="kerala-main"
      style={{
        maxWidth: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <section
        className="announcement-section"
        style={{ maxWidth: 420, width: "100%" }}
      >
        <h2 className="milestone-title">Pocket Kerala admin</h2>
        <p className="secondary-bio-text">
          Sign in with your admin email and password.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ textAlign: "left", marginTop: 20 }}
        >
          <label
            className="secondary-bio-text"
            style={{ display: "block", marginBottom: 8 }}
          >
            Email
          </label>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              marginBottom: 16,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />

          <label
            className="secondary-bio-text"
            style={{ display: "block", marginBottom: 8 }}
          >
            Password
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={{
              width: "100%",
              padding: "8px 10px",
              marginBottom: 16,
              borderRadius: 4,
              border: "1px solid #ccc",
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

          <button
            type="submit"
            disabled={submitting}
            className="about-nav-btn"
            style={{ padding: "8px 18px", width: "100%", marginTop: 4 }}
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}

