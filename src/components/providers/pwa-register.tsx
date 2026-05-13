"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.location.protocol === "https:"
    ) {
      const onLoad = () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .catch(() => {
            // silent: PWA is progressive enhancement
          });
      };
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);
  return null;
}
