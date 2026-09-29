/** Deretan nama berjalan tanpa henti (berhenti saat disorot / reduced motion). */
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-12 pr-12"
    >
      {items.map((m) => (
        <li
          key={m}
          className="whitespace-nowrap text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-bold tracking-[-0.02em] text-label-3"
        >
          {m}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
      <div className="flex animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
