import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  HandHeart,
  Landmark,
  Search,
} from "lucide-react";
import { listEvents } from "@/lib/data/provider";
import type { Event } from "@/lib/data/types";
import { formatDateTime } from "@/lib/format/dates";
import {
  coverFor,
  getMediaMap,
  isAnnouncement,
  listPublishedNews,
} from "@/lib/site/content";
import { defaultWebsiteConfig } from "@/lib/site/defaults";
import { getSite } from "@/lib/site/get-site";
import { getSkripsi } from "@/lib/site/skripsi";
import { kalenderMendatang, rentang } from "@/lib/site/kalender";
import { latestYoutube } from "@/lib/site/youtube-feed";
import { PmbCampaign } from "@/components/site/pmb-campaign";
import { prodi } from "@/lib/site/prodi";
import { AnnouncementList } from "@/components/site/announcement-list";
import { Carousel } from "@/components/site/carousel";
import { CountUp } from "@/components/site/count-up";
import { HighlightCard } from "@/components/site/highlight-card";
import { Marquee } from "@/components/site/marquee";
import { TestimoniCard } from "@/components/site/testimoni-card";
import { VideoEmbed } from "@/components/site/video-embed";
import { NewsCard } from "@/components/site/news-card";
import { ParallaxHero } from "@/components/site/parallax-hero";
import { PmbCta } from "@/components/site/pmb-cta";
import { PrestasiCard } from "@/components/site/prestasi-card";
import { ProdiLogo } from "@/components/site/prodi-logo";
import { QuickLinks } from "@/components/site/quick-links";
import { Reveal } from "@/components/site/reveal";
import { ScrollWords } from "@/components/site/scroll-words";
import { SectionHeading } from "@/components/site/section-heading";
import { StickyStack } from "@/components/site/sticky-stack";

// Halaman publik: render ulang paling lama tiap 5 menit agar berita & agenda
// dari CMS ikut ter-update tanpa rebuild.
export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: `${prodi.fullName} · ${prodi.university}` },
};

/** Kategori agenda CMS yang boleh tampil ke publik. */
const PUBLIC_EVENT_CATEGORIES: Event["category"][] = [
  "kajian",
  "kegiatan_publik",
  "kompetisi",
  "pelatihan",
  "perayaan",
];

const BIDANG_ICONS = [Landmark, HandHeart, Building2, BookOpenCheck];

/** Warna solid bergantian untuk kartu bidang kajian yang menumpuk. */
const BIDANG_TONES = [
  {
    card: "bg-accent text-white",
    icon: "bg-white/15 text-white",
    body: "text-white/80",
    num: "text-sand",
  },
  {
    card: "bg-sand text-navy",
    icon: "bg-navy/10 text-navy",
    body: "text-navy/75",
    num: "text-accent",
  },
  {
    card: "bg-navy text-white",
    icon: "bg-white/10 text-white",
    body: "text-white/75",
    num: "text-sand",
  },
  {
    card: "bg-mist text-label border border-hairline",
    icon: "bg-accent-soft text-accent",
    body: "text-label-2",
    num: "text-accent",
  },
];

