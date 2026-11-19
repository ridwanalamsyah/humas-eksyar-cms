import { ImageResponse } from "next/og";
import { findPublishedNews, rubricLabel } from "@/lib/site/content";
import { OgCard } from "@/lib/site/og-card";
import { SITE_URL } from "@/lib/site/url";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Berita Program Studi Ekonomi Syariah UIN SGD";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = await findPublishedNews((await params).slug);
  const base = SITE_URL;
  const date = item
    ? new Date(item.publishedAt ?? item.updatedAt).toLocaleDateString("id-ID", {
        dateStyle: "long",
      })
    : "";
  return new ImageResponse(
    <OgCard
      title={item?.title ?? "Berita Ekonomi Syariah"}
      kategori={item ? rubricLabel(item.rubric) : "Berita"}
      tanggal={date}
      width={1200}
      height={630}
      logo={`${base}/prodi/logo-eksyar.png`}
    />,
    size,
  );
}
