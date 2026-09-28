"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

/** Tombol bagikan artikel: WhatsApp, X, dan salin tautan. */
export function ShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const url = () => (typeof window !== "undefined" ? window.location.href : "");

  async function copy() {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard bisa ditolak browser; abaikan saja.
    }
  }

  const btn =
    "grid size-9 place-items-center rounded-full bg-mist text-label-2 transition-colors hover:bg-[#e8e8ed] hover:text-label";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={btn}
        aria-label="Bagikan ke WhatsApp"
        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url()}`)}`, "_blank", "noopener")}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" />
        </svg>
      </button>
      <button
        type="button"
        className={btn}
        aria-label="Bagikan ke X"
        onClick={() =>
          window.open(
            `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url())}`,
            "_blank",
            "noopener",
          )
        }
      >
        <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
          <path d="M18.2 2.3h3.4l-7.4 8.4 8.7 11.5h-6.8l-5.3-7-6.1 7H1.3l7.9-9L.9 2.3h7l4.8 6.4 5.5-6.4Zm-1.2 17.9h1.9L7.1 4.2H5.1l11.9 16Z" />
        </svg>
      </button>
      <button type="button" className={btn} aria-label="Salin tautan" onClick={copy}>
        {copied ? <Check className="size-4 text-accent" /> : <Link2 className="size-4" />}
      </button>
      <span aria-live="polite" className="text-[13px] text-label-2">
        {copied ? "Tautan disalin" : ""}
      </span>
    </div>
  );
}
