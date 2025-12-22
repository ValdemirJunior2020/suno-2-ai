import React, { useMemo, useState } from "react";
import {
  PACKAGES,
  DEFAULT_PACKAGE_ID,
  getPackageById,
} from "../lib/packages";

import PayPalCheckout from "../components/PayPalCheckout";
import LyricVideoPromo from "../components/LyricVideoPromo";

export default function Home() {
  const [pkgId, setPkgId] = useState(DEFAULT_PACKAGE_ID);

  const pkg = useMemo(() => getPackageById(pkgId), [pkgId]);

  // Order fields (match your Supabase columns)
  const [payerEmail, setPayerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [occasion, setOccasion] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [dedication, setDedication] = useState("");
  const [musicStyle, setMusicStyle] = useState("");
  const [mood, setMood] = useState("");
  const [languages, setLanguages] = useState("English");
  const [whatsapp, setWhatsapp] = useState("7543669922");

  // Optional: status field before payment
  const [status, setStatus] = useState("pending");

  const orderDraft = useMemo(
    () => ({
      package: pkg.label,         // saves friendly label
      priceUSD: pkg.priceUSD,      // numeric
      payerEmail,
      customerName,
      customerPhone,
      status,
      occasion,
      recipientName,
      relationship,
      dedication,
      musicStyle,
      mood,
      languages,
      whatsapp,
    }),
    [
      pkg,
      payerEmail,
      customerName,
      customerPhone,
      status,
      occasion,
      recipientName,
      relationship,
      dedication,
      musicStyle,
      mood,
      languages,
      whatsapp,
    ]
  );

  return (
    <div className="page">
      <section className="hero">
        <h1>Order a Personalized AI Song</h1>
        <p>
          Fill the details below, then pay to submit your order.
          <br />
          <strong>NEW:</strong> Personalized Lyric Videos are available for <strong>$20</strong>.
        </p>
      </section>

      {/* Promo card (your image component) */}
      <LyricVideoPromo onChooseVideo={() => setPkgId("video")} />


      <div className="stack">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Order Details</h2>

          <label className="label">
            Package
            <select
              className="input"
              value={pkgId}
              onChange={(e) => setPkgId(e.target.value)}
            >
              {PACKAGES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <p className="muted" style={{ marginTop: 8 }}>
            {pkg.description}
          </p>

          <div className="grid">
            <label className="label">
              Your Email (payer)
              <input
                className="input"
                value={payerEmail}
                onChange={(e) => setPayerEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </label>

            <label className="label">
              Your Name
              <input
                className="input"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your full name"
              />
            </label>

            <label className="label">
              Phone (WhatsApp preferred)
              <input
                className="input"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="(754) 366-9922"
              />
            </label>

            <label className="label">
              Occasion
              <input
                className="input"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="Birthday, Anniversary, Wedding..."
              />
            </label>

            <label className="label">
              Recipient Name
              <input
                className="input"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Who is this for?"
              />
            </label>

            <label className="label">
              Relationship
              <input
                className="input"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="Wife, Husband, Mom, Friend..."
              />
            </label>
          </div>

          <label className="label">
            Dedication (message you want in the song/video)
            <textarea
              className="input"
              value={dedication}
              onChange={(e) => setDedication(e.target.value)}
              placeholder="Write the dedication here..."
              rows={4}
            />
          </label>

          <div className="grid">
            <label className="label">
              Music Style
              <input
                className="input"
                value={musicStyle}
                onChange={(e) => setMusicStyle(e.target.value)}
                placeholder="Sertanejo, Gospel, Hip-Hop..."
              />
            </label>

            <label className="label">
              Mood
              <input
                className="input"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="Romantic, Happy, Emotional..."
              />
            </label>

            <label className="label">
              Language
              <select
                className="input"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
              >
                <option>English</option>
                <option>Português</option>
                <option>Español</option>
                <option>Français</option>
              </select>
            </label>

            <label className="label">
              WhatsApp to contact you
              <input
                className="input"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="7543669922"
              />
            </label>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Payment</h2>
          <p className="muted">
            You will be charged <strong>${pkg.priceUSD.toFixed(2)}</strong>. After
            payment approval, your order is saved automatically.
          </p>

          <PayPalCheckout
            amount={pkg.priceUSD}
            orderDraft={orderDraft}
            onStatusChange={(s) => setStatus(s)}
          />
        </div>
      </div>
    </div>
  );
}
