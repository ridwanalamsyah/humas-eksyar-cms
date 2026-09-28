import type { Metadata } from "next";
import { HighlightCard } from "@/components/site/highlight-card";
import { NewsCard } from "@/components/site/news-card";
import { Reveal } from "@/components/site/reveal";
import { coverFor, getMediaMap, listPublishedNews } from "@/lib/site/content";
import { sorotan } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Berita",
  description: "Berita, pengumuman, dan kegiatan Program Studi Ekonomi Syariah UIN Sunan Gunung Djati Bandung.",
};

export const revalidate = 300;

export default async function BeritaPage() {
  const [news, media] = await Promise.all([listPublishedNews(), getMediaMap()]);
  const [first, ...rest] = news;

  return (
    <div className="bg-mist px-4 pb-24 pt-14 sm:px-6 sm:pb-32 sm:pt-20">
      <div className="mx-auto max-w-[1024px]">
        <h1 className="text-[clamp(2.5rem,2rem+2vw,3.5rem)] font-semibold tracking-[-0.03em] text-label">Berita</h1>
        <p className="mt-2 text-[19px] text-label-2">Kabar terbaru dari Program Studi Ekonomi Syariah.</p>

        {first ? (
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

        <h2 className="mt-20 text-[28px] font-semibold tracking-[-0.02em] text-label">Diberitakan di uinsgd.ac.id</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {sorotan.map((s) => (
            <HighlightCard key={s.title} item={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
