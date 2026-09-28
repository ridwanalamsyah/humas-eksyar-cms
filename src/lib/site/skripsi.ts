import { z } from "zod";
import { getSiteSetting } from "@/lib/data/provider";

export const skripsiItemSchema = z.object({
  judul: z.string().trim().min(5).max(400),
  nama: z.string().trim().max(120).default(""),
  tahun: z.number().int().min(1990).max(2100),
});
export const skripsiListSchema = z.array(skripsiItemSchema).max(10000);
export type SkripsiItem = z.infer<typeof skripsiItemSchema>;

export const SKRIPSI_KEY = "skripsi";

export async function getSkripsi(): Promise<SkripsiItem[]> {
  const parsed = skripsiListSchema.safeParse(await getSiteSetting(SKRIPSI_KEY).catch(() => null));
  return parsed.success ? parsed.data : [];
}

/**
 * Impor massal: satu judul per baris, kolom dipisah tab (salin dari Excel),
 * `|` atau `;` dengan urutan: Tahun, Judul, Nama.
 */
export function parseBulk(text: string): { items: SkripsiItem[]; errors: string[] } {
  const items: SkripsiItem[] = [];
  const errors: string[] = [];
  text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line, i) => {
      const [tahun, judul, nama = ""] = line.split(/\t|\s*\|\s*|\s*;\s*/);
      const parsed = skripsiItemSchema.safeParse({ tahun: Number(tahun), judul, nama });
      if (parsed.success) items.push(parsed.data);
      else errors.push(`Baris ${i + 1}: format "Tahun | Judul | Nama" tidak sesuai`);
    });
  return { items, errors };
}

/** Kata umum di judul skripsi yang tidak membedakan topik. */
const STOPWORDS = new Set(
  "dan di ke dari yang pada terhadap dalam dengan untuk atau serta oleh sebagai studi kasus analisis pengaruh peran implementasi tinjauan strategi penerapan hubungan faktor faktor tentang melalui kota kabupaten bandung pt tbk tahun periode perspektif ekonomi islam syariah"
    .split(" "),
);

export function tokens(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w)),
  );
}

/** Koefisien Dice antar-kata kunci (0–1). */
export function similarity(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let common = 0;
  for (const w of a) if (b.has(w)) common++;
  return (2 * common) / (a.size + b.size);
}

export function searchSkripsi(list: SkripsiItem[], q: string, limit = 30) {
  const query = q.trim();
  if (!query) return [];
  const qt = tokens(query);
  const needle = query.toLowerCase();
  return list
    .map((item) => {
      let score = similarity(qt, tokens(item.judul));
      if (item.judul.toLowerCase().includes(needle) || item.nama.toLowerCase().includes(needle)) score = Math.max(score, 0.5);
      return { item, score };
    })
    .filter((r) => r.score >= 0.15)
    .sort((a, b) => b.score - a.score || b.item.tahun - a.item.tahun)
    .slice(0, limit);
}
