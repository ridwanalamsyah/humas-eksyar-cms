import { Award } from "lucide-react";
import type { Prestasi } from "@/lib/site/schema";
import { Photo } from "./photo";

/** Kartu apresiasi "Selamat & Sukses": foto potret + label kategori. */
export function PrestasiCard({ item }: { item: Prestasi }) {
  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-[24px] border border-hairline bg-canvas transition duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_20px_40px_-20px_rgba(22,58,69,0.28)]">
      <div className="relative">
        <Photo src={item.photo} alt={item.name} />
        <span className="absolute left-3.5 top-3.5 z-10 inline-flex max-w-[calc(100%-1.75rem)] items-center gap-1.5 rounded-full border border-hairline bg-canvas/95 px-3 py-1 text-[12px] font-semibold text-label shadow-xs backdrop-blur-xs">
          <Award className="size-3.5 shrink-0 text-amber-deep" strokeWidth={2} />
          <span className="truncate">{item.group}</span>
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <h3 className="break-words text-[17.5px] font-bold leading-snug tracking-[-0.01em] text-label">
          {item.name}
        </h3>
        <p className="mt-1.5 break-words text-[14.5px] leading-snug text-label-2">
          {item.achievement}
        </p>
      </div>
    </article>
  );
}
