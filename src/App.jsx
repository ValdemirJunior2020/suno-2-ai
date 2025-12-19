import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Media from "./pages/Media.jsx";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";

export default function App() {
  return (
    <div className="app">
      <div className="bg" aria-hidden="true" />
      <Navbar />

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/media" element={<Media />} />
          <Route path="/login" element={<Login />} />

          {/* Admin is protected */}
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
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <span>© {new Date().getFullYear()} MelodyMagic</span>
          <span className="dot" />
          <span>WhatsApp: 754-366-9922</span>
        </div>
      </footer>
    </div>
  );
}
