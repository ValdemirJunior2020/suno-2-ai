import React from "react";
import LyricVideoPromo from "../components/LyricVideoPromo";
import ReviewsSection from "../components/ReviewsSection";
import Footer from "../components/Footer";

// If your order form is inside Home already, keep it.
// This file assumes the page scrolls and includes sections.

export default function Home() {
  return (
    <div className="page">
      {/* Promo section near the top */}
      <LyricVideoPromo />

      {/* Your existing order section should have an anchor for footer scroll */}
      <section id="order" className="section">
        <h1>Order a Personalized AI Song</h1>
        <p className="muted">
          Choose a package, fill the details, then pay to submit your order.
        </p>

        {/* IMPORTANT:
            Keep your existing Order Form component here (whatever you already use).
            Example:
            <OrderForm />
        */}
      </section>

      {/* Reviews and footer below for non-stop scrolling */}
      <ReviewsSection />
      <Footer />
    </div>
  );
}
