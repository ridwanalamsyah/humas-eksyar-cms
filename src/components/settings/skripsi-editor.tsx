"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ExternalLink, Plus, RefreshCw, Save, Search, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import type { SkripsiItem, SkripsiSync } from "@/lib/site/skripsi";

/** Parser sisi klien — format sama dengan `parseBulk` di server. */
function parse(text: string) {
  const items: SkripsiItem[] = [];
  const errors: number[] = [];
  text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line, i) => {
      const [tahun, judul = "", nama = ""] = line.split(/\t|\s*\|\s*|\s*;\s*/);
      const t = Number(tahun);
      if (Number.isInteger(t) && t >= 1990 && t <= 2100 && judul.trim().length >= 5) {
        items.push({ tahun: t, judul: judul.trim(), nama: nama.trim() });
      } else errors.push(i + 1);
    });
  return { items, errors };
}

export function SkripsiEditor({ initial, sync }: { initial: SkripsiItem[]; sync: SkripsiSync | null }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [bulk, setBulk] = useState("");
  const [q, setQ] = useState("");
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  const [syncing, startSync] = useTransition();

  function syncDigilib() {
    if (dirty && !confirm("Perubahan yang belum disimpan akan hilang. Lanjutkan sinkronisasi?")) return;
    startSync(async () => {
      const res = await fetch("/api/skripsi/sync", { method: "POST" });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(j.error ?? "Sinkronisasi gagal");
        return;
      }
      toast.success(`${j.total.toLocaleString("id-ID")} judul · ${j.added} baru dari Digilib.`);
      setDirty(false);
      router.refresh();
    });
  }

  const preview = useMemo(() => parse(bulk), [bulk]);
  const visible = useMemo(() => {
    const n = q.trim().toLowerCase();
    return items
      .map((it, idx) => ({ it, idx }))
      .filter(({ it }) => !n || `${it.judul} ${it.nama} ${it.tahun}`.toLowerCase().includes(n))
      .slice(0, 200);
  }, [items, q]);

  function add() {
    const existing = new Set(items.map((i) => i.judul.toLowerCase()));
    const fresh = preview.items.filter((i) => !existing.has(i.judul.toLowerCase()));
    setItems([...fresh, ...items]);
    setBulk("");
    setDirty(true);
    toast.success(`${fresh.length} judul ditambahkan${preview.items.length - fresh.length ? `, ${preview.items.length - fresh.length} duplikat dilewati` : ""}.`);
  }

  function save() {
    startTransition(async () => {
      const res = await fetch("/api/skripsi", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(j.error ?? "Gagal menyimpan");
        return;
      }
      setDirty(false);
      toast.success(`${j.count} judul tersimpan.`);
      router.refresh();
    });
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <GlassCard variant="thick" className="p-5 sm:p-6 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-[17px] font-semibold">Sinkron dari Digilib</h2>
            <p className="mt-1 text-[12px] text-foreground/60">
              Mengambil judul skripsi Prodi Ekonomi Syariah dari digilib.uinsgd.ac.id dan etheses.uinsgd.ac.id. Data yang diimpor
              manual tetap dipertahankan.
            </p>
          </div>
          <Button size="sm" onClick={syncDigilib} disabled={syncing}>
            <RefreshCw className={syncing ? "size-3.5 animate-spin" : "size-3.5"} /> {syncing ? "Mengambil… (±1 menit)" : "Sinkronkan sekarang"}
          </Button>
        </div>
        {sync && (
          <p className="mt-3 text-[12px] text-foreground/60">
            Terakhir: {new Date(sync.at).toLocaleString("id-ID")} · {sync.total.toLocaleString("id-ID")} judul ({sync.added} baru)
            {sync.sources.map((s) => (
              <span key={s.label} className={s.error ? "text-red-500" : undefined}>
                {" "}
                · {s.label}: {s.error ?? `${s.items} judul, ${s.years} tahun`}
              </span>
            ))}
          </p>
        )}
      </GlassCard>

      <GlassCard variant="thick" className="p-5 sm:p-6">
        <h2 className="font-display text-[17px] font-semibold">Impor massal</h2>
        <p className="mt-1 text-[12px] text-foreground/60">
          Satu judul per baris: <span className="font-mono">Tahun | Judul | Nama</span>. Bisa langsung tempel 3 kolom dari
          Excel/Google Sheets.
        </p>
        <textarea
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          rows={10}
          placeholder={"2025 | Pengaruh Literasi Keuangan Syariah terhadap Minat Menabung Mahasiswa | Nama Mahasiswa"}
          className="mt-3 w-full resize-y rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-3 font-mono text-[12px] outline-none dark:border-white/10"
        />
        <div className="mt-3 flex items-center justify-between gap-3 text-[12px] text-foreground/60">
          <span>
            {preview.items.length} valid
            {preview.errors.length > 0 && <span className="text-red-500"> · baris tidak valid: {preview.errors.slice(0, 8).join(", ")}</span>}
          </span>
          <Button size="sm" variant="secondary" disabled={!preview.items.length} onClick={add}>
            <Plus className="size-3.5" /> Tambahkan
          </Button>
        </div>
      </GlassCard>

      <GlassCard variant="thick" className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-[17px] font-semibold">{items.length.toLocaleString("id-ID")} judul</h2>
          <Button size="sm" disabled={pending || !dirty} onClick={save}>
            <Save className="size-3.5" /> {pending ? "Menyimpan…" : dirty ? "Simpan" : "Tersimpan"}
          </Button>
        </div>
        <label className="mt-3 flex items-center gap-2 rounded-2xl border border-foreground/10 px-3 py-2 dark:border-white/10">
          <Search className="size-4 text-foreground/45" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari judul, nama, tahun…" className="w-full bg-transparent text-[14px] outline-none" />
        </label>
        <ul className="mt-3 grid max-h-[520px] gap-1 overflow-y-auto">
          {visible.map(({ it, idx }) => (
            <li key={`${idx}-${it.judul}`} className="flex items-start gap-3 rounded-xl px-2 py-2 hover:bg-foreground/5">
              <span className="w-10 shrink-0 font-mono text-[12px] text-foreground/55">{it.tahun}</span>
              <span className="min-w-0 flex-1 text-[13px]">
                {it.judul}
                {it.nama && <span className="block text-[11px] text-foreground/50">{it.nama}</span>}
              </span>
              {it.url && (
                <a href={it.url} target="_blank" rel="noopener noreferrer" aria-label="Buka di Digilib" className="text-foreground/40 hover:text-foreground">
                  <ExternalLink className="size-3.5" />
                </a>
              )}
              <button
                type="button"
                aria-label="Hapus"
                onClick={() => {
                  setItems(items.filter((_, k) => k !== idx));
                  setDirty(true);
                }}
                className="text-foreground/40 hover:text-red-500"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
          {items.length === 0 && <li className="py-10 text-center text-[13px] text-foreground/55">Belum ada data. Impor dari kolom kiri.</li>}
        </ul>
      </GlassCard>
    </div>
  );
}
