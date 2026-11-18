export type MitraItem = {
  name: string;
  logo: string;
  url: string;
};

export const STRATEGIC_PARTNERS: MitraItem[] = [
  {
    name: "Otoritas Jasa Keuangan",
    logo: "/prodi/mitra/ojk.png",
    url: "https://ojk.go.id",
  },
  {
    name: "Bank Indonesia",
    logo: "/prodi/mitra/bi.png",
    url: "https://bi.go.id",
  },
  {
    name: "Bursa Efek Indonesia",
    logo: "/prodi/mitra/idx.png",
    url: "https://idx.co.id",
  },
  {
    name: "Bank Syariah Indonesia",
    logo: "/prodi/mitra/bsi.svg",
    url: "https://bankbsi.co.id",
  },
  {
    name: "Bank Muamalat Indonesia",
    logo: "/prodi/mitra/muamalat.svg",
    url: "https://bankmuamalat.co.id",
  },
  {
    name: "BAZNAS",
    logo: "/prodi/mitra/baznas.svg",
    url: "https://baznasjabar.org",
  },
  {
    name: "Bank BJB Syariah",
    logo: "/prodi/mitra/bjbsyariah.png",
    url: "https://bjbsyariah.co.id",
  },
  {
    name: "Bank BTN Syariah",
    logo: "/prodi/mitra/btn.svg",
    url: "https://btn.co.id",
  },
  {
    name: "MNC Sekuritas",
    logo: "/prodi/mitra/mncsekuritas.png",
    url: "https://mncsekuritas.id",
  },
  {
    name: "Pegadaian Syariah",
    logo: "/prodi/mitra/pegadaian.svg",
    url: "https://pegadaian.co.id",
  },
  {
    name: "BPRS HIK Parahyangan",
    logo: "/prodi/mitra/hik.svg",
    url: "https://bprshikparahyangan.co.id",
  },
  {
    name: "Badan Wakaf Indonesia",
    logo: "/prodi/mitra/bwi.svg",
    url: "https://bwi.go.id",
  },
];

export function MitraMarquee() {
  return (
    <section className="border-t border-hairline/60 bg-[#FAF9F5] py-7 sm:py-9 dark:bg-[#0B171C]">
      <div className="mx-auto max-w-[1320px] px-4 text-center">
        <p className="text-[14px] sm:text-[14px] font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
          Kemitraan &amp; Jejaring Industri Resmi
        </p>
      </div>

      {/* Marquee Strip: Murni Logo Mengalir Mulus Tanpa Border */}
      <div className="relative mt-5 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max items-center gap-10 sm:gap-14 animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
          {STRATEGIC_PARTNERS.map((p, i) => (
            <a
              key={`p1-${p.name}-${i}`}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center justify-center transition-all duration-300 hover:scale-110"
              title={p.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.logo}
                alt={p.name}
                loading="lazy"
                className="h-8 sm:h-9 w-auto max-w-[125px] sm:max-w-[145px] object-contain transition-all duration-300 dark:brightness-125 dark:contrast-125 dark:drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)]"
              />
            </a>
          ))}
          {/* Looping clone tanpa jeda */}
          {STRATEGIC_PARTNERS.map((p, i) => (
            <a
              key={`p1-clone-${p.name}-${i}`}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center justify-center transition-all duration-300 hover:scale-110"
              title={p.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.logo}
                alt={p.name}
                loading="lazy"
                className="h-8 sm:h-9 w-auto max-w-[125px] sm:max-w-[145px] object-contain transition-all duration-300 dark:brightness-125 dark:contrast-125 dark:drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)]"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
