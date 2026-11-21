"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Status = { at: string; ok: boolean; permalink?: string; error?: string } | null;

/** Status posting Instagram untuk satu konten, dengan tombol kirim/kirim ulang. */
export function InstagramPostStatus({ contentId, published, canPost }: { contentId: string; published: boolean; canPost: boolean }) {
  const [status, setStatus] = useState<Status | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch(`/api/contents/${contentId}/instagram`)
        .then((r) => r.json())
        .then((j) => alive && setStatus(j.status ?? null))
        .catch(() => alive && setStatus(null));
    load();
    // Posting otomatis berjalan di latar; cek lagi sebentar setelah halaman dibuka.
    const t = setTimeout(load, 12000);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [contentId]);

  async function post() {
    setBusy(true);
    try {
      const res = await fetch(`/api/contents/${contentId}/instagram`, { method: "POST" });
      const j = await res.json().catch(() => ({}));
      setStatus(j.status ?? null);
      if (res.ok) toast.success("Terkirim ke Instagram.");
      else toast.error(j.status?.error ?? j.error ?? "Gagal mengirim ke Instagram.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-foreground/10 bg-white p-5">
      <h3 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/50">Instagram</h3>
      {status === undefined ? (
        <p className="mt-2 flex items-center gap-2 text-[14px] text-foreground/60">
          <Loader2 className="size-4 animate-spin" /> Mengecek…
        </p>
      ) : status?.ok ? (
        <p className="mt-2 text-[14px] text-emerald-700">
          Sudah diposting.{" "}
          {status.permalink && (
            <a href={status.permalink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold underline">
              Lihat <ExternalLink className="size-3.5" />
            </a>
          )}
        </p>
      ) : status?.error ? (
        <p className="mt-2 text-[14px] text-red-700">{status.error}</p>
      ) : (
        <p className="mt-2 text-[14px] text-foreground/60">{published ? "Belum dikirim ke Instagram." : "Dikirim otomatis saat terbit (bila dicentang)."}</p>
      )}
      {canPost && published && !status?.ok && (
        <Button onClick={post} disabled={busy} size="sm" className="mt-3 gap-2">
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {status?.error ? "Coba kirim lagi" : "Kirim ke Instagram"}
        </Button>
      )}
    </div>
  );
}
