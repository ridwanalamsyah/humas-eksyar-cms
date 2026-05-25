"use client";

/**
 * Internal comment thread for editorial feedback on a content item.
 * Mirrors a lightweight Google Docs comment UX: post, resolve, delete.
 * Pagination not needed (max ~50 comments per content).
 */

import { useEffect, useState, useTransition } from "react";
import { Loader2, MessageSquare, Check, Trash2, Send } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/common/avatar";
import { Pill } from "@/components/common/pill";
import type { ContentComment, Member } from "@/lib/data/types";

interface Props {
  contentId: string;
  currentMemberId: string | null;
  canModerate: boolean;
}

interface CommentWithAuthor extends ContentComment {
  author?: Pick<Member, "id" | "name" | "initials" | "avatarEmoji" | "accentHue" | "avatarUrl">;
}

function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const min = Math.round(diff / 60_000);
  if (min < 1) return "baru saja";
  if (min < 60) return `${min}m`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}j`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}h`;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

export function CommentThread({ contentId, currentMemberId, canModerate }: Props) {
  const [items, setItems] = useState<CommentWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [showResolved, setShowResolved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    fetch(`/api/contents/${contentId}/comments`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.comments ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId]);

  const submit = () => {
    if (!draft.trim()) return;
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/contents/${contentId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: draft.trim() }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? `Gagal kirim (${res.status})`);
        return;
      }
      setDraft("");
      load();
    });
  };

  const resolve = (id: string, resolved: boolean) => {
    startTransition(async () => {
      const res = await fetch(`/api/contents/${contentId}/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolved }),
      });
      if (res.ok) load();
    });
  };

  const remove = (id: string) => {
    if (!confirm("Hapus komentar ini?")) return;
    startTransition(async () => {
      const res = await fetch(`/api/contents/${contentId}/comments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) load();
    });
  };

  const visible = showResolved ? items : items.filter((c) => !c.resolvedAt);
  const resolvedCount = items.filter((c) => c.resolvedAt).length;

  return (
    <GlassCard variant="regular" className="p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
          <MessageSquare className="mr-1 inline size-3" strokeWidth={1.75} />
          Komentar internal
        </h3>
        {resolvedCount > 0 && (
          <button
            type="button"
            onClick={() => setShowResolved((s) => !s)}
            className="text-[11px] text-foreground/55 hover:text-foreground"
          >
            {showResolved
              ? `Sembunyikan ${resolvedCount} selesai`
              : `Tampilkan ${resolvedCount} selesai`}
          </button>
        )}
      </div>

      {loading ? (
        <div className="mt-3 flex items-center gap-2 text-[12px] text-foreground/45">
          <Loader2 className="size-3.5 animate-spin" /> Memuat…
        </div>
      ) : visible.length === 0 ? (
        <p className="mt-3 text-[12px] text-foreground/45">
          Belum ada komentar. Mulai diskusi internal di sini.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {visible.map((c) => {
            const isAuthor = c.authorId === currentMemberId;
            const isResolved = !!c.resolvedAt;
            return (
              <li
                key={c.id}
                className={`rounded-xl border p-3 ${
                  isResolved
                    ? "border-foreground/5 bg-foreground/[0.02] opacity-70"
                    : "border-foreground/8 dark:border-white/8"
                }`}
              >
                <div className="flex items-center gap-2">
                  {c.author ? (
                    <Avatar member={c.author as Member} size={24} ring={false} />
                  ) : (
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-foreground/10 text-[10px]">
                      ?
                    </span>
                  )}
                  <span className="text-[12px] font-medium text-foreground/80">
                    {c.author?.name ?? "Anggota"}
                  </span>
                  <span className="text-[11px] text-foreground/45">
                    · {timeAgo(c.createdAt)}
                  </span>
                  {isResolved && (
                    <Pill tone="success">Selesai</Pill>
                  )}
                </div>
                <p className="mt-1.5 whitespace-pre-wrap text-[13px] leading-relaxed text-foreground/85">
                  {c.body}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[11px]">
                  {!isResolved && (
                    <button
                      type="button"
                      onClick={() => resolve(c.id, true)}
                      className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700"
                    >
                      <Check className="size-3" strokeWidth={2} /> Tandai selesai
                    </button>
                  )}
                  {isResolved && canModerate && (
                    <button
                      type="button"
                      onClick={() => resolve(c.id, false)}
                      className="text-foreground/55 hover:text-foreground"
                    >
                      Buka lagi
                    </button>
                  )}
                  {(isAuthor || canModerate) && (
                    <button
                      type="button"
                      onClick={() => remove(c.id)}
                      className="ml-auto inline-flex items-center gap-1 text-rose-500/80 hover:text-rose-500"
                    >
                      <Trash2 className="size-3" strokeWidth={1.75} /> Hapus
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {currentMemberId && (
        <div className="mt-4 border-t border-foreground/8 pt-3 dark:border-white/8">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            placeholder="Tulis komentar internal..."
            className="w-full resize-none rounded-xl border border-foreground/10 bg-background px-3 py-2 text-[13px] focus:border-brand-500 focus:outline-none"
          />
          {error && <p className="mt-1 text-[11px] text-rose-500">{error}</p>}
          <div className="mt-2 flex justify-end">
            <Button
              size="sm"
              onClick={submit}
              disabled={!draft.trim() || isPending}
            >
              {isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Send className="size-3.5" strokeWidth={1.75} />
              )}
              Kirim
            </Button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
