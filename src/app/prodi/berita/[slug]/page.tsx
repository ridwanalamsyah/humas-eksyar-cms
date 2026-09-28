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
    <article className="px-5 pb-10 pt-32 sm:pt-40">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/prodi/berita"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300"
        >
          <ArrowLeft className="size-4" />
          Semua berita
        </Link>
        <time dateTime={date} className="mt-6 block text-sm text-foreground/55">
          {formatLongDate(date)}
        </time>
        <h1 className="mt-3 font-display text-[length:var(--font-h1)] font-semibold leading-tight tracking-tight text-balance">
          {item.title}
        </h1>

        {cover && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl">
            <span aria-hidden className="absolute inset-0" style={{ background: cover.averageColor }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover.url} alt={cover.alt} className="absolute inset-0 size-full object-cover" />
          </div>
        )}

        <div className="prose-editor mt-8 text-[16px] leading-[1.75]">
          <ArticleBody text={text} />
        </div>

        {item.hashtags && (
          <p className="mt-8 text-sm text-brand-600 dark:text-brand-300">{item.hashtags}</p>
        )}
      </div>

      {related.length > 0 && (
        <div className="mx-auto mt-20 max-w-6xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Berita lainnya</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((n) => (
              <NewsCard key={n.id} item={n} cover={coverFor(n, media)} />
            ))}
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
