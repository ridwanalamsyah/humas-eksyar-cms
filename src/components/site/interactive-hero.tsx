"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export type HeroSlide = {
  category: string;
  title: string;
  summary: string;
  date?: string;
  image: string;
  href: string;
  external?: boolean;
};

type Props = {
  title: string;
  subtitle: string;
  description: string;
  stats: { value: string; label: string }[];
  slides: HeroSlide[];
};

export function InteractiveHero({
  title,
  subtitle,
  description,
  stats,
  slides,
}: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = slides.length;
  const current = slides[active] ?? slides[0];

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 5500);
    return () => window.clearInterval(id);
  }, [paused, total]);

  return (
    <section className="relative overflow-hidden border-b border-hairline bg-canvas px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
      {/* Subtle ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-accent/8 blur-3xl"
      />

      <div className="mx-auto grid max-w-[1160px] items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        {/* Kolom Kiri: Tipografi Utama, CTA, dan Angka Kunci */}
        <div>
          <p className="text-[13.5px] font-semibold tracking-wide text-accent">
            {subtitle}
          </p>
          <h1 className="mt-2.5 text-[clamp(2.5rem,1.9rem+3.2vw,4.35rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-label">
            {title}
          </h1>
          <p className="mt-4 max-w-[54ch] text-[16.5px] leading-[1.65] text-label-2">
            {description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/prodi/akademik"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[14px] font-semibold text-white shadow-xs transition-colors hover:bg-accent-hover"
            >
              Kurikulum & Akademik
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/prodi/skripsi"
              className="inline-flex items-center gap-2 rounded-full border border-hairline bg-mist/70 px-5 py-3 text-[14px] font-semibold text-label transition-colors hover:border-accent/40 hover:text-accent"
            >
              Direktori & Pojok Skripsi
            </Link>
            <Link
              href="/prodi/berita?kategori=buletin_hmj"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-[14px] font-semibold text-accent transition-colors hover:bg-accent-soft/60"
            >
              Buletin Artikel HMJ ›
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-hairline pt-7 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-[12px] font-medium text-label-3">
                  {s.label}
                </dt>
                <dd className="mt-0.5 text-[22px] font-extrabold tracking-tight text-label">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Kolom Kanan: Showcase Interaktif Kegiatan & Kolaborasi Nyata */}
        {current && (
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="relative overflow-hidden rounded-[24px] border border-hairline bg-mist shadow-sm"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={current.image}
                src={current.image}
                alt={current.title}
                className="size-full object-cover transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* Navigasi Panah */}
              {total > 1 && (
                <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setActive((prev) => (prev - 1 + total) % total)
                    }
                    aria-label="Sorotan sebelumnya"
                    className="grid size-8 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-black/70"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActive((prev) => (prev + 1) % total)}
                    aria-label="Sorotan berikutnya"
                    className="grid size-8 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-black/70"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}

              {/* Konten Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <span className="inline-block rounded-md bg-accent px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
                  {current.category}
                </span>
                <h2 className="mt-2 line-clamp-2 text-[18px] font-bold leading-snug text-white sm:text-[20px]">
                  {current.title}
                </h2>
                <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-white/85">
                  {current.summary}
                </p>
                <div className="mt-3.5 flex items-center justify-between gap-3">
                  {current.external ? (
                    <a
                      href={current.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[13px] font-semibold text-sand hover:underline"
                    >
                      Baca selengkapnya <ArrowUpRight className="size-3.5" />
                    </a>
                  ) : (
                    <Link
                      href={current.href}
                      className="inline-flex items-center gap-1 text-[13px] font-semibold text-sand hover:underline"
                    >
                      Lihat selengkapnya <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                  <span className="text-[12px] font-medium text-white/70 tabular-nums">
                    {active + 1} / {total}
                  </span>
                </div>
              </div>
            </div>

            {/* Pemilih Interaktif di Bawah Gambar */}
            {total > 1 && (
              <div className="grid grid-cols-2 gap-1.5 bg-canvas p-2.5 sm:grid-cols-4">
                {slides.slice(0, 4).map((s, idx) => {
                  const isCurrent = idx === active;
                  return (
                    <button
                      key={s.title}
                      type="button"
                      onClick={() => setActive(idx)}
                      className={`rounded-[12px] px-3 py-2 text-left transition-colors ${
                        isCurrent
                          ? "bg-accent text-white shadow-2xs"
                          : "bg-mist/70 text-label-2 hover:bg-mist hover:text-label"
                      }`}
                    >
                      <span
                        className={`block text-[10.5px] font-semibold uppercase tracking-wider ${
                          isCurrent ? "text-white/80" : "text-accent"
                        }`}
                      >
                        {s.category}
                      </span>
                      <span className="mt-0.5 line-clamp-1 block text-[12px] font-semibold">
                        {s.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
