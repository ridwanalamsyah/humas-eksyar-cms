"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

const DURATION = 7000;

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    category: "Program Studi",
    title: "Pusat Keunggulan Ilmu & Praktik Ekonomi Syariah",
    summary: "Belajar ilmu ekonomi modern berlandaskan prinsip muamalah Islam.",
    date: "",
    image: "/prodi/kampus-2.jpg",
    href: "/prodi/akademik",
    external: false,
  },
];

export function InteractiveHero({ title, subtitle, description, stats, slides }: Props) {
  const [active, setActive] = useState(0);

  const effectiveSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const total = effectiveSlides.length;

  useEffect(() => {
    if (total <= 1) return;
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, DURATION);
    return () => window.clearInterval(id);
  }, [total]);

  return (
    <section className="relative isolate flex min-h-[76vh] sm:min-h-[82vh] w-full flex-col justify-between overflow-hidden bg-[#FAF9F5] text-neutral-900 transition-colors duration-500 dark:bg-[#0B171C] dark:text-white pt-10 sm:pt-14 lg:pt-20 pb-8 sm:pb-12">
      {/* ─── Latar Belakang Foto Penuh (Full-Bleed) & Overlay Editorial ─── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        {effectiveSlides.map((s, i) => (
          <img
            key={s.image + i}
            src={s.image}
            alt=""
            className={cn(
              "absolute inset-0 size-full object-cover object-center transition-opacity duration-1000 ease-out",
              i === active ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        {/* Overlay Mode Terang (Krem Hangat Transparan ke Kanan) */}
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            background:
              "linear-gradient(100deg, rgba(250,249,245,0.96) 0%, rgba(250,249,245,0.88) 46%, rgba(250,249,245,0.62) 78%, rgba(250,249,245,0.45) 100%)",
          }}
        />
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(250,249,245,0.72) 0%, rgba(250,249,245,0.18) 38%, rgba(250,249,245,0.94) 100%)",
          }}
        />

        {/* Overlay Mode Gelap (Teal Gelap Transparan ke Kanan) */}
        <div
          className="hidden dark:block absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(11,23,28,0.95) 0%, rgba(11,23,28,0.86) 46%, rgba(11,23,28,0.58) 78%, rgba(11,23,28,0.42) 100%)",
          }}
        />
        <div
          className="hidden dark:block absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,23,28,0.72) 0%, rgba(11,23,28,0.18) 38%, rgba(11,23,28,0.94) 100%)",
          }}
        />
      </div>

      {/* ─── Konten Utama Hero (Tanpa Card) ─── */}
      <div className="relative z-10 mx-auto my-auto w-full max-w-[1040px] px-4 sm:px-6 font-jakarta">
        <div className="max-w-[660px]">
          <p className="text-[11.5px] sm:text-[13px] font-bold uppercase tracking-[0.14em] text-[#237A74] dark:text-[#6AB5AD]">
            {subtitle}
          </p>

          <h1 className="mt-2.5 sm:mt-3 font-jakarta text-[clamp(2.25rem,1.7rem+2.8vw,4.35rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-[#111827] dark:text-white">
            {title}
          </h1>

          <p className="mt-4 sm:mt-5 max-w-[54ch] text-[15px] sm:text-[17.5px] leading-[1.65] text-neutral-800 dark:text-white/85">
            {description}
          </p>

          <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/prodi/akademik"
              className="group inline-flex h-11 sm:h-12 items-center gap-2 rounded-xl bg-[#237A74] px-5 sm:px-6 text-[14px] sm:text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-[#1D6964]"
            >
              Kurikulum &amp; Akademik
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/prodi/skripsi"
              className="group inline-flex items-center gap-1.5 text-[14px] sm:text-[15px] font-semibold text-[#1E6B65] transition-colors hover:text-[#15534E] hover:underline dark:text-[#6AB5AD] dark:hover:text-white"
            >
              <span>Direktori Skripsi (515+)</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">›</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Baris Angka Kunci Prodi (Tanpa Card) ─── */}
      <div className="relative z-10 mx-auto mt-10 sm:mt-14 w-full max-w-[1040px] px-4 sm:px-6 font-jakarta">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 border-t border-neutral-900/15 pt-5 sm:pt-6 sm:grid-cols-4 dark:border-white/15">
          {stats.slice(0, 4).map((s, idx) => (
            <div
              key={s.label}
              className={cn(
                "flex flex-col-reverse pr-2 sm:pr-4",
                idx > 0 && "sm:border-l sm:border-neutral-900/15 dark:sm:border-white/15 sm:pl-6",
              )}
            >
              <dt className="mt-0.5 text-[12px] sm:text-[12.5px] font-medium leading-snug text-neutral-700 dark:text-white/70">
                {s.label}
              </dt>
              <dd className="font-jakarta text-[22px] sm:text-[28px] font-extrabold tracking-tight text-[#111827] dark:text-white">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
