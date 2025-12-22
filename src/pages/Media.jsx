import React from "react";

// Audio tracks (UNCHANGED)
const tracks = [
  { title: "arena-y-sal", src: "/media/arena-y-sal.mp3" },
  { title: "salt-in-the-air", src: "/media/salt-in-the-air.mp3" },
  { title: "sol-na-pele", src: "/media/sol-na-pele.mp3" },
];

export default function Media() {
  return (
    <div className="page">
      <section className="hero">
        <h1>Music & Lyric Video Examples</h1>
        <p>Listen to MelodyMagic examples and see a lyric video sample.</p>
      </section>

      {/* 🎬 LYRIC VIDEO SAMPLE (SMALL & CONTROLLED) */}
      <section className="stack">
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ marginTop: 0 }}>🎬 Personalized Lyric Video Example</h3>
          <p className="muted">
            Example of a personalized lyric video — available for <strong>$20</strong>
          </p>

          <video
            controls
            playsInline
            preload="metadata"
            style={{
              width: "100%",
              maxWidth: 360,   // ✅ keeps it small
              borderRadius: 12,
              margin: "12px auto 0",
              display: "block",
              background: "#000",
            }}
          >
            {/* URL-encoded because filename has space + parentheses */}
            <source src="/media/1222%20(1).mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* 🎧 AUDIO EXAMPLES (UNCHANGED) */}
      <div className="stack">
        {tracks.map((t) => (
          <div className="card" key={t.title}>
            <strong>{t.title}</strong>
            <audio controls preload="none" style={{ width: "100%", marginTop: 10 }}>
              <source src={t.src} />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
}
