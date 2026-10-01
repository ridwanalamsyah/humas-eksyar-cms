/**
 * GET /api/ekspor?jenis=berita|kegiatan|prestasi|mitra|publikasi|skripsi|dosen|kunjungan (admin)
 * Rekap data website sebagai CSV untuk laporan fakultas/universitas & akreditasi.
 */
import { NextRequest, NextResponse } from "next/server";
import { listPageViews } from "@/lib/data/provider";
import { requireAdmin } from "@/lib/site/admin-guard";
import { listPublishedNews, rubricLabel } from "@/lib/site/content";
import { getSite } from "@/lib/site/get-site";
import { getSkripsi } from "@/lib/site/skripsi";

const cell = (v: unknown) => {
  const s = v === undefined || v === null ? "" : String(v);
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

export async function GET(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const jenis = req.nextUrl.searchParams.get("jenis") ?? "";
  const tahun = req.nextUrl.searchParams.get("tahun") ?? "";
  const site = await getSite();
  let head: string[] = [];
  let rows: unknown[][] = [];
  const inYear = (d?: string) => !tahun || (d ?? "").startsWith(tahun);

  switch (jenis) {
    case "berita": {
      const news = await listPublishedNews();
      head = ["Tanggal terbit", "Judul", "Kategori", "Tautan"];
      rows = news
        .filter((n) => inYear(n.publishedAt ?? n.updatedAt))
        .map((n) => [
          (n.publishedAt ?? n.updatedAt).slice(0, 10),
          n.title,
          rubricLabel(n.rubric),
          `/prodi/berita/${n.slug}`,
        ]);
      break;
    }
    case "kegiatan":
      head = ["Tanggal", "Kategori", "Judul", "Ringkasan", "Sumber"];
      rows = site.kegiatan
        .filter((k) => inYear(k.date))
        .map((k) => [k.date, k.category, k.title, k.summary, k.source ?? ""]);
      break;
    case "prestasi":
      head = ["Nama", "Kategori", "Prestasi"];
      rows = site.prestasi.map((p) => [p.name, p.group, p.achievement]);
      break;
    case "mitra":
      head = ["Lembaga", "Bentuk kerja sama", "Situs"];
      rows = site.mitra.map((m) => [m.name, m.description, m.url]);
      break;
    case "publikasi":
      head = [
        "Tahun",
        "Judul",
        "Penulis",
        "Jenis",
        "Jurnal/penerbit",
        "Tautan",
      ];
      rows = site.publikasi
        .filter((p) => inYear(p.year))
        .map((p) => [p.year, p.title, p.authors, p.type, p.venue, p.url]);
      break;
    case "skripsi": {
      const list = await getSkripsi();
      head = ["Tahun", "Judul", "Penulis", "Pembimbing", "Tautan"];
      rows = list
        .filter((s) => !tahun || String(s.tahun) === tahun)
        .map((s) => [
          s.tahun,
          s.judul,
          s.nama,
          (s.pembimbing ?? []).join("; "),
          s.url ?? "",
        ]);
      break;
    }
    case "dosen":
      head = ["Nama", "Jabatan", "Keahlian", "SINTA", "Google Scholar"];
      rows = [...site.pimpinan, ...site.dosen].map((d) => [
        d.name,
        d.role,
        (d.expertise ?? []).join("; "),
        d.sinta ?? "",
        d.scholar ?? "",
      ]);
      break;
    case "kunjungan": {
      const since = tahun ? `${tahun}-01-01` : "2000-01-01";
      const views = (await listPageViews(since)).filter((v) => inYear(v.day));
      head = ["Tanggal", "Halaman", "Kunjungan"];
      rows = views
        .sort((a, b) => a.day.localeCompare(b.day))
        .map((v) => [v.day, v.path, v.count]);
      break;
    }
    default:
      return NextResponse.json(
        { error: "Jenis rekap tidak dikenal" },
        { status: 400 },
      );
  }
  const csv =
    "﻿" + [head, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rekap-${jenis}${tahun ? `-${tahun}` : ""}.csv"`,
    },
  });
}
