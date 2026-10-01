import { ArrowUpRight } from "lucide-react";
import { labelTenggat } from "@/lib/site/kalender";
import { cn } from "@/lib/utils";

/** Kartu item bertenggat (lomba, lowongan) dengan label sisa waktu. */
export function DeadlineCard({
  title,
  meta,
  description,
  deadline,
  href,
  cta,
}: {
  title: string;
  meta: string;
  description: string;
  deadline?: string;
  href?: string;
  cta: string;
}) {
  const t = labelTenggat(deadline);
  const tanggal = deadline
    ? new Date(`${deadline}T00:00:00+07:00`).toLocaleDateString("id-ID", {
        dateStyle: "long",
        timeZone: "Asia/Jakarta",
      })
    : "";
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[24px] border border-hairline p-6",
        t.open ? "bg-canvas" : "bg-mist/60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-semibold text-accent">{meta}</p>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[12px] font-bold",
            t.open ? "bg-sand text-navy" : "bg-hairline text-label-3",
          )}
        >
          {t.text}
        </span>
      </div>
      <h3
        className={cn(
          "mt-2 text-[18px] font-bold leading-snug",
          t.open ? "text-label" : "text-label-2",
        )}
      >
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-[14.5px] leading-[1.55] text-label-2">
          {description}
        </p>
      )}
      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="text-[13px] text-label-3">
          {tanggal && `Tenggat ${tanggal}`}
        </span>
        {href && t.open && (
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-[14px] font-semibold text-white hover:bg-accent-strong"
          >
            {cta} <ArrowUpRight className="size-4" />
          </a>
        )}
      </div>
    </article>
  );
}
