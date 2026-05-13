import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Compass, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <AppShell hideDock>
      <div className="grid place-items-center py-12">
        <GlassCard variant="thick" className="max-w-lg p-8 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-gold-400/15">
            <Compass className="size-7 text-brand-600 dark:text-brand-300" strokeWidth={1.5} />
          </div>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
            404 · halaman tidak ditemukan
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Sepertinya nyasar.
          </h1>
          <p className="mx-auto mt-2 max-w-prose text-[13px] text-foreground/65">
            Halaman yang kamu cari belum ada (atau pindah). Tidak masalah —
            mari kembali ke jalur utama.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Button asChild>
              <Link href="/">
                <Home className="size-4" strokeWidth={1.75} /> Dashboard
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/captions/playground">
                <Sparkles className="size-4" strokeWidth={1.75} /> AI Caption
              </Link>
            </Button>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
