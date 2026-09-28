import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { listEvents } from "@/lib/data/provider";
import type { Event } from "@/lib/data/types";
import { formatDateTime, formatShortDate } from "@/lib/format/dates";
import { coverFor, getMediaMap, listPublishedNews } from "@/lib/site/content";
import {
  bidangKajian,
  faq,
  faktaSingkat,
  hero,
  kelompokMataKuliah,
  kontak,
  layananAkademik,
  prodi,
  prospekKarir,
  sambutan,
  sorotan,
  visi,
} from "@/lib/site/prodi";
import { EksyarLogo } from "@/components/brand/eksyar-logo";
import { FaqList } from "@/components/site/faq-list";
import { HighlightCard } from "@/components/site/highlight-card";
import { NewsCard } from "@/components/site/news-card";
import { PmbCta } from "@/components/site/pmb-cta";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";

// Halaman publik: render ulang paling lama tiap 5 menit agar berita & agenda
// dari CMS ikut ter-update tanpa rebuild.
export const revalidate = 300;

/** Kategori agenda CMS yang boleh tampil ke publik. */
const PUBLIC_EVENT_CATEGORIES: Event["category"][] = [
  "kajian",
  "kegiatan_publik",
  "kompetisi",
  "pelatihan",
  "perayaan",
];

