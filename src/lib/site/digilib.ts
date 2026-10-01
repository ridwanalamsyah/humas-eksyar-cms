/**
 * Sinkronisasi skripsi Ekonomi Syariah dari Digital Library UIN SGD (EPrints).
 * Berjalan di server (Vercel):
 *
 *  1. Buka halaman "Browse by Division" prodi untuk mendapat daftar tahun.
 *  2. Untuk tiap tahun, ambil ekspor JSON EPrints (judul, penulis, abstrak,
 *     kata kunci, pembimbing, daftar berkas). Bila ekspor JSON tidak
 *     tersedia, baca halaman HTML daftar tahun, lalu lengkapi detailnya dari
 *     meta tag halaman tiap skripsi (bertahap, beberapa ratus per jalan).
 *
 * Berkas PDF tidak disalin: website menautkan langsung ke Digilib sehingga
 * hak akses (berkas publik/terbatas) tetap diatur oleh perpustakaan.
 */

export type DigilibSource = {
  base: string;
  division: string;
  label: string;
  prefix: string;
};

/** Divisi EPrints untuk Prodi Ekonomi Syariah (encoding EPrints: "_" → "=5F"). */
export const DIGILIB_SOURCES: DigilibSource[] = [
  {
    base: "https://digilib.uinsgd.ac.id",
    division: "prodi=5Fekonomi=5Fsyariah",
    label: "Digilib UIN SGD",
    prefix: "d",
  },
  {
    base: "https://etheses.uinsgd.ac.id",
    division: "prodi=5Fekonomi=5Fsyariah",
    label: "Etheses UIN SGD",
    prefix: "e",
  },
];

export type Dokumen = { label: string; url: string; terbatas?: boolean };

export type DigilibDetail = {
  abstrak?: string;
  kataKunci?: string;
  dokumen?: Dokumen[];
};

export type DigilibItem = {
  id: string;
  judul: string;
  nama: string;
  tahun: number;
  url: string;
  pembimbing: string[];
  detail?: DigilibDetail;
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

/** ID pendek stabil dari URL item, mis. "https://digilib.uinsgd.ac.id/70000/" → "d70000". */
export function idFromUrl(url: string): string | null {
  const m = url.match(/^https?:\/\/([^/]+)\/(?:id\/eprint\/)?(\d+)\/?$/);
  if (!m) return null;
  const src = DIGILIB_SOURCES.find((s) => s.base.includes(m[1]));
  return `${src?.prefix ?? "x"}${m[2]}`;
}

/** Tahun-tahun yang tersedia di halaman indeks divisi. */
export function parseYears(html: string): number[] {
  const years = new Set<number>();
  for (const m of html.matchAll(
    /href="(?:[^"]*\/)?(\d{4})(?:\.default|\.type)?\.html"/g,
  ))
    years.add(Number(m[1]));
  return [...years].filter((y) => y >= 1990 && y <= 2100).sort((a, b) => b - a);
}

/** Label berkas yang ramah dibaca: "3_bab1.pdf" → "Bab 1". */
export function fileLabel(name: string): string {
  const base = decodeURIComponent(name.split("/").pop() ?? name)
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/^\d+[_-]?/, "")
    .replace(/[_-]+/g, " ")
    .trim();
  const lower = base.toLowerCase();
  const bab = lower.match(/bab\s*([1-6ivx]+)/);
  if (bab) return `Bab ${bab[1].toUpperCase()}`;
  if (/cover|sampul/.test(lower)) return "Cover";
  if (/abstra/.test(lower)) return "Abstrak";
  if (/isi|daftar isi/.test(lower)) return "Daftar isi";
  if (/pustaka|daf.*pus|references|bibliograf/.test(lower))
    return "Daftar pustaka";
  if (/lampiran/.test(lower)) return "Lampiran";
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : "Berkas";
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
    const id = idFromUrl(link[1]);
    if (judul.length >= 5 && id)
      out.push({
        id,
        judul,
        nama: names.join(", "),
        tahun: year,
        url: link[1],
        pembimbing: [],
      });
  }
  return out;
}

type EprintName = { name?: { family?: string; given?: string } };
type EprintJson = {
  title?: string | { text?: string }[];
  abstract?: string | { text?: string }[];
  keywords?: string;
  type?: string;
  date?: string | number;
  uri?: string;
  eprintid?: number;
  creators?: EprintName[];
  contributors?: (EprintName & { type?: string })[];
  thesis_advisor?: EprintName[];
  documents?: {
    pos?: number;
    main?: string;
    formatdesc?: string;
    security?: string;
    files?: { filename?: string; uri?: string }[];
  }[];
};

const text = (v: EprintJson["title"]) =>
  Array.isArray(v) ? (v[0]?.text ?? "") : (v ?? "");
