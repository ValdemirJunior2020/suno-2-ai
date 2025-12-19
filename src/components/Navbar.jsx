import React from "react";
import { NavLink } from "react-router-dom";
import GoogleTranslate from "./GoogleTranslate";

const WHATSAPP = "17543669922";

export default function Navbar() {
  const openWhatsApp = () => {
    const msg = encodeURIComponent(
      "Hi! I want to order a personalized MelodyMagic song 🎶"
    );
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank");
  };

  return (
    <header className="nav">
      <div className="nav__inner">
        <NavLink to="/" className="brand">
          <span className="brand__logo">🎵</span>
          <span className="brand__text">MelodyMagic</span>
        </NavLink>

        <nav className="nav__links">
          <NavLink to="/" className="link">
            Order
          </NavLink>

          <NavLink to="/media" className="link">
            Music Examples
          </NavLink>

          <button className="link link--button" onClick={openWhatsApp}>
            Contact (WhatsApp)
          </button>

          <NavLink to="/login" className="link">
            Admin
          </NavLink>

          {/* 🌐 Google Translate */}
          <GoogleTranslate />
        </nav>
      </div>
    </header>
  );
}
