import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { NewsCard } from "@/components/site/news-card";
import { formatLongDate } from "@/lib/format/dates";
import {
  contentExcerpt,
  coverFor,
  findPublishedNews,
  getMediaMap,
  listPublishedNews,
} from "@/lib/site/content";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await findPublishedNews(slug);
  if (!item) return { title: "Berita tidak ditemukan" };
  const media = await getMediaMap();
  const cover = coverFor(item, media);
  return {
    title: item.title,
    description: contentExcerpt(item, 160),
    openGraph: {
      type: "article",
      title: item.title,
      description: contentExcerpt(item, 160),
      publishedTime: item.publishedAt,
      images: cover ? [{ url: cover.url, alt: cover.alt }] : undefined,
    },
  };
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const [item, all, media] = await Promise.all([
    findPublishedNews(slug),
    listPublishedNews(),
    getMediaMap(),
  ]);
  if (!item) notFound();

  const cover = coverFor(item, media);
  const date = item.publishedAt ?? item.updatedAt;
  const text = item.body?.trim() || item.caption?.trim() || "";
  const related = all.filter((c) => c.id !== item.id).slice(0, 3);

  return (
    <article>
      <header className="site-pattern bg-pine-800">
        <div className="bg-gradient-to-r from-pine-900 via-pine-900/90 to-pine-800/70">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <Link
              href="/prodi/berita"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-saffron-300 hover:text-paper"
            >
              <ArrowLeft className="size-4" />
              Semua berita
            </Link>
            <h1 className="mt-6 font-serif text-[clamp(1.9rem,1.4rem+2vw,3rem)] font-semibold leading-tight text-paper text-balance">
              {item.title}
            </h1>
            <time dateTime={date} className="mt-5 block text-[14px] text-pine-100/75">
              {formatLongDate(date)}
            </time>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-14">
        {cover && (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden">
            <span aria-hidden className="absolute inset-0" style={{ background: cover.averageColor }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover.url} alt={cover.alt} className="absolute inset-0 size-full object-cover" />
          </div>
        )}

        <div className="site-prose text-[17px] leading-[1.85] text-ink/80">
          <ArticleBody text={text} />
        </div>

        {item.hashtags && (
          <p className="mt-10 border-t border-pine-800/15 pt-6 text-[14px] text-pine-700">{item.hashtags}</p>
        )}
      </div>

      {related.length > 0 && (
        <div className="border-t border-pine-800/10 bg-paper-2 px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-serif text-2xl font-semibold text-pine-800">Berita lainnya</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((n) => (
                <NewsCard key={n.id} item={n} cover={coverFor(n, media)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

/**
 * Renderer markdown minimal: heading (#, ##), list (-, *), kutipan (>) dan
 * paragraf. Cukup untuk body/caption dari CMS tanpa dependency tambahan.
 */
function ArticleBody({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (block.startsWith("## ")) return <h2 key={i}>{block.slice(3)}</h2>;
        if (block.startsWith("# ")) return <h2 key={i}>{block.slice(2)}</h2>;
        if (lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{l.replace(/^\s*[-*•]\s+/, "")}</li>
              ))}
            </ul>
          );
        }
        if (block.startsWith(">")) {
          return <blockquote key={i}>{lines.map((l) => l.replace(/^>\s?/, "")).join(" ")}</blockquote>;
        }
        return (
          <p key={i} className="whitespace-pre-line">
            {block}
          </p>
        );
      })}
    </>
  );
}
