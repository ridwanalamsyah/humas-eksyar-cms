"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { History, RotateCcw, Save, Loader2, Diff, X, Check } from "lucide-react";
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
  const [diffMode, setDiffMode] = useState(false);
  const [diffPicks, setDiffPicks] = useState<string[]>([]);
  const [showDiffModal, setShowDiffModal] = useState(false);

  const diffPair = useMemo(() => {
    if (diffPicks.length !== 2) return null;
    const [a, b] = diffPicks;
    const va = versions.find((v) => v.id === a);
    const vb = versions.find((v) => v.id === b);
    if (!va || !vb) return null;
    return va.createdAt <= vb.createdAt ? { before: va, after: vb } : { before: vb, after: va };
  }, [diffPicks, versions]);

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

  const togglePick = (id: string) => {
    setDiffPicks((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  return (
    <GlassCard variant="regular" className="p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
          <History className="size-3" strokeWidth={1.75} />
          Riwayat Caption
        </h3>
        <div className="flex flex-wrap items-center gap-1">
          {versions.length >= 2 && (
            <Button
              variant={diffMode ? "secondary" : "ghost"}
              size="sm"
              onClick={() => {
                setDiffMode((m) => !m);
                setDiffPicks([]);
              }}
            >
              <Diff className="size-3.5" strokeWidth={1.75} />
              {diffMode ? "Selesai" : "Bandingkan"}
            </Button>
          )}
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
      </div>

      {diffMode && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-foreground/10 bg-foreground/[0.03] p-3 text-[11px] text-foreground/70 dark:border-white/10 dark:bg-white/[0.03]">
          Pilih 2 versi ({diffPicks.length}/2)
          {diffPicks.length === 2 && (
            <Button size="sm" onClick={() => setShowDiffModal(true)}>
              Lihat diff
            </Button>
          )}
        </div>
      )}

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

            const picked = diffPicks.includes(v.id);
            return (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() =>
                    diffMode ? togglePick(v.id) : setExpanded(isExpanded ? null : v.id)
                  }
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${
                    diffMode && picked
                      ? "border-brand-500/45 bg-brand-500/10"
                      : "border-foreground/8 hover:border-foreground/15 dark:border-white/8 dark:hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {diffMode && (
                      <span
                        className={`inline-flex size-4 items-center justify-center rounded-full border ${
                          picked
                            ? "border-brand-500 bg-brand-500 text-white"
                            : "border-foreground/30"
                        }`}
                      >
                        {picked && <Check className="size-3" strokeWidth={3} />}
                      </span>
                    )}
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
                {!diffMode && isExpanded && (
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

      {showDiffModal && diffPair && (
        <DiffModal
          before={diffPair.before}
          after={diffPair.after}
          onClose={() => setShowDiffModal(false)}
        />
      )}
    </GlassCard>
  );
}

function DiffModal({
  before,
  after,
  onClose,
}: {
  before: CaptionVersion;
  after: CaptionVersion;
  onClose: () => void;
}) {
  const beforeLines = before.caption.split("\n");
  const afterLines = after.caption.split("\n");
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-foreground/10 bg-background shadow-2xl dark:border-white/10">
        <header className="flex items-center justify-between border-b border-foreground/10 px-5 py-3 dark:border-white/10">
          <div>
            <h4 className="font-display text-base font-semibold">
              Bandingkan versi
            </h4>
            <p className="text-[11px] text-foreground/55">
              {timeAgo(before.createdAt)} vs {timeAgo(after.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-foreground/55 hover:bg-foreground/5 hover:text-foreground"
            aria-label="Tutup"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </header>
        <div className="grid max-h-[calc(85vh-3.5rem)] grid-cols-2 overflow-auto text-[13px]">
          <div className="border-r border-foreground/10 dark:border-white/10">
            <div className="sticky top-0 z-10 bg-foreground/[0.04] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55 dark:bg-white/[0.05]">
              Sebelum · {timeAgo(before.createdAt)}
            </div>
            <pre className="whitespace-pre-wrap break-words p-4 font-mono leading-relaxed text-foreground/85">
              {beforeLines.map((line, i) => {
                const matched = afterLines.includes(line);
                return (
                  <span
                    key={i}
                    className={
                      matched
                        ? "block"
                        : "block -mx-1 my-px rounded bg-red-500/15 px-1 text-red-700 dark:text-red-300"
                    }
                  >
                    {line || "\u00a0"}
                  </span>
                );
              })}
            </pre>
          </div>
          <div>
            <div className="sticky top-0 z-10 bg-foreground/[0.04] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55 dark:bg-white/[0.05]">
              Sesudah · {timeAgo(after.createdAt)}
            </div>
            <pre className="whitespace-pre-wrap break-words p-4 font-mono leading-relaxed text-foreground/85">
              {afterLines.map((line, i) => {
                const matched = beforeLines.includes(line);
                return (
                  <span
                    key={i}
                    className={
                      matched
                        ? "block"
                        : "block -mx-1 my-px rounded bg-green-500/15 px-1 text-green-700 dark:text-green-300"
                    }
                  >
                    {line || "\u00a0"}
                  </span>
                );
              })}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
