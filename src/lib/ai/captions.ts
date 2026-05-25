/**
 * AI Caption Generator wrapper.
 *
 * - When `GEMINI_API_KEY` env var is present, calls Gemini 2.0 Flash via
 *   `@google/genai` SDK.
 * - When absent (preview / no key), falls back to a deterministic local
 *   composer that mimics the structure: HEADLINE (caps), opening, body,
 *   close + identitas + hashtags. Quality is good enough that the UI
 *   demo doesn't break in the absence of a key.
 *
 * IMPORTANT: keep all Gemini imports inside the function so client builds
 * don't try to bundle node-only SDK code.
 */

import { HASHTAG_BLOCK } from "@/lib/fixtures/contents";
import type { CaptionStyle, ContentRubric } from "@/lib/data/types";
import { defaultBrandingConfig } from "@/lib/data/types";

export interface CaptionRequest {
  /** What the post is about — short title or vibe */
  title: string;
  /** Free-form details the user wants in the caption */
  details: string;
  /** Division name to give writer-voice context */
  divisionName: string;
  /** Editorial rubric */
  rubric: ContentRubric;
  /** Style/tone tag */
  style: CaptionStyle;
  /** Number of alternative variants to produce (1..3) */
  variants?: number;
  /** Whether to include reel hook */
  includeHook?: boolean;
  /** Optional list of additional hashtags (already prefixed with #) */
  extraHashtags?: string;
}

export interface CaptionResult {
  /** Primary caption */
  caption: string;
  /** Alternative caption variants (style-bend) */
  alternatives: string[];
  /** Suggested hook line for reels */
  hook?: string;
  /** Final hashtag block */
  hashtags: string;
  /** Suggested call-to-action */
  cta?: string;
  /** Provider metadata */
  provider: "gemini" | "mock";
  /** Timestamp ISO */
  generatedAt: string;
}

const STYLE_LABELS: Record<CaptionStyle, string> = {
  formal_organisasi: "Formal Organisasi (resmi, hangat, struktur 5-bagian)",
  gen_z_friendly: "Gen Z Friendly (santai, gaya IG-native, emoji minimalis)",
  cinematic: "Cinematic Storytelling (kalimat pendek beruntun, visual)",
  profesional: "Profesional (langsung, ringkas, format poin numerik)",
  persuasif: "Persuasif (CTA kuat, retorika, urgensi)",
  emotional_branding: "Emotional Branding (hangat, reflektif, koneksi pribadi)",
  campaign: "Campaign Communication (mobilisasi massa, hashtag-driven)",
};

/**
 * Rubric labels are intentionally generic. Program-specific labels
 * (e.g. "Tausiyah Senin", "Eksphoria") are no longer hardcoded — tim isi
 * sendiri lewat UI / API.
 */
const RUBRIC_LABELS: Record<ContentRubric, string> = {
  tausiyah_senin: "Rubrik harian (refleksi / kutipan pagi)",
  eksyar_talks: "Diskusi / Talkshow",
  bisnis_halal: "Spotlight UMKM / Bisnis Halal",
  eksphoria_update: "Update Program / Festival",
  selamat_sukses: "Ucapan Selamat & Hari Besar",
  kajian: "Kajian Akademik",
  pengumuman: "Pengumuman Resmi",
  dokumentasi: "Dokumentasi Kegiatan (recap)",
  campaign: "Campaign / Mobilisasi",
};

/**
 * Backward-compat constant. Prefer reading from BrandingConfig at runtime.
 */
export const CAPTION_FOOTER = `———\n${defaultBrandingConfig.signature}`;

function buildFooter(signature: string): string {
  return `———\n${signature}`;
}

function ensureFooter(text: string, signature: string): string {
  if (text.includes(signature)) return text;
  return `${text.trimEnd()}\n\n${buildFooter(signature)}`;
}

interface PromptOpts {
  signature: string;
  orgName: string;
}

