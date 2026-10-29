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

const PALETTES = [
  {
    bg: "from-[#0f3d33] via-[#165b4c] to-[#0c2340]",
    ring: "border-white/20 bg-white/10 text-white",
    accent: "#a7f3d0",
  },
  {
    bg: "from-[#0c2340] via-[#163a5f] to-[#0f4c45]",
    ring: "border-white/20 bg-white/10 text-white",
    accent: "#fde68a",
  },
  {
    bg: "from-[#14532d] via-[#166534] to-[#0f3d33]",
    ring: "border-white/20 bg-white/10 text-white",
    accent: "#bbf7d0",
  },
  {
    bg: "from-[#1e3a5f] via-[#134e4a] to-[#0c2340]",
    ring: "border-white/20 bg-white/10 text-white",
    accent: "#99f6e4",
  },
];

function pickPalette(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return PALETTES[Math.abs(hash) % PALETTES.length];
}

/**
 * Foto potret/lanskap dengan fallback monogram akademik & ornamen geometris
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
  const palette = pickPalette(alt || "eksyar");

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
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br p-6 text-white transition-transform duration-700 ease-out group-hover:scale-[1.02]",
            palette.bg,
          )}
          aria-hidden
        >
          {/* Ornamen geometris Islami halus di latar */}
          <svg
            viewBox="0 0 200 200"
            fill="none"
            className="pointer-events-none absolute -right-10 -top-10 size-48 opacity-[0.12]"
          >
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="56" stroke="currentColor" strokeWidth="1.2" />
            <rect
              x="44"
              y="44"
              width="112"
              height="112"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <rect
              x="44"
              y="44"
              width="112"
              height="112"
              transform="rotate(45 100 100)"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>

          {/* Siluet potret akademik halus di bagian bawah */}
          <svg
            viewBox="0 0 200 250"
            preserveAspectRatio="xMidYMax meet"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[78%] w-full text-white/[0.08]"
          >
            <circle cx="100" cy="88" r="40" fill="currentColor" />
            <path
              d="M22 250c0-48 35-82 78-82s78 34 78 82z"
              fill="currentColor"
            />
          </svg>

          {/* Lencana monogram inisial */}
          <div
            className={cn(
              "relative z-10 grid size-20 place-items-center rounded-full border backdrop-blur-xs shadow-inner",
              palette.ring,
            )}
          >
            <span
              className="text-[24px] font-extrabold tracking-tight"
              style={{ color: palette.accent }}
            >
              {initials}
            </span>
          </div>
          <span className="relative z-10 mt-3 rounded-full bg-black/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/75">
            FEBI · UIN SGD
          </span>
        </div>
      )}
    </div>
  );
}
