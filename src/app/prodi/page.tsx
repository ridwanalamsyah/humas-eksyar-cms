import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
import { hero, prodi } from "@/lib/site/prodi";
import { AnnouncementList } from "@/components/site/announcement-list";
import { HighlightCard } from "@/components/site/highlight-card";
import { InteractiveHero } from "@/components/site/interactive-hero";
import { MitraMarquee } from "@/components/site/mitra-marquee";
import { NewsCard } from "@/components/site/news-card";
import { PrestasiCard } from "@/components/site/prestasi-card";
import { SectionHeading } from "@/components/site/section-heading";
import { SkripsiTrendExplorer } from "@/components/site/skripsi-trend-explorer";
import { TestimoniCard } from "@/components/site/testimoni-card";

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
  const articles = news
    .filter((n) => !isAnnouncement(n) && !isBuletinHmj(n))
    .slice(0, 3);
  const upcoming = events
    .filter((e) => PUBLIC_EVENT_CATEGORIES.includes(e.category))
    .slice(0, 3);
  const kegiatan = [...site.kegiatan]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  // Hero A: satu foto (dari CMS), judul menyebut prodi + kampus + kota, tiga angka.
  const heroTitle =
    identity.heroTitle && identity.heroTitle !== prodi.name
      ? identity.heroTitle
      : `${prodi.name} ${prodi.university}`;
  const heroStats = [
    {
      value: identity.universityAccreditation || "Unggul",
      label: "Akreditasi",
    },
    { value: `${identity.totalCredits} SKS`, label: "Kurikulum OBE" },
    {
      value: `${Math.max(skripsi.length, 515).toLocaleString("id-ID")}+`,
      label: "Skripsi Digilib",
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
        title={heroTitle}
        description={identity.heroDescription || hero.description}
        image={identity.heroImage || hero.image || "/prodi/hero-mahasiswa.jpg"}
        imageAlt={hero.imageAlt}
        stats={heroStats}
      />

      {/* ─── 2. Bidang kajian: grid 2×2 ─────────────────────── */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1160px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading align="left" title="Bidang kajian" />
            <Link
              href="/prodi/akademik"
              className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-accent hover:underline"
            >
              Lihat kurikulum <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {site.bidangKajian.slice(0, 4).map((b, i) => {
              const tone = BIDANG_TONES[i % BIDANG_TONES.length];
              return (
                <article
                  key={b.title}
                  className={`flex min-h-[200px] flex-col rounded-3xl p-6 sm:p-8 ${tone.card}`}
                >
                  <span className={`text-[14px] font-bold tabular-nums ${tone.num}`}>0{i + 1}</span>
                  <h3 className="mt-auto pt-6 text-[24px] font-bold leading-tight tracking-[-0.02em]">
                    {b.title}
                  </h3>
                  <p className={`mt-2 line-clamp-2 text-[16px] leading-relaxed ${tone.body}`}>
                    {b.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 3. Kegiatan dan prestasi terbaru: grid, bukan carousel ─── */}
      {(kegiatan.length > 0 || site.prestasi.length > 0) && (
        <section className="border-t border-hairline/80 bg-mist/40 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-[1160px]">
            {kegiatan.length > 0 && (
              <>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <SectionHeading align="left" title="Kegiatan terbaru" />
                  <Link
                    href="/prodi/berita#kegiatan"
                    className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-accent hover:underline"
                  >
                    Semua kegiatan <ArrowRight className="size-4" />
                  </Link>
                </div>
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {kegiatan.slice(0, 3).map((k, i) => (
                    <HighlightCard key={`${k.title}-${i}`} item={k} />
                  ))}
                </div>
              </>
            )}
            {site.prestasi.length > 0 && (
              <>
                <div className="mt-16 flex flex-wrap items-end justify-between gap-4">
                  <h3 className="text-[24px] font-bold tracking-[-0.02em] text-label">Prestasi</h3>
                  <Link
                    href="/prodi/kemahasiswaan#prestasi"
                    className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-accent hover:underline"
                  >
                    Semua prestasi <ArrowRight className="size-4" />
                  </Link>
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {site.prestasi.slice(0, 3).map((p, i) => (
                    <PrestasiCard key={`${p.name}-${i}`} item={p} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ─── 4. Topik skripsi terbanyak ──────────────────────── */}
      <SkripsiTrendExplorer />

      {/* ─── 5. Kabar: berita, pengumuman, agenda ───────────── */}
      <section className="border-t border-hairline/80 bg-mist/30 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-[1160px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading align="left" title="Kabar prodi" />
            <Link
              href="/prodi/berita"
              className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-accent hover:underline"
            >
              Semua berita <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            {articles.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {articles.slice(0, 2).map((n) => (
                  <NewsCard
                    key={n.id}
                    item={n}
                    cover={coverFor(n, media)}
                    author={members.get(n.authorId)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-hairline bg-canvas p-8 text-center text-[16px] text-label-2">
                Belum ada berita.
              </div>
            )}

            <div className="flex min-w-0 flex-col gap-5">
              <div className="rounded-2xl border border-hairline bg-canvas p-6">
                <div className="flex items-center justify-between border-b border-hairline pb-3">
                  <h3 className="text-[18px] font-bold text-label">Agenda</h3>
                  <Link href="/prodi/kalender" className="text-[14px] font-semibold text-accent hover:underline">
                    Kalender
                  </Link>
                </div>
                {upcoming.length > 0 ? (
                  <ul className="mt-2 divide-y divide-hairline">
                    {upcoming.map((e) => (
                      <li key={e.id} className="py-3">
                        <p className="text-[14px] font-medium text-accent">{formatDateTime(e.startsAt)}</p>
                        <p className="mt-0.5 text-[16px] font-semibold leading-snug text-label">{e.title}</p>
                      </li>
                    ))}
                  </ul>
                ) : jadwal.length > 0 ? (
                  <ul className="mt-2 divide-y divide-hairline">
                    {jadwal.map((k) => (
                      <li key={k.kegiatan} className="py-3">
                        <p className="text-[14px] font-medium text-accent">{rentang(k)}</p>
                        <p className="mt-0.5 text-[16px] font-semibold leading-snug text-label">{k.kegiatan}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="py-4 text-[16px] text-label-2">Belum ada agenda terdekat.</p>
                )}
              </div>

              {announcements.length > 0 && (
                <div className="rounded-2xl border border-hairline bg-canvas p-6">
                  <div className="flex items-center justify-between border-b border-hairline pb-3">
                    <h3 className="text-[18px] font-bold text-label">Pengumuman</h3>
                    <Link
                      href="/prodi/berita?kategori=pengumuman"
                      className="text-[14px] font-semibold text-accent hover:underline"
                    >
                      Arsip
                    </Link>
                  </div>
                  <div className="mt-3">
                    <AnnouncementList items={announcements.slice(0, 3)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Alumni + ajakan untuk calon mahasiswa ─────────── */}
      <section className="border-t border-hairline/80 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-[1160px] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <SectionHeading
              align="left"
              title="Lulusan kami bekerja di bank, bursa, dan lembaga zakat"
            />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/prodi/mahasiswa-baru"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-[16px] font-semibold text-white transition-colors hover:bg-accent-strong"
              >
                Info pendaftaran <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/prodi/alumni"
                className="inline-flex h-12 items-center justify-center rounded-full border border-hairline px-6 text-[16px] font-semibold text-label transition-colors hover:border-accent/40"
              >
                Cerita alumni
              </Link>
            </div>
          </div>
          {site.testimoni[0] && <TestimoniCard item={site.testimoni[0]} />}
        </div>
      </section>

      {/* ─── Instagram: hanya tampil bila akun resmi benar-benar tersambung ── */}
      {ig.length > 0 && (
        <section className="border-t border-hairline/80 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-[1160px]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading align="left" title={kontak.instagramHandle || "@eksyaruinsgd"} />
              {kontak.instagram && (
                <a
                  href={kontak.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-accent hover:underline"
                >
                  Ikuti di Instagram <ArrowUpRight className="size-4" />
                </a>
              )}
            </div>
            <ul className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {ig.map((p, i) => (
                <li key={`${p.permalink}-${i}`}>
                  <a
                    href={p.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block aspect-square overflow-hidden rounded-2xl bg-mist"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.caption || "Unggahan Instagram"}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ─── 7. Mitra kerja sama ────────────────────────────── */}
      <MitraMarquee />
    </>
  );
}