function buildPrompt(req: CaptionRequest, opts: PromptOpts): string {
  return [
    `Kamu copywriter resmi ${opts.orgName}.`,
    "",
    "ATURAN WAJIB:",
    "- Caption pendek: maksimal 80 kata (kurang lebih 4–6 kalimat).",
    "- Bahasa Indonesia santai-profesional. Tidak kaku, tidak berbelit.",
    "- JANGAN buka dengan 'Assalamualaikum', 'Alhamdulillah', atau salam panjang — kecuali konten rubrik refleksi / kajian atau ucapan duka.",
    "- JANGAN basa-basi seperti 'Dengan bangga kami sampaikan…' atau menyebut nama internal divisi/program.",
    "- Langsung ke pesan utama di kalimat pertama. Beri 1 detail konkret (waktu, tempat, atau angka kalau ada).",
    "- Hindari kata kosong: 'unleash', 'elevate', 'leverage', 'sinergi', 'kolaboratif', emoji berderet (✨🌟💫), hashtag di tengah caption.",
    "- Hormati nilai Islam. Tidak bahasa flirty, tidak hyperbole.",
    `- Tutup dengan baris kosong + '———\\n${opts.signature}'. Footer ini sudah dihitung sebagai bagian dari 80 kata kalau diperlukan — singkat aja konten utamanya.`,
    "",
    `Rubrik: ${RUBRIC_LABELS[req.rubric] ?? req.rubric}`,
    `Gaya: ${STYLE_LABELS[req.style] ?? req.style}`,
    `Topik: ${req.title}`,
    `Detail: ${req.details || "—"}`,
    "",
    "Output JSON valid dengan kunci:",
    "- caption (string, max 80 kata sebelum footer)",
    "- alternatives (array 2 string, masing-masing juga max 80 kata, gaya berbeda)",
    "- hook (1 kalimat pendek 6-10 kata untuk reel)",
    "- cta (1 kalimat ajakan singkat)",
    "Hashtag JANGAN ditulis (akan disambung otomatis di sistem).",
    "JANGAN tulis apa pun di luar JSON. JANGAN pakai ```json fence.",
  ].join("\n");
}

/**
 * Mock generator that produces a believable, on-brand caption without
 * requiring a Gemini API key. Used both as fallback and for offline dev.
 */
interface ComposeOpts {
  signature: string;
  hashtags: string;
  orgName: string;
}

