import type { Metadata } from "next";
import Link from "next/link";
import { AnnouncementList } from "@/components/site/announcement-list";
import { HighlightCard } from "@/components/site/highlight-card";
import { NewsCard } from "@/components/site/news-card";
import { Reveal } from "@/components/site/reveal";
import { coverFor, getMediaMap, isAnnouncement, listPublishedNews } from "@/lib/site/content";
import { cn } from "@/lib/utils";
import { getSite } from "@/lib/site/get-site";

export const metadata: Metadata = {
  title: "Berita",
  description: "Berita, pengumuman, dan kegiatan Program Studi Ekonomi Syariah UIN Sunan Gunung Djati Bandung.",
};

export const revalidate = 300;

const TABS = [
  { key: "semua", label: "Semua" },
  { key: "berita", label: "Berita" },
  { key: "pengumuman", label: "Pengumuman" },
] as const;

type Props = { searchParams: Promise<{ kategori?: string }> };

export default async function BeritaPage({ searchParams }: Props) {
  const { kategori } = await searchParams;
  const tab = TABS.find((t) => t.key === kategori)?.key ?? "semua";
  const [all, media, site] = await Promise.all([listPublishedNews(), getMediaMap(), getSite()]);

  const announcements = all.filter(isAnnouncement);
  const news = tab === "pengumuman" ? [] : all.filter((n) => tab === "semua" || !isAnnouncement(n));
  const [first, ...rest] = news;

  return (
    <div className="bg-mist px-4 pb-24 pt-14 sm:px-6 sm:pb-32 sm:pt-20">
      <div className="mx-auto max-w-[1024px]">
        <h1 className="text-[clamp(2.5rem,2rem+2vw,3.5rem)] font-semibold tracking-[-0.03em] text-label">Berita</h1>
        <p className="mt-2 text-[19px] text-label-2">Kabar terbaru dari Program Studi Ekonomi Syariah.</p>

        <nav aria-label="Kategori" className="mt-8 inline-flex rounded-full bg-[#e3eef0] p-1">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={t.key === "semua" ? "/prodi/berita" : `/prodi/berita?kategori=${t.key}`}
              aria-current={tab === t.key ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-1.5 text-[14px] font-semibold transition-colors",
                tab === t.key ? "bg-canvas text-label shadow-[0_1px_3px_rgba(0,0,0,0.1)]" : "text-label-2 hover:text-label",
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
        <h2 className="mt-20 text-[28px] font-semibold tracking-[-0.02em] text-label">Sorotan kegiatan</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {site.kegiatan.map((s, i) => (
            <HighlightCard key={`${s.title}-${i}`} item={s} />
          ))}
        </div>
          </>
        )}
      </div>
    </div>
  );
}
