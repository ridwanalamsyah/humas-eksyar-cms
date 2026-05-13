"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { QrCode, ScanLine, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  eventId: string;
  eventTitle: string;
}

export function QRCheckIn({ eventId, eventTitle }: Props) {
  const [revealed, setRevealed] = useState(false);
  const checkinUrl = `${typeof window === "undefined" ? "https://eksyar.app" : window.location.origin}/events/${eventId}/checkin`;
  const svg = qrSvg(`${eventId}|${eventTitle}`);

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
        QR Check-in
      </p>
      <p className="mt-1 text-[12px] text-foreground/65">
        Cetak / proyeksi QR ini di acara — anggota scan untuk check-in &amp; dapat XP.
      </p>

      <div className="mt-3 flex items-center gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="grid size-28 place-items-center rounded-2xl bg-white p-2 ring-1 ring-foreground/10 dark:ring-white/10"
        >
          {revealed ? (
            <span
              className="block size-full [&_svg]:size-full"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="grid size-full place-items-center rounded-xl bg-foreground/[0.04] text-foreground/55 transition-colors hover:bg-foreground/[0.08] dark:bg-white/5"
              title="Klik untuk tampilkan QR"
            >
              <QrCode className="size-7" strokeWidth={1.5} />
            </button>
          )}
        </motion.div>
        <div className="flex-1 space-y-1.5">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setRevealed((v) => !v)}
            className="w-full"
          >
            <ScanLine className="size-3.5" strokeWidth={1.75} />
            {revealed ? "Sembunyikan" : "Tampilkan"} QR
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(checkinUrl);
              toast.success("Link check-in disalin.");
            }}
            className="w-full"
          >
            <Copy className="size-3.5" strokeWidth={1.75} /> Salin link
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Lightweight deterministic QR-like SVG (visual placeholder).
 * Not a scannable QR — for design/preview only. Phase 6+ will use a
 * proper `qrcode` lib (or canvas-based scanner) for real check-in.
 */
function qrSvg(seed: string): string {
  const N = 21;
  const cells: boolean[] = [];
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  for (let i = 0; i < N * N; i++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    cells.push(((h >>> 0) % 100) < 50);
  }
  // Position markers
  const mark = (cx: number, cy: number) => {
    for (let y = 0; y < 7; y++)
      for (let x = 0; x < 7; x++) {
        const isBorder = y === 0 || y === 6 || x === 0 || x === 6;
        const isCenter = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        cells[(cy + y) * N + (cx + x)] = isBorder || isCenter;
      }
  };
  mark(0, 0);
  mark(N - 7, 0);
  mark(0, N - 7);

  const SIZE = 200;
  const CELL = SIZE / N;
  let rects = "";
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (!cells[y * N + x]) continue;
      rects += `<rect x="${x * CELL}" y="${y * CELL}" width="${CELL}" height="${CELL}" fill="#14201a"/>`;
    }
  }
  return `<svg viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg"><rect width="${SIZE}" height="${SIZE}" fill="white"/>${rects}</svg>`;
}
