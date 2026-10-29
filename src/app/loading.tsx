export default function Loading() {
  return (
    <div className="mx-auto max-w-[1024px] px-4 py-12 sm:px-6">
      <div className="space-y-4">
        <Shimmer className="h-8 w-1/2" />
        <Shimmer className="h-4 w-2/3" />
        <div className="grid gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Shimmer key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-4 pt-2 lg:grid-cols-[2fr_1fr]">
          <Shimmer className="h-72 rounded-2xl" />
          <Shimmer className="h-72 rounded-2xl" />
        </div>
      </div>
    </div>
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
