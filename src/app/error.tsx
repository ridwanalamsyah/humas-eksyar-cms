"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error boundary:", error);
  }, [error]);
  return (
    <AppShell hideDock>
      <div className="grid place-items-center py-12">
        <GlassCard variant="thick" className="max-w-lg p-8 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-500/15">
            <AlertTriangle className="size-7 text-rose-600" strokeWidth={1.5} />
          </div>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
            500 · sesuatu rusak
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            Ada error tak terduga.
          </h1>
          <p className="mx-auto mt-2 max-w-prose text-[13px] text-foreground/65">
            Tim teknis sudah dapat log-nya. Coba muat ulang halaman.
          </p>
          {error.digest && (
            <code className="mx-auto mt-3 inline-block rounded-lg border border-foreground/10 bg-foreground/[0.04] px-2 py-1 font-mono text-[10px] text-foreground/55">
              Trace: {error.digest}
            </code>
          )}
          <div className="mt-5 flex items-center justify-center">
            <Button onClick={() => reset()}>
              <RefreshCcw className="size-4" strokeWidth={1.75} /> Coba lagi
            </Button>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
