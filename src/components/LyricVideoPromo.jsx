import React from "react";

const BUSINESS_WHATSAPP = "7543669922";

export default function LyricVideoPromo({ onChooseVideo }) {
  const waLink = `https://wa.me/1${BUSINESS_WHATSAPP}`;

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>
            🎬 Personalized Lyric Video — <span style={{ fontWeight: 800 }}>$20</span>
          </h2>

          <p className="muted" style={{ marginTop: 0 }}>
            Your lyrics synchronized on a beautiful video — perfect for gifts, birthdays,
            anniversaries, and special moments.
          </p>

          <ul style={{ marginTop: 10, marginBottom: 14, paddingLeft: 18 }}>
            <li>Lyrics synced to the song</li>
            <li>Personalized dedication included</li>
            <li>Delivered via WhatsApp link</li>
          </ul>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn"
              onClick={() => onChooseVideo?.()}
            >
              Choose Lyric Video ($20)
            </button>

            <a className="btn btn--ghost" href={waLink} target="_blank" rel="noreferrer">
              Order via WhatsApp: {BUSINESS_WHATSAPP}
            </a>
          </div>
        </div>

        <div>
          <img
            src="/media/video.jpeg"
            alt="MelodyMagic Personalized Lyric Video"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 14,
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}
