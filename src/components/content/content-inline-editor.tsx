"use client";

/**
 * Inline editor mounted on /content/[id] for quick edits to title/caption/
 * hashtags/body/status. Distinct from the rich `ContentEditor` used on
 * /content/new which handles fresh drafts.
 */

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Save, X, Trash2, Loader2, Cloud, CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

interface Props {
  contentId: string;
  initialTitle: string;
  initialCaption: string;
  initialHashtags: string;
  initialBody: string;
  initialStatus: string;
  canDelete: boolean;
}

const STATUS_OPTIONS = [
  "idea",
  "draft",
  "review",
  "approved",
  "scheduled",
  "published",
  "archived",
];

export function ContentInlineEditor({
  contentId,
  initialTitle,
  initialCaption,
  initialHashtags,
  initialBody,
  initialStatus,
  canDelete,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [caption, setCaption] = useState(initialCaption);
  const [hashtags, setHashtags] = useState(initialHashtags);
  const [body, setBody] = useState(initialBody);
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [autosaveState, setAutosaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [autosaveAt, setAutosaveAt] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSentRef = useRef<string>("");
  const restoredRef = useRef<boolean>(false);

  // Restore autosave draft once editing opens.
  useEffect(() => {
    if (!editing || restoredRef.current) return;
    restoredRef.current = true;
    fetch(`/api/contents/${contentId}/draft`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const d = data?.draft;
        if (!d) return;
        // Only restore if newer than the loaded server state.
        const serverModified = initialCaption + initialBody;
        const draftModified = (d.caption ?? "") + (d.body ?? "");
        if (draftModified === serverModified) return;
        const ok =
          typeof window !== "undefined" &&
          window.confirm(
            "Ada draft autosave belum tersimpan dari sesi terakhir. Pulihkan?",
          );
        if (!ok) return;
        if (d.caption !== undefined) setCaption(d.caption ?? "");
        if (d.body !== undefined) setBody(d.body ?? "");
        if (d.hashtags !== undefined) setHashtags(d.hashtags ?? "");
      })
      .catch(() => undefined);
  }, [editing, contentId, initialCaption, initialBody]);

  // Debounced autosave whenever editable fields change.
  useEffect(() => {
    if (!editing) return;
    const payload = JSON.stringify({ caption, hashtags, body });
    if (payload === lastSentRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setAutosaveState("saving");
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/contents/${contentId}/draft`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: payload,
        });
        if (!res.ok) throw new Error(`autosave ${res.status}`);
        lastSentRef.current = payload;
        setAutosaveState("saved");
        setAutosaveAt(new Date().toISOString());
      } catch {
        setAutosaveState("error");
      }
    }, 1500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [editing, contentId, caption, hashtags, body]);

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/contents/${contentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, caption, hashtags, body, status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? `Save failed (${res.status})`);
        return;
      }
      // Clear autosave draft since the change is now persisted.
      fetch(`/api/contents/${contentId}/draft`, { method: "DELETE" }).catch(
        () => undefined,
      );
      lastSentRef.current = JSON.stringify({ caption, hashtags, body });
      setAutosaveState("idle");
      setEditing(false);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (!confirm("Hapus konten ini? Tidak bisa di-undo.")) return;
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/contents/${contentId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? `Delete failed (${res.status})`);
        return;
      }
      router.push("/content");
      router.refresh();
    });
  };

  const cancel = () => {
    setTitle(initialTitle);
    setCaption(initialCaption);
    setHashtags(initialHashtags);
    setBody(initialBody);
    setStatus(initialStatus);
    setError(null);
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button onClick={() => setEditing(true)}>
          <Pencil className="size-4" strokeWidth={1.75} />
          Edit konten
        </Button>
        {canDelete && (
          <Button variant="ghost" onClick={handleDelete} disabled={isPending}>
            <Trash2 className="size-4" strokeWidth={1.75} />
            Hapus
          </Button>
        )}
        {error && <p className="w-full text-sm text-rose-500">{error}</p>}
      </div>
    );
  }

  return (
    <GlassCard variant="thick" className="mt-6 p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground/55">
          Edit konten
        </h3>
        <div className="flex items-center gap-2">
          <AutosaveBadge state={autosaveState} at={autosaveAt} />
          <Button variant="ghost" size="sm" onClick={cancel} disabled={isPending}>
            <X className="size-4" strokeWidth={1.75} />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        <Field label="Judul">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-foreground/10 bg-background px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </Field>

        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-foreground/10 bg-background px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Caption">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={8}
            className="w-full rounded-xl border border-foreground/10 bg-background px-3 py-2 text-sm leading-relaxed focus:border-brand-500 focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-foreground/55">
            Edit caption otomatis disimpan sebagai versi baru di Riwayat.
          </p>
        </Field>

        <Field label="Hashtag (dipisah spasi)">
          <input
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full rounded-xl border border-foreground/10 bg-background px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none"
            placeholder="#eksyar #humas #ekonomisyariah"
          />
        </Field>

        <Field label="Catatan internal (opsional)">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-foreground/10 bg-background px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </Field>

        {error && <p className="text-sm text-rose-500">{error}</p>}

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" strokeWidth={1.75} />
            )}
            Simpan
          </Button>
          <Button variant="ghost" onClick={cancel} disabled={isPending}>
            Batal
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}

function AutosaveBadge({
  state,
  at,
}: {
  state: "idle" | "saving" | "saved" | "error";
  at: string | null;
}) {
  if (state === "idle") return null;
  if (state === "saving")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-2 py-0.5 text-[10px] text-foreground/55">
        <Loader2 className="size-3 animate-spin" /> Autosave…
      </span>
    );
  if (state === "error")
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] text-rose-500"
        title="Autosave gagal"
      >
        <CloudOff className="size-3" /> Offline
      </span>
    );
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-600"
      title={at ?? undefined}
    >
      <Cloud className="size-3" /> Tersimpan
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
        {label}
      </span>
      {children}
    </label>
  );
}
