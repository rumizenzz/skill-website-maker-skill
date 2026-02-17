import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./i18n";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Production-only: cache large show assets after first watch so the episode can be rewatched smoothly.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Best-effort only; the site works without a service worker.
    });
  });
}
