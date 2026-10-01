import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/site/article-body";
import { NewsCard } from "@/components/site/news-card";
import { ShareBar } from "@/components/site/share-bar";
import { FormRenderer } from "@/components/site/form-renderer";
import { listSubmissions } from "@/lib/data/provider";
import { findForm } from "@/lib/site/forms";
import { formatLongDate } from "@/lib/format/dates";
import {
  contentExcerpt,
  coverFor,
  findPublishedNews,
  getMediaMap,
  listPublishedNews,
  rubricLabel,
} from "@/lib/site/content";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await findPublishedNews(slug);
  if (!item) return { title: "Berita tidak ditemukan" };
  const cover = coverFor(item, await getMediaMap());
  const description = contentExcerpt(item, 160);
  return {
    title: item.title,
    description,
    openGraph: {
      type: "article",
      title: item.title,
      description,
      publishedTime: item.publishedAt,
      images: cover ? [{ url: cover.url, alt: cover.alt }] : undefined,
    },
  };
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const [item, all, media, comments] = await Promise.all([
    findPublishedNews(slug),
    listPublishedNews(),
    getMediaMap(),
    listSubmissions({
      type: "komentar",
      refId: slug,
      published: true,
      limit: 200,
    }),
  ]);
  if (!item) notFound();

  const cover = coverFor(item, media);
  const date = item.publishedAt ?? item.updatedAt;
  const text = item.body?.trim() || item.caption?.trim() || "";
  const related = all.filter((c) => c.id !== item.id).slice(0, 3);

  return (
    <>
      <article className="px-4 pb-24 pt-12 sm:px-6 sm:pt-20">
        <header className="mx-auto max-w-[692px]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-label-2">
            <Link href="/prodi/berita" className="hover:text-accent">
              Berita
            </Link>
            <span className="mx-2 text-hairline">|</span>
            {rubricLabel(item.rubric)}
          </p>
          <time
            dateTime={date}
            className="mt-4 block text-[14px] font-semibold text-label-2"
          >
            {formatLongDate(date)}
          </time>
          <h1 className="mt-2 text-[clamp(2rem,1.5rem+2.2vw,3rem)] font-bold leading-[1.1] tracking-[-0.025em] text-label text-balance">
            {item.title}
          </h1>
          <div className="mt-6">
            <ShareBar title={item.title} />
          </div>
        </header>

        {cover && (
          <figure className="mx-auto mt-10 max-w-[980px]">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-mist">
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
              <figcaption className="mx-auto mt-3 max-w-[692px] text-[14px] text-label-2">
                {cover.alt}
              </figcaption>
            )}
          </figure>
        )}

        <div className="site-prose mx-auto mt-10 max-w-[692px]">
          <ArticleBody text={text} />
        </div>

        <footer className="mx-auto mt-12 max-w-[692px] border-t border-hairline pt-6">
          {item.hashtags && (
            <p className="text-[14px] text-label-2">{item.hashtags}</p>
          )}
          <div className="mt-4">
            <ShareBar title={item.title} />
          </div>
        </footer>

        <section
          id="komentar"
          className="mx-auto mt-14 max-w-[692px] scroll-mt-24"
        >
          <h2 className="text-[22px] font-bold tracking-[-0.01em] text-label">
            Komentar{comments.length ? ` (${comments.length})` : ""}
          </h2>
          {comments.length > 0 && (
            <ul className="mt-5 grid gap-3">
              {[...comments].reverse().map((c) => (
                <li key={c.id} className="rounded-[18px] bg-mist p-4">
                  <p className="text-[14px] font-bold text-label">
                    {String(c.data.nama ?? "Pembaca")}
                    <span className="ml-2 font-normal text-label-3">
                      {new Date(c.createdAt).toLocaleDateString("id-ID", {
                        dateStyle: "medium",
                      })}
                    </span>
                  </p>
                  <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed text-label">
                    {String(c.data.komentar ?? "")}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 rounded-[20px] border border-hairline p-5">
            <FormRenderer def={findForm("komentar")!} refId={slug} compact />
          </div>
        </section>
      </article>

      {related.length > 0 && (
        <section className="bg-mist px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-label">
              Berita lainnya
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((n) => (
                <NewsCard key={n.id} item={n} cover={coverFor(n, media)} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
