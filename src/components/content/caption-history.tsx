"use client";

import { useCallback, useEffect, useState } from "react";
import { History, RotateCcw, Save, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/common/pill";
import type { CaptionVersion, CaptionVersionSource } from "@/lib/data/types";

interface CaptionHistoryProps {
  contentId: string;
  currentCaption: string;
  currentHashtags: string;
  currentStyle?: string | null;
}

const SOURCE_LABELS: Record<CaptionVersionSource, string> = {
  manual: "Manual",
  ai: "AI",
  imported: "Import",
  restore: "Restore",
};

const SOURCE_TONES: Record<CaptionVersionSource, "brand" | "gold" | "info" | "neutral"> = {
  manual: "neutral",
  ai: "gold",
  imported: "info",
  restore: "brand",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins}m lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}j lalu`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}h lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export function CaptionHistory({
  contentId,
  currentCaption,
  currentHashtags,
  currentStyle,
}: CaptionHistoryProps) {
  const [versions, setVersions] = useState<CaptionVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchVersions = useCallback(async () => {
    try {
      const res = await fetch(`/api/captions/versions?contentId=${contentId}`);
      if (res.ok) {
        const data = (await res.json()) as { versions: CaptionVersion[] };
        setVersions(data.versions);
      }
    } catch {
      /* silently ignore */
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/captions/versions?contentId=${contentId}`);
        if (!active) return;
        if (res.ok) {
          const data = (await res.json()) as { versions: CaptionVersion[] };
          if (active) setVersions(data.versions);
        }
      } catch {
        /* silently ignore */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [contentId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/captions/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId,
          caption: currentCaption,
          hashtags: currentHashtags,
          captionStyle: currentStyle ?? null,
          source: "manual",
          note: "",
        }),
      });
      if (res.ok) {
        await fetchVersions();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    setRestoring(versionId);
    try {
      const res = await fetch("/api/captions/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });
      if (res.ok) {
        await fetchVersions();
        window.location.reload();
      }
    } finally {
      setRestoring(null);
    }
  };

  return (
    <GlassCard variant="regular" className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
          <History className="size-3" strokeWidth={1.75} />
          Riwayat Caption
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          disabled={saving || !currentCaption}
        >
          {saving ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Save className="size-3.5" strokeWidth={1.75} />
          )}
          Simpan versi
        </Button>
      </div>

      {loading ? (
        <div className="mt-3 flex items-center gap-2 text-[12px] text-foreground/45">
          <Loader2 className="size-3.5 animate-spin" />
          Memuat riwayat...
        </div>
      ) : versions.length === 0 ? (
        <p className="mt-3 text-[12px] text-foreground/45">
          Belum ada versi tersimpan. Klik &ldquo;Simpan versi&rdquo; untuk membuat snapshot caption saat ini.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {versions.map((v) => {
            const isExpanded = expanded === v.id;
            const preview =
              v.caption.length > 80
                ? v.caption.slice(0, 80) + "..."
                : v.caption;

            return (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : v.id)}
                  className="w-full rounded-xl border border-foreground/8 p-3 text-left transition-colors hover:border-foreground/15 dark:border-white/8 dark:hover:border-white/15"
                >
                  <div className="flex items-center gap-2">
                    <Pill tone={SOURCE_TONES[v.source as CaptionVersionSource] ?? "neutral"}>
                      {SOURCE_LABELS[v.source as CaptionVersionSource] ?? v.source}
                    </Pill>
                    <span className="text-[11px] text-foreground/45">
                      {timeAgo(v.createdAt)}
                    </span>
                    {v.note && (
                      <span className="ml-auto text-[11px] text-foreground/55 truncate max-w-[120px]">
                        {v.note}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-foreground/70">
                    {isExpanded ? v.caption : preview}
                  </p>
                </button>
                {isExpanded && (
                  <div className="mt-1.5 flex justify-end gap-2 px-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRestore(v.id)}
                      disabled={restoring === v.id}
                    >
                      {restoring === v.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <RotateCcw className="size-3" strokeWidth={1.75} />
                      )}
                      Restore
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </GlassCard>
  );
}
