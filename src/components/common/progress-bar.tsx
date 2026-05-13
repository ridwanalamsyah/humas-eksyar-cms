import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0..1
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  /** Show animated shimmer shimmer over fill */
  shimmer?: boolean;
}

export function ProgressBar({
  value,
  className,
  trackClassName,
  fillClassName,
  shimmer = true,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-foreground/10 dark:bg-white/10",
        trackClassName,
        className,
      )}
      role="progressbar"
      aria-valuenow={Math.round(pct * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span
        className={cn(
          "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-brand-500 shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]",
          fillClassName,
        )}
        style={{ width: `${pct * 100}%`, transition: "width 0.6s cubic-bezier(0.32,0.72,0,1)" }}
      />
      {shimmer && pct > 0 && pct < 1 && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 -translate-x-full animate-shimmer rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
          style={{ width: `${pct * 100}%` }}
        />
      )}
    </div>
  );
}
