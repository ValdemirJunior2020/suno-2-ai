// src/components/LyricVideoPromo.jsx
import React from "react";

const BUSINESS_WHATSAPP = "7543669922";

/**
 * Promo component that shows BOTH products:
 * - Personalized Song ($10)
 * - Personalized Lyric Video ($20)
 *
 * Props:
 * - selectedPkgId: string (current selected package id)
 * - onSelect: (pkgId: string) => void
 */
export default function LyricVideoPromo({ selectedPkgId, onSelect }) {
  const waLink = `https://wa.me/1${BUSINESS_WHATSAPP}`;

  const btnStyle = (active) => ({
    backgroundColor: active ? "#16a34a" : "#1e3a8a", // green / dark blue
    color: "#ffffff",
    border: "none",
    transition: "background-color 0.25s ease",
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
  });

  const cardStyle = {
    padding: 16,
    borderRadius: 16,
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 16,
        marginBottom: 16,
      }}
    >
      {/* SONG $10 */}
      <div className="card" style={cardStyle}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>
          🎵 Personalized Song — <span style={{ fontWeight: 800 }}>$10</span>
        </h2>

        <p className="muted" style={{ marginTop: 0 }}>
          A personalized song (audio only). Perfect for gifts, birthdays, anniversaries, and
          motivation.
        </p>

        <ul style={{ marginTop: 10, marginBottom: 14, paddingLeft: 18 }}>
          <li>Custom lyrics + dedication</li>
          <li>Choose style, mood, and language</li>
          <li>Delivered via WhatsApp link</li>
        </ul>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            style={btnStyle(selectedPkgId === "standard")}
            onClick={() => onSelect?.("standard")}
          >
            {selectedPkgId === "standard" ? "✔ Song Selected" : "Choose Song ($10)"}
          </button>

          <a
            className="btn btn--ghost"
            href={waLink}
            target="_blank"
            rel="noreferrer"
            style={{ alignSelf: "center" }}
          >
            Order via WhatsApp
          </a>
        </div>
      </div>

      {/* LYRIC VIDEO $20 */}
      <div className="card" style={cardStyle}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>
          🎬 Personalized Lyric Video — <span style={{ fontWeight: 800 }}>$20</span>
        </h2>

        <p className="muted" style={{ marginTop: 0 }}>
          Personalized lyric video with synced lyrics — great for sharing on WhatsApp and social
          media.
        </p>

        <div style={{ marginTop: 12, marginBottom: 12 }}>
          <img
            src="/media/video.jpeg"
            alt="Personalized Lyric Video"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 14,
              display: "block",
            }}
          />
        </div>

        <ul style={{ marginTop: 10, marginBottom: 14, paddingLeft: 18 }}>
          <li>Lyrics synced to the song</li>
          <li>Personalized dedication included</li>
          <li>Delivered via WhatsApp link</li>
        </ul>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            style={btnStyle(selectedPkgId === "video")}
            onClick={() => onSelect?.("video")}
          >
            {selectedPkgId === "video" ? "✔ Lyric Video Selected" : "Choose Lyric Video ($20)"}
          </button>

          <a
            className="btn btn--ghost"
            href={waLink}
            target="_blank"
            rel="noreferrer"
            style={{ alignSelf: "center" }}
          >
            Order via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
