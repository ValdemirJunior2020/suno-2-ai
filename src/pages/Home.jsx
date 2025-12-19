import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import PayPalCheckout from "../components/PayPalCheckout.jsx";

const BUSINESS_WHATSAPP = "7543669922";
const PACKAGE_DEFAULT = { name: "Standard", priceUSD: 10 };

const OCCASIONS = [
  "Birthday","Anniversary","Christmas","Wedding","Mother's Day","Father's Day","Graduation","Apology","Motivation","Other",
];

const MOODS = ["Happy / Celebration","Romantic","Emotional","Funny","Motivational","Chill","Other"];

const MUSIC_STYLES = [
  "Pop","Sertanejo","Forró","Pagode","Gospel","Hip-Hop / Rap","Rock","Reggaeton","Afrobeat","EDM","Lo-fi","Other",
];

const LANGUAGES = ["English","Português","Español","Français","Other"];

function normalizeChoice(choice, otherText) {
  if (choice !== "Other") return choice;
  return (otherText || "").trim() || "Other";
}

export default function Home() {
  const nav = useNavigate();

  const [step, setStep] = useState(1); // 1=form, 2=pay
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    payerEmail: "",
    occasion: "Birthday",
    occasionOther: "",
    recipientName: "",
    relationship: "",
    dedication: "",
    musicStyle: "Pop",
    musicStyleOther: "",
    mood: "Happy / Celebration",
    moodOther: "",
    languages: "English",
    languagesOther: "",
    whatsapp: BUSINESS_WHATSAPP,
  });

  const requiredOk = useMemo(() => {
    return (
      form.customerName.trim() &&
      form.customerPhone.trim() &&
      form.recipientName.trim() &&
      form.relationship.trim() &&
      form.dedication.trim()
    );
  }, [form]);

  // snake_case keys to match Supabase columns
  const payload = useMemo(() => {
    return {
      package: PACKAGE_DEFAULT.name,
      price_usd: PACKAGE_DEFAULT.priceUSD,
      payer_email: (form.payerEmail || "").trim() || null,
      customer_name: form.customerName.trim(),
      customer_phone: form.customerPhone.trim(),
      status: "paid",
      occasion: normalizeChoice(form.occasion, form.occasionOther),
      recipient_name: form.recipientName.trim(),
      relationship: form.relationship.trim(),
      dedication: form.dedication.trim(),
      music_style: normalizeChoice(form.musicStyle, form.musicStyleOther),
      mood: normalizeChoice(form.mood, form.moodOther),
      languages: normalizeChoice(form.languages, form.languagesOther),
      whatsapp: (form.whatsapp || "").trim() || BUSINESS_WHATSAPP,
    };
  }, [form]);

  const update = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const goPay = (e) => {
    e.preventDefault();
    setError("");
    if (!requiredOk) {
      setError("Please fill all required fields.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToForm = () => {
    setStep(1);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const savePaidOrder = async ({ details }) => {
    setError("");
    setLoadingSave(true);

    try {
      const payerEmail = payload.payer_email || details?.payer?.email_address || null;

      const { data, error: supaErr } = await supabase
        .from("orders")
        .insert([{ ...payload, payer_email: payerEmail, status: "paid" }])
        .select("order_id")
        .single();

      if (supaErr) throw supaErr;

      // Go to success page with order id
      nav("/success", { state: { orderId: data.order_id } });
    } catch (err) {
      // Make the error visible (mobile)
      setError(err?.message || "Payment succeeded but saving failed.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Also log details for debugging
      // eslint-disable-next-line no-console
      console.error("Save order failed:", err);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <h1>Order a Personalized AI Song</h1>
        <p>Fill the details, then pay to submit your order.</p>

        <div className="hero__pill">
          <span className="pill__label">Package</span>
          <span className="pill__value">
            {PACKAGE_DEFAULT.name} — ${PACKAGE_DEFAULT.priceUSD} (2 versions)
          </span>
        </div>
      </section>

      {error && (
        <div className="card card--error">
          <strong>⚠️ {error}</strong>
          <div className="muted tiny" style={{ marginTop: 8 }}>
            If you paid and still see this, it means PayPal captured but Supabase save failed (RLS/columns).
            Open Admin after login to confirm.
          </div>
        </div>
      )}

      {step === 1 && (
        <form className="card form" onSubmit={goPay}>
          <h2>Order Details</h2>

          <div className="grid">
            <div className="field">
              <label>Your Name <span className="req">*</span></label>
              <input value={form.customerName} onChange={update("customerName")} placeholder="Ex: Junior" />
            </div>

            <div className="field">
              <label>Your Phone <span className="req">*</span></label>
              <input value={form.customerPhone} onChange={update("customerPhone")} placeholder="Ex: 7543669922" />
            </div>

            <div className="field">
              <label>Payer Email (optional)</label>
              <input value={form.payerEmail} onChange={update("payerEmail")} placeholder="Ex: you@email.com" />
            </div>

            <div className="field">
              <label>Occasion</label>
              <select value={form.occasion} onChange={update("occasion")}>
                {OCCASIONS.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
              {form.occasion === "Other" && (
                <input value={form.occasionOther} onChange={update("occasionOther")} placeholder="Type the occasion..." />
              )}
            </div>

            <div className="field">
              <label>Recipient Name <span className="req">*</span></label>
              <input value={form.recipientName} onChange={update("recipientName")} placeholder="Who is this song for?" />
            </div>

            <div className="field">
              <label>Relationship <span className="req">*</span></label>
              <input value={form.relationship} onChange={update("relationship")} placeholder="Ex: Mom, Dad, Friend..." />
            </div>

            <div className="field">
              <label>Music Style</label>
              <select value={form.musicStyle} onChange={update("musicStyle")}>
                {MUSIC_STYLES.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
              {form.musicStyle === "Other" && (
                <input value={form.musicStyleOther} onChange={update("musicStyleOther")} placeholder="Type the music style..." />
              )}
            </div>

            <div className="field">
              <label>Mood</label>
              <select value={form.mood} onChange={update("mood")}>
                {MOODS.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
              {form.mood === "Other" && (
                <input value={form.moodOther} onChange={update("moodOther")} placeholder="Type the mood..." />
              )}
            </div>

            <div className="field">
              <label>Language</label>
              <select value={form.languages} onChange={update("languages")}>
                {LANGUAGES.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
              {form.languages === "Other" && (
                <input value={form.languagesOther} onChange={update("languagesOther")} placeholder="Type the language..." />
              )}
            </div>

            <div className="field field--full">
              <label>Dedication / Message <span className="req">*</span></label>
              <textarea
                value={form.dedication}
                onChange={update("dedication")}
                rows={6}
                placeholder="Write what you want the song to say..."
              />
            </div>

            <div className="field">
              <label>Business WhatsApp (saved with order)</label>
              <input value={form.whatsapp} onChange={update("whatsapp")} />
              <small className="muted">Default: 7543669922</small>
            </div>
          </div>

          <button className="btn" disabled={!requiredOk}>
            Continue to Payment
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="stack">
          {/* MOBILE-FRIENDLY SUMMARY (always visible) */}
          <div className="card">
            <h2>Review</h2>
            <div className="review">
              <div><strong>Package:</strong> {payload.package} (${payload.price_usd})</div>
              <div><strong>Occasion:</strong> {payload.occasion}</div>
              <div><strong>Recipient:</strong> {payload.recipient_name}</div>
              <div><strong>Relationship:</strong> {payload.relationship}</div>
              <div><strong>Style:</strong> {payload.music_style}</div>
              <div><strong>Mood:</strong> {payload.mood}</div>
              <div><strong>Language:</strong> {payload.languages}</div>
            </div>

            <button className="btn btn--ghost" onClick={backToForm} type="button">
              Back to Edit
            </button>
          </div>

          <PayPalCheckout
            amountUSD={payload.price_usd}
            description={`MelodyMagic ${payload.package} — ${payload.occasion} for ${payload.recipient_name}`}
            disabled={loadingSave}
            onApproved={savePaidOrder}
            onError={(e) => {
              setError(e?.message || "PayPal error");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />

          {loadingSave && (
            <div className="card">
              <strong>Saving your order…</strong>
              <div className="muted">Please don’t close the page.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
