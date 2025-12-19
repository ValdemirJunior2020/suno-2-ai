import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { isAdminEmail } from "../lib/admin.js";

function withTimeout(promise, ms = 12000) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Timeout: Supabase not responding")), ms);
    promise
      .then((v) => {
        clearTimeout(t);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(t);
        reject(e);
      });
  });
}

export default function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const canSubmit = useMemo(() => {
    return form.email.trim() && form.password.trim();
  }, [form]);

  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({
          email: form.email.trim(),
          password: form.password,
        }),
        12000
      );

      if (error) throw error;

      const email = data?.user?.email;
      const ok = await withTimeout(isAdminEmail(email), 12000);

      if (!ok) {
        await supabase.auth.signOut();
        setMsg("This account is not authorized for Admin (not in admin_users).");
        return;
      }

      nav("/admin");
    } catch (err) {
      console.error("Login failed:", err);
      setMsg(
        err?.message ||
          "Login failed. Check Supabase URL/Anon Key and that this user exists in Supabase Auth."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <h1>Admin Login</h1>
        <p className="muted">Log in to view orders and export Excel.</p>
      </section>

      {msg && (
        <div className="card card--error">
          <strong>⚠️ {msg}</strong>
          <div className="muted tiny" style={{ marginTop: 8 }}>
            If you see a timeout, your Supabase env variables are wrong or Vite needs a restart.
          </div>
        </div>
      )}

      <form className="card form" onSubmit={onSubmit}>
        <h2>Sign In</h2>

        <div className="grid">
          <div className="field">
            <label>Email</label>
            <input
              value={form.email}
              onChange={update("email")}
              placeholder="you@email.com"
              inputMode="email"
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              value={form.password}
              onChange={update("password")}
              placeholder="Your password"
              type="password"
              autoComplete="current-password"
            />
          </div>
        </div>

        <button className="btn" disabled={!canSubmit || loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
