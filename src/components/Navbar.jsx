import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { isAdminEmail } from "../lib/admin.js";

const BUSINESS_WHATSAPP = "17543669922"; // +1 + number

export default function Navbar() {
  const nav = useNavigate();
  const [auth, setAuth] = useState({ loading: true, user: null, isAdmin: false });

  const openWhatsApp = () => {
    const msg = encodeURIComponent("Hi! I want to order a MelodyMagic song 🙂");
    window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${msg}`, "_blank");
  };

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data } = await supabase.auth.getUser();
      const user = data?.user || null;

      let admin = false;
      if (user?.email) admin = await isAdminEmail(user.email);

      if (mounted) setAuth({ loading: false, user, isAdmin: admin });
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user || null;
      let admin = false;
      if (user?.email) admin = await isAdminEmail(user.email);
      setAuth({ loading: false, user, isAdmin: admin });
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    nav("/");
  };

  return (
    <header className="nav">
      <div className="nav__inner">
        <NavLink to="/" className="brand">
          <span className="brand__logo">♪</span>
          <span className="brand__text">MelodyMagic</span>
        </NavLink>

        <nav className="nav__links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "link active" : "link")}>
            Order
          </NavLink>

          <NavLink to="/media" className={({ isActive }) => (isActive ? "link active" : "link")}>
            Music Examples
          </NavLink>

          <button className="link link--button" onClick={openWhatsApp}>
            Contact (WhatsApp)
          </button>

          {!auth.loading && !auth.user && (
            <NavLink to="/login" className={({ isActive }) => (isActive ? "link active" : "link")}>
              Admin Login
            </NavLink>
          )}

          {!auth.loading && auth.user && auth.isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? "link active" : "link")}>
              Admin
            </NavLink>
          )}

          {!auth.loading && auth.user && (
            <button className="link link--button" onClick={logout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
