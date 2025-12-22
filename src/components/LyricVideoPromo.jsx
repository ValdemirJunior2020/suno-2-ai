// src/components/LyricVideoPromo.jsx
import React from "react";

const BUSINESS_WHATSAPP = "7543669922";

export default function LyricVideoPromo({ selectedPkgId, onSelect }) {
  const waLink = `https://wa.me/1${BUSINESS_WHATSAPP}`;

  const pick = (id) => (e) => {
    e.preventDefault();
    onSelect?.(id);
  };

  const btnStyle = (active) => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "none",
    backgroundColor: active ? "#16a34a" : "#1e3a8a", // green / dark blue
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    touchAction: "manipulation",
  });

  return (
    <div style={{ display: "grid", gap: 14, marginBottom: 18 }}>
      {/* $10 SONG */}
      <div className="card" style={{ padding: 14 }}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>
          🎵 Personalized Song — <strong>$10</strong>
        </h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Audio-only personalized song with your dedication.
        </p>

        <button
          type="button"
          style={btnStyle(selectedPkgId === "standard")}
          onClick={pick("standard")}
          onPointerUp={pick("standard")}
          onTouchEnd={pick("standard")}
        >
          {selectedPkgId === "standard" ? "✔ Song Selected" : "Pick Song ($10)"}
        </button>

        <a
          className="btn btn--ghost"
          href={waLink}
          target="_blank"
          rel="noreferrer"
          style={{ display: "block", marginTop: 10, textAlign: "center" }}
        >
          Order via WhatsApp: {BUSINESS_WHATSAPP}
        </a>
      </div>

      {/* $20 VIDEO */}
      <div className="card" style={{ padding: 14 }}>
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>
          🎬 Personalized Lyric Video — <strong>$20</strong>
        </h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Lyrics synchronized on a video — perfect for sharing.
        </p>

        <div style={{ margin: "10px 0" }}>
          <img
            src="/media/video.jpeg"
            alt="Personalized Lyric Video"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 12,
              display: "block",
            }}
          />
        </div>

        <button
          type="button"
          style={btnStyle(selectedPkgId === "video")}
          onClick={pick("video")}
          onPointerUp={pick("video")}
          onTouchEnd={pick("video")}
        >
          {selectedPkgId === "video" ? "✔ Video Selected" : "Pick Video ($20)"}
        </button>

        <a
          className="btn btn--ghost"
          href={waLink}
          target="_blank"
          rel="noreferrer"
          style={{ display: "block", marginTop: 10, textAlign: "center" }}
        >
          Order via WhatsApp: {BUSINESS_WHATSAPP}
        </a>
      </div>
    </div>
  );
}
