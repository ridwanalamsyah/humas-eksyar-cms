"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Status = { connected: boolean; username?: string | null; error?: string };

/**
 * Sambungkan Instagram resmi (khusus admin): tempel access token dari Meta,
 * sistem mengeceknya ke Instagram, lalu menyimpannya. Setelah tersambung,
 * bagian Instagram di beranda website muncul dengan unggahan asli.
 */
export function InstagramConnect() {
  const [status, setStatus] = useState<Status | null>(null);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/instagram/token")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ connected: false }));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/instagram/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const j = (await res.json()) as Status;
      if (!res.ok) throw new Error(j.error || "Gagal menyambungkan.");
      setStatus(j);
      setToken("");
      toast.success(`Instagram @${j.username} tersambung.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyambungkan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-foreground/[0.08] bg-canvas p-5 sm:p-6">
      <h2 className="flex items-center gap-2 text-[16px] font-bold">
        <Link2 className="size-4" strokeWidth={1.75} /> Sambungkan Instagram resmi
      </h2>
      {status === null ? (
        <p className="mt-2 flex items-center gap-2 text-[14px] text-foreground/65">
          <Loader2 className="size-4 animate-spin" /> Mengecek sambungan…
        </p>
      ) : status.connected ? (
        <p className="mt-2 flex items-center gap-2 text-[14px] text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-4" /> Tersambung ke @{status.username}. Unggahan terbaru
          tampil di beranda website, dan token diperpanjang otomatis.
        </p>
      ) : (
        <p className="mt-2 text-[14px] text-foreground/70">
          {status.error ??
            "Belum tersambung. Bagian Instagram di beranda disembunyikan sampai tersambung."}
        </p>
      )}

      <form onSubmit={save} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="ig-token" className="sr-only">
          Access token Instagram
        </label>
        <input
          id="ig-token"
          type="password"
          autoComplete="off"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Tempel access token Instagram di sini"
          className="h-11 min-w-0 flex-1 rounded-xl border border-foreground/10 bg-foreground/[0.03] px-3 text-[14px] outline-none focus:border-brand-500/40"
        />
        <Button type="submit" disabled={busy || token.trim().length < 20} className="h-11">
          {busy ? <Loader2 className="size-4 animate-spin" /> : null}
          {status?.connected ? "Ganti token" : "Sambungkan"}
        </Button>
      </form>
      <details className="mt-3 text-[14px] text-foreground/70">
        <summary className="flex min-h-10 cursor-pointer items-center font-medium">
          Cara mendapatkan token
        </summary>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          <li>Di aplikasi Instagram, jadikan @eksyaruinsgd akun profesional (Kreator atau Bisnis).</li>
          <li>Buka developers.facebook.com → Buat aplikasi → tambahkan produk Instagram, pilih “API setup with Instagram login”.</li>
          <li>Di bagian “Generate access tokens”, tambahkan akun @eksyaruinsgd lalu tekan Generate token.</li>
          <li>Salin token itu, tempel di kotak di atas, tekan Sambungkan.</li>
        </ol>
      </details>
    </section>
  );
}
