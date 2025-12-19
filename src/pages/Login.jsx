import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { isAdminEmail } from "../lib/admin.js";

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });

      if (error) throw error;

      const email = data?.user?.email;
      const ok = await isAdminEmail(email);

      if (!ok) {
        await supabase.auth.signOut();
        setMsg("This account is not authorized for Admin.");
        return;
      }

      nav("/admin");
    } catch (err) {
      setMsg(err?.message || "Login failed");
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

        <p className="muted tiny" style={{ marginTop: 10 }}>
          Admin access is controlled by the Supabase <code>admin_users</code> allowlist.
        </p>
      </form>
    </div>
  );
}
