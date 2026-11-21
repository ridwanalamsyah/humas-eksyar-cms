"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, ImagePlus, Images, Loader2, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ContentChannel, ContentRubric, MediaAsset, Member, Rubric } from "@/lib/data/types";
import { HASHTAG_BLOCK } from "@/lib/fixtures/contents";
import { cn } from "@/lib/utils";

interface Props {
  media: MediaAsset[];
  author: Member;
  rubrics: Rubric[];
  defaultHashtags?: string;
}

type Kind = "kegiatan" | "buletin" | "pengumuman";

const KINDS: { value: Kind; label: string; hint: string; placeholder: string }[] = [
  {
    value: "kegiatan",
    label: "Berita kegiatan",
    hint: "Liputan acara oleh tim Humas.",
    placeholder:
      "Contoh: Seminar Literasi Wakaf Produktif, Kamis 12 Desember 2026, Aula FEBI. Narasumber Dr. ... dari BWI. Diikuti 120 mahasiswa. Poin penting: ...",
  },
  {
    value: "buletin",
    label: "Buletin Mahasiswa",
    hint: "Artikel opini/analisis ekonomi syariah karya mahasiswa.",
    placeholder:
      "Topik, gagasan utama, dan poin argumen. Contoh: Peran sukuk hijau untuk transisi energi. Poin: 1) ... 2) ... Sumber yang dipakai: ...",
  },
  {
    value: "pengumuman",
    label: "Pengumuman",
    hint: "Informasi resmi untuk mahasiswa.",
    placeholder: "Apa yang diumumkan, untuk siapa, batas waktu, dan cara/tautan pendaftaran.",
  },
];

const field =
  "w-full rounded-xl border border-foreground/10 bg-white px-3.5 py-3 text-[15px] outline-none transition focus:border-brand-500/50 focus:ring-3 focus:ring-brand-500/10";

/** Foto apa pun → JPG maks 2048 px (Instagram hanya menerima JPG; unggahan lebih ringan). */
async function toJpeg(file: File): Promise<{ file: File; width: number; height: number }> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 2048 / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
  const blob: Blob = await new Promise((r, j) => canvas.toBlob((b) => (b ? r(b) : j(new Error("Foto gagal diproses."))), "image/jpeg", 0.86));
  return { file: new File([blob], file.name.replace(/\.[a-z0-9]+$/i, "") + ".jpg", { type: "image/jpeg" }), width: w, height: h };
}

/**
 * Editor "foto + konteks → beres": pilih jenis tulisan, beri foto dan konteks,
 * AI menyusun judul, isi, dan caption Instagram; tim tinggal memeriksa lalu
 * menerbitkan. Saat terbit, postingan ikut dikirim ke Instagram bila dicentang.
 */
