import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listEvents } from "@/lib/data/provider";
import type { Event } from "@/lib/data/types";
import { formatDateTime } from "@/lib/format/dates";
import {
  coverFor,
  getMediaMap,
  getMemberMap,
  isAnnouncement,
  isBuletinHmj,
  listPublishedNews,
} from "@/lib/site/content";
import { getSite } from "@/lib/site/get-site";
import { getSkripsi } from "@/lib/site/skripsi";
import { instagramFeed } from "@/lib/instagram/graph";
import { kalenderMendatang, rentang } from "@/lib/site/kalender";
import { prodi } from "@/lib/site/prodi";
import { FastHubUin } from "@/components/site/fast-hub-uin";
import { AnnouncementList } from "@/components/site/announcement-list";
import { Carousel } from "@/components/site/carousel";
import { HighlightCard } from "@/components/site/highlight-card";
import { InteractiveHero, type HeroSlide } from "@/components/site/interactive-hero";
import { MitraMarquee } from "@/components/site/mitra-marquee";
import { NewsCard } from "@/components/site/news-card";
import { PrestasiCard } from "@/components/site/prestasi-card";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { SkripsiTrendExplorer } from "@/components/site/skripsi-trend-explorer";
import { StickyStack } from "@/components/site/sticky-stack";
import { TestimoniCard } from "@/components/site/testimoni-card";
import { VideoEmbed } from "@/components/site/video-embed";

// Render ulang paling lama tiap 5 menit agar update CMS langsung muncul
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