function mockCompose(req: CaptionRequest, opts: ComposeOpts): CaptionResult {
  const { title, details, rubric, style } = req;
  const headline = title.toUpperCase();

  const styled = (() => {
    switch (style) {
      case "cinematic":
        return [
          headline,
          "",
          `Bayangkan ruangan itu. ${details ? details : "Suara pelan, langkah teratur."}`,
          "Satu napas. Satu detik tertahan.",
          "Lalu, momentum.",
          "",
          "Itulah yang kami siapkan — bukan sekadar acara, tapi perjalanan.",
          "Tandai tanggalnya. Kita bertemu di sana.",
        ].join("\n");
      case "gen_z_friendly":
        return [
          `${title} hits different ✨`,
          "",
          details || "no exaggeration — ini real.",
          "",
          "highlight singkat:",
          "• vibe-nya beneran beda",
          "• siap-siap bookmark",
          "• tag 1 temenmu yang harus liat",
          "",
          "geser kanan untuk full story →",
        ].join("\n");
      case "profesional":
        return [
          `${headline} — RILIS RESMI`,
          "",
          `${opts.signature}, kami menyampaikan informasi berikut:`,
          "",
          details || "Detail menyusul melalui kanal resmi.",
          "",
          "Mohon perhatian dan dukungan dari seluruh sivitas akademika.",
        ].join("\n");
      case "persuasif":
        return [
          `${title}.`,
          "",
          "Kalau bukan sekarang, kapan lagi?",
          "",
          details || "Bergabung. Ambil langkah pertama. Tinggalkan ragu.",
          "",
          "Daftar di link bio. Slot terbatas — yang serius duluan.",
        ].join("\n");
      case "emotional_branding":
        return [
          headline,
          "",
          "Untuk kamu yang masih bertanya: 'apakah jalan ini benar?'",
          "",
          details || "Kami pun pernah ragu. Tapi kami terus berjalan, dan ternyata jalan itu memimpin pulang.",
          "",
          "Selamat datang di rumah yang sama.",
        ].join("\n");
      case "campaign":
        return [
          `${headline} — KAMI PERLU KAMU`,
          "",
          details || "Gerakan ini membutuhkan suara, kehadiran, dan dukunganmu.",
          "",
          "Ayo bergerak bersama:",
          "1. Bagikan postingan ini",
          "2. Tag 3 teman",
          "3. Hadir di acara puncak",
          "",
          "Bersama, kita ciptakan momentum.",
        ].join("\n");
      case "formal_organisasi":
      default:
        return [
          headline,
          "",
          `${opts.signature}, kami menyampaikan ${rubric === "selamat_sukses" ? "ucapan selamat" : "informasi resmi"} berikut.`,
          "",
          details ||
            "Detail informasi akan diumumkan melalui kanal resmi organisasi.",
          "",
          "Mohon perhatian dan dukungan dari seluruh sivitas akademika.",
        ].join("\n");
    }
  })();

  const caption = ensureFooter(styled, opts.signature);

  // Simple alternative variants — bend tone slightly
  const altA = ensureFooter(
    `${title}.\n\n${details || "Detail kegiatan akan kami sampaikan via channel resmi."}\n\nSampai jumpa di sana — semoga harinya berkah.`,
    opts.signature,
  );
  const altB = ensureFooter(
    `${title.toLowerCase()}.\n\n${details ? details : "tema kali ini terasa personal — semoga bisa beresonansi."}\n\nbaca sampai habis. tag yang perlu lihat. terima kasih sudah hadir di sini.`,
    opts.signature,
  );

  const hashtags = `${opts.hashtags}${req.extraHashtags ? ` ${req.extraHashtags}` : ""}`;

  return {
    caption,
    alternatives: [altA, altB],
    hook: req.includeHook
      ? "3 detik pertama: 'Lihat ini sebelum scroll ke bawah.'"
      : undefined,
    hashtags,
    cta: "Simpan & bagikan kalau bermanfaat untuk satu orang lain.",
    provider: "mock",
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Try calling Gemini 2.0 Flash via @google/genai. Returns null on
 * any error (network, quota, parse failure) so the caller can fall back.
 */
async function callGemini(
  req: CaptionRequest,
  opts: ComposeOpts,
): Promise<CaptionResult | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  try {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: key });
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildPrompt(req, { signature: opts.signature, orgName: opts.orgName }),
      config: {
        responseMimeType: "application/json",
      },
    });
    const text = result.text ?? "";
    const parsed = JSON.parse(text) as {
      caption?: string;
      alternatives?: string[];
      hook?: string;
      cta?: string;
    };
    if (!parsed.caption) return null;
    return {
      caption: ensureFooter(parsed.caption, opts.signature),
      alternatives: (parsed.alternatives ?? []).map((c) =>
        ensureFooter(c, opts.signature),
      ),
      hook: req.includeHook ? parsed.hook : undefined,
      cta: parsed.cta,
      hashtags: `${opts.hashtags}${req.extraHashtags ? ` ${req.extraHashtags}` : ""}`,
      provider: "gemini",
      generatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function loadBrandingOpts(): Promise<ComposeOpts> {
  try {
    const { getBrandingConfig } = await import("@/lib/data/provider");
    const cfg = await getBrandingConfig();
    return {
      signature: cfg.signature,
      hashtags: cfg.defaultHashtags || HASHTAG_BLOCK,
      orgName: cfg.orgName,
    };
  } catch {
    return {
      signature: defaultBrandingConfig.signature,
      hashtags: HASHTAG_BLOCK,
      orgName: defaultBrandingConfig.orgName,
    };
  }
}

export async function generateCaption(req: CaptionRequest): Promise<CaptionResult> {
  const opts = await loadBrandingOpts();
  const gemini = await callGemini(req, opts);
  return gemini ?? mockCompose(req, opts);
}

export const STYLE_LIST: Array<{ value: CaptionStyle; label: string; emoji: string; hint: string }> = [
  {
    value: "formal_organisasi",
    label: "Formal Organisasi",
    emoji: "🏛️",
    hint: "Resmi, hangat, struktur 5-bagian",
  },
  {
    value: "gen_z_friendly",
    label: "Gen Z Friendly",
    emoji: "✨",
    hint: "Santai, IG-native, emoji minimalis",
  },
  {
    value: "cinematic",
    label: "Cinematic",
    emoji: "🎬",
    hint: "Kalimat pendek, visual, atmospheric",
  },
  {
    value: "profesional",
    label: "Profesional",
    emoji: "📋",
    hint: "Ringkas, format poin, langsung",
  },
  {
    value: "persuasif",
    label: "Persuasif",
    emoji: "🎯",
    hint: "CTA kuat, retorika, urgensi",
  },
  {
    value: "emotional_branding",
    label: "Emotional Branding",
    emoji: "💛",
    hint: "Hangat, reflektif, personal",
  },
  {
    value: "campaign",
    label: "Campaign",
    emoji: "📣",
    hint: "Mobilisasi massa, hashtag-driven",
  },
];

/**
 * @deprecated Rubric list is now read from the DB (`/api/rubrics`). Kept only
 * as a fallback for tooling that runs before the DB is reachable.
 */
export const RUBRIC_LIST: Array<{ value: ContentRubric; label: string; emoji: string }> = [
  { value: "refleksi_harian" as ContentRubric, label: "Refleksi harian", emoji: "🌅" },
  { value: "pengumuman" as ContentRubric, label: "Pengumuman resmi", emoji: "📣" },
  { value: "kajian" as ContentRubric, label: "Kajian akademik", emoji: "📖" },
  { value: "selamat_sukses" as ContentRubric, label: "Ucapan & Hari Besar", emoji: "🌷" },
  { value: "dokumentasi" as ContentRubric, label: "Dokumentasi kegiatan", emoji: "📸" },
  { value: "campaign" as ContentRubric, label: "Campaign / mobilisasi", emoji: "📢" },
];