export function ContentEditor({ media, author, rubrics, defaultHashtags }: Props) {
  const router = useRouter();
  const isWriter = author.role === "anggota";
  const canPublish = !["anggota", "monitoring", "pending"].includes(author.role);
  const [pending, startTransition] = useTransition();
  const [writing, setWriting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [library, setLibrary] = useState(media);
  const [showLibrary, setShowLibrary] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [kind, setKind] = useState<Kind>(isWriter ? "buletin" : "kegiatan");
  const categories = useMemo(
    () => rubrics.filter((r) => r.slug !== "buletin_hmj" && r.slug !== "pengumuman"),
    [rubrics],
  );
  const [category, setCategory] = useState<string>(
    categories.find((r) => r.slug === "dokumentasi")?.slug ?? categories[0]?.slug ?? "dokumentasi",
  );
  const [photos, setPhotos] = useState<string[]>([]);
  const [context, setContext] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState(defaultHashtags ?? HASHTAG_BLOCK);
  const [toInstagram, setToInstagram] = useState(true);

  const kindInfo = KINDS.find((k) => k.value === kind)!;
  const rubric: ContentRubric = (kind === "buletin" ? "buletin_hmj" : kind === "pengumuman" ? "pengumuman" : category) as ContentRubric;
  const byId = useMemo(() => new Map(library.map((m) => [m.id, m])), [library]);

  async function upload(files: FileList) {
    setUploading(true);
    try {
      for (const f of Array.from(files).slice(0, 10)) {
        const { file, width, height } = await toJpeg(f);
        const form = new FormData();
        form.append("file", file);
        form.append("width", String(width));
        form.append("height", String(height));
        form.append("alt", title || context.slice(0, 80) || "Foto kegiatan Ekonomi Syariah");
        form.append("tags", kind);
        const res = await fetch("/api/media", { method: "POST", body: form });
        const j = await res.json().catch(() => ({}));
        if (!res.ok || !j.media) throw new Error(j.error ?? "Foto gagal diunggah.");
        setLibrary((cur) => [j.media as MediaAsset, ...cur]);
        setPhotos((cur) => [...cur, (j.media as MediaAsset).id].slice(0, 10));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Foto gagal diunggah.");
    } finally {
      setUploading(false);
    }
  }

  async function writeWithAI() {
    if (context.trim().length < 20) {
      toast.error("Tulis konteks dulu, minimal satu-dua kalimat.");
      return;
    }
    setWriting(true);
    try {
      const res = await fetch("/api/ai/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, context, title, mediaIds: photos }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "AI gagal menulis.");
      setTitle(j.title);
      setBody(j.body);
      setCaption(j.caption);
      if (j.hashtags) setHashtags(j.hashtags);
      toast.success("Tulisan siap. Periksa dulu sebelum diterbitkan.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI gagal menulis.");
    } finally {
      setWriting(false);
    }
  }

  function submit(action: "draft" | "review" | "publish") {
    if (!title.trim()) return toast.error("Judul wajib diisi.");
    if (action !== "draft" && !body.trim()) return toast.error("Isi tulisan masih kosong. Tekan “Tulis dengan AI” atau tulis sendiri.");
    const channels: ContentChannel[] = toInstagram && photos.length ? ["instagram"] : ["internal"];
    startTransition(async () => {
      const status = action === "publish" ? "published" : action === "review" ? "review_divisi" : "draft";
      const res = await fetch("/api/contents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), rubric, status, body, caption, hashtags, channels, mediaIds: photos }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(j.error ?? "Gagal menyimpan.");
        return;
      }
      toast.success(
        action === "publish"
          ? channels.includes("instagram")
            ? "Terbit di website. Sedang dikirim ke Instagram…"
            : "Terbit di website."
          : action === "review"
            ? "Dikirim untuk diperiksa."
            : "Draf tersimpan.",
      );
      router.push(j.content?.id ? `/content/${j.content.id}` : "/content");
      router.refresh();
    });
  }

  const titleWords = title.trim() ? title.trim().split(/\s+/).length : 0;

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div className="space-y-6">
        {/* 1. Jenis */}
        <section className="rounded-2xl border border-foreground/10 bg-white p-5">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/50">1 · Jenis tulisan</h2>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {KINDS.filter((k) => !isWriter || k.value === "buletin").map((k) => (
              <button
                key={k.value}
                type="button"
                onClick={() => setKind(k.value)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left transition-colors",
                  kind === k.value ? "border-brand-500/60 bg-brand-500/[0.07]" : "border-foreground/10 hover:bg-foreground/[0.03]",
                )}
              >
                <span className="block text-[15px] font-semibold">{k.label}</span>
                <span className="block text-[13px] text-foreground/60">{k.hint}</span>
              </button>
            ))}
          </div>
          {kind === "kegiatan" && categories.length > 1 && (
            <label className="mt-3 flex items-center gap-2 text-[14px] text-foreground/70">
              Kategori
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 rounded-lg border border-foreground/10 bg-white px-2 text-[14px]">
                {categories.map((r) => (
                  <option key={r.id} value={r.slug}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </section>

        {/* 2. Foto + konteks */}
        <section className="rounded-2xl border border-foreground/10 bg-white p-5">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/50">2 · Foto & konteks</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {photos.map((id) => {
              const m = byId.get(id);
              return (
                <div key={id} className="relative size-24 overflow-hidden rounded-xl bg-foreground/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {m && <img src={m.url} alt={m.alt} className="size-full object-cover" />}
                  <button
                    type="button"
                    onClick={() => setPhotos((cur) => cur.filter((x) => x !== id))}
                    aria-label="Lepas foto"
                    className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-black/60 text-white"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="grid size-24 place-items-center rounded-xl border border-dashed border-foreground/20 text-[12px] text-foreground/60 hover:bg-foreground/[0.03]"
            >
              {uploading ? <Loader2 className="size-5 animate-spin" /> : (
                <span className="flex flex-col items-center gap-1"><ImagePlus className="size-5" />Unggah</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowLibrary((v) => !v)}
              className="grid size-24 place-items-center rounded-xl border border-dashed border-foreground/20 text-[12px] text-foreground/60 hover:bg-foreground/[0.03]"
            >
              <span className="flex flex-col items-center gap-1"><Images className="size-5" />Dari Media</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                if (e.target.files?.length) void upload(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
          {showLibrary && (
            <div className="mt-3 grid max-h-64 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6">
              {library.slice(0, 60).map((m) => {
                const on = photos.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPhotos((cur) => (on ? cur.filter((x) => x !== m.id) : [...cur, m.id].slice(0, 10)))}
                    className={cn("relative aspect-square overflow-hidden rounded-lg", on && "ring-2 ring-brand-500")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.url} alt={m.alt} loading="lazy" className="size-full object-cover" />
                    {on && <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-brand-600 text-white"><Check className="size-3" /></span>}
                  </button>
                );
              })}
            </div>
          )}
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={5}
            placeholder={kindInfo.placeholder}
            className={cn(field, "mt-4 resize-y")}
          />
          <Button type="button" onClick={writeWithAI} disabled={writing} className="mt-3 h-12 w-full gap-2 text-[15px] sm:w-auto">
            {writing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {writing ? "AI sedang menulis…" : body ? "Tulis ulang dengan AI" : "Tulis dengan AI"}
          </Button>
        </section>

        {/* 3. Hasil */}
        <section className="rounded-2xl border border-foreground/10 bg-white p-5">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/50">3 · Periksa tulisan</h2>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul"
            className="mt-3 w-full bg-transparent text-[22px] font-semibold leading-tight tracking-tight outline-none placeholder:text-foreground/35 sm:text-[26px]"
          />
          <p className={cn("mt-1 text-[13px]", titleWords > 10 ? "text-amber-600" : "text-foreground/50")}>{titleWords} kata · judul sebaiknya maks 10 kata</p>
          <label className="mt-4 block text-[13px] font-medium text-foreground/60">
            Isi untuk website
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={14} placeholder="Isi tulisan muncul di sini." className={cn(field, "mt-1.5 resize-y leading-relaxed")} />
          </label>
        </section>
      </div>

      {/* Samping: Instagram + kirim */}
      <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <section className="rounded-2xl border border-foreground/10 bg-white p-5">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/50">Instagram</h2>
          <label className="mt-3 flex items-start gap-2.5 text-[14px]">
            <input type="checkbox" checked={toInstagram} onChange={(e) => setToInstagram(e.target.checked)} className="mt-0.5 size-4" />
            <span>
              Kirim juga ke Instagram saat terbit
              {!photos.length && <span className="block text-[13px] text-amber-700">Butuh minimal satu foto.</span>}
            </span>
          </label>
          <label className="mt-4 block text-[13px] font-medium text-foreground/60">
            Caption
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={7} placeholder="Caption dibuat AI bersama tulisan." className={cn(field, "mt-1.5 resize-y text-[14px]")} />
          </label>
          <label className="mt-3 block text-[13px] font-medium text-foreground/60">
            Hashtag
            <input value={hashtags} onChange={(e) => setHashtags(e.target.value)} className={cn(field, "mt-1.5 py-2.5 text-[14px]")} />
          </label>
        </section>

        <section className="space-y-2 rounded-2xl border border-foreground/10 bg-white p-5">
          {canPublish && (
            <Button onClick={() => submit("publish")} disabled={pending} className="h-12 w-full gap-2 text-[15px]">
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Terbitkan{toInstagram && photos.length ? " + Instagram" : ""}
            </Button>
          )}
          <Button onClick={() => submit("review")} disabled={pending} variant={canPublish ? "secondary" : "primary"} className="h-11 w-full">
            Kirim untuk diperiksa
          </Button>
          <Button onClick={() => submit("draft")} disabled={pending} variant="ghost" className="h-11 w-full">
            Simpan draf
          </Button>
          {isWriter && <p className="pt-1 text-[13px] text-foreground/60">Tulisanmu terbit setelah diperiksa tim Humas.</p>}
        </section>
      </aside>
    </div>
  );
}
