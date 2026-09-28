import type { prestasi } from "@/lib/site/prodi";

type Prestasi = (typeof prestasi)[number];

/** Kartu apresiasi bergaya postingan "Selamat & Sukses" di IG Eksyar. */
export function PrestasiCard({ item }: { item: Prestasi }) {
  return (
    <article className="flex h-full flex-col rounded-[24px] border border-hairline bg-canvas">
      <div className="flex flex-1 flex-col items-center px-5 pb-6 pt-7 text-center">
        <p className="text-[22px] font-extrabold leading-none tracking-[-0.01em] text-accent">Selamat &amp; Sukses</p>
        <p className="font-script text-[20px] leading-tight text-navy">atas prestasinya</p>
        <span className="mt-4 grid size-20 place-items-center rounded-full bg-accent text-[24px] font-extrabold text-white">
          {item.initials}
        </span>
        <p className="mt-4 text-[17px] font-bold leading-snug text-label">{item.name}</p>
        <p className="mt-1.5 text-[14px] leading-snug text-label-2">{item.achievement}</p>
      </div>
      <p className="border-t border-hairline py-3 text-center text-[12px] font-semibold tracking-[0.08em] text-label-2">— Ekonomi Syariah —</p>
    </article>
  );
}
