import type { MetadataRoute } from "next";
import { listPublishedNews } from "@/lib/site/content";
import { SITE_URL } from "@/lib/site/url";

export const revalidate = 3600;

const PAGES = [
  "", "/prodi/profil", "/prodi/pimpinan", "/prodi/dosen", "/prodi/akademik", "/prodi/kalender", "/prodi/penelitian",
  "/prodi/mutu", "/prodi/skripsi", "/prodi/layanan", "/prodi/kemahasiswaan", "/prodi/beasiswa", "/prodi/lomba",
  "/prodi/mahasiswa-baru", "/prodi/alumni", "/prodi/karier", "/prodi/berita", "/prodi/galeri", "/prodi/kontak",
  "/prodi/fasilitas", "/prodi/mitra", "/prodi/kamus",
];

/** Peta situs untuk mesin pencari: halaman utama + setiap berita yang terbit. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await listPublishedNews().catch(() => []);
  return [
    ...PAGES.map((p) => ({ url: `${SITE_URL}${p || "/"}`, changeFrequency: "weekly" as const, priority: p ? 0.7 : 1 })),
    ...news.map((n) => ({
      url: `${SITE_URL}/prodi/berita/${n.slug}`,
      lastModified: n.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
