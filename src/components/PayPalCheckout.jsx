import React, { useMemo, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { supabase } from "../lib/supabase";

function isLocalhost() {
  if (typeof window === "undefined") return false;
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

function resolvePayPalMode() {
  const env = import.meta.env.VITE_PAYPAL_ENV || "auto";
  if (env === "sandbox") return "sandbox";
  if (env === "live") return "live";
  return isLocalhost() ? "sandbox" : "live";
}

function resolveClientId() {
  const mode = resolvePayPalMode();
  const sandboxId = import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX;
  const liveId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const clientId = mode === "sandbox" ? sandboxId : liveId;
  return { mode, clientId };
}

/**
 * Converts Home.jsx orderDraft (camelCase) into your Supabase snake_case columns.
 * This matches the errors you showed: customer_phone, occasion, etc.
 */
function buildDbPayload({ orderDraft, paypalCapture }) {
  return {
    // --- required-ish columns (based on your NOT NULL errors)
    package: orderDraft.package || null,
    price_usd: orderDraft.priceUSD ?? null,
    status: "paid",

    payer_email:
      orderDraft.payerEmail ||
      paypalCapture?.payer?.email_address ||
      null,

    customer_name: orderDraft.customerName || null,
    customer_phone: orderDraft.customerPhone || null,
    occasion: orderDraft.occasion || null,
    recipient_name: orderDraft.recipientName || null,

    // --- optional columns
    relationship: orderDraft.relationship || null,
    dedication: orderDraft.dedication || null,
    music_style: orderDraft.musicStyle || null,
    mood: orderDraft.mood || null,
    languages: orderDraft.languages || null,
    whatsapp: orderDraft.whatsapp || null,

    // --- helpful PayPal metadata (only works if these columns exist; otherwise remove)
    paypal_order_id: paypalCapture?.id || null,
  };
}

export default function PayPalCheckout({ amount, orderDraft, onStatusChange }) {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const { mode, clientId } = useMemo(() => resolveClientId(), []);

  const options = useMemo(
    () => ({
      clientId: clientId || "test",
      currency: "USD",
      intent: "capture",
    }),
    [clientId]
  );

  // Missing Client ID
  if (!clientId) {
    return (
      <div className="card card--error">
        <strong>PayPal Client ID missing</strong>
        <p className="muted" style={{ marginTop: 8 }}>
          Add these env vars (locally + Netlify) then restart/redeploy:
          <br />
          <span className="mono">VITE_PAYPAL_CLIENT_ID_SANDBOX</span>
          <br />
          <span className="mono">VITE_PAYPAL_CLIENT_ID</span>
          <br />
          Mode detected: <span className="mono">{mode}</span>
        </p>
      </div>
    );
  }

  // Prevent NOT NULL insert errors (based on your Supabase messages)
  const missingRequired =
    !orderDraft?.customerName ||
    !orderDraft?.customerPhone ||
    !orderDraft?.occasion ||
    !orderDraft?.recipientName;

  return (
    <PayPalScriptProvider options={options}>
      <div className="stack">
        <div className="muted tiny">
          PayPal mode: <span className="mono">{mode}</span>
        </div>

        {missingRequired ? (
          <div className="card card--error">
            <strong>Missing required fields</strong>
            <div className="muted" style={{ marginTop: 8 }}>
              Please fill: <span className="mono">Your Name</span>,{" "}
              <span className="mono">Phone</span>,{" "}
              <span className="mono">Occasion</span>,{" "}
              <span className="mono">Recipient Name</span>.
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="card card--error">
            <strong>Payment error</strong>
            <div className="muted" style={{ marginTop: 8 }}>
              {error}
            </div>
          </div>
        ) : null}

        <PayPalButtons
          style={{ layout: "vertical" }}
          forceReRender={[amount]}
          disabled={saving || missingRequired}
          createOrder={(data, actions) => {
            setError("");
            onStatusChange?.("pending");

            const val = Number(amount || 0).toFixed(2);

            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: val,
                    currency_code: "USD",
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            try {
              setError("");
              setSaving(true);
              onStatusChange?.("approved");

              const capture = await actions.order.capture();

              const payload = buildDbPayload({
                orderDraft,
                paypalCapture: capture,
              });

              const { error: dbErr } = await supabase
                .from("orders")
                .insert([payload]);

              if (dbErr) {
                // If your table does NOT have paypal_order_id, remove it from payload.
                throw new Error(dbErr.message);
              }

              onStatusChange?.("paid");
              window.location.href = "/success";
            } catch (e) {
              console.error(e);
              onStatusChange?.("error");
              setError(
                e?.message ||
                  "Payment succeeded but saving the order failed in Supabase."
              );
            } finally {
              setSaving(false);
            }
          }}
          onError={(err) => {
            console.error(err);
            onStatusChange?.("error");
            setError("PayPal failed to load or complete the payment.");
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}