export default async function ProdiHomePage() {
  const [news, events, media] = await Promise.all([
    listPublishedNews(),
    listEvents({ fromDate: new Date().toISOString() }),
    getMediaMap(),
  ]);

  const [featuredNews, ...otherNews] = news.slice(0, 4);
  const upcomingEvents = events.filter((e) => PUBLIC_EVENT_CATEGORIES.includes(e.category)).slice(0, 4);

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="site-pattern relative overflow-hidden bg-pine-800 text-paper">
        <div className="bg-gradient-to-r from-pine-900 via-pine-900/92 to-pine-900/40">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-14 pt-16 sm:pt-24 lg:grid-cols-[1.35fr_1fr]">
            <Reveal>
              <p className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-saffron-300">
                <span className="h-px w-8 bg-saffron-300" aria-hidden />
                {hero.eyebrow}
              </p>
              <h1 className="mt-6 font-serif text-[clamp(2.4rem,1.6rem+3.2vw,4.4rem)] font-semibold leading-[1.06] text-balance">
                {hero.title} <em className="font-medium text-saffron-300">{hero.highlight}</em>
              </h1>
              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-pine-100/85">{hero.description}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={kontak.pmbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-sm bg-saffron-500 px-7 text-[13px] font-bold uppercase tracking-[0.1em] text-pine-900 transition-colors hover:bg-saffron-300"
                >
                  Daftar Sekarang <ArrowUpRight className="size-4" />
                </a>
                <Link
                  href="/prodi/profil"
                  className="inline-flex h-12 items-center gap-2 rounded-sm border border-paper/30 px-7 text-[13px] font-bold uppercase tracking-[0.1em] text-paper transition-colors hover:border-paper hover:bg-paper/5"
                >
                  Profil Prodi <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="hidden justify-center lg:flex">
              <div className="relative grid size-[340px] place-items-center">
                <svg viewBox="0 0 200 200" className="absolute inset-0 size-full text-saffron-500" aria-hidden>
                  <g fill="none" stroke="currentColor" strokeWidth="0.8">
                    <rect x="40" y="40" width="120" height="120" />
                    <rect x="40" y="40" width="120" height="120" transform="rotate(45 100 100)" />
                    <circle cx="100" cy="100" r="92" opacity="0.5" />
                    <circle cx="100" cy="100" r="58" opacity="0.5" />
                  </g>
                </svg>
                <span className="relative grid size-40 place-items-center rounded-full bg-paper shadow-[0_0_0_8px_rgba(201,150,43,0.25)]">
                  <EksyarLogo size={112} alt="Logo Program Studi Ekonomi Syariah" />
                </span>
              </div>
            </Reveal>
          </div>

          {/* Fakta singkat */}
          <div className="border-t border-white/10">
            <dl className="mx-auto grid max-w-7xl grid-cols-2 px-6 lg:grid-cols-4">
              {faktaSingkat.map((f, i) => (
                <div
                  key={f.label}
                  className={`py-7 ${i % 2 === 1 ? "pl-6" : ""} ${i > 0 ? "lg:border-l lg:border-white/10 lg:pl-8" : ""}`}
                >
                  <dd className="font-serif text-[clamp(1.8rem,1.4rem+1.2vw,2.5rem)] font-semibold leading-none text-paper">
                    {f.value}
                    {f.unit && <span className="ml-2 text-base font-medium text-saffron-300">{f.unit}</span>}
                  </dd>
                  <dt className="mt-2 text-[13px] text-pine-100/70">{f.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ─── Sambutan Kaprodi ─────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.4fr] lg:items-center">
          <Reveal>
            <figure className="relative mx-auto max-w-sm">
              <div className="site-pattern-light aspect-[4/5] border border-pine-800/15 bg-paper-2">
                <div className="grid size-full place-items-center">
                  <span className="grid size-40 place-items-center rounded-full bg-pine-700 font-serif text-5xl font-semibold text-paper ring-8 ring-saffron-500/25">
                    ES
                  </span>
                </div>
              </div>
              <figcaption className="absolute -bottom-6 left-6 right-6 bg-pine-800 px-5 py-4 text-paper">
                <p className="font-serif text-lg font-semibold">{sambutan.name}</p>
                <p className="text-[13px] text-pine-100/75">{sambutan.role}</p>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.05}>
            <SectionHeading eyebrow="Sambutan Ketua Program Studi" title="Ilmu ekonomi yang berpijak pada nilai." />
            <div className="mt-6 space-y-4 text-[16.5px] leading-[1.8] text-ink/75">
              {sambutan.paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "font-serif italic text-pine-700" : undefined}>
                  {p}
                </p>
              ))}
            </div>
            <Link
              href="/prodi/profil"
              className="mt-8 inline-flex items-center gap-2 border-b-2 border-saffron-500 pb-1 text-[14px] font-semibold text-pine-700 hover:text-saffron-600"
            >
              Selengkapnya tentang prodi <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ─── Visi ─────────────────────────────────────────── */}
      <section className="site-pattern-light border-y border-pine-800/10 bg-paper-2 px-6 py-20">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-saffron-600">Visi Program Studi</p>
          <blockquote className="mt-6 font-serif text-[clamp(1.35rem,1.1rem+1vw,2rem)] font-medium leading-[1.5] text-pine-800">
            “{visi}”
          </blockquote>
          <p className="mt-6 text-sm text-ink/55">Paradigma keilmuan UIN SGD: {prodi.paradigm}</p>
        </Reveal>
      </section>

      {/* ─── Bidang kajian ────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Bidang Kajian"
              title="Empat ranah keilmuan yang kamu pelajari."
              description="Kurikulum dirancang agar lulusan memahami ekonomi Islam dari teori hingga praktik di berbagai sektor."
            />
          </Reveal>
          <div className="mt-12 grid border-l border-t border-pine-800/15 sm:grid-cols-2 lg:grid-cols-4">
            {bidangKajian.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.05} className="border-b border-r border-pine-800/15">
                <div className="group h-full p-7 transition-colors hover:bg-pine-800">
                  <span className="font-serif text-4xl font-semibold text-saffron-500">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-6 font-serif text-xl font-semibold leading-snug text-pine-800 group-hover:text-paper">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink/65 group-hover:text-pine-100/80">{b.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Akademik teaser ──────────────────────────────── */}
      <section className="bg-pine-50 px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Kurikulum"
              title={`${prodi.totalCredits} SKS menuju Sarjana Ekonomi.`}
              description={`Beban studi ${prodi.totalCredits} SKS ditempuh normal dalam ${prodi.normalDuration} (maksimal ${prodi.maxSemesters} semester), terbagi dalam tiga kelompok mata kuliah.`}
            />
            <Link
              href="/prodi/akademik"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-sm bg-pine-700 px-7 text-[13px] font-bold uppercase tracking-[0.1em] text-paper hover:bg-pine-800"
            >
              Lihat Struktur Kurikulum <ArrowRight className="size-4" />
            </Link>
          </Reveal>
          <div className="grid gap-4">
            {kelompokMataKuliah.map((k, i) => (
              <Reveal key={k.code} delay={i * 0.05}>
                <div className="flex gap-6 bg-paper p-6 shadow-[0_1px_0_rgba(15,76,62,0.08)]">
                  <span className="grid size-16 shrink-0 place-items-center bg-pine-700 font-serif text-lg font-semibold tracking-wide text-saffron-300">
                    {k.code}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-pine-800">{k.title}</h3>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink/65">{k.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Prospek karir ────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow="Prospek Karir"
              title="Lulusan dibutuhkan di banyak sektor."
              description="Pertumbuhan industri keuangan syariah dan ekonomi halal di Indonesia membuka peluang karir yang luas."
            />
          </Reveal>
          <ol className="mt-12 grid gap-x-12 sm:grid-cols-2">
            {prospekKarir.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.04}>
                <li className="flex gap-5 border-t border-pine-800/15 py-6">
                  <span className="font-mono text-sm text-saffron-600">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-pine-800">{p.title}</h3>
                    <p className="mt-1 text-[14.5px] text-ink/65">{p.description}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── Berita & agenda ──────────────────────────────── */}
      <section id="berita" className="scroll-mt-28 border-t border-pine-800/10 bg-paper-2 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={news.length > 0 ? "Berita Terkini" : "Sorotan Kegiatan"}
              title="Kabar dari Program Studi."
            />
            <Link
              href="/prodi/berita"
              className="inline-flex items-center gap-2 border-b-2 border-saffron-500 pb-1 text-[14px] font-semibold text-pine-700 hover:text-saffron-600"
            >
              Semua berita <ArrowRight className="size-4" />
            </Link>
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]">
            {featuredNews ? (
              <div className="grid gap-8 sm:grid-cols-2">
                <Reveal className="sm:col-span-2">
                  <NewsCard item={featuredNews} cover={coverFor(featuredNews, media)} featured />
                </Reveal>
                {otherNews.slice(0, 2).map((n, i) => (
                  <Reveal key={n.id} delay={i * 0.05}>
                    <NewsCard item={n} cover={coverFor(n, media)} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {sorotan.map((s, i) => (
                  <Reveal key={s.title} delay={(i % 2) * 0.05}>
                    <HighlightCard item={s} />
                  </Reveal>
                ))}
              </div>
            )}

            <Reveal>
              <aside className="bg-pine-800 p-7 text-paper">
                <div className="flex items-center gap-2.5 border-b border-white/15 pb-4">
                  <CalendarDays className="size-5 text-saffron-300" />
                  <h3 className="font-serif text-xl font-semibold">Agenda</h3>
                </div>
                {upcomingEvents.length > 0 ? (
                  <ul className="divide-y divide-white/10">
                    {upcomingEvents.map((e) => {
                      // "Sen 12 Mei" → ["Sen", "12", "Mei"]
                      const [, day, month] = formatShortDate(e.startsAt).split(" ");
                      return (
                        <li key={e.id} className="flex gap-4 py-4">
                          <div className="w-14 shrink-0 border border-saffron-500/60 py-1.5 text-center">
                            <span className="block font-serif text-2xl font-semibold leading-none">{day}</span>
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-saffron-300">{month}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold leading-snug">{e.title}</p>
                            <p className="mt-1 text-[12.5px] text-pine-100/70">{formatDateTime(e.startsAt)}</p>
                            <p className="mt-0.5 flex items-center gap-1 truncate text-[12.5px] text-pine-100/70">
                              <MapPin className="size-3" /> {e.isOnline ? "Daring" : e.location}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="pt-4 text-[14px] leading-relaxed text-pine-100/75">
                    Belum ada agenda publik terjadwal. Ikuti{" "}
                    <a href={kontak.instagram} target="_blank" rel="noopener noreferrer" className="text-saffron-300 underline">
                      {kontak.instagramHandle}
                    </a>{" "}
                    untuk info terbaru.
                  </p>
                )}
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      <PmbCta />

      {/* ─── FAQ ──────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.6fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Tanya Jawab"
              title="Pertanyaan yang sering diajukan."
              description="Belum menemukan jawaban? Hubungi kami melalui halaman kontak."
            />
            <Link
              href="/prodi/kontak"
              className="mt-8 inline-flex items-center gap-2 border-b-2 border-saffron-500 pb-1 text-[14px] font-semibold text-pine-700 hover:text-saffron-600"
            >
              Hubungi kami <ArrowRight className="size-4" />
            </Link>
          </Reveal>
          <Reveal>
            <FaqList items={faq} />
          </Reveal>
        </div>
      </section>

      {/* ─── Layanan cepat ────────────────────────────────── */}
      <section className="border-t border-pine-800/10 px-6 py-14">
        <div className="mx-auto grid max-w-7xl gap-px bg-pine-800/10 sm:grid-cols-2 lg:grid-cols-4">
          {layananAkademik.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-4 bg-paper p-6 hover:bg-pine-50"
            >
              <span>
                <span className="block font-serif text-[17px] font-semibold text-pine-800">{l.title}</span>
                <span className="mt-1 block text-[13.5px] text-ink/60">{l.description}</span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-saffron-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
