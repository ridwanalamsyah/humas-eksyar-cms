/**
 * Sinkronisasi judul skripsi Ekonomi Syariah dari Digital Library UIN SGD
 * (EPrints). Berjalan di server (Vercel), karena itu tidak butuh API khusus:
 *
 *  1. Buka halaman "Browse by Division" prodi untuk mendapat daftar tahun.
 *  2. Untuk tiap tahun, ambil ekspor JSON EPrints; bila gagal, baca halaman
 *     HTML daftar tahun tersebut.
 *
 * Hanya item bertipe skripsi/thesis yang diambil. Metadata (judul, penulis,
 * tahun, tautan) bersifat publik di Digilib; berkas PDF tidak disalin.
 */

export type DigilibSource = { base: string; division: string; label: string };

/** Divisi EPrints untuk Prodi Ekonomi Syariah (encoding EPrints: "_" → "=5F"). */
export const DIGILIB_SOURCES: DigilibSource[] = [
  {
    base: "https://digilib.uinsgd.ac.id",
    division: "prodi=5Fekonomi=5Fsyariah",
    label: "Digilib UIN SGD",
  },
  {
    base: "https://etheses.uinsgd.ac.id",
    division: "prodi=5Fekonomi=5Fsyariah",
    label: "Etheses UIN SGD",
  },
];

export type DigilibItem = {
  judul: string;
  nama: string;
  tahun: number;
  url: string;
};

export type SyncReport = {
  items: DigilibItem[];
  sources: { label: string; years: number; items: number; error?: string }[];
};

const UA =
  "Mozilla/5.0 (compatible; EksyarWebsite/1.0; +https://github.com/ridwanalamsyah/humas-eksyar-cms)";

async function get(url: string, timeoutMs = 25_000): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "*/*" },
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

export function decodeHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCodePoint(parseInt(h, 16)),
    )
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

/** "Anwar, Muhammad Zaky" → "Muhammad Zaky Anwar". */
export function displayName(raw: string): string {
  const [family, given] = raw.split(",").map((s) => s.trim());
  return given ? `${given} ${family}` : family;
}

/** Tahun-tahun yang tersedia di halaman indeks divisi. */
export function parseYears(html: string): number[] {
  const years = new Set<number>();
  for (const m of html.matchAll(
    /href="(?:[^"]*\/)?(\d{4})(?:\.default)?\.html"/g,
  ))
    years.add(Number(m[1]));
  return [...years].filter((y) => y >= 1990 && y <= 2100).sort((a, b) => b - a);
}

