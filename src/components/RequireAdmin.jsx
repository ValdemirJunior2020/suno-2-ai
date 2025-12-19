import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { isAdminEmail } from "../lib/admin.js";

export default function RequireAdmin({ children }) {
  const [state, setState] = useState({ loading: true, ok: false });

  useEffect(() => {
    let mounted = true;

    async function run() {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user?.email) {
        if (mounted) setState({ loading: false, ok: false });
        return;
      }

      const ok = await isAdminEmail(user.email);
      if (mounted) setState({ loading: false, ok });
    }

    run();

    return () => {
      mounted = false;
    };
  }, []);

  if (state.loading) {
    return (
      <div className="card">
        <strong>Checking admin access…</strong>
        <div className="muted">Please wait.</div>
      </div>
    );
  }

  if (!state.ok) return <Navigate to="/login" replace />;

  return children;
}
