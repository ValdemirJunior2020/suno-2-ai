import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function Success() {
  const loc = useLocation();
  const orderId = loc.state?.orderId || "";

  return (
    <div className="page">
      <section className="hero">
        <h1>✅ Payment Successful</h1>
        <p className="muted">
          Your order was saved. We’ll start working on your 2 song versions.
        </p>
      </section>

      <div className="card card--success">
        <strong>Order ID</strong>
        <div className="mono" style={{ marginTop: 8 }}>
          {orderId || "Not available"}
        </div>
        <div className="muted tiny" style={{ marginTop: 10 }}>
          Send this Order ID on WhatsApp to speed things up.
        </div>
      </div>

      <div className="adminActions">
        <Link className="btn" to="/">Back to Order</Link>
        <Link className="btn btn--ghost" to="/media">Listen to Examples</Link>
      </div>
    </div>
  );
}