/** Daftar item dari halaman HTML tahun (sitasi standar EPrints). */
export function parseYearHtml(
  html: string,
  base: string,
  fallbackYear: number,
): DigilibItem[] {
  const host = base.replace(/^https?:\/\//, "").replace(/\./g, "\\.");
  const linkRe = new RegExp(
    `<a href="(https?://${host}/(?:id/eprint/)?\\d+/?)"[^>]*>([\\s\\S]*?)</a>`,
    "i",
  );
  const out: DigilibItem[] = [];
  for (const [, block] of html.matchAll(/<p>([\s\S]*?)<\/p>/g)) {
    const link = block.match(linkRe);
    if (!link) continue;
    const typeText = decodeHtml(
      block.slice(block.indexOf(link[0]) + link[0].length),
    );
    if (
      typeText &&
      /article|artikel|book|buku|conference|prosiding/i.test(typeText) &&
      !/thesis|skripsi/i.test(typeText)
    )
      continue;
    const names = [
      ...block.matchAll(/<span class="person_name">([\s\S]*?)<\/span>/g),
    ].map((m) => displayName(decodeHtml(m[1])));
    const year = Number(block.match(/\((\d{4})\)/)?.[1] ?? fallbackYear);
    const judul = decodeHtml(link[2]).replace(/\.$/, "");
    if (judul.length >= 5)
      out.push({ judul, nama: names.join(", "), tahun: year, url: link[1] });
  }
  return out;
}

type EprintJson = {
  title?: string | { text?: string }[];
  type?: string;
  date?: string | number;
  uri?: string;
  eprintid?: number;
  creators?: { name?: { family?: string; given?: string } }[];
};

export function parseEprintsJson(
  json: unknown,
  base: string,
  fallbackYear: number,
): DigilibItem[] {
  if (!Array.isArray(json)) throw new Error("format JSON tidak dikenal");
  return (json as EprintJson[])
    .filter((e) => !e.type || /thesis|skripsi/i.test(e.type))
    .map((e) => {
      const title = Array.isArray(e.title)
        ? (e.title[0]?.text ?? "")
        : (e.title ?? "");
      const nama = (e.creators ?? [])
        .map((c) => [c.name?.given, c.name?.family].filter(Boolean).join(" "))
        .filter(Boolean)
        .join(", ");
      const tahun = Number(String(e.date ?? "").slice(0, 4)) || fallbackYear;
      const url = e.eprintid ? `${base}/${e.eprintid}/` : (e.uri ?? "");
      return { judul: decodeHtml(title).replace(/\.$/, ""), nama, tahun, url };
    })
    .filter((i) => i.judul.length >= 5 && /^https?:\/\//.test(i.url));
}

async function fetchYear(
  src: DigilibSource,
  year: number,
): Promise<DigilibItem[]> {
  const json = `${src.base}/cgi/exportview/divisions/${src.division}/${year}/JSON/${src.division}_${year}.js`;
  try {
    return parseEprintsJson(JSON.parse(await get(json)), src.base, year);
  } catch {
    const html = await get(
      `${src.base}/view/divisions/${src.division}/${year}.html`,
    );
    return parseYearHtml(html, src.base, year);
  }
}

/** Jalankan fungsi async dengan batas paralel. */
async function pool<T, R>(
  items: T[],
  limit: number,
  fn: (t: T) => Promise<R>,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        try {
          results[i] = { status: "fulfilled", value: await fn(items[i]) };
        } catch (reason) {
          results[i] = { status: "rejected", reason };
        }
      }
    }),
  );
  return results;
}

export async function fetchDigilibSkripsi(
  sources = DIGILIB_SOURCES,
): Promise<SyncReport> {
  const report: SyncReport = { items: [], sources: [] };
  for (const src of sources) {
    try {
      const index = await get(`${src.base}/view/divisions/${src.division}/`);
      const years = parseYears(index);
      const settled = await pool(years, 4, (y) => fetchYear(src, y));
      const items = settled.flatMap((r) =>
        r.status === "fulfilled" ? r.value : [],
      );
      const failed = settled.filter((r) => r.status === "rejected").length;
      report.items.push(...items);
      report.sources.push({
        label: src.label,
        years: years.length,
        items: items.length,
        error: failed ? `${failed} tahun gagal diambil` : undefined,
      });
    } catch (err) {
      report.sources.push({
        label: src.label,
        years: 0,
        items: 0,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  return report;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * Gabungkan hasil Digilib dengan data yang sudah ada: entri Digilib
 * menggantikan entri lama dengan judul sama; entri manual (tanpa tautan)
 * yang tidak ada di Digilib tetap dipertahankan. Bila sebagian pengambilan
 * gagal (`keepLinked`), entri lama bertautan juga dipertahankan agar data
 * tidak hilang.
 */
export function mergeSkripsi<T extends { judul: string; url?: string }>(
  existing: T[],
  fetched: T[],
  { keepLinked = false } = {},
): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const it of fetched) {
    const k = norm(it.judul);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(it);
  }
  for (const it of existing) {
    const k = norm(it.judul);
    if (seen.has(k) || (it.url && !keepLinked)) continue;
    seen.add(k);
    out.push(it);
  }
  return out;
}
