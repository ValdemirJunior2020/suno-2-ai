import React from "react";
import LyricVideoPromo from "../components/LyricVideoPromo.jsx";
import ReviewsSection from "../components/ReviewsSection.jsx";
import Footer from "../components/Footer.jsx";

// If you already have an OrderForm component, import it here.
// Example: import OrderForm from "../components/OrderForm.jsx";

export default function Home() {
  return (
    <div className="page">
      {/* TOP PROMO (users will see this immediately) */}
      <LyricVideoPromo />

      {/* ORDER SECTION (anchor for footer "Order" button) */}
      <section id="order" className="section">
        <h1>MelodyMagic</h1>
        <p className="muted">
          Order a personalized song or a personalized lyric video. Fill the details, then pay to submit.
        </p>

        {/* ✅ Put your order form here */}
        {/* Replace this placeholder with your real Order Form component */}
        <div className="card">
          <p className="muted">
            Add your Order Form component here (the one you already use for PayPal + saving orders).
          </p>
        </div>
      </section>

      {/* REVIEWS SECTION (anchor for footer "Reviews" button) */}
      <ReviewsSection />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
