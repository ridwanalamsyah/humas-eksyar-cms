/**
 * Ambil daftar mata kuliah & dosen pengampu Prodi Ekonomi Syariah dari
 * e-Knows (LMS Moodle UIN SGD). Halaman kategori kursus Moodle bersifat
 * publik: berisi nama kursus dan nama pengajarnya — tanpa materi/nilai.
 *
 * Kategori "Ekonomi Syariah" = categoryid 40; subkategori (semester/tahun
 * ajaran) ditelusuri sampai kedalaman 3.
 */
import { decodeHtml, pool } from "./digilib";

export const EKNOWS_BASE = "https://eknows.uinsgd.ac.id";
export const EKNOWS_CATEGORY = 40;

export type EknowsCourse = { nama: string; kelas: string; dosen: string[]; kategori: string };
export type MataKuliah = { nama: string; dosen: string[]; kelas: number; kategori: string[] };
export type DosenPengampu = { nama: string; mataKuliah: string[] };

const UA = "Mozilla/5.0 (compatible; EksyarWebsite/1.0; +https://github.com/ridwanalamsyah/humas-eksyar-cms)";

async function get(url: string): Promise<string> {
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20_000), cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

/** Subkategori dan kursus di satu halaman kategori Moodle. */
export function parseCategoryPage(html: string): {
  title: string;
  subcategories: { id: number; name: string }[];
  courses: { name: string; teachers: string[] }[];
} {
  const title = decodeHtml(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "");
  const subcategories = [
    ...html.matchAll(/class="[^"]*categoryname[^"]*"[^>]*>\s*<a[^>]+categoryid=(\d+)[^>]*>([\s\S]*?)<\/a>/g),
  ].map((m) => ({ id: Number(m[1]), name: decodeHtml(m[2]) }));

  const courses: { name: string; teachers: string[] }[] = [];
  const boxes = html.split(/<div[^>]+class="[^"]*coursebox[^"]*"/).slice(1);
  for (const box of boxes) {
    const name = box.match(/class="[^"]*coursename[^"]*"[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>/)?.[1];
    if (!name) continue;
    const teacherList = box.match(/<ul[^>]+class="[^"]*teachers[^"]*"[^>]*>([\s\S]*?)<\/ul>/)?.[1] ?? "";
    const teachers = [...teacherList.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/g)].map((m) => decodeHtml(m[1])).filter(Boolean);
    courses.push({ name: decodeHtml(name), teachers });
  }
  return { title, subcategories, courses };
}

/**
 * "EKONOMI MIKRO ISLAM (ES-3A) 2024/2025 Ganjil" → { nama: "Ekonomi Mikro Islam", kelas: "ES-3A" }
 */
export function cleanCourseName(raw: string): { nama: string; kelas: string } {
  let s = raw.replace(/\s+/g, " ").trim();
  const kelas: string[] = [];
  s = s.replace(/\(([^)]*)\)|\[([^\]]*)\]/g, (_, a, b) => {
    kelas.push((a ?? b).trim());
    return " ";
  });
  s = s
    .replace(/\b20\d\d\s*[/-]\s*20\d\d\b/g, " ")
    .replace(/\b(semester\s+)?(ganjil|genap|pendek)\b/gi, " ")
    .replace(/\s[-–|]\s*(kelas|kls|class)?\s*[a-z0-9-]{1,6}\s*$/i, (m) => {
      kelas.push(m.replace(/^\s[-–|]\s*/, "").trim());
      return " ";
    })
    .replace(/\b(kelas|kls)\s+[a-z0-9-]{1,6}\b/gi, (m) => {
      kelas.push(m.trim());
      return " ";
    })
    .replace(/^\s*[A-Z]{2,4}\s?\d{3,5}\s*[-:]?\s*/, "") // kode MK di depan
    .replace(/\s+/g, " ")
    .replace(/[-–|,:\s]+$/g, "")
    .trim();
  const small = new Set(["dan", "di", "ke", "dari", "yang", "untuk", "dalam", "pada", "atau"]);
  const nama = s
    .toLowerCase()
    .split(" ")
    .map((w, i) => (i > 0 && small.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ")
    .replace(/\bIi\b/g, "II")
    .replace(/\bIii\b/g, "III")
    .replace(/\bIv\b/g, "IV")
    .replace(/\bZiswaf\b/g, "ZISWAF")
    .replace(/\bUmkm\b/g, "UMKM");
  return { nama, kelas: kelas.filter(Boolean).join(" ") };
}

export type EknowsReport = { courses: EknowsCourse[]; pages: number; errors: number };

export async function fetchEknows(categoryId = EKNOWS_CATEGORY, maxPages = 80): Promise<EknowsReport> {
  const courses: EknowsCourse[] = [];
  const seen = new Set<number>();
  let level: { id: number; path: string }[] = [{ id: categoryId, path: "" }];
  let pages = 0;
  let errors = 0;
  for (let depth = 0; depth < 4 && level.length && pages < maxPages; depth++) {
    const batch = level.filter((c) => !seen.has(c.id)).slice(0, maxPages - pages);
    batch.forEach((c) => seen.add(c.id));
    pages += batch.length;
    const results = await pool(batch, 5, async (c) => {
      const page = parseCategoryPage(await get(`${EKNOWS_BASE}/course/index.php?categoryid=${c.id}&perpage=all`));
      return { c, page };
    });
    const next: { id: number; path: string }[] = [];
    for (const r of results) {
      if (r.status !== "fulfilled") {
        errors++;
        continue;
      }
      const { c, page } = r.value;
      const path = depth === 0 ? "" : c.path;
      for (const course of page.courses) {
        const { nama, kelas } = cleanCourseName(course.name);
        if (nama.length >= 3) courses.push({ nama, kelas, dosen: course.teachers, kategori: path });
      }
      for (const sub of page.subcategories) next.push({ id: sub.id, path: path ? `${path} › ${sub.name}` : sub.name });
    }
    level = next;
  }
  if (pages > 0 && errors === pages) throw new Error("Halaman e-Knows tidak bisa diambil");
  return { courses, pages, errors };
}

/** Kelompokkan kursus per nama mata kuliah dan per dosen. */
export function aggregate(courses: EknowsCourse[]): { mataKuliah: MataKuliah[]; dosen: DosenPengampu[] } {
  const mk = new Map<string, MataKuliah>();
  for (const c of courses) {
    const key = c.nama.toLowerCase();
    const cur = mk.get(key) ?? { nama: c.nama, dosen: [], kelas: 0, kategori: [] };
    cur.kelas++;
    for (const d of c.dosen) if (!cur.dosen.includes(d)) cur.dosen.push(d);
    if (c.kategori && !cur.kategori.includes(c.kategori)) cur.kategori.push(c.kategori);
    mk.set(key, cur);
  }
  const dosen = new Map<string, DosenPengampu>();
  for (const m of mk.values())
    for (const d of m.dosen) {
      const cur = dosen.get(d) ?? { nama: d, mataKuliah: [] };
      if (!cur.mataKuliah.includes(m.nama)) cur.mataKuliah.push(m.nama);
      dosen.set(d, cur);
    }
  return {
    mataKuliah: [...mk.values()].sort((a, b) => a.nama.localeCompare(b.nama, "id")),
    dosen: [...dosen.values()].sort((a, b) => a.nama.localeCompare(b.nama, "id")),
  };
}
