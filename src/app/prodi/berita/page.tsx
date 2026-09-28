import type { Metadata } from "next";
import { HighlightCard } from "@/components/site/highlight-card";
import { NewsCard } from "@/components/site/news-card";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { coverFor, getMediaMap, listPublishedNews } from "@/lib/site/content";
import { sorotan } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Berita",
  description: "Berita, pengumuman, dan dokumentasi kegiatan Program Studi Ekonomi Syariah UIN Sunan Gunung Djati Bandung.",
};

export const revalidate = 300;

export default async function BeritaPage() {
  const [news, media] = await Promise.all([listPublishedNews(), getMediaMap()]);
  const [first, ...rest] = news;

  return (
    <>
      <PageHeader
        crumb="Berita"
        title="Berita & Kegiatan"
        description="Informasi resmi seputar akademik, prestasi, pengabdian, dan kegiatan Program Studi Ekonomi Syariah."
      />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          {first ? (
            <>
              <Reveal>
                <NewsCard item={first} cover={coverFor(first, media)} featured />
              </Reveal>
              {rest.length > 0 && (
                <div className="mt-14 grid gap-x-8 gap-y-12 border-t border-pine-800/15 pt-12 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((n, i) => (
                    <Reveal key={n.id} delay={(i % 3) * 0.05}>
                      <NewsCard item={n} cover={coverFor(n, media)} />
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="border border-dashed border-pine-800/20 p-10 text-center text-[15px] text-ink/60">
              Belum ada berita yang dipublikasikan melalui CMS.
            </p>
          )}

          <div className="mt-20">
            <SectionHeading eyebrow="Arsip Media Kampus" title="Diberitakan di uinsgd.ac.id" />
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {sorotan.map((s) => (
                <HighlightCard key={s.title} item={s} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
