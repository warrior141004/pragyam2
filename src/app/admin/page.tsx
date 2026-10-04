"use client";

import { useEffect, useState } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authenticated)))
      .finally(() => setChecking(false));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Incorrect password");
        return;
      }
      setAuthed(true);
    } finally {
      setLoggingIn(false);
    }
  }

  if (checking) {
    return (
      <div className="mx-auto max-w-md px-4 pb-10">
        <div className="glass h-72 animate-pulse rounded-md" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 pb-10">
        <form onSubmit={handleLogin} className="glass-strong glass-sheen tint-violet w-full animate-fade-up rounded-md p-8 sm:p-10">
          <span className="chip">
            <i className="dot bg-current text-orange" />
            Organizers
          </span>
          <h1 className="font-display mt-5 text-3xl font-bold text-ink">
            Sign <span className="font-display text-orange">in</span>
          </h1>
          <p className="mt-2 text-sm text-ink/76">Shared organizer password for the Pragyam 2.0 dashboard.</p>

          <div className="mt-8 space-y-4">
            {error && <p className="alert-error">{error}</p>}
            <input
              required
              type="password"
              placeholder="Password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-glass"
            />
            <button type="submit" disabled={loggingIn} className="btn btn-primary w-full">
              {loggingIn ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => setAuthed(false)} />;
}
