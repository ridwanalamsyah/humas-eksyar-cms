"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Search, Upload, Filter, Tag as TagIcon, Copy } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/common/pill";
import type { MediaAsset } from "@/lib/data/types";

interface Props {
  media: MediaAsset[];
}

const ASPECT_RATIOS: MediaAsset["aspect"][] = [
  "square",
  "portrait",
  "landscape",
  "wide",
];

/** Baca ukuran gambar di browser sebelum diunggah. */
function imageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => resolve({ width: 1200, height: 800 });
    img.src = url;
  });
}

const ASPECT_LABEL: Record<MediaAsset["aspect"], string> = {
  square: "Persegi",
  portrait: "Tegak",
  landscape: "Mendatar",
  wide: "Lebar",
};

export function MediaLibrary({ media: initial }: Props) {
  const [media, setMedia] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [aspect, setAspect] = useState<MediaAsset["aspect"] | "all">("all");
  const [activeTag, setActiveTag] = useState<string | "all">("all");
  const [active, setActive] = useState<MediaAsset | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    media.forEach((m) => m.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [media]);

  const filtered = useMemo(() => {
    return media.filter((m) => {
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
  }, [media, query, aspect, activeTag]);

  async function upload(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) {
      toast.error("Pilih file gambar (JPG, PNG, atau WEBP).");
      return;
    }
    setUploading(true);
    let ok = 0;
    for (const file of list) {
      const { width, height } = await imageSize(file);
      const body = new FormData();
      body.append("file", file);
      body.append("width", String(width));
      body.append("height", String(height));
      const res = await fetch("/api/media", { method: "POST", body });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(`${file.name}: ${j.error ?? "Gagal mengunggah."}`);
        continue;
      }
      ok++;
      setMedia((m) => [j.media as MediaAsset, ...m]);
    }
    setUploading(false);
    if (ok) toast.success(`${ok} foto berhasil diunggah.`);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length) void upload(e.dataTransfer.files);
  }

  return (
    <div className="mt-2 space-y-5">
      <GlassCard className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex flex-1 items-center gap-2 rounded-2xl border border-foreground/10 bg-foreground/[0.04] px-3 py-2 dark:border-white/10 dark:bg-white/5">
            <Search className="size-4 text-foreground/55" strokeWidth={1.75} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari keterangan atau label…"
              className="w-full bg-transparent text-[13px] outline-none placeholder:text-foreground/45"
            />
          </label>
          <select
            value={aspect}
            onChange={(e) => setAspect(e.target.value as MediaAsset["aspect"] | "all")}
            className="h-10 rounded-2xl border border-foreground/10 bg-foreground/[0.04] px-3 text-[13px] dark:border-white/10 dark:bg-white/5"
          >
            <option value="all">Semua bentuk</option>
            {ASPECT_RATIOS.map((a) => (
              <option key={a} value={a}>
                {ASPECT_LABEL[a]}
              </option>
            ))}
          </select>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files?.length) void upload(e.target.files);
              e.target.value = "";
            }}
          />
          <Button size="sm" disabled={uploading} onClick={() => fileInput.current?.click()}>
            <Upload className="size-4" strokeWidth={1.75} />{" "}
            {uploading ? "Mengunggah…" : "Unggah foto"}
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="inline-flex items-center gap-1 text-foreground/55">
            <Filter className="size-3" strokeWidth={2} /> Label:
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
      </GlassCard>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="rounded-3xl border-2 border-dashed border-foreground/15 px-4 py-3 text-center text-[12px] text-foreground/55"
      >
        {uploading
          ? "Mengunggah…"
          : "Seret foto ke sini, atau tekan Unggah foto. Maksimal 10 MB per foto."}
      </div>

      <div
        className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
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
              onClick={() => setActive(m)}
              className={`group relative overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.04] text-left transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 ${span}`}
              style={{ backgroundColor: m.averageColor }}
            >
              <Image
                src={m.url}
                alt={m.alt}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                <p className="line-clamp-1">{m.alt}</p>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-foreground/15 p-8 text-center text-[12px] text-foreground/55">
            Tidak ada foto yang cocok. Coba kata kunci lain.
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
              className="glass-thick max-w-3xl overflow-hidden rounded-3xl ring-1 ring-foreground/10 dark:ring-white/10"
            >
              <div
                className="relative aspect-video w-full"
                style={{ backgroundColor: active.averageColor }}
              >
                <Image
                  src={active.url}
                  alt={active.alt}
                  fill
                  sizes="(max-width: 800px) 100vw, 800px"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {active.alt}
                </h3>
                <p className="mt-1 text-[12px] text-foreground/65">
                  {active.width} × {active.height} · {active.aspect} ·{" "}
                  {(active.url.length).toFixed(0)} bytes URL
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {active.tags.map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(active.url);
                      toast.success("URL disalin");
                    }}
                  >
                    <Copy className="size-3.5" strokeWidth={1.75} /> Salin URL
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setActive(null)}>
                    Tutup
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
