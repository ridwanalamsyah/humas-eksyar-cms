import { Award } from "lucide-react";
import type { Prestasi } from "@/lib/site/schema";
import { Photo } from "./photo";

/** Kartu apresiasi "Selamat & Sukses": foto potret + label kategori. */
export function PrestasiCard({ item }: { item: Prestasi }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-hairline bg-canvas transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_24px_48px_-24px_rgba(22,58,69,0.35)]">
      <div className="relative">
        <Photo src={item.photo} alt={item.name} />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-canvas/95 px-3 py-1 text-[12px] font-semibold text-label shadow-sm">
          <Award className="size-3.5 text-amber-deep" strokeWidth={2} />
          {item.group}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[18px] font-bold leading-snug tracking-[-0.01em] text-label">
          {item.name}
        </h3>
        <p className="mt-1.5 text-[15px] leading-snug text-label-2">
          {item.achievement}
        </p>
      </div>
    </article>
  );
}
