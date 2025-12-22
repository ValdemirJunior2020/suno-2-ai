import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WHATSAPP = "17543669922";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const goHomeAndScroll = (id) => {
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    navigate(`/#${id}`);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
  };

  const openWhatsApp = () => {
    const msg = encodeURIComponent(
      "Hi MelodyMagic! 🎶 I want to order a personalized song or lyric video."
    );
    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank");
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__left">
          <div className="footer__brand">
            <span className="footer__logo">🎵</span>
            <div>
              <div className="footer__title">MelodyMagic</div>
              <div className="muted tiny">Personalized songs & lyric videos</div>
            </div>
          </div>
          <div className="muted tiny" style={{ marginTop: 8 }}>
            © {new Date().getFullYear()} MelodyMagic
          </div>
        </div>

        <div className="footer__links">
          <button className="footer__link" type="button" onClick={() => goHomeAndScroll("order")}>
            Order
          </button>
          <button className="footer__link" type="button" onClick={() => goHomeAndScroll("reviews")}>
            Reviews ⭐
          </button>
          <button className="footer__link" type="button" onClick={openWhatsApp}>
            WhatsApp: 754-366-9922
          </button>
        </div>
      </div>
    </footer>
  );
}
