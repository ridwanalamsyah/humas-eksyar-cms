import type { Metadata } from "next";
import { NewsCard } from "@/components/site/news-card";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { coverFor, getMediaMap, listPublishedNews } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "Berita",
  description: "Berita, pengumuman, dan dokumentasi kegiatan Program Studi Ekonomi Syariah.",
};

export const revalidate = 300;

export default async function BeritaPage() {
  const [news, media] = await Promise.all([listPublishedNews(), getMediaMap()]);

  return (
    <section className="px-5 pb-10 pt-32 sm:pt-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Kabar Prodi"
            title="Berita & kegiatan terbaru."
            description="Informasi resmi seputar akademik, prestasi, dan kegiatan Program Studi Ekonomi Syariah."
          />
        </Reveal>

        {news.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((n, i) => (
              <Reveal key={n.id} delay={(i % 3) * 0.05}>
                <NewsCard item={n} cover={coverFor(n, media)} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="glass-thin mt-12 rounded-3xl p-12 text-center text-sm text-foreground/60">
            Belum ada berita yang dipublikasikan.
          </div>
        )}
      </div>
    </section>
  );
}
