import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck } from "lucide-react";
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
  accreditation: string;
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
 * Ponsel: foto sebagai kartu dengan lencana akreditasi, judul dua warna, dan
 * dua kotak angka berwarna khas prodi yang menghitung naik.
 * Tanpa slider: fotonya diatur dari CMS (Isi website → heroImage).
 */
export function InteractiveHero({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  accreditation,
  stats,
}: Props) {
  const [s1, s2, s3] = stats;
  return (
    <>
      {/* ─── Ponsel ─────────────────────────────────────────── */}
      <section className="px-4 pb-6 pt-4 sm:hidden">
        <div className="relative aspect-[5/4] overflow-hidden rounded-[28px] bg-navy">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[58%_40%]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{ background: "linear-gradient(0deg, rgba(8,28,34,.55), transparent)" }}
          />
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-sand px-3.5 py-2 text-[14px] font-bold text-navy">
            <BadgeCheck className="size-4" /> Akreditasi {accreditation}
          </span>
        </div>

        <h1 className="mt-6 text-balance text-[44px] font-extrabold leading-[1] tracking-[-0.04em] text-label">
          {title}
          <span className="mt-2 block text-[22px] font-bold leading-tight tracking-[-0.02em] text-accent">
            {subtitle}
          </span>
        </h1>
        <p className="mt-4 text-[16px] leading-[1.55] text-label-2">{description}</p>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <Link
            href="/prodi/akademik"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent text-[16px] font-semibold text-white transition active:scale-[0.98]"
          >
            Lihat kurikulum
            <ArrowRight className="size-4 transition-transform group-active:translate-x-0.5" />
          </Link>
          <Link
            href="/prodi/skripsi"
            className="inline-flex h-12 items-center justify-center rounded-full border border-hairline text-[16px] font-semibold text-label transition active:scale-[0.98]"
          >
            Cari skripsi
          </Link>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3">
          {[s2, s3].filter(Boolean).map((s, i) => (
            <div
              key={s.label}
              className={
                i === 0
                  ? "flex flex-col-reverse rounded-3xl bg-navy p-5 text-white"
                  : "flex flex-col-reverse rounded-3xl bg-sand p-5 text-navy"
              }
            >
              <dt className={i === 0 ? "mt-1 text-[14px] text-white/80" : "mt-1 text-[14px] text-navy/75"}>
                {s.label}
              </dt>
              <dd className="text-[32px] font-extrabold leading-none tracking-[-0.03em]">
                <StatValue s={s} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ─── Tablet dan desktop ──────────────────────────────── */}
      <section className="relative isolate hidden min-h-[calc(100svh-4rem)] w-full overflow-hidden bg-navy text-white sm:flex">
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
              "linear-gradient(90deg, rgba(8,28,34,.86) 0%, rgba(8,28,34,.55) 45%, rgba(8,28,34,.08) 80%), linear-gradient(0deg, rgba(8,28,34,.7) 0%, transparent 45%)",
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