const fullName = (n: EprintName) =>
  [n.name?.given, n.name?.family].filter(Boolean).join(" ").trim();

export function parseEprintsJson(
  json: unknown,
  src: Pick<DigilibSource, "base">,
  fallbackYear: number,
): DigilibItem[] {
  if (!Array.isArray(json)) throw new Error("format JSON tidak dikenal");
  return (json as EprintJson[])
    .filter((e) => !e.type || /thesis|skripsi/i.test(e.type))
    .flatMap((e) => {
      const url = e.eprintid ? `${src.base}/${e.eprintid}/` : (e.uri ?? "");
      const id = idFromUrl(url);
      const judul = decodeHtml(text(e.title)).replace(/\.$/, "");
      if (!id || judul.length < 5) return [];
      const pembimbing = [
        ...(e.thesis_advisor ?? []),
        ...(e.contributors ?? []).filter(
          (c) => !c.type || /THS|advisor|pembimbing|dgs/i.test(c.type),
        ),
      ]
        .map(fullName)
        .filter(Boolean);
      const dokumen: Dokumen[] = (e.documents ?? []).flatMap((d) => {
        const file =
          d.files?.find((f) => f.filename === d.main) ?? d.files?.[0];
        const href =
          file?.uri ??
          (d.pos && d.main
            ? `${src.base}/${e.eprintid}/${d.pos}/${encodeURIComponent(d.main)}`
            : "");
        if (!/^https?:\/\//.test(href)) return [];
        return [
          {
            label: d.formatdesc?.trim() || fileLabel(d.main ?? href),
            url: href,
            terbatas: d.security ? d.security !== "public" : undefined,
          },
        ];
      });
      const abstrak = decodeHtml(text(e.abstract));
      return [
        {
          id,
          judul,
          nama: (e.creators ?? []).map(fullName).filter(Boolean).join(", "),
          tahun: Number(String(e.date ?? "").slice(0, 4)) || fallbackYear,
          url,
          pembimbing: [...new Set(pembimbing)],
          detail: {
            abstrak: abstrak || undefined,
            kataKunci: e.keywords?.trim() || undefined,
            dokumen,
          },
        },
      ];
    });
}

/** Detail dari meta tag halaman item EPrints (eprints.abstract, dll.). */
export function parseItemMeta(html: string): {
  pembimbing: string[];
  detail: DigilibDetail;
} {
  const metas = (name: string) =>
    [
      ...html.matchAll(
        new RegExp(
          `<meta[^>]+name="${name.replace(".", "\\.")}"[^>]+content="([^"]*)"`,
          "gi",
        ),
      ),
    ].map((m) => decodeHtml(m[1]));
  const pembimbing = [
    ...metas("eprints.thesis_advisor_name"),
    ...metas("eprints.contributors_name"),
  ].map(displayName);
  const dokumen = [
    ...new Set([
      ...metas("eprints.document_url"),
      ...metas("citation_pdf_url"),
    ]),
  ]
    .filter((u) => /^https?:\/\//.test(u))
    .map((u) => ({ label: fileLabel(u), url: u }));
  return {
    pembimbing: [...new Set(pembimbing.filter(Boolean))],
    detail: {
      abstrak:
        metas("eprints.abstract")[0] || metas("DC.description")[0] || undefined,
      kataKunci: metas("eprints.keywords")[0] || undefined,
      dokumen,
    },
  };
}

async function fetchYear(
  src: DigilibSource,
  year: number,
): Promise<DigilibItem[]> {
  const json = `${src.base}/cgi/exportview/divisions/${src.division}/${year}/JSON/${src.division}_${year}.js`;
  try {
    return parseEprintsJson(JSON.parse(await get(json)), src, year);
  } catch {
    const html = await get(
      `${src.base}/view/divisions/${src.division}/${year}.html`,
    );
    return parseYearHtml(html, src.base, year);
  }
}

/** Jalankan fungsi async dengan batas paralel. */
export async function pool<T, R>(
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

/**
 * Lengkapi item yang belum punya detail dengan membaca halaman item-nya.
 * Dibatasi per jalan agar tidak melewati batas waktu fungsi server.
 */
export async function enrichItems(
  items: DigilibItem[],
  { limit = 150, deadlineMs = 35_000 } = {},
): Promise<number> {
  const todo = items.filter((i) => !i.detail).slice(0, limit);
  const stopAt = Date.now() + deadlineMs;
  let done = 0;
  await pool(todo, 6, async (item) => {
    if (Date.now() > stopAt) return;
    const meta = parseItemMeta(await get(item.url, 12_000));
    item.detail = meta.detail;
    if (!item.pembimbing.length) item.pembimbing = meta.pembimbing;
    done++;
  });
  return done;
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
