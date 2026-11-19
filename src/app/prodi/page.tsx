import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { listEvents } from "@/lib/data/provider";
import type { Event } from "@/lib/data/types";
import { formatDateTime, formatLongDate } from "@/lib/format/dates";
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
import { getInstagramPilihan } from "@/lib/instagram/pilihan";
import { kalenderMendatang, rentang } from "@/lib/site/kalender";
import { hero, prodi } from "@/lib/site/prodi";
import { dosenSlug, initials } from "@/lib/site/names";
import { AnnouncementList } from "@/components/site/announcement-list";
import { BidangKajian } from "@/components/site/bidang-kajian";
import { HighlightCard } from "@/components/site/highlight-card";
import { InteractiveHero } from "@/components/site/interactive-hero";
import { MitraMarquee } from "@/components/site/mitra-marquee";
import { CoverFallback, NewsCard } from "@/components/site/news-card";
import { PrestasiCard } from "@/components/site/prestasi-card";
import { SectionHeading } from "@/components/site/section-heading";
import { SkripsiTrendExplorer } from "@/components/site/skripsi-trend-explorer";
import { Photo } from "@/components/site/photo";

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

export default async function ProdiHomePage() {
  const [site, news, events, media, skripsi, igApi, igPilihan, members] = await Promise.all([
    getSite(),
    listPublishedNews(),
    listEvents({ fromDate: new Date().toISOString() }),
    getMediaMap(),
    getSkripsi(),
    instagramFeed(6),
    getInstagramPilihan(),
    getMemberMap(),
  ]);
  // Unggahan asli dari Instagram API; bila belum tersambung, pilihan tim dari CMS.
  const ig = igApi.length > 0 ? igApi : igPilihan;
  const jadwal = kalenderMendatang(site.kalender, 3);
  const { identity, kontak } = site;

  const announcements = news.filter(isAnnouncement).slice(0, 4);
  const articles = news
    .filter((n) => !isAnnouncement(n) && !isBuletinHmj(n))
    .slice(0, 3);
  const buletin = news.filter(isBuletinHmj).slice(0, 3);
  const upcoming = events
    .filter((e) => PUBLIC_EVENT_CATEGORIES.includes(e.category))
    .slice(0, 3);
  const kegiatan = [...site.kegiatan]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  // Kaprodi dan Sekprodi tampil besar; pimpinan fakultas sebagai daftar ringkas.
  // Foto diambil dari data pimpinan, atau dari data dosen bila belum diisi.
  const fotoDosen = (name: string) =>
    site.dosen.find((d) => dosenSlug(d.name) === dosenSlug(name))?.photo ?? null;
  const isProdi = (role: string) => /program studi/i.test(role);
  const pimpinanProdi = site.pimpinan
    .filter((p) => isProdi(p.role))
    .slice(0, 2)
    .map((p) => ({ ...p, photo: p.photo || fotoDosen(p.name) }));
  const pimpinanFakultas = site.pimpinan.filter((p) => !isProdi(p.role)).slice(0, 4);

  // Hero A: satu foto (dari CMS), judul menyebut prodi + kampus + kota, tiga angka.
  // Judul dua baris: nama prodi, lalu kampus dan kota (bisa diganti dari CMS).
  const custom = identity.heroTitle && identity.heroTitle !== prodi.name ? identity.heroTitle : null;
  const heroMain = custom ?? prodi.name;
  const heroSub = custom ? "" : prodi.university;
  const akreditasi = identity.prodiAccreditation || identity.universityAccreditation || "Unggul";
  const heroStats = [
    { value: akreditasi, label: "Akreditasi" },
    { num: identity.totalCredits, suffix: " SKS", label: "Kurikulum OBE" },
    { num: Math.max(skripsi.length, 515), suffix: "+", label: "Skripsi Digilib" },
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
        title={heroMain}
        subtitle={heroSub}
        description={identity.heroDescription || hero.description}
        image={identity.heroImage || hero.image || "/prodi/hero-mahasiswa.jpg"}
        imageAlt={hero.imageAlt}
        accreditation={akreditasi}
        stats={heroStats}
      />

      {/* ─── 2. Bidang kajian: grid 2×2 ─────────────────────── */}
      <section className="px-4 py-12 sm:px-6 sm:py-24">
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
          <div className="mt-8">
            <BidangKajian items={site.bidangKajian} />
          </div>
        </div>
      </section>

      {/* ─── 3. Kegiatan dan prestasi terbaru: grid, bukan carousel ─── */}
      {(kegiatan.length > 0 || site.prestasi.length > 0) && (
        <section className="border-t border-hairline/80 bg-mist/40 px-4 py-12 sm:px-6 sm:py-24">
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
                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                  {[...site.prestasi].sort((a, b) => Number(!!b.photo) - Number(!!a.photo)).slice(0, 4).map((p, i) => (
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
      <section className="border-t border-hairline/80 bg-mist/30 px-4 py-12 sm:px-6 sm:py-24">
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

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-8">
            <div className="flex min-w-0 flex-col gap-12">
            {articles.length > 0 ? (
                <div className="grid content-start gap-5 sm:grid-cols-2">
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
                <p className="text-[16px] text-label-2">Belum ada berita.</p>
              )}

              {buletin.length > 0 && (
                <div>
                  <div className="flex items-center justify-between border-b border-hairline pb-3">
                    <h3 className="text-[18px] font-bold text-label">Buletin Mahasiswa</h3>
                    <Link
                      href="/prodi/berita?kategori=buletin_hmj"
                      className="text-[14px] font-semibold text-accent hover:underline"
                    >
                      Semua buletin
                    </Link>
                  </div>
                  <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                    {buletin.map((n) => {
                      const cover = coverFor(n, media);
                      return (
                        <li key={n.id}>
                          <Link
                            href={`/prodi/berita/${n.slug}`}
                            className="group flex gap-4 sm:flex-col sm:gap-0"
                          >
                            <div className="relative isolate aspect-square w-24 shrink-0 overflow-hidden rounded-2xl bg-mist sm:aspect-[4/3] sm:w-auto">
                              {cover ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={cover.url}
                                  alt={cover.alt}
                                  loading="lazy"
                                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                />
                              ) : (
                                <CoverFallback />
                              )}
                            </div>
                            <div className="min-w-0 self-center sm:self-auto sm:pt-3">
                              <p className="text-[13px] text-label-3">
                                {formatLongDate(n.publishedAt ?? n.updatedAt)}
                              </p>
                              <p className="mt-0.5 line-clamp-3 text-[15px] font-semibold leading-snug text-label group-hover:text-accent">
                                {n.title.replace(/^\[(?:Buletin\s+Artikel\s+HMJ|Buletin\s+HMJ)\]\s*/i, "")}
                              </p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-10">
              <div>
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
                <div>
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

      {/* ─── 6. Pimpinan program studi ──────────────────────── */}
      {pimpinanProdi.length > 0 && (
        <section className="border-t border-hairline/80 px-4 py-12 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-[1160px]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading align="left" title="Pimpinan program studi" />
              <Link
                href="/prodi/dosen"
                className="inline-flex items-center gap-1.5 text-[16px] font-semibold text-accent hover:underline"
              >
                Semua dosen <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div className="grid grid-cols-2 content-start gap-x-4 gap-y-6 sm:grid-cols-3">
                {pimpinanProdi.map((p) => (
                  <Link key={p.name} href={`/prodi/dosen/${dosenSlug(p.name)}`} className="group">
                    {p.photo ? (
                      <Photo src={p.photo} alt={p.name} className="rounded-[20px] [&_img]:object-top" />
                    ) : (
                      <span className="grid size-20 place-items-center rounded-full bg-accent-soft text-[24px] font-bold text-accent">
                        {initials(p.name)}
                      </span>
                    )}
                    <p className="mt-3 text-[14px] font-semibold text-accent">{p.role}</p>
                    <h3 className="mt-0.5 text-[16px] font-bold leading-snug text-label group-hover:text-accent">
                      {p.name}
                    </h3>
                  </Link>
                ))}
              </div>
              {pimpinanFakultas.length > 0 && (
                <div className="border-t border-hairline pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <h3 className="text-[16px] font-bold text-label">Pimpinan fakultas</h3>
                  <ul className="mt-3 divide-y divide-hairline">
                    {pimpinanFakultas.map((p) => (
                      <li key={p.name} className="py-3">
                        <p className="text-[16px] font-semibold leading-snug text-label">{p.name}</p>
                        <p className="mt-0.5 text-[14px] text-label-2">{p.role}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── Instagram: hanya tampil bila akun resmi benar-benar tersambung ── */}
      {ig.length > 0 && (
        <section className="border-t border-hairline/80 px-4 py-12 sm:px-6 sm:py-24">
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
