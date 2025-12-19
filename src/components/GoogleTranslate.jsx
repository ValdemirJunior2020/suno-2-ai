import React, { useEffect, useRef, useState } from "react";

export default function GoogleTranslate() {
  const [ready, setReady] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    // If already initialized, do nothing
    if (initializedRef.current) return;

    // Create a global init function Google calls
    window.googleTranslateElementInit = () => {
      try {
        // Guard if translate isn't available yet
        if (!window.google?.translate?.TranslateElement) return;

        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
          },
          "google_translate_element"
        );

        initializedRef.current = true;
        setReady(true);
      } catch (e) {
        console.error("Google Translate init error:", e);
      }
    };

    // Load script once
    const existing = document.querySelector('script[data-gt="true"]');
    if (existing) {
      // Script already loaded; try init now
      setTimeout(() => window.googleTranslateElementInit(), 300);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.defer = true;
    script.async = true;
    script.dataset.gt = "true";

    script.onload = () => {
      // In case callback didn't fire for some reason
      setTimeout(() => window.googleTranslateElementInit(), 300);
    };

    script.onerror = () => {
      console.error("Failed to load Google Translate script");
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div className="gt-wrapper">
      <span className="gt-label">🌐 Language</span>

      {/* Google injects the <select> into this element */}
      <div
        id="google_translate_element"
        className="gt-box"
        style={{ opacity: ready ? 1 : 0.7 }}
        title={ready ? "Select a language" : "Loading languages..."}
      />
    </div>
  );
}
