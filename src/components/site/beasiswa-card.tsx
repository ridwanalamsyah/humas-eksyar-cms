import { ArrowUpRight, CalendarDays, Check } from "lucide-react";
import type { Beasiswa } from "@/lib/site/schema";

/** Kartu beasiswa: penyelenggara, periode, syarat singkat, tautan daftar. */
export function BeasiswaCard({
  item,
  compact = false,
}: {
  item: Beasiswa;
  compact?: boolean;
}) {
  const reqs = compact ? item.requirements.slice(0, 2) : item.requirements;
  return (
    <article className="group flex h-full flex-col rounded-[24px] border border-hairline bg-canvas p-7 transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_24px_48px_-24px_rgba(22,58,69,0.35)]">
      <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-accent">
        {item.provider}
      </p>
      <h3 className="mt-1.5 text-[21px] font-bold leading-snug tracking-[-0.015em] text-label">
        {item.name}
      </h3>
      {item.period && (
        <p className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full bg-mist px-3 py-1 text-[13px] font-medium text-label-2">
          <CalendarDays className="size-3.5 text-accent" /> {item.period}
        </p>
      )}
      <p className="mt-4 text-[15px] leading-relaxed text-label-2">
        {item.description}
      </p>
      {reqs.length > 0 && (
        <ul className="mt-4 grid gap-1.5">
          {reqs.map((r) => (
            <li key={r} className="flex gap-2 text-[14px] text-label">
              <Check
                className="mt-0.5 size-4 shrink-0 text-accent"
                strokeWidth={2.25}
              />{" "}
              {r}
            </li>
          ))}
        </ul>
      )}
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center justify-between pt-6 text-[14px] font-semibold text-accent"
        >
          Info & pendaftaran
          <span className="grid size-8 place-items-center rounded-full bg-mist transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
            <ArrowUpRight className="size-4" />
          </span>
        </a>
      )}
    </article>
  );
}
