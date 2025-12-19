export function getPayPalEnv() {
  const mode = (import.meta.env.VITE_PAYPAL_ENV || "auto").toLowerCase();
  const isLocal = window.location.hostname === "localhost";

  if (mode === "sandbox") return "sandbox";
  if (mode === "live") return "live";
  return isLocal ? "sandbox" : "live";
}

export function getPayPalClientId() {
  const env = getPayPalEnv();
  const sandboxId = import.meta.env.VITE_PAYPAL_CLIENT_ID_SANDBOX;
  const liveId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  return env === "sandbox" ? sandboxId : liveId;
}
