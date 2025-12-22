import React from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Media from "./pages/Media.jsx";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";
import Success from "./pages/Success.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/media" element={<Media />} />
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<Success />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

function AppShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const goHomeAndScroll = (id) => {
    // If we are already on home, just scroll.
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // If we're on another route, navigate home with a hash and scroll after paint.
    navigate(`/#${id}`);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
  };

  const openWhatsApp = () => {
    const msg = encodeURIComponent("Hi MelodyMagic! 🎶 I want to place an order.");
    window.open(`https://wa.me/17543669922?text=${msg}`, "_blank");
  };

  return (
    <div className="app">
      <div className="bg" aria-hidden="true" />
      <Navbar />

      {/* Make layout support footer at bottom */}
      <main className="container" style={{ flex: 1 }}>
        {children}
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <span>© {new Date().getFullYear()} MelodyMagic</span>
          <span className="dot" />

          {/* Scroll links */}
          <button
            type="button"
            className="footer__link"
            onClick={() => goHomeAndScroll("order")}
          >
            Order
          </button>

          <span className="dot" />

          <button
            type="button"
            className="footer__link"
            onClick={() => goHomeAndScroll("reviews")}
          >
            Reviews ⭐
          </button>

          <span className="dot" />

          <button type="button" className="footer__link" onClick={openWhatsApp}>
            WhatsApp: 754-366-9922
          </button>
        </div>
      </footer>
    </div>
  );
}
