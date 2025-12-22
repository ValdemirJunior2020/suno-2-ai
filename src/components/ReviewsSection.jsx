import React, { useMemo, useState } from "react";

function Star({ filled }) {
  return (
    <span className={filled ? "star star--filled" : "star"} aria-hidden="true">
      ★
    </span>
  );
}

function StarsRow({ value }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <div className="stars" aria-label={`${v} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} filled={i <= v} />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const initial = useMemo(
    () => [
      { name: "Amanda R.", rating: 5, text: "Amazing service and super fast delivery!" },
      { name: "Carlos M.", rating: 5, text: "Beautiful dedication song. My family loved it!" },
      { name: "Bruna S.", rating: 5, text: "High quality and great communication on WhatsApp." },
    ],
    []
  );

  const [reviews, setReviews] = useState(initial);
  const [form, setForm] = useState({ name: "", rating: 5, text: "" });
  const [msg, setMsg] = useState("");

  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((a, r) => a + (Number(r.rating) || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setMsg("");

    const name = form.name.trim();
    const text = form.text.trim();
    const rating = Number(form.rating) || 5;

    if (!name || !text) {
      setMsg("Please add your name and review text.");
      return;
    }

    setReviews((prev) => [{ name, rating, text }, ...prev]);
    setForm({ name: "", rating: 5, text: "" });
    setMsg("Thank you! Your review was added.");
  };

  return (
    <section id="reviews" className="section">
      <div className="section__head">
        <h2>Customer Reviews</h2>
        <p className="muted">
          Rated <strong>{avg}</strong>/5 by {reviews.length} customers
        </p>
        <StarsRow value={Math.round(avg)} />
      </div>

      <div className="reviews-grid">
        {reviews.map((r, idx) => (
          <article className="card review" key={`${r.name}-${idx}`}>
            <div className="review__top">
              <div className="review__name">{r.name}</div>
              <StarsRow value={r.rating} />
            </div>
            <p className="review__text">“{r.text}”</p>
          </article>
        ))}
      </div>

      <div className="card review-form">
        <h3>Leave a Review</h3>

        {msg && <div className="note">{msg}</div>}

        <form onSubmit={submit} className="form">
          <div className="grid">
            <div className="field">
              <label>Your name</label>
              <input value={form.name} onChange={update("name")} placeholder="John / Maria..." />
            </div>

            <div className="field">
              <label>Rating</label>
              <select value={form.rating} onChange={update("rating")}>
                <option value={5}>★★★★★ (5)</option>
                <option value={4}>★★★★☆ (4)</option>
                <option value={3}>★★★☆☆ (3)</option>
                <option value={2}>★★☆☆☆ (2)</option>
                <option value={1}>★☆☆☆☆ (1)</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Your review</label>
            <textarea
              value={form.text}
              onChange={update("text")}
              rows={4}
              placeholder="Tell us how your song/video came out…"
            />
          </div>

          <button className="btn" type="submit">
            Submit Review
          </button>

          <p className="muted tiny" style={{ marginTop: 10 }}>
            (For now, reviews are stored locally. Next we can save them to Supabase.)
          </p>
        </form>
      </div>
    </section>
  );
}
