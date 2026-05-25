"use client";

/**
 * Client-side image uploader with optional watermark overlay.
 *
 * Composites a watermark PNG onto the user-selected image via Canvas
 * BEFORE upload, so the file persisted in Vercel Blob already has the
 * watermark baked in. Watermark source + position read from branding
 * config passed in as props.
 *
 * Used by `/media` (library) and content editors.
 */
import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Loader2, Droplet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import type { BrandingConfig, MediaAsset } from "@/lib/data/types";

interface Props {
  branding: BrandingConfig;
  onUploaded?: (asset: MediaAsset) => void;
  /** Tags to seed the upload with (e.g. content rubric) */
  defaultTags?: string[];
}

interface CompositeResult {
  blob: Blob;
  width: number;
  height: number;
  filename: string;
  type: string;
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Cannot load image: ${src}`));
    img.src = src;
  });
}

async function applyWatermark(
  file: File,
  watermarkUrl: string,
  position: "br" | "bl" | "tr" | "tl",
): Promise<CompositeResult> {
  const objectUrl = URL.createObjectURL(file);
  const [base, mark] = await Promise.all([
    loadImage(objectUrl),
    loadImage(watermarkUrl),
  ]);
  URL.revokeObjectURL(objectUrl);

  const canvas = document.createElement("canvas");
  canvas.width = base.naturalWidth;
  canvas.height = base.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.drawImage(base, 0, 0);

  // Watermark sizing: ~12% of the shorter side, capped at 320px.
  const targetW = Math.min(
    320,
    Math.round(Math.min(canvas.width, canvas.height) * 0.18),
  );
  const ratio = mark.naturalHeight / mark.naturalWidth;
  const w = targetW;
  const h = Math.round(targetW * ratio);
  const pad = Math.round(Math.min(canvas.width, canvas.height) * 0.025);

  let x = canvas.width - w - pad;
  let y = canvas.height - h - pad;
  if (position === "bl") {
    x = pad;
  } else if (position === "tr") {
    y = pad;
  } else if (position === "tl") {
    x = pad;
    y = pad;
  }
  ctx.globalAlpha = 0.95;
  ctx.drawImage(mark, x, y, w, h);
  ctx.globalAlpha = 1;

  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Failed to encode image"))),
      file.type === "image/png" ? "image/png" : "image/jpeg",
      0.92,
    ),
  );

  return {
    blob,
    width: canvas.width,
    height: canvas.height,
    filename: file.name,
    type: file.type === "image/png" ? "image/png" : "image/jpeg",
  };
}

async function imageMeta(file: File): Promise<{ width: number; height: number }> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function MediaUploader({ branding, onUploaded, defaultTags = [] }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const [tagsField, setTagsField] = useState(defaultTags.join(", "));
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [applyMark, setApplyMark] = useState<boolean>(
    !!branding.watermarkEnabled && !!branding.watermarkUrl,
  );

  const pick = () => inputRef.current?.click();

  const onSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError(null);
  };

  const reset = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setAlt("");
    setTagsField(defaultTags.join(", "));
  };

  const upload = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      let payload: Blob;
      let width = 0;
      let height = 0;
      let type = file.type;
      const isImage = file.type.startsWith("image/");
      if (isImage && applyMark && branding.watermarkUrl) {
        setProgress("Menempel watermark…");
        const res = await applyWatermark(
          file,
          branding.watermarkUrl,
          branding.watermarkPosition ?? "br",
        );
        payload = res.blob;
        width = res.width;
        height = res.height;
        type = res.type;
      } else {
        payload = file;
        if (isImage) {
          const m = await imageMeta(file);
          width = m.width;
          height = m.height;
        }
      }

      setProgress("Mengunggah…");
      const fd = new FormData();
      fd.set("file", new File([payload], file.name, { type }));
      fd.set("alt", alt);
      fd.set("tags", tagsField);
      fd.set("width", String(width));
      fd.set("height", String(height));

      const res = await fetch("/api/upload/media", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Upload gagal (${res.status})`);
      }
      const data = await res.json();
      if (data.media && onUploaded) onUploaded(data.media as MediaAsset);
      reset();
      setProgress("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setBusy(false);
    }
  };

  const canWatermark = !!branding.watermarkUrl;

  return (
    <GlassCard variant="regular" className="p-5">
      <div className="flex items-center gap-2">
        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-foreground/55">
          Upload media
        </h3>
        {canWatermark && (
          <label className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-foreground/[0.05] px-2 py-1 text-[11px]">
            <input
              type="checkbox"
              checked={applyMark}
              onChange={(e) => setApplyMark(e.target.checked)}
            />
            <Droplet className="size-3" strokeWidth={1.75} />
            Watermark otomatis
          </label>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
        onChange={onSelected}
        className="hidden"
      />

      {!file ? (
        <button
          type="button"
          onClick={pick}
          className="mt-3 grid w-full place-items-center rounded-2xl border-2 border-dashed border-foreground/15 px-6 py-10 text-center text-foreground/55 transition-colors hover:border-brand-500/40 hover:text-foreground/80"
        >
          <Upload className="size-6" strokeWidth={1.5} />
          <span className="mt-2 text-sm">Pilih file dari komputer</span>
          <span className="mt-0.5 text-[11px]">JPG/PNG/WebP/GIF/MP4. Maks 25MB.</span>
        </button>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-[160px,1fr]">
          {preview && (
            <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.04] dark:border-white/10">
              {file.type.startsWith("video/") ? (
                <div className="grid h-full w-full place-items-center text-foreground/55">
                  <ImageIcon className="size-8" strokeWidth={1.5} />
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              )}
              <button
                type="button"
                onClick={reset}
                className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/55 text-white hover:bg-black/75"
                aria-label="Buang"
              >
                <X className="size-3.5" strokeWidth={2} />
              </button>
            </div>
          )}
          <div className="grid gap-2">
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
                Alt / caption singkat
              </span>
              <input
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                className="w-full rounded-xl border border-foreground/10 bg-background px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                placeholder="Spanduk acara Maulid"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
                Tags (pisah dengan koma)
              </span>
              <input
                value={tagsField}
                onChange={(e) => setTagsField(e.target.value)}
                className="w-full rounded-xl border border-foreground/10 bg-background px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                placeholder="maulid, ucapan, banner"
              />
            </label>
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-[12px] text-rose-500">{error}</p>}
      {progress && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-foreground/65">
          <Loader2 className="size-3 animate-spin" strokeWidth={1.75} />
          {progress}
        </p>
      )}

      {file && (
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <Button variant="ghost" onClick={reset} disabled={busy}>
            Batal
          </Button>
          <Button onClick={upload} disabled={busy}>
            {busy && <Loader2 className="size-3.5 animate-spin" />}
            Upload
          </Button>
        </div>
      )}
    </GlassCard>
  );
}