export default async function ProdiHomePage() {
  const [site, news, events, media, skripsi] = await Promise.all([
    getSite(),
    listPublishedNews(),
    listEvents({ fromDate: new Date().toISOString() }),
    getMediaMap(),
    getSkripsi(),
  ]);
  const jadwal = kalenderMendatang(site.kalender, 3);
  const ytLatest = await latestYoutube(site.medsos.youtubeChannelId);
  const latestBulan = site.apresiasi
    .map((x) => x.bulan)
    .sort()
    .at(-1);
  const apresiasi = site.apresiasi.filter((x) => x.bulan === latestBulan);
  const bulanApresiasi = latestBulan
    ? new Date(`${latestBulan}-01T00:00:00+07:00`).toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      })
    : "";
  const skripsiYears = [...new Set(skripsi.map((s) => s.tahun))].sort(
    (a, b) => a - b,
  );
  const { identity, kontak } = site;

  const announcements = news.filter(isAnnouncement).slice(0, 4);
  const articles = news.filter((n) => !isAnnouncement(n)).slice(0, 3);
  const upcoming = events
    .filter((e) => PUBLIC_EVENT_CATEGORIES.includes(e.category))
    .slice(0, 3);
  const kegiatan = [...site.kegiatan]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);
  const keywords = [
    ...site.bidangKajian.map((b) => b.title),
    ...site.prospekKarir.map((p) => p.title),
  ];
  const statement =
    identity.statement || defaultWebsiteConfig.identity.statement || "";

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <ParallaxHero keywords={keywords}>
        <Reveal>
          <ProdiLogo size={72} priority className="mx-auto" />
          <p className="mt-6 text-[15px] font-semibold uppercase tracking-[0.08em] text-accent">
            {prodi.level} · {prodi.faculty}
          </p>
          <h1 className="mt-3 text-[clamp(3rem,1.8rem+5.4vw,6.5rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-label">
            {identity.heroTitle}
          </h1>
          <p className="mt-4 text-[15px] font-semibold text-label-2">
            {prodi.university}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-[clamp(1.05rem,1rem+0.35vw,1.3rem)] leading-[1.5] text-label-2">
            {identity.heroDescription}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <a
              href={kontak.pmbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-7 py-3 text-[16px] font-semibold text-white transition hover:scale-[1.03] hover:bg-accent-strong active:scale-[0.98]"
            >
              Daftar sekarang
            </a>
            <Link
              href="/prodi/profil"
              className="text-[16px] font-semibold text-accent hover:underline"
            >
              Kenali prodi ›
            </Link>
          </div>
        </Reveal>

        {identity.heroImage && (
          <Reveal delay={0.12} className="mx-auto mt-14 max-w-[1024px]">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-mist">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={identity.heroImage}
                alt={`Kegiatan ${prodi.fullName}`}
                className="absolute inset-0 size-full object-cover"
              />
            </div>
          </Reveal>
        )}
      </ParallaxHero>

      <section className="px-4 pb-8 sm:px-6">
        <QuickLinks pmbUrl={kontak.pmbUrl} />
      </section>

      {/* ─── Pengantar (kata menyala saat digulir) ────────── */}
      {statement && (
        <section className="px-4 py-24 sm:px-6 sm:py-36">
          <ScrollWords
            text={statement}
            className="mx-auto max-w-[900px] text-[clamp(1.75rem,1.2rem+2.2vw,3rem)] font-bold leading-[1.2] tracking-[-0.025em] text-label"
          />
        </section>
      )}

      {/* ─── Sekilas ──────────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6 sm:pb-32">
        <div className="mx-auto grid max-w-[1024px] gap-4 md:grid-cols-6">
          <Tile className="md:col-span-4" label="Kurikulum">
            <p className="text-[clamp(4rem,3rem+4vw,7rem)] font-extrabold leading-none tracking-[-0.05em] text-label">
              <CountUp value={identity.totalCredits} />
              <span className="ml-2 text-[0.35em] tracking-[-0.02em] text-label-2">
                SKS
              </span>
            </p>
            <p className="mt-4 max-w-md text-[17px] leading-[1.45] text-label-2">
              Teori ekonomi, fiqh muamalah, dan praktik industri keuangan
              syariah dalam masa studi {identity.normalDuration}, dengan gelar{" "}
              {identity.degree}.
            </p>
          </Tile>
          <Tile
            className="md:col-span-2"
            label="Akreditasi UIN SGD"
            dark
            delay={0.06}
          >
            <p className="text-[clamp(2.5rem,2rem+2vw,3.5rem)] font-extrabold leading-none tracking-[-0.03em]">
              {identity.universityAccreditation}
            </p>
            <p className="mt-4 text-[15px] leading-[1.45] text-white/80">
              BAN-PT · {identity.universityAccreditationPeriod}
            </p>
          </Tile>
          <Tile
            className="md:col-span-3"
            label="Pasar modal syariah"
            delay={0.1}
          >
            <p className="text-[clamp(2.5rem,2rem+2vw,3.5rem)] font-extrabold leading-none tracking-[-0.03em] text-label">
              <CountUp value={115} />
            </p>
            <p className="mt-3 text-[16px] leading-[1.45] text-label-2">
              mahasiswa mengikuti Sekolah Pasar Modal Syariah 2026 di Kantor
              Perwakilan BEI Jawa Barat.
            </p>
          </Tile>
          <Tile
            className="md:col-span-3"
            label="Pengabdian masyarakat"
            delay={0.14}
          >
            <p className="text-[clamp(2.5rem,2rem+2vw,3.5rem)] font-extrabold leading-none tracking-[-0.03em] text-label">
              <CountUp value={15} />
            </p>
            <p className="mt-3 text-[16px] leading-[1.45] text-label-2">
              warga Desa Cibiru Wetan meraih sertifikat Juru Sembelih Halal
              lewat pelatihan berbasis SKKNI.
            </p>
          </Tile>
        </div>
      </section>

      {/* ─── Bidang kajian (kartu menumpuk) ───────────────── */}
      <section className="border-t border-hairline px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto grid max-w-[1024px] gap-12 md:grid-cols-[1fr_1.35fr]">
          <div>
            <div className="md:sticky md:top-28">
              <Reveal>
                <SectionHeading
                  align="left"
                  eyebrow="Keilmuan"
                  title="Bidang kajian"
                  description="Empat bidang yang menjadi fokus perkuliahan, penelitian, dan pengabdian dosen serta mahasiswa."
                />
                <Link
                  href="/prodi/akademik"
                  className="mt-8 inline-flex items-center gap-1.5 text-[16px] font-semibold text-accent hover:underline"
                >
                  Lihat kurikulum lengkap <ArrowRight className="size-4" />
                </Link>
              </Reveal>
            </div>
          </div>
          <StackBidang items={site.bidangKajian} />
        </div>
      </section>

      {/* ─── Prestasi ─────────────────────────────────────── */}
      {site.prestasi.length > 0 && (
        <section className="bg-mist py-24 sm:py-32">
          <Reveal className="mx-auto flex max-w-[1024px] flex-wrap items-end justify-between gap-4 px-4 sm:px-0">
            <SectionHeading
              align="left"
              eyebrow="Selamat & Sukses"
              title="Prestasi mahasiswa & dosen"
            />
            <Link
              href="/prodi/kemahasiswaan#prestasi"
              className="text-[16px] font-semibold text-accent hover:underline"
            >
              Lihat semua ›
            </Link>
          </Reveal>
          <div className="mt-10">
            <Carousel label="Prestasi" itemClassName="max-w-[280px] w-[70vw]">
              {site.prestasi.map((p, i) => (
                <PrestasiCard key={`${p.name}-${i}`} item={p} />
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* ─── Apresiasi bulan ini ───────────────────────────── */}
      {apresiasi.length > 0 && (
        <section className="px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Apresiasi"
                title={`Insan Eksyar ${bulanApresiasi}`}
              />
            </Reveal>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {apresiasi.map((a, i) => (
                <Reveal key={`${a.nama}-${i}`} delay={i * 0.06}>
                  <div className="flex h-full gap-5 rounded-[28px] bg-sand/60 p-6">
                    {a.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.photo}
                        alt=""
                        className="size-24 shrink-0 rounded-[20px] object-cover"
                      />
                    ) : null}
                    <div>
                      <p className="text-[13px] font-semibold text-accent">
                        {a.peran}
                      </p>
                      <p className="mt-1 text-[19px] font-bold leading-snug text-navy">
                        {a.nama}
                      </p>
                      <p className="mt-2 text-[14.5px] leading-[1.55] text-navy/75">
                        {a.alasan}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Kegiatan (carousel) ──────────────────────────── */}
      {kegiatan.length > 0 && (
        <section className="py-24 sm:py-32">
          <Reveal className="mx-auto flex max-w-[1024px] flex-wrap items-end justify-between gap-4 px-4 sm:px-0">
            <SectionHeading
              align="left"
              eyebrow="Kegiatan"
              title="Kegiatan terbaru"
            />
            <Link
              href="/prodi/berita#kegiatan"
              className="text-[16px] font-semibold text-accent hover:underline"
            >
              Arsip kegiatan ›
            </Link>
          </Reveal>
          <div className="mt-10">
            <Carousel label="Kegiatan terbaru">
              {kegiatan.map((k, i) => (
                <HighlightCard key={`${k.title}-${i}`} item={k} />
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* ─── Direktori skripsi ────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6 sm:pb-32">
        <Reveal className="mx-auto max-w-[1024px]">
          <div className="rounded-[32px] bg-navy px-6 py-14 text-center text-white sm:px-16 sm:py-20">
            <p className="text-[15px] font-semibold uppercase tracking-[0.08em] text-sand">
              Direktori skripsi
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.035em]">
              <CountUp value={skripsi.length} /> skripsi Ekonomi Syariah
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-[1.5] text-white/75">
              Cari referensi skripsi kakak tingkat
              {skripsiYears.length > 1
                ? ` (${skripsiYears[0]}–${skripsiYears.at(-1)})`
                : ""}
              , lalu cek apakah rencana judulmu sudah pernah diteliti.
            </p>
            <form
              action="/prodi/skripsi"
              className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full bg-canvas p-2 pl-5"
            >
              <Search className="size-5 shrink-0 text-label-3" />
              <input
                name="q"
                aria-label="Cari skripsi"
                placeholder="Mis. zakat, bank syariah, label halal"
                className="min-w-0 flex-1 bg-transparent py-2 text-[16px] text-label outline-none placeholder:text-label-3"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-accent px-6 py-2.5 text-[15px] font-semibold text-white hover:bg-accent-strong"
              >
                Cari
              </button>
            </form>
            <Link
              href="/prodi/skripsi?mode=cek"
              className="mt-5 inline-block text-[15px] font-semibold text-sand hover:underline"
            >
              Cek kemiripan judul ›
            </Link>
          </div>
        </Reveal>
      </section>

      {site.kampanyePmb.aktif && site.kampanyePmb.judul && (
        <PmbCampaign
          judul={site.kampanyePmb.judul}
          teks={site.kampanyePmb.teks}
          tenggat={site.kampanyePmb.tenggat}
          pmbUrl={kontak.pmbUrl}
        />
      )}

      {/* ─── Video YouTube terbaru ─────────────────────────── */}
      {ytLatest.length > 0 && (
        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="YouTube"
                title="Video terbaru"
              />
              <Link
                href="/prodi/galeri"
                className="text-[16px] font-semibold text-accent hover:underline"
              >
                Semua video ›
              </Link>
            </Reveal>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {ytLatest.slice(0, 2).map((v) => (
                <VideoEmbed key={v.url} url={v.url} title={v.title} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Video profil ─────────────────────────────────── */}
      {site.video[0] && (
        <section className="px-4 pb-24 sm:px-6 sm:pb-32">
          <Reveal className="mx-auto max-w-[1024px]">
            <SectionHeading eyebrow="Video" title={site.video[0].title} />
            <div className="mt-10">
              <VideoEmbed url={site.video[0].url} title={site.video[0].title} />
            </div>
          </Reveal>
        </section>
      )}

      {/* ─── Galeri ───────────────────────────────────────── */}
      {site.galeri.length > 0 && (
        <section className="pb-24 sm:pb-32">
          <Reveal className="mx-auto flex max-w-[1024px] flex-wrap items-end justify-between gap-4 px-4 sm:px-0">
            <SectionHeading
              align="left"
              eyebrow="Galeri"
              title="Dokumentasi kegiatan"
            />
            <Link
              href="/prodi/galeri"
              className="text-[16px] font-semibold text-accent hover:underline"
            >
              Lihat galeri ›
            </Link>
          </Reveal>
          <div className="mt-10">
            <Carousel label="Galeri" itemClassName="w-[70vw] max-w-[320px]">
              {site.galeri.slice(0, 10).map((g, i) => (
                <Link
                  key={`${g.image}-${i}`}
                  href="/prodi/galeri"
                  className="group block overflow-hidden rounded-[24px] bg-mist"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.image}
                    alt={g.caption}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                </Link>
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* ─── Testimoni ────────────────────────────────────── */}
      {site.testimoni.length > 0 && (
        <section className="bg-mist py-24 sm:py-32">
          <Reveal className="mx-auto max-w-[1024px] px-4 sm:px-0">
            <SectionHeading
              align="left"
              eyebrow="Cerita alumni"
              title="Kata mereka"
            />
          </Reveal>
          <div className="mt-10">
            <Carousel label="Testimoni">
              {site.testimoni.map((t, i) => (
                <TestimoniCard key={`${t.name}-${i}`} item={t} />
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* ─── Mitra (marquee) ──────────────────────────────── */}
      {site.mitra.length > 0 && (
        <section className="border-y border-hairline py-16 sm:py-20">
          <Reveal className="mx-auto mb-10 flex max-w-[1024px] flex-wrap items-end justify-between gap-4 px-4 sm:px-0">
            <p className="text-[15px] font-semibold uppercase tracking-[0.08em] text-accent">
              Mitra kerja sama
            </p>
            <Link
              href="/prodi/profil#mitra"
              className="text-[16px] font-semibold text-accent hover:underline"
            >
              Bentuk kerja sama ›
            </Link>
          </Reveal>
          <Marquee items={site.mitra.map((m) => m.name)} />
        </section>
      )}

      {/* ─── Berita, pengumuman & agenda ──────────────────── */}
      <section className="bg-mist px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-[1024px]">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Kabar Eksyar"
              title="Berita & pengumuman"
            />
            <Link
              href="/prodi/berita"
              className="text-[16px] font-semibold text-accent hover:underline"
            >
              Lihat semua ›
            </Link>
          </Reveal>

          <div
            className={
              articles.length
                ? "mt-10 grid gap-5 lg:grid-cols-[2fr_1fr]"
                : "mt-10 grid gap-5 md:grid-cols-2"
            }
          >
            {articles.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2">
                {articles.map((n, i) => (
                  <Reveal
                    key={n.id}
                    delay={i * 0.06}
                    className={i === 0 ? "sm:col-span-2" : undefined}
                  >
                    <NewsCard item={n} cover={coverFor(n, media)} />
                  </Reveal>
                ))}
              </div>
            )}

            <div
              className={articles.length ? "flex flex-col gap-5" : "contents"}
            >
              <Reveal>
                <div className="h-full rounded-[24px] border border-hairline bg-canvas px-6 pt-6">
                  <h3 className="text-[19px] font-bold tracking-[-0.01em] text-label">
                    Pengumuman
                  </h3>
                  <AnnouncementList items={announcements} />
                </div>
              </Reveal>
              <Reveal delay={0.06}>
                <div className="h-full rounded-[24px] border border-hairline bg-canvas p-6">
                  <h3 className="text-[19px] font-bold tracking-[-0.01em] text-label">
                    Agenda
                  </h3>
                  {upcoming.length > 0 ? (
                    <ul className="mt-2 divide-y divide-hairline">
                      {upcoming.map((e) => (
                        <li key={e.id} className="py-4">
                          <p className="text-[13px] text-label-3">
                            {formatDateTime(e.startsAt)}
                          </p>
                          <p className="mt-1 text-[16px] font-semibold leading-snug text-label">
                            {e.title}
                          </p>
                          <p className="mt-0.5 text-[13px] text-label-2">
                            {e.isOnline ? "Daring" : e.location}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : jadwal.length ? (
                    <ul className="mt-2 divide-y divide-hairline">
                      {jadwal.map((k) => (
                        <li key={k.kegiatan} className="py-4">
                          <p className="text-[13px] text-label-3">
                            {rentang(k)}
                          </p>
                          <p className="mt-1 text-[16px] font-semibold leading-snug text-label">
                            {k.kegiatan}
                          </p>
                          <p className="mt-0.5 text-[13px] text-label-2">
                            {k.kategori}
                          </p>
                        </li>
                      ))}
                      <li className="py-3">
                        <Link
                          href="/prodi/kalender"
                          className="text-[14px] font-semibold text-accent hover:underline"
                        >
                          Kalender akademik ›
                        </Link>
                      </li>
                    </ul>
                  ) : (
                    <p className="py-4 text-[15px] text-label-2">
                      Belum ada agenda terjadwal.
                    </p>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <PmbCta />
    </>
  );
}

function StackBidang({
  items,
}: {
  items: { title: string; description: string }[];
}) {
  return (
    <StickyStack>
      {items.map((b, i) => {
        const Icon = BIDANG_ICONS[i % BIDANG_ICONS.length];
        const tone = BIDANG_TONES[i % BIDANG_TONES.length];
        return (
          <article
            key={b.title}
            className={`flex min-h-[280px] flex-col rounded-[28px] p-8 sm:p-10 ${tone.card}`}
          >
            <div className="flex items-start justify-between">
              <span
                className={`grid size-12 place-items-center rounded-2xl ${tone.icon}`}
              >
                <Icon className="size-6" strokeWidth={1.75} />
              </span>
              <span
                className={`text-[15px] font-bold tabular-nums ${tone.num}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-auto pt-12 text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-bold leading-[1.15] tracking-[-0.02em]">
              {b.title}
            </h3>
            <p className={`mt-3 text-[16px] leading-[1.5] ${tone.body}`}>
              {b.description}
            </p>
          </article>
        );
      })}
    </StickyStack>
  );
}

function Tile({
  label,
  children,
  className,
  dark = false,
  delay = 0,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  delay?: number;
}) {
  return (
    <Reveal className={className} delay={delay}>
      <div
        className={
          dark
            ? "flex h-full flex-col justify-between rounded-[28px] bg-accent p-8 text-white transition-transform duration-500 hover:scale-[1.015] sm:p-10"
            : "flex h-full flex-col justify-between rounded-[28px] bg-mist p-8 transition-transform duration-500 hover:scale-[1.015] sm:p-10"
        }
      >
        <p
          className={
            dark
              ? "text-[14px] font-bold text-sand"
              : "text-[14px] font-bold text-accent"
          }
        >
          {label}
        </p>
        <div className="mt-10">{children}</div>
      </div>
    </Reveal>
  );
}
