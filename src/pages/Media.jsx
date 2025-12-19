import React from "react";

// If your files are .wav or .m4a, change the extensions here to match.
const tracks = [
  { title: "arena-y-sal", src: "/media/arena-y-sal.mp3" },
  { title: "salt-in-the-air", src: "/media/salt-in-the-air.mp3" },
  { title: "sol-na-pele", src: "/media/sol-na-pele.mp3" },
];

export default function Media() {
  return (
    <div className="page">
      <section className="hero">
        <h1>Music Examples</h1>
        <p>Listen to a few MelodyMagic examples below.</p>
      </section>

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
