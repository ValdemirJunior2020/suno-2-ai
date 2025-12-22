import React from "react";

const tracks = [
  { title: "arena-y-sal", src: "/media/arena-y-sal.mp3" },
  { title: "salt-in-the-air", src: "/media/salt-in-the-air.mp3" },
  { title: "sol-na-pele", src: "/media/sol-na-pele.mp3" },
];

// Cloudinary hosted video (works on Netlify)
const lyricVideoUrl =
  "https://res.cloudinary.com/review-site/video/upload/1222-1_I1pv2DPX_ubkskx.mp4?_s=vp-3.5.2";

export default function Media() {
  return (
    <div className="page">
      <section className="hero">
        <h1>Music & Video Examples</h1>
        <p>Listen to a few MelodyMagic examples below.</p>
      </section>

      {/* Keep your audios intact */}
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

      {/* Add video example (small, not huge) */}
      <div className="card" style={{ marginTop: 14 }}>
        <h2 style={{ marginTop: 0 }}>Lyric Video Example</h2>
        <p className="muted">
          This is an example of our <strong>Personalized Lyric Video ($20)</strong>.
        </p>

        <div className="videoFrame">
          <video
            controls
            preload="metadata"
            playsInline
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <source src={lyricVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
