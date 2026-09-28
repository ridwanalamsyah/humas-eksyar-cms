import Link from "next/link";
import { listEvents } from "@/lib/data/provider";
import type { Event } from "@/lib/data/types";
import { formatDateTime } from "@/lib/format/dates";
import { coverFor, getMediaMap, listPublishedNews } from "@/lib/site/content";
import { bidangKajian, hero, kontak, prodi, sambutan, sorotan } from "@/lib/site/prodi";
import { EksyarLogo } from "@/components/brand/eksyar-logo";
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

  const [featuredNews, ...otherNews] = news;
  const nextEvent = events.find((e) => PUBLIC_EVENT_CATEGORIES.includes(e.category));

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="px-4 pt-16 text-center sm:px-6 sm:pt-24">
        <Reveal>
          <p className="text-[clamp(1.1rem,1rem+0.5vw,1.5rem)] font-semibold text-label">{hero.eyebrow}</p>
          <h1 className="mx-auto mt-2 max-w-4xl text-[clamp(2.75rem,1.6rem+5vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-label">
            {hero.title}
            <br />
            <span className="bg-gradient-to-r from-accent-strong to-amber bg-clip-text text-transparent">{hero.highlight}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[clamp(1.1rem,1rem+0.45vw,1.45rem)] leading-[1.4] text-label-2">
            {hero.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <a
              href={kontak.pmbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-7 py-3 text-[17px] font-medium text-white transition-colors hover:bg-accent-strong"
            >
              Daftar sekarang
            </a>
            <Link href="/prodi/profil" className="text-[17px] text-accent hover:underline">
              Kenali prodi ›
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-14 max-w-[1024px] sm:mt-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] bg-gradient-to-br from-[#dff1ee] via-[#f5f5f7] to-[#fdecd3] sm:aspect-[16/8]">
            {hero.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.image} alt={hero.imageAlt} className="absolute inset-0 size-full object-cover" />
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <div className="flex flex-col items-center">
                  <EksyarLogo size={140} alt="Logo Program Studi Ekonomi Syariah" className="drop-shadow-[0_24px_40px_rgba(13,148,136,0.25)]" />
                  <p className="mt-6 text-[15px] font-medium text-label-2">
                    {prodi.faculty} · {prodi.university}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </section>

      {/* ─── Sekilas (bento) ──────────────────────────────── */}
      <section className="px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading title="Kenapa Ekonomi Syariah." />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-4 md:grid-cols-6">
          <Tile className="md:col-span-4" label="Kurikulum">
            <p className="text-[clamp(4rem,3rem+4vw,7rem)] font-semibold leading-none tracking-[-0.04em] text-label">
              {prodi.totalCredits}
              <span className="ml-2 text-[0.35em] tracking-[-0.02em] text-label-2">SKS</span>
            </p>
            <p className="mt-4 max-w-md text-[17px] leading-[1.45] text-label-2">
              Teori ekonomi, fiqh muamalah, dan praktik industri — dirangkum dalam {prodi.normalDuration} menuju gelar{" "}
              {prodi.degree}.
            </p>
          </Tile>
          <Tile className="md:col-span-2" label="Akreditasi UIN SGD" dark>
            <p className="text-[clamp(2.5rem,2rem+2vw,3.5rem)] font-semibold leading-none tracking-[-0.03em]">
              {prodi.universityAccreditation}
            </p>
            <p className="mt-4 text-[15px] leading-[1.45] text-white/65">BAN-PT, berlaku {prodi.universityAccreditationPeriod}.</p>
          </Tile>
          <Tile className="md:col-span-3" label="Belajar dari praktisi">
            <p className="text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-label">
              Kuliah langsung di bank syariah.
            </p>
            <p className="mt-3 text-[16px] leading-[1.45] text-label-2">
              Mahasiswa belajar operasional perbankan syariah bersama praktisi Bank Muamalat Indonesia.
            </p>
          </Tile>
          <Tile className="md:col-span-3" label="Berdampak">
            <p className="text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] text-label">
              Ilmu yang turun ke masyarakat.
            </p>
            <p className="mt-3 text-[16px] leading-[1.45] text-label-2">
              Dari sertifikasi Juru Sembelih Halal hingga literasi keuangan syariah di desa binaan.
            </p>
          </Tile>
        </div>
      </section>

      {/* ─── Bidang kajian ────────────────────────────────── */}
      <section className="bg-mist px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Bidang Kajian"
            title="Empat bidang. Satu tujuan."
            description="Memahami ekonomi Islam dari teori hingga praktik di berbagai sektor."
          />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[1024px] gap-4 sm:grid-cols-2">
          {bidangKajian.map((b, i) => (
            <Reveal key={b.title} delay={(i % 2) * 0.06}>
              <div className="h-full rounded-[28px] bg-canvas p-8 sm:p-10">
                <h3 className="text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-label">{b.title}</h3>
                <p className="mt-3 text-[17px] leading-[1.45] text-label-2">{b.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-center">
          <Link href="/prodi/akademik" className="text-[17px] text-accent hover:underline">
            Lihat kurikulum lengkap ›
          </Link>
        </p>
      </section>

      {/* ─── Nilai ───────────────────────────────────────── */}
      <section className="px-4 py-24 sm:px-6 sm:py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[17px] font-semibold text-accent">Nilai Kami</p>
          <p className="mt-4 text-[clamp(1.6rem,1.1rem+1.8vw,2.5rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-label text-balance">
            Ekonomi syariah bukan sekadar label, tetapi cara pandang yang menempatkan keadilan dan kemaslahatan di pusat
            aktivitas ekonomi.
          </p>
          <div className="mt-10 inline-flex items-center gap-3 text-left">
            <span className="grid size-12 place-items-center rounded-full bg-accent-soft text-[15px] font-semibold text-accent">
              ES
            </span>
            <span>
              <span className="block text-[15px] font-semibold text-label">{sambutan.name}</span>
              <span className="block text-[13px] text-label-2">{sambutan.role}</span>
            </span>
          </div>
        </Reveal>
      </section>

      {/* ─── Berita ───────────────────────────────────────── */}
      <section className="bg-mist px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-[1024px]">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading align="left" title={featuredNews ? "Berita terbaru." : "Kabar terbaru."} />
            <Link href="/prodi/berita" className="text-[17px] text-accent hover:underline">
              Lihat semua ›
            </Link>
          </Reveal>

          {featuredNews ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <Reveal className="md:col-span-2">
                <NewsCard item={featuredNews} cover={coverFor(featuredNews, media)} featured />
              </Reveal>
              {otherNews.slice(0, 2).map((n, i) => (
                <Reveal key={n.id} delay={i * 0.06}>
                  <NewsCard item={n} cover={coverFor(n, media)} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {sorotan.slice(0, 3).map((s, i) => (
                <Reveal key={s.title} delay={i * 0.06}>
                  <HighlightCard item={s} />
                </Reveal>
              ))}
            </div>
          )}

          {nextEvent && (
            <Reveal className="mt-5">
              <div className="flex flex-col gap-2 rounded-[20px] bg-canvas px-7 py-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[15px] text-label-2">
                  <span className="font-semibold text-label">Agenda berikutnya · </span>
                  {nextEvent.title}
                </p>
                <p className="text-[14px] text-label-3">
                  {formatDateTime(nextEvent.startsAt)} · {nextEvent.isOnline ? "Daring" : nextEvent.location}
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <PmbCta />
    </>
  );
}

function Tile({
  label,
  children,
  className,
  dark = false,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <Reveal className={className}>
      <div
        className={
          dark
            ? "flex h-full flex-col justify-between rounded-[28px] bg-label p-8 text-white sm:p-10"
            : "flex h-full flex-col justify-between rounded-[28px] bg-mist p-8 sm:p-10"
        }
      >
        <p className={dark ? "text-[14px] font-semibold text-amber" : "text-[14px] font-semibold text-accent"}>{label}</p>
        <div className="mt-10">{children}</div>
      </div>
    </Reveal>
  );
}
