"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Tombol sinkron mata kuliah & dosen pengampu dari e-Knows. */
export function AkademikSyncCard({ info }: { info: { at: string; mataKuliah: number; dosen: number; errors: number } | null }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function sync() {
    start(async () => {
      const res = await fetch("/api/akademik/sync", { method: "POST" });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(j.error ?? "Sinkronisasi gagal");
        return;
      }
      toast.success(`${j.mataKuliah} mata kuliah & ${j.dosen} dosen pengampu diperbarui.`);
      router.refresh();
    });
  }

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-foreground/10 px-4 py-3 dark:border-white/10">
      <div className="min-w-0">
        <p className="text-[14px] font-semibold">Mata kuliah & dosen pengampu dari e-Knows</p>
        <p className="text-[12px] text-foreground/60">
          {info
            ? `Terakhir ${new Date(info.at).toLocaleString("id-ID")} · ${info.mataKuliah} mata kuliah · ${info.dosen} dosen${info.errors ? ` · ${info.errors} halaman gagal` : ""}`
            : "Belum pernah disinkronkan. Data diambil dari kategori Ekonomi Syariah di eknows.uinsgd.ac.id dan diperbarui otomatis tiap Senin."}
        </p>
      </div>
      <Button size="sm" variant="secondary" onClick={sync} disabled={pending}>
        <RefreshCw className={pending ? "size-3.5 animate-spin" : "size-3.5"} /> {pending ? "Mengambil…" : "Sinkronkan"}
      </Button>
    </div>
  );
}
