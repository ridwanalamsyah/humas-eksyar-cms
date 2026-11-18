import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/site/article-body";
import { NewsCard } from "@/components/site/news-card";
import { ShareBar } from "@/components/site/share-bar";
import { formatLongDate } from "@/lib/format/dates";
import {
  contentExcerpt,
  coverFor,
  estimateReadingTime,
  findPublishedNews,
  getMediaMap,
  getMemberMap,
  listPublishedNews,
  rubricLabel,
} from "@/lib/site/content";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await findPublishedNews(slug);
  if (!item) return { title: "Artikel tidak ditemukan" };
  const cover = coverFor(item, await getMediaMap());
  const description = contentExcerpt(item, 160);
  const cleanTitle = item.title.replace(/^\[(?:Buletin\s+Artikel\s+HMJ|Buletin\s+HMJ)\]\s*/i, "");

  return {
    title: cleanTitle,
    description,
    openGraph: {
      type: "article",
      title: cleanTitle,
      description,
      publishedTime: item.publishedAt,
      images: cover ? [{ url: cover.url, alt: cover.alt }] : undefined,
    },
  };
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const [item, all, media, members] = await Promise.all([
    findPublishedNews(slug),
    listPublishedNews(),
    getMediaMap(),
    getMemberMap(),
  ]);
  if (!item) notFound();

  const cover = coverFor(item, media);
  const author = members.get(item.authorId);
  const date = item.publishedAt ?? item.updatedAt;
  const text = item.body?.trim() || item.caption?.trim() || "";
  const readTime = estimateReadingTime(text);
  const cleanTitle = item.title.replace(/^\[(?:Buletin\s+Artikel\s+HMJ|Buletin\s+HMJ)\]\s*/i, "");
  const related = all.filter((c) => c.id !== item.id).slice(0, 3);

  const authorName = author?.name || "Redaksi Eksyar";
  const authorRole = author?.position || (item.rubric === "buletin_hmj" ? "Penulis Mahasiswa" : "Humas Prodi");
  const authorBio = author?.bio || `Sivitas akademika Program Studi Ekonomi Syariah Fakultas Ekonomi dan Bisnis Islam UIN Sunan Gunung Djati Bandung.`;

  return (
    <>
      <article className="px-4 pb-24 pt-12 sm:px-6 sm:pt-20">
        <header className="mx-auto max-w-[720px]">
          <div className="flex items-center gap-2 text-[14px] font-semibold uppercase tracking-[0.05em] text-label-2">
            <Link href="/prodi/berita" className="hover:text-accent transition-colors">
              Artikel & Berita
            </Link>
            <span>/</span>
            <span className="text-accent">{rubricLabel(item.rubric)}</span>
          </div>

          <h1 className="mt-4 text-[clamp(2.1rem,1.6rem+2.2vw,3.15rem)] font-bold leading-[1.15] tracking-[-0.025em] text-label text-balance">
            {cleanTitle}
          </h1>

          {/* Penulis & Waktu Baca di Header */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-hairline/70 py-4">
            <div className="flex items-center gap-3">
              {author?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={author.avatarUrl}
                  alt={authorName}
                  className="size-11 rounded-xl object-cover ring-2 ring-hairline"
                />
              ) : (
                <div className="flex size-11 items-center justify-center rounded-xl bg-accent/12 text-[14px] font-bold text-accent ring-2 ring-accent/20">
                  {author?.initials || "ES"}
                </div>
              )}
              <div>
                <p className="text-[14px] font-bold text-label">
                  {authorName}
                </p>
                <p className="text-[14px] text-label-3">
                  {authorRole}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[14px] text-label-2">
              <time dateTime={date}>{formatLongDate(date)}</time>
              <span>·</span>
              <span className="rounded-md bg-mist px-2.5 py-0.5 font-medium text-label-2">
                {readTime}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <ShareBar title={cleanTitle} />
          </div>
        </header>

        {cover && (
          <figure className="mx-auto mt-10 max-w-[980px]">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[22px] bg-mist shadow-xs">
              <span
                aria-hidden
                className="absolute inset-0"
                style={{ background: cover.averageColor }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover.url}
                alt={cover.alt}
                className="absolute inset-0 size-full object-cover"
              />
            </div>
            {cover.alt && (
              <figcaption className="mx-auto mt-3 max-w-[720px] text-[14px] text-label-2">
                {cover.alt}
              </figcaption>
            )}
          </figure>
        )}

        <div className="site-prose mx-auto mt-10 max-w-[720px]">
          <ArticleBody text={text} />
        </div>

        {/* Profil Penulis (Author Box) */}
        <section aria-label="Profil Penulis" className="mx-auto mt-14 max-w-[720px] border-t border-hairline pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {author?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={author.avatarUrl}
                alt={authorName}
                className="size-16 shrink-0 rounded-2xl object-cover ring-2 ring-accent/25"
              />
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-accent/12 text-[18px] font-bold text-accent ring-2 ring-accent/25">
                {author?.initials || "ES"}
              </div>
            )}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="text-[16px] font-bold text-label">
                    {authorName}
                  </h3>
                  <p className="text-[14px] font-semibold text-accent">
                    {authorRole}
                  </p>
                </div>
                {author?.angkatan && (
                  <span className="inline-block self-center sm:self-auto rounded-md bg-mist px-2.5 py-0.5 text-[14px] font-semibold text-label-3">
                    Angkatan {author.angkatan}
                  </span>
                )}
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-label-2">
                {authorBio}
              </p>
              {author?.email && (
                <p className="mt-3 text-[14px] text-label-3">
                  Kontak:{" "}
                  <a href={`mailto:${author.email}`} className="text-accent hover:underline">
                    {author.email}
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>

        <footer className="mx-auto mt-10 max-w-[720px] border-t border-hairline pt-6">
          {item.hashtags && (
            <p className="text-[14px] text-label-2">{item.hashtags}</p>
          )}
          <div className="mt-4">
            <ShareBar title={cleanTitle} />
          </div>
        </footer>
      </article>

      {related.length > 0 && (
        <section className="bg-mist px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-label">
              Artikel & Berita Terkait
            </h2>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((n) => (
                <NewsCard
                  key={n.id}
                  item={n}
                  cover={coverFor(n, media)}
                  author={members.get(n.authorId)}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
