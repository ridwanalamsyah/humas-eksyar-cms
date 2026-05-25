"use client";

/**
 * Suggests media-library assets relevant to a given content's
 * title + rubric + caption. Useful before submitting a draft when the
 * author hasn't picked images yet. Calls `/api/media/suggest`.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Sparkles, ExternalLink, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Pill } from "@/components/common/pill";
import { toast } from "sonner";
import type { MediaAsset } from "@/lib/data/types";

interface Props {
  contentId: string;
}

export function SuggestMedia({ contentId }: Props) {
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<MediaAsset[] | null>(null);
  const [tokens, setTokens] = useState<string[]>([]);

  const run = async () => {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/media/suggest?contentId=${encodeURIComponent(contentId)}`,
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Gagal mencari saran");
        return;
      }
      setItems(data.suggestions ?? []);
      setTokens(data.matchedTokens ?? []);
    } finally {
      setBusy(false);
    }
  };

  const fetched = useRef<string | null>(null);
  useEffect(() => {
    if (fetched.current === contentId) return;
    fetched.current = contentId;
    void run();
    // Re-run only when contentId changes; `run` is stable in practice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId]);

  return (
    <GlassCard variant="thick" className="p-5">
      <div className="flex items-center justify-between">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
          <Sparkles className="size-3.5" strokeWidth={1.75} /> Saran media
        </p>
        <button
          onClick={run}
          disabled={busy}
          className="inline-flex items-center gap-1 text-[11px] text-foreground/55 hover:text-foreground"
        >
          {busy && <Loader2 className="size-3 animate-spin" />}
          Refresh
        </button>
      </div>
      {tokens.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tokens.slice(0, 6).map((t) => (
            <Pill key={t} tone="neutral">
              #{t}
            </Pill>
          ))}
        </div>
      )}
      {items && items.length === 0 && (
        <p className="mt-3 text-[12px] text-foreground/55">
          Belum ada media yang cocok dengan konten ini. Tambahkan tag ke media library agar saran lebih kaya.
        </p>
      )}
      {items && items.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-2">
          {items.slice(0, 6).map((m) => (
            <li key={m.id}>
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.04] dark:border-white/10"
                style={{ backgroundColor: m.averageColor }}
                title={m.alt}
              >
                <Image
                  src={m.url}
                  alt={m.alt || "Saran"}
                  fill
                  sizes="120px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <ExternalLink className="size-3" strokeWidth={2} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}
