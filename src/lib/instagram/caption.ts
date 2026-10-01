import type { ContentRubric } from "@/lib/data/types";

/** Hashtag → rubrik CMS (urutan menentukan; sama dengan skrip impor instaloader). */
const HASHTAG_RUBRIC: Array<[RegExp, ContentRubric]> = [
  [/pengumuman|announcement|info\s*penting/i, "pengumuman"],
  [/selamat|sukses|juara|prestasi|wisuda/i, "selamat_sukses"],
  [/kajian|kuliah\s*umum|seminar|webinar/i, "kajian"],
  [/bisnis|umkm|halal(?!day)/i, "bisnis_halal"],
  [/talks?/i, "eksyar_talks"],
  [/tausiyah/i, "tausiyah_senin"],
  [/campaign|kampanye|aksi/i, "campaign"],
];

export function rubricFromCaption(caption: string): ContentRubric {
  for (const [re, rubric] of HASHTAG_RUBRIC)
    if (re.test(caption)) return rubric;
  return "dokumentasi";
}

export function hashtagsOf(caption: string): string {
  return [...new Set(caption.match(/#[\p{L}\p{N}_]+/gu) ?? [])].join(" ");
}

/** "https://www.instagram.com/p/ABC123/" → "ABC123". */
export function shortcodeFromUrl(url: string): string | null {
  return (
    url.match(/instagram\.com\/(?:[^/]+\/)?(?:p|reel|tv)\/([\w-]{5,})/)?.[1] ??
    null
  );
}

/**
 * Artikel sederhana tanpa AI: buang hashtag, mention, dan baris ajakan;
 * baris pertama jadi judul, sisanya paragraf.
 */
export function articleFromCaptionPlain(caption: string): {
  judul: string;
  isi: string;
} {
  const lines = caption
    .replace(/#[\p{L}\p{N}_]+/gu, "")
    .replace(/@[\w.]+/g, "")
    .replace(/[\p{Extended_Pictographic}️‍]/gu, "")
    .split(/\r?\n/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(
      (l) =>
        l &&
        !/^(link in bio|klik link|follow|jangan lupa|cp\b|narahubung)/i.test(l),
    );
  const first = lines[0] ?? "Kegiatan Program Studi Ekonomi Syariah";
  const judul = first.length > 100 ? `${first.slice(0, 97).trimEnd()}…` : first;
  const isi = lines.slice(first.length > 100 ? 0 : 1).join("\n\n") || first;
  return { judul, isi };
}
