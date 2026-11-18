import type { Prestasi } from "@/lib/site/schema";
import { Photo } from "./photo";

/**
 * Prestasi sebagai foto: fotonya yang bicara, nama dan capaian tipis di atas
 * foto. Prestasi tanpa foto tampil sebagai baris teks biasa tanpa kotak.
 */
export function PrestasiCard({ item }: { item: Prestasi }) {
  if (!item.photo)
    return (
      <article className="border-t border-hairline pt-4">
        <h3 className="break-words text-[16px] font-bold leading-snug text-label">{item.name}</h3>
        <p className="mt-1 line-clamp-2 break-words text-[14px] leading-relaxed text-label-2">
          {item.achievement}
        </p>
      </article>
    );

  return (
    <article className="group relative overflow-hidden rounded-[22px]" title={item.achievement}>
      <Photo src={item.photo} alt={`${item.name}: ${item.achievement}`} className="[&_img]:object-top" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: "linear-gradient(0deg, rgba(8,28,34,.7), transparent)" }}
      />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <h3 className="line-clamp-1 text-[15px] font-semibold">{item.name}</h3>
        <p className="line-clamp-1 text-[13px] text-white/80">{item.achievement}</p>
      </div>
    </article>
  );
}
