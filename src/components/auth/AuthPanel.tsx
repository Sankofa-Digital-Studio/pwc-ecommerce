"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import "./auth-panel.css";

type AuthMode = "sign-in" | "sign-up" | "reset" | "update-password";
const modeCopy: Record<AuthMode, { eyebrow: string; title: string; description: string; submit: string }> = {
  "sign-in": { eyebrow: "Welcome back", title: "Return to your rituals.", description: "Sign in to keep your saved products and account details together.", submit: "Sign in" },
  "sign-up": { eyebrow: "A considered beginning", title: "Create your Phekong space.", description: "Use your email to create a secure customer account. We will verify it before access is granted.", submit: "Create account" },
  reset: { eyebrow: "A gentle reset", title: "Recover your access.", description: "Enter your account email and we will send a secure password reset link.", submit: "Send reset link" },
  "update-password": { eyebrow: "New beginning", title: "Choose a new password.", description: "Set a new password for your Phekong account.", submit: "Update password" },
};

export function AuthPanel() {
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    let subscription: { unsubscribe: () => void } | undefined;
    try {
      const supabase = getSupabaseBrowserClient();
      void supabase.auth.getSession().then(({ data }) => { if (active) setUser(data.session?.user ?? null); });
      const authState = supabase.auth.onAuthStateChange((_event, session) => { if (active) setUser(session?.user ?? null); });
      subscription = authState.data.subscription;
    } catch (caught) {
      if (active) setError(caught instanceof Error ? caught.message : "Authentication is not configured.");
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "1") setMessage("Your email is verified. You can now sign in.");
    if (window.location.hash.includes("type=recovery")) {
      setMode("update-password");
      setMessage("Choose a new password to finish recovery.");
    }
    return () => { active = false; subscription?.unsubscribe(); };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const supabase = getSupabaseBrowserClient();
      if (mode === "sign-in") {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;
        setMessage("You are signed in.");
      } else if (mode === "sign-up") {
        const result = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin + "/account?verified=1" },
        });
        if (result.error) throw result.error;
        setMessage("Check your email to verify your account before signing in.");
      } else if (mode === "reset") {
        const result = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/account" });
        if (result.error) throw result.error;
        setMessage("If an account exists for that email, a reset link is on its way.");
      } else {
        const result = await supabase.auth.updateUser({ password });
        if (result.error) throw result.error;
        setMessage("Your password has been updated. You can continue securely.");
        window.history.replaceState({}, "", "/account");
        setMode("sign-in");
        setPassword("");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    setError("");
    const result = await getSupabaseBrowserClient().auth.signOut();
    if (result.error) setError(result.error.message);
    else setMessage("You are signed out.");
    setBusy(false);
  }

  if (user) {
    return (
      <section className="auth-panel" aria-labelledby="account-title">
        <div className="auth-panel__intro">
          <p className="auth-panel__eyebrow">Your space</p>
          <h1 id="account-title">Welcome back{user.user_metadata.full_name ? ", " + user.user_metadata.full_name : ""}.</h1>
          <p>Your account is ready. Booking and commerce capabilities will connect to this identity in their own milestones.</p>
        </div>
        <div className="auth-panel__signed-in">
          <span className="auth-panel__status" aria-hidden="true">✓</span>
          <div><strong>{user.email}</strong><p>Email verified and signed in.</p></div>
        </div>
        {message && <p className="auth-panel__message" role="status">{message}</p>}
        <button className="auth-panel__button" type="button" onClick={signOut} disabled={busy}>{busy ? "Signing out…" : "Sign out"}</button>
      </section>
    );
  }

  const copy = modeCopy[mode];
  return (
    <section className="auth-panel" aria-labelledby="account-title">
      <div className="auth-panel__intro">
        <p className="auth-panel__eyebrow">{copy.eyebrow}</p>
        <h1 id="account-title">{copy.title}</h1>
        <p>{copy.description}</p>
      </div>
      <form className="auth-panel__form" onSubmit={submit}>
        {mode === "sign-up" && <label>Full name<input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" /></label>}
        {mode !== "update-password" && <label>Email address<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></label>}
        {mode !== "reset" && <label>{mode === "update-password" ? "New password" : "Password"}<input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "sign-in" ? "current-password" : "new-password"} /></label>}
        {error && <p className="auth-panel__error" role="alert">{error}</p>}
        {message && <p className="auth-panel__message" role="status">{message}</p>}
        <button className="auth-panel__button" type="submit" disabled={busy}>{busy ? "One moment…" : copy.submit}</button>
      </form>
      <nav className="auth-panel__links" aria-label="Account actions">
        {mode === "sign-in" && <>
          <button type="button" onClick={() => { setMode("sign-up"); setMessage(""); setError(""); }}>Create an account</button>
          <button type="button" onClick={() => { setMode("reset"); setMessage(""); setError(""); }}>Forgot password?</button>
        </>}
        {mode !== "sign-in" && mode !== "update-password" && <button type="button" onClick={() => { setMode("sign-in"); setMessage(""); setError(""); }}>Back to sign in</button>}
      </nav>
    </section>
  );
}
