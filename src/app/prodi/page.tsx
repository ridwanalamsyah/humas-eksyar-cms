import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  HandHeart,
  Landmark,
} from "lucide-react";
import { listEvents } from "@/lib/data/provider";
import type { Event } from "@/lib/data/types";
import { formatDateTime } from "@/lib/format/dates";
import {
  coverFor,
  getMediaMap,
  isAnnouncement,
  isBuletinHmj,
  listPublishedNews,
} from "@/lib/site/content";
import { defaultWebsiteConfig } from "@/lib/site/defaults";
import { getSite } from "@/lib/site/get-site";
import { getSkripsi } from "@/lib/site/skripsi";
import { instagramFeed } from "@/lib/instagram/graph";
import { kalenderMendatang, rentang } from "@/lib/site/kalender";
import { PmbCampaign } from "@/components/site/pmb-campaign";
import { prodi } from "@/lib/site/prodi";
import { AnnouncementList } from "@/components/site/announcement-list";
import { Carousel } from "@/components/site/carousel";
import { CountUp } from "@/components/site/count-up";
import { HighlightCard } from "@/components/site/highlight-card";
import { InteractiveHero, type HeroSlide } from "@/components/site/interactive-hero";
import { MitraList } from "@/components/site/mitra-list";
import { NewsCard } from "@/components/site/news-card";
import { PrestasiCard } from "@/components/site/prestasi-card";
import { Reveal } from "@/components/site/reveal";
import { ScrollWords } from "@/components/site/scroll-words";
import { SectionHeading } from "@/components/site/section-heading";
import { StickyStack } from "@/components/site/sticky-stack";
import { VideoEmbed } from "@/components/site/video-embed";

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
  const [site, news, events, media, skripsi, ig] = await Promise.all([
    getSite(),
    listPublishedNews(),
    listEvents({ fromDate: new Date().toISOString() }),
    getMediaMap(),
    getSkripsi(),
    instagramFeed(6),
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
    ...kegiatan
      .filter((k) => Boolean(k.image))
      .slice(0, 3)
      .map((k) => ({
        category: k.category,
        title: k.title,
        summary: k.summary,
        date: k.date,
        image: k.image!,
        href: k.source || "/prodi/berita#kegiatan",
        external: Boolean(k.source && k.source.startsWith("http")),
      })),
    ...(buletinItems[0]
      ? [
          {
            category: "Buletin Artikel HMJ",
            title: buletinItems[0].title,
            summary: buletinItems[0].caption,
            image:
              coverFor(buletinItems[0], media)?.url ??
              "https://uinsgd.ac.id/wp-content/uploads/2026/04/IMG-20260416-WA0025-scaled.jpg",
            href: `/prodi/berita/${buletinItems[0].slug}`,
            external: false,
          },
        ]
      : []),
  ];

  const heroStats = [
    { value: `${identity.totalCredits} SKS`, label: "Kurikulum OBE (S.E.)" },
    { value: "Semester 1–8", label: "Struktur Mata Kuliah" },
    {
      value: `${Math.max(skripsi.length, 515).toLocaleString("id-ID")}+`,
      label: "Skripsi Digilib Sinkron",
    },
    {
      value: identity.universityAccreditation || "Unggul",
      label: "Akreditasi UIN SGD",
    },
  ];
  const statement =
    identity.statement || defaultWebsiteConfig.identity.statement || "";

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

      {/* ─── Hero Interaktif (Satu Section Terpadu) ───────── */}
      <InteractiveHero
        title={identity.heroTitle}
        subtitle={`${prodi.faculty} · ${prodi.university}`}
        description={identity.heroDescription}
        stats={heroStats}
        slides={heroSlides}
      />

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
          {site.sorotan.map((x, i) => (
            <Tile
              key={`${x.judul}-${i}`}
              className="md:col-span-3"
              label={x.judul}
              delay={0.1 + i * 0.04}
            >
              <p className="text-[clamp(2.5rem,2rem+2vw,3.5rem)] font-extrabold leading-none tracking-[-0.03em] text-label">
                {/^\d+$/.test(x.nilai) ? (
                  <CountUp value={Number(x.nilai)} />
                ) : (
                  x.nilai
                )}
              </p>
              <p className="mt-3 text-[16px] leading-[1.45] text-label-2">
                {x.keterangan}
              </p>
            </Tile>
          ))}
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

      {site.kampanyePmb.aktif && site.kampanyePmb.judul && (
        <PmbCampaign
          judul={site.kampanyePmb.judul}
          teks={site.kampanyePmb.teks}
          tenggat={site.kampanyePmb.tenggat}
          pmbUrl={kontak.pmbUrl}
        />
      )}

      {/* ─── Dari Instagram (otomatis) ────────────────────── */}
      {ig.length > 0 && (
        <section className="px-4 py-24 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-[1024px]">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Instagram"
                title={kontak.instagramHandle || "Dari Instagram"}
              />
              {kontak.instagram && (
                <a
                  href={kontak.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] font-semibold text-accent hover:underline"
                >
                  Ikuti di Instagram ↗
                </a>
              )}
            </Reveal>
            <ul className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
              {ig.map((p, i) => (
                <li key={`${p.permalink}-${i}`}>
                  <a
                    href={p.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block aspect-square overflow-hidden rounded-[14px] bg-mist sm:rounded-[20px]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.caption || "Postingan Instagram"}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ─── Video & YouTube ──────────────────────────────── */}
      {site.video.length > 0 && (
        <section className="border-t border-hairline px-4 py-24 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-[1024px]">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="YouTube & Dokumentasi"
                title="Video profil & edukasi syariah"
              />
              <div className="flex flex-wrap items-center gap-5">
                {site.medsos.youtubeChannelId && (
                  <a
                    href={`https://www.youtube.com/channel/${site.medsos.youtubeChannelId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] font-semibold text-accent hover:underline"
                  >
                    Kanal YouTube FEBI ↗
                  </a>
                )}
                <Link
                  href="/prodi/galeri"
                  className="text-[15px] font-semibold text-accent hover:underline"
                >
                  Semua foto & video ›
                </Link>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {site.video.slice(0, 4).map((v) => (
                <VideoEmbed key={v.url} url={v.url} title={v.title} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Kolaborasi Buletin Artikel HMJ Ekonomi Syariah ── */}
      {buletinItems.length > 0 && (
        <section className="border-t border-hairline bg-canvas px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-[1024px]">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Kolaborasi Prodi × HMJ Ekonomi Syariah"
                title="Buletin Artikel HMJ"
                description="Publikasi berkala kajian ekonomi Islam, pasar modal syariah, ZISWAF, dan industri halal karya mahasiswa & HMJ Ekonomi Syariah."
              />
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/prodi/formulir/buletin-artikel"
                  className="rounded-full border border-hairline bg-mist px-4 py-2 text-[14px] font-semibold text-label transition-colors hover:border-accent/40 hover:text-accent"
                >
                  Kirim Artikel Buletin
                </Link>
                <Link
                  href="/prodi/berita?kategori=buletin_hmj"
                  className="text-[15px] font-semibold text-accent hover:underline"
                >
                  Semua edisi ›
                </Link>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {buletinItems.map((n, i) => (
                <Reveal key={n.id} delay={i * 0.05}>
                  <NewsCard item={n} cover={coverFor(n, media)} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Mitra Kerja Sama Resmi ───────────────────────── */}
      {site.mitra.length > 0 && (
        <section className="border-t border-hairline bg-mist/60 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-[1024px]">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Jejaring Industri & Regulator"
                title="Mitra kerja sama strategis"
                description="Kolaborasi kuliah praktisi, Galeri Investasi Syariah BEI, magang industri, dan beasiswa mahasiswa."
              />
              <Link
                href="/prodi/profil#mitra"
                className="text-[15px] font-semibold text-accent hover:underline"
              >
                Detail kemitraan ›
              </Link>
            </Reveal>
            <div className="mt-8">
              <MitraList items={site.mitra} />
            </div>
          </div>
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
