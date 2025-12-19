import React, { useMemo } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { getPayPalEnv, getPayPalClientId } from "../lib/paypal.js";

export default function PayPalCheckout({ amountUSD, description, onApproved, onError, disabled }) {
  const clientId = getPayPalClientId();
  const env = getPayPalEnv();

  const options = useMemo(() => {
    return {
      clientId: clientId || "test",
      currency: "USD",
      intent: "capture",
      components: "buttons",
      "data-sdk-integration-source": "melodymagic",
    };
  }, [clientId]);

  if (!clientId) {
    return (
      <div className="card card--error">
        <strong>⚠️ Missing PayPal Client ID</strong>
        <div className="muted">Add VITE_PAYPAL_CLIENT_ID (and sandbox) in .env and restart.</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="muted tiny" style={{ marginBottom: 10 }}>
        PayPal Mode: <strong>{env}</strong>
      </div>

      <PayPalScriptProvider options={options}>
        <PayPalButtons
          disabled={!!disabled}
          style={{ layout: "vertical", label: "paypal" }}
          createOrder={async (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: description || "MelodyMagic order",
                  amount: { currency_code: "USD", value: String(Number(amountUSD).toFixed(2)) },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            try {
              const details = await actions.order.capture();
              onApproved?.({ data, details });
            } catch (e) {
              onError?.(e);
            }
          }}
          onError={(err) => onError?.(err)}
        />
      </PayPalScriptProvider>

      <div className="muted tiny" style={{ marginTop: 10 }}>
        After payment approval, your order is saved automatically.
      </div>
    </div>
  );
}
