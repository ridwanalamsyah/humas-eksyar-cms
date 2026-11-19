import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CountUp } from "./count-up";

type Stat = { label: string; value?: string; num?: number; suffix?: string };

type Props = {
  /** Baris utama judul, mis. "Ekonomi Syariah". */
  title: string;
  /** Baris kedua judul, mis. "UIN Sunan Gunung Djati Bandung". */
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Tidak lagi ditampilkan terpisah: sudah ada sebagai angka pertama di stats. */
  accreditation?: string;
  stats: Stat[];
};

function StatValue({ s }: { s: Stat }) {
  if (typeof s.num === "number")
    return (
      <>
        <CountUp value={s.num} />
        {s.suffix}
      </>
    );
  return <>{s.value}</>;
}

/**
 * Hero beranda (opsi A).
 * Desktop: satu foto penuh dengan gradasi gelap, judul, dua tombol, tiga angka.
 * Ponsel: foto penuh juga, dengan lapisan gelap tipis dari bawah; tanpa
 * kotak berwarna, angka berupa teks di atas garis tipis.
 * Tanpa slider: fotonya diatur dari CMS (Isi website → heroImage).
 */
export function InteractiveHero({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  stats,
}: Props) {
  const [s1, s2, s3] = stats;
  return (
    <>
      {/* ─── Ponsel: foto penuh, teks di atas lapisan tipis ─── */}
      <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-navy px-5 pb-8 pt-24 text-white sm:hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[58%_40%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,28,34,.5) 0%, transparent 22%), linear-gradient(0deg, rgba(8,28,34,.78) 0%, rgba(8,28,34,.45) 40%, rgba(8,28,34,.05) 70%)",
          }}
        />
                <h1 className="mt-2 text-balance text-[40px] font-extrabold leading-[1.02] tracking-[-0.035em]">
          {title}
          <span className="mt-2 block text-[20px] font-semibold leading-tight tracking-[-0.01em] text-white/85">
            {subtitle}
          </span>
        </h1>
        <div className="mt-6 flex gap-3">
          <Link
            href="/prodi/akademik"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white/90 text-[16px] font-semibold text-navy backdrop-blur transition active:scale-[0.98]"
          >
            Kurikulum <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/prodi/skripsi"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-white/10 text-[16px] font-semibold text-white ring-1 ring-inset ring-white/50 backdrop-blur transition active:scale-[0.98]"
          >
            Cari skripsi
          </Link>
        </div>
        <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/20 pt-4">
          {[s1, s2, s3].filter(Boolean).map((s) => (
            <div key={s.label} className="flex min-w-0 flex-col-reverse">
              <dt className="truncate text-[13px] text-white/75">{s.label}</dt>
              <dd className="truncate text-[22px] font-bold leading-tight tracking-[-0.02em]">
                <StatValue s={s} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ─── Tablet dan desktop ──────────────────────────────── */}
      <section className="relative isolate hidden min-h-[100svh] w-full overflow-hidden bg-navy text-white sm:flex">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[center_38%]"
        />
        {/* Gelap di kiri dan bawah supaya teks terbaca; fotonya tetap jelas di kanan. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,28,34,.45) 0%, transparent 20%), linear-gradient(90deg, rgba(8,28,34,.86) 0%, rgba(8,28,34,.55) 45%, rgba(8,28,34,.08) 80%), linear-gradient(0deg, rgba(8,28,34,.7) 0%, transparent 45%)",
          }}
        />

        <div className="mx-auto flex w-full max-w-[1160px] flex-col justify-end px-6 pb-16 pt-24">
          <h1 className="max-w-[760px] text-balance text-[clamp(2.75rem,1.4rem+3.6vw,4.25rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">
            {title} {subtitle}
          </h1>

          <div className="mt-5 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="max-w-[56ch] text-[18px] leading-[1.55] text-white/90">{description}</p>
              <div className="mt-7 flex gap-3">
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

            <dl className="flex items-end gap-11">
              {[s1, s2, s3].filter(Boolean).map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-1 whitespace-nowrap text-[14px] text-white/80">{s.label}</dt>
                  <dd className="whitespace-nowrap text-[40px] font-extrabold tracking-[-0.03em]">
                    <StatValue s={s} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
