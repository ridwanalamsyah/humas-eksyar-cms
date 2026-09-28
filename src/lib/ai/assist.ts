/**
 * AI Bantu untuk editor CMS (Gemini). Server-only.
 *
 * - `assistText`: merapikan / meringkas / mengubah gaya teks.
 * - `kegiatanFromCaption`: mengubah caption Instagram jadi data kegiatan.
 *
 * Butuh `GEMINI_API_KEY`. Tanpa kunci, melempar `AssistUnavailableError`
 * agar UI bisa memberi tahu admin — tidak ada teks palsu.
 */

export type AssistAction = "perbaiki" | "ringkas" | "formal" | "santai" | "perluas";

export class AssistUnavailableError extends Error {}

const INSTRUCTIONS: Record<AssistAction, string> = {
  perbaiki: "Perbaiki ejaan, tata bahasa, dan alur kalimat sesuai PUEBI tanpa mengubah makna.",
  ringkas: "Ringkas menjadi lebih padat dan jelas, sekitar setengah panjang aslinya.",
  formal: "Tulis ulang dengan gaya resmi institusi perguruan tinggi yang hangat.",
  santai: "Tulis ulang dengan gaya ramah untuk calon mahasiswa (Gen Z), tetap sopan dan profesional.",
  perluas: "Kembangkan menjadi 2–3 kalimat yang lebih informatif, TANPA menambahkan fakta, angka, nama, atau tanggal baru.",
};

const BASE_RULES =
  "Kamu editor website Program Studi Ekonomi Syariah UIN Sunan Gunung Djati Bandung. " +
  "Jangan mengarang fakta. Pertahankan nama, angka, dan tanggal persis seperti aslinya. Bahasa Indonesia.";

async function gemini(prompt: string, json = false): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AssistUnavailableError("AI belum aktif: tambahkan GEMINI_API_KEY di environment.");
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: key });
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: json ? { responseMimeType: "application/json" } : undefined,
  });
  return (res.text ?? "").trim();
}

export async function assistText(action: AssistAction, text: string, field?: string): Promise<string> {
  const out = await gemini(
    `${BASE_RULES}\nTugas: ${INSTRUCTIONS[action]}\n${field ? `Bagian website: ${field}.\n` : ""}` +
      `Balas HANYA dengan teks hasil, tanpa pengantar, tanpa tanda kutip, tanpa markdown.\n\nTeks:\n"""${text}"""`,
  );
  return out.replace(/^["“]|["”]$/g, "").slice(0, 4000);
}

export interface KegiatanDraft {
  title: string;
  date: string;
  category: string;
  summary: string;
}

export async function kegiatanFromCaption(caption: string, today: string): Promise<KegiatanDraft> {
  const raw = await gemini(
    `${BASE_RULES}\nUbah caption Instagram berikut menjadi data kegiatan untuk website. ` +
      `Kembalikan JSON {"title": string (maks 90 karakter, judul berita yang jelas), ` +
      `"date": "YYYY-MM-DD" (tanggal kegiatan dari caption; jika tidak ada, pakai ${today}), ` +
      `"category": salah satu "Akademik" | "Pengabdian" | "Karir" | "Kemahasiswaan" | "Prestasi" | "Penjaminan Mutu", ` +
      `"summary": string (2 kalimat ringkas, tanpa hashtag & emoji)}.\n\nCaption:\n"""${caption}"""`,
    true,
  );
  const data = JSON.parse(raw) as Partial<KegiatanDraft>;
  return {
    title: String(data.title ?? "").slice(0, 200),
    date: /^\d{4}-\d{2}-\d{2}$/.test(String(data.date)) ? String(data.date) : today,
    category: String(data.category ?? "Akademik").slice(0, 60),
    summary: String(data.summary ?? "").slice(0, 800),
  };
}
