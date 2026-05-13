import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";

export default function Loading() {
  return (
    <AppShell>
      <div className="space-y-4">
        <Shimmer className="h-8 w-1/2" />
        <Shimmer className="h-4 w-2/3" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <GlassCard key={i} className="h-24 animate-pulse" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <GlassCard className="h-72 animate-pulse" />
          <GlassCard className="h-72 animate-pulse" />
        </div>
      </div>
    </AppShell>
  );
}

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-foreground/[0.06] dark:bg-white/[0.05] ${className ?? ""}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </div>
  );
}
