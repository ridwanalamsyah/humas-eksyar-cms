/**
 * Alamat utama website. Domain resmi: https://es.uinsgd.ac.id.
 *
 * Diatur lewat variabel NEXT_PUBLIC_SITE_URL di Vercel. Selama domain resmi
 * belum aktif, dipakai alamat produksi Vercel supaya pratinjau tautan (Open
 * Graph), sitemap, dan tautan email tidak mengarah ke domain yang belum hidup.
 */
export const OFFICIAL_DOMAIN = "https://es.uinsgd.ac.id";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");
