import React from "react";

// Audio tracks (UNCHANGED)
const tracks = [
  { title: "arena-y-sal", src: "/media/arena-y-sal.mp3" },
  { title: "salt-in-the-air", src: "/media/salt-in-the-air.mp3" },
  { title: "sol-na-pele", src: "/media/sol-na-pele.mp3" },
];

export default function Media() {
  const drivePreviewUrl =
    "https://drive.google.com/file/d/1LHwU4C8B73iH9iwWzbi37SkMa-fMVayy/preview";

  return (
    <div className="page">
      <section className="hero">
        <h1>Music & Lyric Video Examples</h1>
        <p>Listen to MelodyMagic examples and watch a lyric video sample.</p>
      </section>

      {/* 🎬 LYRIC VIDEO SAMPLE (SMALL + MOBILE FRIENDLY) */}
      <section className="stack">
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ marginTop: 0 }}>🎬 Personalized Lyric Video Example</h3>
          <p className="muted">
            Example of a personalized lyric video — available for <strong>$20</strong>
          </p>

          {/* Responsive embed box */}
          <div
            style={{
              maxWidth: 360,
              margin: "12px auto 0",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ position: "relative", paddingTop: "177.78%" }}>
              {/* 9:16 aspect ratio (vertical) */}
              <iframe
                src={drivePreviewUrl}
                title="Lyric Video Example"
                allow="autoplay"
                allowFullScreen
                loading="lazy"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <a
              className="btn btn--ghost"
              href="https://drive.google.com/file/d/1LHwU4C8B73iH9iwWzbi37SkMa-fMVayy/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Open video in Google Drive
            </a>
          </div>
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
