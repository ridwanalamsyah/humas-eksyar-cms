"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ExternalLink,
  ImagePlus,
  Loader2,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Post = {
  shortcode: string;
  permalink: string;
  caption: string;
  timestamp: string;
  images: string[];
  imported: { contentId: string; title: string } | null;
};

type Feed = { configured: boolean; posts?: Post[]; error?: string };

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { dateStyle: "medium" });

export function InstagramImporter({
  isAdmin,
  lastSync,
}: {
  isAdmin: boolean;
  lastSync: { at: string; imported: number; error?: string } | null;
}) {
  const router = useRouter();
  const [feed, setFeed] = useState<Feed | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [publish, setPublish] = useState(false);
  const [syncing, startSync] = useTransition();

  async function load() {
    const res = await fetch("/api/instagram/posts");
    setFeed(
      (await res
        .json()
        .catch(() => ({ configured: false, error: "Gagal memuat" }))) as Feed,
    );
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  async function importOne(body: Record<string, unknown>, key: string) {
    setBusy(key);
    try {
      const res = await fetch("/api/instagram/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, publish }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(j.error ?? "Gagal membuat artikel");
        return false;
      }
      toast.success(
        `${publish ? "Terbit" : "Draft dibuat"}: ${j.title}${j.ai ? "" : " (tanpa AI)"}`,
        {
          action: {
            label: "Buka",
            onClick: () => router.push(`/content/${j.id}`),
          },
        },
      );
      await load();
      router.refresh();
      return true;
    } finally {
      setBusy(null);
    }
  }

  function syncAll() {
    startSync(async () => {
      const res = await fetch("/api/instagram/sync", { method: "POST" });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) toast.error(j.error ?? "Sinkronisasi gagal");
      else toast.success(`${j.imported} postingan baru dijadikan draf berita.`);
      await load();
      router.refresh();
    });
  }

  return (
    <div className="mt-6 grid gap-6">
      {isAdmin && (
        <label className="flex w-fit items-center gap-2 text-[13px] text-foreground/70">
          <input
            type="checkbox"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
          />
          Langsung terbitkan di website (tanpa diperiksa)
        </label>
      )}

      {/* Dari akun Instagram yang terhubung */}
      <section className="glass-regular rounded-xl">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/[0.07] px-5 py-3.5">
          <div>
            <h2 className="text-[15px] font-semibold">
              Postingan @eksyaruinsgd
            </h2>
            <p className="text-[12px] text-foreground/55">
              {lastSync
                ? `Sinkron otomatis terakhir ${new Date(lastSync.at).toLocaleString("id-ID")} · ${lastSync.imported} draft baru${lastSync.error ? ` · galat: ${lastSync.error}` : ""}`
                : "Postingan baru otomatis dijadikan draf berita setiap hari."}
            </p>
          </div>
          {isAdmin && feed?.configured && (
            <Button
              size="sm"
              variant="secondary"
              onClick={syncAll}
              disabled={syncing}
            >
              <RefreshCw
                className={syncing ? "size-3.5 animate-spin" : "size-3.5"}
              />{" "}
              Jadikan semua yang baru
            </Button>
          )}
        </header>

        {!feed ? (
          <p className="flex items-center gap-2 px-5 py-8 text-[13px] text-foreground/55">
            <Loader2 className="size-4 animate-spin" /> Memuat postingan…
          </p>
        ) : !feed.configured ? (
          <div className="px-5 py-6 text-[13px] leading-relaxed text-foreground/70">
            <p className="font-medium text-foreground">
              Akun Instagram belum terhubung.
            </p>
            <p className="mt-1">
              Sementara itu, gunakan impor manual di bawah. Untuk menghubungkan
              (sekali saja, oleh admin):
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>
                Pastikan @eksyaruinsgd adalah akun <b>Profesional</b>{" "}
                (Kreator/Bisnis) di pengaturan Instagram.
              </li>
              <li>
                <i>Untuk pengelola teknis:</i> buat aplikasi di{" "}
                <span className="font-mono">developers.facebook.com</span> →
                produk <b>Instagram</b> → “API setup with Instagram login”,
                tambahkan akun @eksyaruinsgd, lalu buat <b>access token</b>.
              </li>
              <li>
                Simpan kode akses itu di pengaturan Vercel dengan nama{" "}
                <span className="font-mono">INSTAGRAM_ACCESS_TOKEN</span>, lalu
                terbitkan ulang website. Kode akses diperpanjang otomatis.
              </li>
            </ol>
          </div>
        ) : feed.error ? (
          <p className="px-5 py-6 text-[13px] text-red-500">{feed.error}</p>
        ) : (
          <ul className="grid gap-px bg-foreground/[0.06] sm:grid-cols-2 lg:grid-cols-3">
            {(feed.posts ?? []).map((p) => (
              <li key={p.shortcode} className="flex flex-col bg-background p-4">
                <div className="flex gap-3">
                  {p.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.images[0]}
                      alt=""
                      className="size-20 shrink-0 rounded-lg object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-[11.5px] text-foreground/50">
                      {fmt(p.timestamp)} · {p.images.length} foto
                    </p>
                    <p className="mt-1 line-clamp-4 text-[12.5px] leading-snug text-foreground/80">
                      {p.caption || "(tanpa caption)"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <a
                    href={p.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[12px] text-foreground/55 hover:text-foreground"
                  >
                    Instagram <ExternalLink className="size-3" />
                  </a>
                  {p.imported ? (
                    <Link
                      href={`/content/${p.imported.contentId}`}
                      className="text-[12.5px] font-medium text-emerald-600 hover:underline"
                    >
                      Sudah jadi artikel ›
                    </Link>
                  ) : (
                    <Button
                      size="sm"
                      disabled={!!busy}
                      onClick={() =>
                        importOne({ shortcode: p.shortcode }, p.shortcode)
                      }
                    >
                      {busy === p.shortcode ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="size-3.5" />
                      )}{" "}
                      Jadikan artikel
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ManualImport
        busy={busy === "manual"}
        onSubmit={(body) => importOne(body, "manual")}
      />
    </div>
  );
}

function ManualImport({
  busy,
  onSubmit,
}: {
  busy: boolean;
  onSubmit: (body: Record<string, unknown>) => Promise<boolean>;
}) {
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, 10 - images.length)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload/file", {
          method: "POST",
          body: fd,
        });
        const j = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(j.error ?? "Gagal mengunggah foto");
          break;
        }
        setImages((prev) => [...prev, j.url]);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="glass-regular rounded-xl p-5">
      <h2 className="text-[15px] font-semibold">Impor manual</h2>
      <p className="mt-1 text-[12px] text-foreground/55">
        Tempel tautan postingan dan caption-nya (salin dari Instagram), unggah
        fotonya, lalu AI menyusun artikel berita.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-[2fr_1fr]">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.instagram.com/p/…"
          className="rounded-lg border border-foreground/10 bg-transparent px-3 py-2 text-[14px] outline-none focus:border-foreground/30"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Tanggal unggahan"
          className="rounded-lg border border-foreground/10 bg-transparent px-3 py-2 text-[14px] outline-none focus:border-foreground/30"
        />
      </div>
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={7}
        placeholder="Tempel caption Instagram di sini…"
        className="mt-3 w-full rounded-lg border border-foreground/10 bg-transparent p-3 text-[14px] outline-none focus:border-foreground/30"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {images.map((src) => (
          <span key={src} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="size-16 rounded-lg object-cover" />
            <button
              type="button"
              aria-label="Hapus foto"
              onClick={() => setImages(images.filter((x) => x !== src))}
              className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-foreground text-background"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <label className="grid size-16 cursor-pointer place-items-center rounded-lg border border-dashed border-foreground/20 text-foreground/50 hover:text-foreground">
          {uploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ImagePlus className="size-4" />
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            hidden
            onChange={(e) => upload(e.target.files)}
          />
        </label>
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          disabled={busy || uploading || !url || caption.trim().length < 20}
          onClick={async () => {
            const ok = await onSubmit({
              url,
              caption,
              imageUrls: images,
              timestamp: date
                ? new Date(`${date}T09:00:00+07:00`).toISOString()
                : undefined,
            });
            if (ok) {
              setUrl("");
              setCaption("");
              setDate("");
              setImages([]);
            }
          }}
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Sparkles className="size-4" />
          )}{" "}
          Buat artikel
        </Button>
      </div>
    </section>
  );
}
