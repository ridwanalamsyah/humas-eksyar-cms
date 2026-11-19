"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Item = { permalink: string; image: string; caption: string };
const MAX = 6;
const IG_POST = /^https:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[\w-]+/i;

/**
 * Instagram tanpa API: tim menempel tautan unggahan asli dan mengunggah
 * fotonya. Beranda menampilkan maksimal enam unggahan ini, masing-masing
 * menuju unggahan aslinya di Instagram.
 */
export function InstagramPilihan() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [link, setLink] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/instagram/pilihan")
      .then((r) => r.json())
      .then((j: { items?: Item[] }) => setItems(j.items ?? []))
      .catch(() => setItems([]));
  }, []);

  async function save(next: Item[], msg: string) {
    const res = await fetch("/api/instagram/pilihan", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: next }),
    });
    const j = (await res.json()) as { items?: Item[]; error?: string };
    if (!res.ok) throw new Error(j.error || "Gagal menyimpan.");
    setItems(j.items ?? []);
    toast.success(msg);
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !IG_POST.test(link.trim())) return;
    setBusy(true);
    try {
      // Foto disimpan di Pustaka Media supaya tidak bergantung pada server Instagram.
      const form = new FormData();
      form.append("file", file);
      form.append("alt", caption || "Unggahan Instagram @eksyaruinsgd");
      form.append("tags", "instagram");
      const up = await fetch("/api/media", { method: "POST", body: form });
      const uj = (await up.json()) as { media?: { url: string }; error?: string };
      if (!up.ok || !uj.media) throw new Error(uj.error || "Foto gagal diunggah.");
      const next = [{ permalink: link.trim(), image: uj.media.url, caption: caption.trim() }, ...(items ?? [])].slice(0, MAX);
      await save(next, "Unggahan ditambahkan ke beranda.");
      setLink("");
      setCaption("");
      setFile(null);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menambahkan.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(i: number) {
    if (!items) return;
    try {
      await save(items.filter((_, k) => k !== i), "Unggahan dihapus dari beranda.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus.");
    }
  }

  const linkOk = IG_POST.test(link.trim());

  return (
    <section className="mt-6 rounded-2xl border border-foreground/[0.08] bg-canvas p-5 sm:p-6">
      <h2 className="text-[16px] font-bold">Unggahan pilihan untuk beranda (tanpa API)</h2>
      <p className="mt-1 max-w-prose text-[14px] text-foreground/70">
        Tempel tautan unggahan Instagram dan unggah fotonya. Maksimal {MAX} unggahan; yang terbaru
        tampil paling depan. Dipakai selama Instagram API belum tersambung.
      </p>

      {items === null ? (
        <p className="mt-4 flex items-center gap-2 text-[14px] text-foreground/65">
          <Loader2 className="size-4 animate-spin" /> Memuat…
        </p>
      ) : items.length > 0 ? (
        <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {items.map((it, i) => (
            <li key={it.permalink} className="group relative">
              <a href={it.permalink} target="_blank" rel="noopener noreferrer" className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image} alt={it.caption || "Unggahan Instagram"} className="aspect-square w-full rounded-xl object-cover" />
              </a>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Hapus dari beranda"
                className="absolute right-1.5 top-1.5 grid grid-cols-1 size-9 place-items-center rounded-full bg-black/60 text-white"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-[14px] text-foreground/65">Belum ada. Bagian Instagram di beranda disembunyikan.</p>
      )}

      {(items?.length ?? 0) < MAX && (
        <form onSubmit={add} className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <label className="grid grid-cols-1 gap-1 text-[13px] font-medium text-foreground/70">
            Tautan unggahan Instagram
            <input
              type="url"
              required
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://www.instagram.com/p/…"
              className="h-11 rounded-xl border border-foreground/10 bg-foreground/[0.03] px-3 text-[14px] text-foreground outline-none focus:border-brand-500/40"
            />
            {link && !linkOk && (
              <span className="text-[13px] text-amber-700">Pakai tautan satu unggahan, mis. https://www.instagram.com/p/ABC123/</span>
            )}
          </label>
          <label className="grid grid-cols-1 gap-1 text-[13px] font-medium text-foreground/70">
            Foto (JPG/PNG, dari unggahan itu)
            <input
              type="file"
              required
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-[14px] file:mr-3 file:h-11 file:rounded-xl file:border-0 file:bg-foreground/[0.06] file:px-4 file:font-medium"
            />
          </label>
          <label className="grid grid-cols-1 gap-1 text-[13px] font-medium text-foreground/70 sm:col-span-2">
            Keterangan singkat (opsional)
            <input
              value={caption}
              maxLength={150}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Mis. Studium Generale Wakaf Produktif"
              className="h-11 rounded-xl border border-foreground/10 bg-foreground/[0.03] px-3 text-[14px] text-foreground outline-none focus:border-brand-500/40"
            />
          </label>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={busy || !file || !linkOk} className="h-11">
              {busy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
              Tambah ke beranda
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
