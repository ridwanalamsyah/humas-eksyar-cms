import type { Prestasi } from "@/lib/site/schema";
import { initials } from "@/lib/site/names";
import { Photo } from "./photo";

/** Kartu apresiasi "Selamat & Sukses": bersih tanpa ikon dekoratif AI. */
export function PrestasiCard({ item }: { item: Prestasi }) {
  return (
    <article className="group relative isolate flex h-full flex-col justify-between overflow-hidden rounded-[22px] border border-hairline bg-canvas p-5 sm:p-6 transition duration-300 hover:border-accent/35">
      {item.photo ? (
        <div className="mb-4 overflow-hidden rounded-xl border border-hairline/60 bg-mist">
          <Photo
            src={item.photo}
            alt={item.name}
            ratio="landscape"
            className="aspect-[4/3] [&_img]:object-top"
          />
        </div>
      ) : (
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-[14px] font-bold text-accent">
            {initials(item.name)}
          </span>
          <span className="rounded-md bg-mist px-2.5 py-1 text-[14px] font-semibold text-label-2">
            {item.group}
          </span>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        {item.photo && (
          <span className="mb-2 inline-block self-start rounded-md bg-mist px-2.5 py-0.5 text-[14px] font-semibold text-label-2">
            {item.group}
          </span>
        )}
        <h3 className="break-words text-[16px] font-bold leading-snug tracking-[-0.01em] text-label">
          {item.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 break-words text-[14px] leading-relaxed text-label-2">
          {item.achievement}
        </p>
      </div>
    </article>
  );
}
