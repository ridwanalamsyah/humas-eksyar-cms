import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

type Props = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  stats: { value: string; label: string }[];
};

/**
 * Hero beranda: satu foto penuh yang jelas, gradasi gelap di belakang teks,
 * judul yang menyebut prodi, kampus dan kota, dua tombol, dan tiga angka kunci.
 * Tanpa slider: fotonya diatur dari CMS (Isi website → heroImage).
 */
export function InteractiveHero({ title, description, image, imageAlt, stats }: Props) {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] w-full overflow-hidden bg-navy text-white">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[58%_40%] sm:object-[center_38%]"
      />
      {/* Gelap di kiri dan bawah supaya teks terbaca; fotonya tetap jelas di kanan.
          Di HP teks memenuhi lebar layar, jadi bagian bawah dibuat lebih gelap. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 sm:hidden"
        style={{
          background:
            "linear-gradient(0deg, rgba(8,28,34,.92) 0%, rgba(8,28,34,.72) 55%, rgba(8,28,34,0) 85%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,28,34,.86) 0%, rgba(8,28,34,.55) 45%, rgba(8,28,34,.08) 80%), linear-gradient(0deg, rgba(8,28,34,.7) 0%, transparent 45%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-[1160px] flex-col justify-end px-4 pb-10 pt-24 sm:px-6 sm:pb-16">
        <h1 className="max-w-[760px] text-balance text-[clamp(2.25rem,1.4rem+3.6vw,4.25rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">
          {title}
        </h1>

        <div className="mt-5 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="max-w-[56ch] text-[16px] leading-[1.55] text-white/90 sm:text-[18px]">
              {description}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/prodi/akademik"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[16px] font-semibold text-navy transition-colors hover:bg-mist"
              >
                Lihat kurikulum
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/prodi/skripsi"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white/10 px-6 text-[16px] font-semibold text-white ring-1 ring-inset ring-white/70 transition-colors hover:bg-white/20"
              >
                Cari skripsi
              </Link>
            </div>
          </div>

          <dl className="flex items-end gap-6 sm:gap-11">
            {stats.slice(0, 3).map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="mt-1 whitespace-nowrap text-[14px] text-white/80">{s.label}</dt>
                <dd className="whitespace-nowrap text-[24px] font-extrabold tracking-[-0.03em] sm:text-[40px]">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
