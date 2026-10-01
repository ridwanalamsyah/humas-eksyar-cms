/**
 * GET /api/og/instagram?judul=…&kategori=…&tanggal=…&format=feed|story
 * Template gambar Instagram bergaya Eksyar (khusus anggota CMS — dilindungi proxy).
 */
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { OgCard } from "@/lib/site/og-card";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const story = sp.get("format") === "story";
  const width = 1080;
  const height = story ? 1920 : 1350;
  return new ImageResponse(
    <OgCard
      title={(sp.get("judul") ?? "Judul konten").slice(0, 160)}
      kategori={(sp.get("kategori") ?? "Info").slice(0, 40)}
      tanggal={(sp.get("tanggal") ?? "").slice(0, 40)}
      width={width}
      height={height}
      logo={`${req.nextUrl.origin}/prodi/logo-eksyar.png`}
    />,
    {
      width,
      height,
      headers: {
        "Content-Disposition": `inline; filename="eksyar-${story ? "story" : "feed"}.png"`,
      },
    },
  );
}
