import { ArrowUpRight } from "lucide-react";
import type { Mitra } from "@/lib/site/schema";

/** Kartu mitra kerja sama: nama lembaga (tanpa logo agar tidak melanggar merek) + bentuk kerja sama. */
export function MitraList({
  items,
  compact = false,
}: {
  items: Mitra[];
  compact?: boolean;
}) {
  return (
    <ul
      className={
        compact
          ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          : "grid gap-4 sm:grid-cols-2"
      }
    >
      {items.map((m) => {
        const body = (
          <>
            <span className="flex items-start justify-between gap-3">
              <span className="text-[17px] font-bold leading-snug text-label">
                {m.name}
              </span>
              {m.url && (
                <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-label-3 transition-colors group-hover:text-accent" />
              )}
            </span>
            {m.description && (
              <span className="mt-1.5 block text-[14.5px] leading-[1.5] text-label-2">
                {m.description}
              </span>
            )}
          </>
        );
        const cls =
          "group block h-full rounded-[20px] border border-hairline bg-canvas p-5 transition-colors hover:border-accent/40";
        return (
          <li key={m.name}>
            {m.url ? (
              <a
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
              >
                {body}
              </a>
            ) : (
              <div className={cls}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
