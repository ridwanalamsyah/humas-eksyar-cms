import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementList } from "@/components/site/announcement-list";
import { KegiatanExplorer } from "@/components/site/kegiatan-explorer";
import { NewsCard } from "@/components/site/news-card";
import { Reveal } from "@/components/site/reveal";
import {
  coverFor,
  getMediaMap,
  isAnnouncement,
  isBuletinHmj,
  listPublishedNews,
} from "@/lib/site/content";
import { cn } from "@/lib/utils";
import { getSite } from "@/lib/site/get-site";

export const metadata: Metadata = {
  title: "Berita & Buletin Artikel HMJ",
  description:
    "Berita resmi, pengumuman akademik, dan Buletin Artikel kolaborasi HMJ Ekonomi Syariah UIN Sunan Gunung Djati Bandung.",
};

export const revalidate = 300;

const TABS = [
  { key: "semua", label: "Semua" },
  { key: "berita", label: "Berita Prodi" },
  { key: "buletin_hmj", label: "Buletin Artikel HMJ" },
  { key: "pengumuman", label: "Pengumuman" },
] as const;

type Props = { searchParams: Promise<{ kategori?: string }> };

export default async function BeritaPage({ searchParams }: Props) {
  const { kategori } = await searchParams;
  const tab = TABS.find((t) => t.key === kategori)?.key ?? "semua";
  const [all, media, site] = await Promise.all([
    listPublishedNews(),
    getMediaMap(),
    getSite(),
  ]);

  const announcements = all.filter(isAnnouncement);
  const news =
    tab === "pengumuman"
      ? []
      : tab === "buletin_hmj"
        ? all.filter(isBuletinHmj)
        : tab === "berita"
          ? all.filter((n) => !isAnnouncement(n) && !isBuletinHmj(n))
          : all.filter((n) => !isAnnouncement(n));
  const [first, ...rest] = news;

  return (
    <div className="bg-mist px-4 pb-24 pt-12 sm:px-6 sm:pb-28 sm:pt-16">
      <div className="mx-auto max-w-[1060px]">
        <h1 className="text-[clamp(2.25rem,1.8rem+1.8vw,3.25rem)] font-semibold tracking-[-0.03em] text-label">
          Berita & Buletin Artikel
        </h1>
        <p className="mt-2 max-w-[68ch] text-[16px] leading-[1.55] text-label-2">
          Kegiatan, pengumuman, dan tulisan mahasiswa.
        </p>

        <nav
          aria-label="Kategori"
          className="mt-7 inline-flex flex-wrap gap-1 rounded-full bg-[#e3eef0] p-1 dark:bg-canvas"
        >
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={
                t.key === "semua"
                  ? "/prodi/berita"
                  : `/prodi/berita?kategori=${t.key}`
              }
              aria-current={tab === t.key ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-1.5 text-[14px] font-semibold transition-colors",
                tab === t.key
                  ? "bg-accent text-white shadow-xs"
                  : "text-label-2 hover:text-label",
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        {tab === "pengumuman" && (
          <div className="mt-10 rounded-[20px] bg-canvas px-7 pt-3">
            <AnnouncementList items={announcements} />
          </div>
        )}

        {tab === "pengumuman" ? null : first ? (
          <>
            <Reveal className="mt-10">
              <NewsCard item={first} cover={coverFor(first, media)} featured />
            </Reveal>
            {rest.length > 0 && (
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((n, i) => (
                  <Reveal key={n.id} delay={(i % 3) * 0.05}>
                    <NewsCard item={n} cover={coverFor(n, media)} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="mt-10 text-center text-[16px] text-label-2 py-6">
            Belum ada berita yang dipublikasikan.
          </p>
        )}

        {tab !== "pengumuman" && (
          <>
            <h2
              id="kegiatan"
              className="mt-20 scroll-mt-28 text-[24px] font-semibold tracking-[-0.02em] text-label"
            >
              Arsip kegiatan
            </h2>
            <div className="mt-6">
              <KegiatanExplorer items={site.kegiatan} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
