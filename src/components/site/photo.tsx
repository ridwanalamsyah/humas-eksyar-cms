"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const TITLE_TOKENS = new Set([
  "prof",
  "dr",
  "drs",
  "dra",
  "ir",
  "h",
  "hj",
  "kh",
  "rd",
  "nyi",
  "sag",
  "mag",
  "msi",
  "mpd",
  "me",
  "mesy",
  "mm",
  "se",
  "sei",
  "shi",
  "sh",
  "mh",
  "akt",
  "ca",
  "ciiqa",
  "cielp",
  "csrs",
  "csra",
  "cfr",
  "phd",
  "ma",
]);

function extractInitials(raw: string): string {
  // Ambil bagian nama sebelum koma (gelar belakang biasanya setelah koma)
  const beforeComma = raw.split(",")[0] ?? raw;
  const words = beforeComma
    .replace(/[()]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean)
    .filter((w) => {
      const clean = w.toLowerCase().replace(/[^a-z]/g, "");
      return clean.length > 1 && !TITLE_TOKENS.has(clean);
    });

  if (words.length >= 2) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return "ES";
}

/**
 * Foto potret/lanskap dengan fallback monogram akademik
 * saat foto belum diunggah atau gagal dimuat. Menggunakan `isolate overflow-hidden`
 * agar efek zoom (`group-hover:scale`) tidak pernah keluar dari sudut membulat.
 */
export function Photo({
  src,
  alt,
  ratio = "portrait",
  className,
}: {
  src?: string | null;
  alt: string;
  ratio?: "portrait" | "landscape";
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const validSrc = src && src.trim() && failedSrc !== src ? src : null;
  const initials = extractInitials(alt || "Ekonomi Syariah");

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-mist",
        ratio === "portrait" ? "aspect-[4/5]" : "aspect-[16/10]",
        className,
      )}
    >
      {validSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={validSrc}
          alt={alt}
          loading="lazy"
          onError={() => setFailedSrc(validSrc)}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-mist p-6 text-label"
          aria-hidden
        >
          <div className="grid size-16 place-items-center rounded-2xl bg-accent-soft text-accent">
            <span className="text-[22px] font-extrabold tracking-tight">
              {initials}
            </span>
          </div>
          <span className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-label-3">
            FEBI · UIN SGD
          </span>
        </div>
      )}
    </div>
  );
}