const BIDANG_TONES = [
  {
    card: "bg-accent text-white",
    icon: "bg-white/15 text-white",
    body: "text-white/85",
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
  const [site, news, events, media, skripsi, ig, members] = await Promise.all([
    getSite(),
    listPublishedNews(),
    listEvents({ fromDate: new Date().toISOString() }),
    getMediaMap(),
    getSkripsi(),
    instagramFeed(6),
    getMemberMap(),
  ]);
  const jadwal = kalenderMendatang(site.kalender, 3);
  const { identity, kontak } = site;

  const announcements = news.filter(isAnnouncement).slice(0, 4);
  const buletinItems = news.filter(isBuletinHmj).slice(0, 3);
  const articles = news
    .filter((n) => !isAnnouncement(n) && !isBuletinHmj(n))
    .slice(0, 3);
  const upcoming = events
    .filter((e) => PUBLIC_EVENT_CATEGORIES.includes(e.category))
    .slice(0, 3);
  const kegiatan = [...site.kegiatan]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  const heroSlides: HeroSlide[] = [
    ...(identity.heroImage && !kegiatan.some((k) => k.image === identity.heroImage)
      ? [
          {
            category: "Program Studi",
            title: identity.heroTitle || "Ekonomi Syariah",
            summary: identity.heroDescription || "Pendidikan tinggi ekonomi Islam unggul berakreditasi nasional.",
            date: "",
            image: identity.heroImage,
            href: "/prodi/akademik",
            external: false,
          },
        ]
      : []),
    ...kegiatan
      .filter((k) => Boolean(k.image))
      .slice(0, 4)
      .map((k) => ({
        category: k.category,
        title: k.title,
        summary: k.summary,
        date: k.date,
        image: k.image!,
        href: k.source || "/prodi/berita#kegiatan",
        external: Boolean(k.source && k.source.startsWith("http")),
      })),
  ];

  const heroStats = [
    { value: `${identity.totalCredits} SKS`, label: "Kurikulum Sarjana (S.E.)" },
    { value: "Semester 1–8", label: "Struktur Perkuliahan" },
    {
      value: `${Math.max(skripsi.length, 515).toLocaleString("id-ID")}+`,
      label: "Judul Skripsi Terindeks",
    },
    {
      value: identity.universityAccreditation || "Unggul",
      label: "Akreditasi Institusi",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: `${prodi.fullName} ${prodi.university}`,
            alternateName: "Ekonomi Syariah UIN SGD",
            parentOrganization: {
              "@type": "CollegeOrUniversity",
              name: prodi.university,
            },
            email: kontak.email,
            address: `${kontak.address}, ${kontak.street}`,
            url: kontak.website || undefined,
            sameAs: [
              kontak.instagram,
              kontak.tiktok,
              kontak.x,
              site.medsos.youtubeChannelId
                ? `https://www.youtube.com/channel/${site.medsos.youtubeChannelId}`
                : undefined,
            ].filter(Boolean),
          }).replace(/</g, "\\u003c"),
        }}
      />

      {/* ─── 1. Hero Terpadu ─────────────────────────────────── */}
      <InteractiveHero
        title={identity.heroTitle || "Ekonomi Syariah"}
        subtitle={`${prodi.faculty} · ${prodi.university}`}
        description={
          identity.heroDescription ||
          "Mempersiapkan sarjana ekonomi berintegritas yang menguasai analisis perbankan syariah, pasar modal, tata kelola filantropi, dan etika bisnis Islam."
        }
        stats={heroStats}
        slides={heroSlides}
      />

      {/* ─── 2. Fast-Hub Portal Mahasiswa UIN SGD ─────────────── */}
      <FastHubUin />

      {/* ─── 3. Fokus Bidang Keilmuan (4 Bidang Kajian) ───────── */}
      <section className="border-t border-hairline/80 px-4 py-12 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-[1040px]">
          <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Pilar Keilmuan"
              title="Bidang Kajian"
              description="Empat konsentrasi keilmuan yang menjadi fokus kurikulum, riset tugas akhir, dan karir lulusan."
            />
            <Link
              href="/prodi/akademik"
              className="inline-flex items-center gap-1.5 text-[14px] sm:text-[15px] font-semibold text-accent hover:underline shrink-0"
            >
              Kurikulum Semester 1–8 <ArrowRight className="size-4" />
            </Link>
          </Reveal>

          {/* Versi Mobile: Kartu Tipografi Bersih Tanpa Ikon AI */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:hidden">
            {site.bidangKajian.map((b, i) => (
              <div
                key={b.title}
                className="flex items-start justify-between gap-4 rounded-2xl border border-hairline bg-canvas p-5 shadow-xs"
              >
                <div>
                  <span className="font-mono text-[12px] font-bold text-accent">
                    0{i + 1}
                  </span>
                  <h3 className="mt-1 text-[16px] font-bold text-label leading-snug">
                    {b.title}
                  </h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-label-2">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Versi Desktop: StickyStack Efek Tumpuk Elegan */}
          <div className="hidden md:block mt-8">
            <div className="grid gap-12 md:grid-cols-[1fr_1.35fr]">
              <div className="md:sticky md:top-28 self-start">
                <p className="text-[15px] leading-relaxed text-label-2">
                  Struktur konsentrasi dirancang agar lulusan memiliki keunggulan kompetitif di industri keuangan syariah, lembaga regulator nasional, pasar modal syariah, dan ekosistem bisnis halal.
                </p>
                <div className="mt-6">
                  <Link
                    href="/prodi/akademik"
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[14px] font-semibold text-white shadow-xs hover:bg-accent-strong"
                  >
                    Jelajahi Mata Kuliah <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>

              <StickyStack>
                {site.bidangKajian.map((b, i) => {
                  const tone = BIDANG_TONES[i % BIDANG_TONES.length];
                  return (
                    <article
                      key={b.title}
                      className={`flex min-h-[180px] flex-col rounded-2xl p-6 lg:p-8 ${tone.card}`}
                    >
                      <span className={`font-mono text-[14px] font-bold tabular-nums ${tone.num}`}>
                        0{i + 1}
                      </span>
                      <h3 className="mt-auto pt-4 text-[22px] font-bold leading-tight">
                        {b.title}
                      </h3>
                      <p className={`mt-2 text-[14.5px] leading-relaxed ${tone.body}`}>
                        {b.description}
                      </p>
                    </article>
                  );
                })}
              </StickyStack>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Peta Riset & Tren Skripsi 515+ Judul ─────────── */}
      <SkripsiTrendExplorer />

      {/* ─── 5. Prestasi Mahasiswa & Dosen ─────────────────── */}
      {site.prestasi.length > 0 && (
        <section className="bg-mist/40 border-t border-hairline/80 py-12 sm:py-20">
          <div className="mx-auto max-w-[1040px] px-4 sm:px-6">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Selamat & Sukses"
                title="Prestasi Mahasiswa & Dosen"
                description="Capaian kompetisi ilmiah nasional, kejuaraan bisnis syariah, dan rekognisi akademik."
              />
              <Link
                href="/prodi/kemahasiswaan#prestasi"
                className="text-[14px] sm:text-[15px] font-semibold text-accent hover:underline flex items-center gap-1"
              >
                Lihat semua prestasi <ArrowRight className="size-4" />
              </Link>
            </Reveal>
            <div className="mt-8">
              <Carousel label="Prestasi" itemClassName="w-[78vw] max-w-[280px] sm:max-w-[300px]">
                {site.prestasi.map((p, i) => (
                  <PrestasiCard key={`${p.name}-${i}`} item={p} />
                ))}
              </Carousel>
            </div>
          </div>
        </section>
      )}

      {/* ─── 6. Kegiatan & Liputan Terkini (Carousel) ────────── */}
      {kegiatan.length > 0 && (
        <section className="border-t border-hairline/80 py-12 sm:py-20">
          <div className="mx-auto max-w-[1040px] px-4 sm:px-6">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Dokumentasi"
                title="Kegiatan & Liputan Terkini"
                description="Seminar nasional, pengabdian masyarakat, workshop industri, dan aktivitas civitas akademika."
              />
              <Link
                href="/prodi/berita#kegiatan"
                className="text-[14px] sm:text-[15px] font-semibold text-accent hover:underline flex items-center gap-1"
              >
                Arsip kegiatan <ArrowRight className="size-4" />
              </Link>
            </Reveal>
            <div className="mt-8">
              <Carousel label="Kegiatan terbaru">
                {kegiatan.map((k, i) => (
                  <HighlightCard key={`${k.title}-${i}`} item={k} />
                ))}
              </Carousel>
            </div>
          </div>
        </section>
      )}

      {/* ─── 7. Kabar Eksyar, Pengumuman & Agenda ───────────── */}
      <section className="border-t border-hairline/80 px-4 py-12 sm:px-6 sm:py-20 bg-mist/30">
        <div className="mx-auto max-w-[1040px]">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Kabar Eksyar"
              title="Berita & Pengumuman Humas"
              description="Informasi kegiatan akademik, edaran resmi, dan jadwal perkuliahan Jurusan Ekonomi Syariah."
            />
            <Link
              href="/prodi/berita"
              className="text-[14px] sm:text-[15px] font-semibold text-accent hover:underline flex items-center gap-1"
            >
              Lihat semua berita <ArrowRight className="size-4" />
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Kolom Berita */}
            {articles.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {articles.map((n, i) => (
                  <Reveal
                    key={n.id}
                    delay={i * 0.05}
                    className={i === 0 ? "sm:col-span-2" : undefined}
                  >
                    <NewsCard
                      item={n}
                      cover={coverFor(n, media)}
                      author={members.get(n.authorId)}
                    />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-hairline bg-canvas p-8 text-center text-label-2">
                Belum ada berita yang dipublikasikan.
              </div>
            )}

            {/* Kolom Pengumuman & Agenda */}
            <div className="flex flex-col gap-5">
              <Reveal>
                <div className="rounded-2xl border border-hairline bg-canvas p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-hairline">
                    <h3 className="text-[17px] font-bold text-label">
                      Pengumuman Resmi
                    </h3>
                    <Link
                      href="/prodi/berita?kategori=pengumuman"
                      className="text-[12px] font-semibold text-accent hover:underline"
                    >
                      Arsip ›
                    </Link>
                  </div>
                  <div className="mt-3">
                    <AnnouncementList items={announcements} />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="rounded-2xl border border-hairline bg-canvas p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-hairline">
                    <h3 className="text-[17px] font-bold text-label">
                      Agenda Akademik
                    </h3>
                    <Link
                      href="/prodi/kalender"
                      className="text-[12px] font-semibold text-accent hover:underline"
                    >
                      Kalender Lengkap ›
                    </Link>
                  </div>
                  {upcoming.length > 0 ? (
                    <ul className="mt-2 divide-y divide-hairline">
                      {upcoming.map((e) => (
                        <li key={e.id} className="py-3">
                          <p className="text-[12px] font-medium text-accent">
                            {formatDateTime(e.startsAt)}
                          </p>
                          <p className="mt-0.5 text-[14.5px] font-semibold leading-snug text-label">
                            {e.title}
                          </p>
                          <p className="mt-0.5 text-[12px] text-label-2">
                            {e.isOnline ? "Daring (Online)" : e.location}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : jadwal.length > 0 ? (
                    <ul className="mt-2 divide-y divide-hairline">
                      {jadwal.map((k) => (
                        <li key={k.kegiatan} className="py-3">
                          <p className="text-[12px] font-medium text-accent">
                            {rentang(k)}
                          </p>
                          <p className="mt-0.5 text-[14.5px] font-semibold leading-snug text-label">
                            {k.kegiatan}
                          </p>
                          <p className="mt-0.5 text-[12px] text-label-2">
                            {k.kategori}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="py-4 text-[13.5px] text-label-2">
                      Belum ada agenda terdekat.
                    </p>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. Buletin Mahasiswa Ekonomi Syariah ────────────── */}
      {buletinItems.length > 0 && (
        <section className="border-t border-hairline/80 px-4 py-12 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[1040px]">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Karya Ilmiah"
                title="Buletin Mahasiswa Ekonomi Syariah"
                description="Analisis perbankan, opini keuangan syariah, dan resume riset karya mahasiswa."
              />
              <Link
                href="/prodi/berita?kategori=artikel"
                className="text-[14px] sm:text-[15px] font-semibold text-accent hover:underline flex items-center gap-1"
              >
                Semua buletin mahasiswa <ArrowRight className="size-4" />
              </Link>
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {buletinItems.map((n, i) => (
                <Reveal key={n.id} delay={i * 0.05}>
                  <NewsCard
                    item={n}
                    cover={coverFor(n, media)}
                    author={members.get(n.authorId)}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 9. Kiprah & Cerita Alumni ───────────────────────── */}
      {site.testimoni.length > 0 && (
        <section className="border-t border-hairline/80 bg-mist/30 px-4 py-12 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[1040px]">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Jejaring Alumni"
                title="Kiprah & Cerita Alumni"
                description="Sarjana Ekonomi Syariah berkarir di perbankan syariah, lembaga regulator (OJK/BI), pasar modal, dan industri halal."
              />
              <Link
                href="/prodi/alumni"
                className="text-[14px] sm:text-[15px] font-semibold text-accent hover:underline flex items-center gap-1"
              >
                Tracer study & alumni <ArrowRight className="size-4" />
              </Link>
            </Reveal>
            <div className="mt-8">
              <Carousel label="Cerita alumni">
                {site.testimoni.map((t, i) => (
                  <TestimoniCard key={`${t.name}-${i}`} item={t} />
                ))}
              </Carousel>
            </div>
          </div>
        </section>
      )}

      {/* ─── 10. Video YouTube & Dokumentasi ─────────────────── */}
      {site.video.length > 0 && (
        <section className="border-t border-hairline/80 px-4 py-12 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[1040px]">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Dokumentasi Video"
                title="Video Profil & Edukasi Syariah"
                description="Profil fakultas, kuliah umum, dan video literasi keuangan Islam."
              />
              <Link
                href="/prodi/galeri"
                className="text-[14px] sm:text-[15px] font-semibold text-accent hover:underline flex items-center gap-1"
              >
                Galeri lengkap <ArrowRight className="size-4" />
              </Link>
            </Reveal>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {site.video.slice(0, 2).map((v) => (
                <VideoEmbed key={v.url} url={v.url} title={v.title} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── 11. Instagram Feed Resmi (@eksyaruinsgd) ───────── */}
      {ig.length > 0 && (
        <section className="border-t border-hairline/80 px-4 py-12 sm:px-6 sm:py-20 bg-mist/20">
          <div className="mx-auto max-w-[1040px]">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Instagram"
                title={kontak.instagramHandle || "@eksyaruinsgd"}
                description="Dokumentasi kegiatan dan kabar harian langsung dari akun Instagram resmi jurusan."
              />
              {kontak.instagram && (
                <a
                  href={kontak.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] sm:text-[15px] font-semibold text-accent hover:underline flex items-center gap-1"
                >
                  Ikuti di Instagram ↗
                </a>
              )}
            </Reveal>
            <ul className="mt-8 grid grid-cols-3 sm:grid-cols-6 gap-3">
              {ig.map((p, i) => (
                <li key={`${p.permalink}-${i}`}>
                  <a
                    href={p.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block aspect-square overflow-hidden rounded-2xl bg-mist shadow-xs transition-transform duration-300 hover:scale-[1.03]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.caption || "Postingan Instagram"}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ─── 12. Mitra Kerjasama (FEBI Marquee Bersih) ──────── */}
      <MitraMarquee />
    </>
  );
}
