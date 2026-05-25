"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Tag as TagIcon,
  Copy,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/common/pill";
import { MediaUploader } from "@/components/media/media-uploader";
import type { BrandingConfig, MediaAsset, Member } from "@/lib/data/types";

interface Props {
  media: MediaAsset[];
  branding: BrandingConfig;
  currentMemberId: string | null;
  currentMemberRole: Member["role"] | null;
}

const ASPECT_RATIOS: MediaAsset["aspect"][] = [
  "square",
  "portrait",
  "landscape",
  "wide",
];

export function MediaLibrary({
  media,
  branding,
  currentMemberId,
  currentMemberRole,
}: Props) {
  const [items, setItems] = useState<MediaAsset[]>(media);
  const [query, setQuery] = useState("");
  const [aspect, setAspect] = useState<MediaAsset["aspect"] | "all">("all");
  const [activeTag, setActiveTag] = useState<string | "all">("all");
  const [active, setActive] = useState<MediaAsset | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editTags, setEditTags] = useState("");
  const [pending, startTransition] = useTransition();

  const allTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((m) => m.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((m) => {
      if (aspect !== "all" && m.aspect !== aspect) return false;
      if (activeTag !== "all" && !m.tags.includes(activeTag)) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !m.alt.toLowerCase().includes(q) &&
          !m.tags.some((t) => t.toLowerCase().includes(q))
        )
          return false;
      }
      return true;
    });
  }, [items, query, aspect, activeTag]);

  const openDetail = (m: MediaAsset) => {
    setActive(m);
    setEditAlt(m.alt);
    setEditTags(m.tags.join(", "));
  };

  const saveDetail = () => {
    if (!active) return;
    const tags = editTags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    startTransition(async () => {
      const res = await fetch(`/api/media/${active.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ alt: editAlt, tags }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j.error ?? "Gagal menyimpan");
        return;
      }
      const data = await res.json();
      const updated = data.media as MediaAsset;
      setItems((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setActive(updated);
      toast.success("Disimpan");
    });
  };

  const deleteItem = (m: MediaAsset) => {
    if (!window.confirm(`Hapus "${m.alt || "media"}"?`)) return;
    startTransition(async () => {
      const res = await fetch(`/api/media/${m.id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j.error ?? "Gagal menghapus");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== m.id));
      if (active?.id === m.id) setActive(null);
      toast.success("Media dihapus");
    });
  };

  const canUpload = currentMemberRole && currentMemberRole !== "monitoring";

  return (
    <div className="mt-2 space-y-5">
      {canUpload && (
        <MediaUploader
          branding={branding}
          onUploaded={(asset) => {
            setItems((prev) => [asset, ...prev]);
            toast.success("Media berhasil diunggah");
          }}
        />
      )}

      <GlassCard className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex flex-1 items-center gap-2 rounded-2xl border border-foreground/10 bg-foreground/[0.04] px-3 py-2 dark:border-white/10 dark:bg-white/5">
            <Search className="size-4 text-foreground/55" strokeWidth={1.75} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari alt, tag…"
              className="w-full bg-transparent text-[13px] outline-none placeholder:text-foreground/45"
            />
          </label>
          <select
            value={aspect}
            onChange={(e) => setAspect(e.target.value as MediaAsset["aspect"] | "all")}
            className="h-10 rounded-2xl border border-foreground/10 bg-foreground/[0.04] px-3 text-[13px] dark:border-white/10 dark:bg-white/5"
          >
            <option value="all">Semua aspect</option>
            {ASPECT_RATIOS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        {allTags.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="inline-flex items-center gap-1 text-foreground/55">
              <Filter className="size-3" strokeWidth={2} /> Tag:
            </span>
            <button
              type="button"
              onClick={() => setActiveTag("all")}
              className={`rounded-full border px-2 py-0.5 ${
                activeTag === "all"
                  ? "border-brand-500/45 bg-brand-500/15 text-brand-700 dark:text-brand-300"
                  : "border-foreground/15 bg-foreground/5 text-foreground/65"
              }`}
            >
              Semua
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTag(t === activeTag ? "all" : t)}
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${
                  activeTag === t
                    ? "border-brand-500/45 bg-brand-500/15 text-brand-700 dark:text-brand-300"
                    : "border-foreground/15 bg-foreground/5 text-foreground/65"
                }`}
              >
                <TagIcon className="size-2.5" strokeWidth={2} />
                {t}
              </button>
            ))}
          </div>
        )}
      </GlassCard>

      <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((m) => {
          const span =
            m.aspect === "portrait"
              ? "row-span-2"
              : m.aspect === "wide"
                ? "col-span-2"
                : "";
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => openDetail(m)}
              className={`group relative overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.04] text-left transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 ${span}`}
              style={{ backgroundColor: m.averageColor }}
            >
              {m.type === "video" ? (
                <video
                  src={m.url}
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={m.url}
                  alt={m.alt || "Media"}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                <p className="line-clamp-1">{m.alt || "—"}</p>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-foreground/15 p-8 text-center text-[12px] text-foreground/55">
            Tidak ada media. Upload pertama Anda di atas.
          </p>
        )}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-md"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-thick max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl ring-1 ring-foreground/10 dark:ring-white/10"
            >
              <div
                className="relative aspect-video w-full"
                style={{ backgroundColor: active.averageColor }}
              >
                {active.type === "video" ? (
                  <video
                    src={active.url}
                    controls
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={active.url}
                    alt={active.alt || "Media"}
                    fill
                    sizes="(max-width: 800px) 100vw, 800px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <label className="mb-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
                    Alt / caption singkat
                  </label>
                  <input
                    value={editAlt}
                    onChange={(e) => setEditAlt(e.target.value)}
                    className="w-full rounded-xl border border-foreground/10 bg-background px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
                    Tags
                  </label>
                  <input
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    className="w-full rounded-xl border border-foreground/10 bg-background px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    placeholder="tag1, tag2"
                  />
                </div>
                <p className="text-[12px] text-foreground/65">
                  {active.width} × {active.height} · {active.aspect} ·{" "}
                  {active.type}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {active.tags.map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(active.url);
                      toast.success("URL disalin");
                    }}
                  >
                    <Copy className="size-3.5" strokeWidth={1.75} /> Salin URL
                  </Button>
                  {(active.uploaderId === currentMemberId ||
                    currentMemberRole === "admin" ||
                    currentMemberRole === "ketua_divisi") && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteItem(active)}
                      disabled={pending}
                    >
                      <Trash2 className="size-3.5 text-rose-500" />
                      Hapus
                    </Button>
                  )}
                  <Button size="sm" onClick={saveDetail} disabled={pending}>
                    {pending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Save className="size-3.5" />
                    )}
                    Simpan
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
