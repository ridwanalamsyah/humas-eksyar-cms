"use client";

import { CalendarPlus, Copy } from "lucide-react";
import { useState } from "react";

/** Tombol berlangganan kalender (.ics) untuk Google Calendar / kalender HP. */
export function CalendarSubscribe() {
  const [copied, setCopied] = useState(false);
  const url = () => `${window.location.origin}/prodi/kalender.ics`;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() =>
          window.open(
            `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(url().replace(/^https?:/, "webcal:"))}`,
            "_blank",
          )
        }
        className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14.5px] font-semibold text-white hover:bg-accent-strong"
      >
        <CalendarPlus className="size-4" /> Langganan di Google Calendar
      </button>
      <a
        href="/prodi/kalender.ics"
        className="rounded-full bg-mist px-5 py-2.5 text-[14.5px] font-semibold text-label hover:bg-hairline"
      >
        Unduh .ics
      </a>
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(url());
          setCopied(true);
        }}
        className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent hover:underline"
      >
        <Copy className="size-4" />{" "}
        {copied ? "Tautan disalin" : "Salin tautan kalender"}
      </button>
    </div>
  );
}
