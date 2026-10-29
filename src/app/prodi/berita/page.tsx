import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, PenTool } from "lucide-react";
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
        <p className="mt-2 max-w-[68ch] text-[17px] leading-[1.55] text-label-2">
          Kabar kegiatan akademik, pengumuman resmi, dan publikasi{" "}
          <strong className="font-semibold text-label">
            Buletin Artikel HMJ Ekonomi Syariah
          </strong>
          .
        </p>

        {/* Banner Program Kolaborasi Buletin Artikel HMJ */}
        <div className="mt-7 flex flex-col justify-between gap-4 rounded-[20px] border border-accent/25 bg-canvas p-5 shadow-xs sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-start gap-3.5">
            <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-accent-soft text-accent">
              <BookOpen className="size-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent/12 px-2.5 py-0.5 text-[11.5px] font-semibold text-accent">
                  Kolaborasi Prodi × HMJ Eksyar
                </span>
                <h2 className="text-[16px] font-bold text-label">
                  Program Buletin Artikel HMJ Ekonomi Syariah
                </h2>
              </div>
              <p className="mt-1 text-[13.5px] leading-[1.5] text-label-2">
                Setiap edisi Buletin Artikel karya mahasiswa & departemen keilmuan HMJ Ekonomi Syariah dapat langsung diunggah melalui CMS (Rubrik{" "}
                <code className="rounded bg-mist px-1.5 py-0.5 text-[12px] font-semibold text-label">
                  Buletin Artikel HMJ
                </code>
                ) atau dikirim melalui formulir kontribusi berita untuk tayang di website resmi prodi.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {tab !== "buletin_hmj" && (
              <Link
                href="/prodi/berita?kategori=buletin_hmj"
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Lihat Buletin HMJ
              </Link>
            )}
            <Link
              href="/prodi/formulir/buletin-artikel"
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-mist px-4 py-2 text-[13px] font-semibold text-label transition-colors hover:border-accent/40 hover:text-accent"
            >
              <PenTool className="size-3.5" />
              Kirim Artikel Buletin
            </Link>
          </div>
        </div>

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
                "rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-colors",
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
          <p className="mt-10 rounded-[20px] bg-canvas p-10 text-center text-[17px] text-label-2">
            Belum ada berita yang dipublikasikan.
          </p>
        )}

        {tab !== "pengumuman" && (
          <>
            <h2
              id="kegiatan"
              className="mt-20 scroll-mt-28 text-[28px] font-semibold tracking-[-0.02em] text-label"
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
