"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "./lib/supabase";

type Mode = "login" | "signup";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let supabase;
    try {
      supabase = getSupabase();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setNotice(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    const supabase = getSupabase();
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else if (!data.session) {
        setNotice("Account created. Check your email to confirm it, then log in.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    }

    setPassword("");
    setBusy(false);
  }

  async function handleLogout() {
    setBusy(true);
    const { error } = await getSupabase().auth.signOut();
    if (error) setError(error.message);
    setEmail("");
    setBusy(false);
  }

  if (loading) {
    return (
      <main>
        <p className="muted">Loading…</p>
      </main>
    );
  }

  if (session) {
    return (
      <main>
        <h1>Study tasks</h1>
        <p className="signed-in">
          Signed in as <strong>{session.user.email}</strong>
        </p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="button" onClick={handleLogout} disabled={busy}>
          Log out
        </button>
      </main>
    );
  }

  return (
    <main>
      <h1>Study tasks</h1>
      <div className="mode-switch" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
          className={mode === "login" ? "active" : ""}
          onClick={() => switchMode("login")}
        >
          Log in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signup"}
          className={mode === "signup" ? "active" : ""}
          onClick={() => switchMode("signup")}
        >
          Sign up
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        {notice && <p className="form-notice">{notice}</p>}
        <button type="submit" disabled={busy}>
          {mode === "signup" ? "Create account" : "Log in"}
        </button>
      </form>
    </main>
  );
}
