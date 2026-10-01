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

export interface ArtikelDraft {
  judul: string;
  isi: string;
}

/**
 * Ubah caption Instagram menjadi artikel berita website (markdown).
 * Hanya memakai fakta di caption — tidak menambah nama, angka, atau kutipan.
 */
export async function artikelFromCaption(caption: string, tanggal: string): Promise<ArtikelDraft> {
  const raw = await gemini(
    `${BASE_RULES}\nUbah caption Instagram berikut menjadi artikel berita untuk website prodi. ` +
      `Gaya berita kampus: paragraf pembuka menjawab apa, siapa, kapan, di mana (sejauh ada di caption), lalu 2–4 paragraf isi. ` +
      `JANGAN menambah fakta, kutipan, angka, atau nama yang tidak ada di caption. Hapus hashtag, emoji, ajakan "link in bio", dan mention akun. ` +
      `Tanggal unggahan: ${tanggal}. Kembalikan JSON {"judul": string (maks 100 karakter, judul berita yang jelas), ` +
      `"isi": string (markdown, paragraf dipisah baris kosong, tanpa judul)}.\n\nCaption:\n"""${caption.slice(0, 4000)}"""`,
    true,
  );
  const parsed = JSON.parse(raw) as Partial<ArtikelDraft>;
  if (!parsed.judul || !parsed.isi) throw new Error("Format jawaban AI tidak sesuai");
  return { judul: parsed.judul.slice(0, 160), isi: parsed.isi.slice(0, 12000) };
}

export interface RepurposeDraft {
  instagram: string;
  whatsapp: string;
  ringkas: string;
}

/** Satu tulisan → caption Instagram, pesan WhatsApp, ringkasan pengumuman. */
export async function repurpose(title: string, body: string, url: string): Promise<RepurposeDraft> {
  const raw = await gemini(
    `${BASE_RULES}\nUbah konten berikut menjadi tiga format. JANGAN menambah fakta baru. Kembalikan JSON ` +
      `{"instagram": string (caption 80–150 kata, pembuka menarik, paragraf pendek, ajakan membaca di website, 3–6 hashtag relevan termasuk #EkonomiSyariah #UINSGD), ` +
      `"whatsapp": string (pesan siaran singkat, judul tebal pakai *bintang*, 2–4 kalimat, diakhiri "Selengkapnya: ${url}"), ` +
      `"ringkas": string (satu kalimat maks 160 karakter untuk pita pengumuman website)}.\n\nJudul: ${title}\n\nIsi:\n"""${body.slice(0, 6000)}"""`,
    true,
  );
  const j = JSON.parse(raw) as Partial<RepurposeDraft>;
  if (!j.instagram || !j.whatsapp || !j.ringkas) throw new Error("Format jawaban AI tidak sesuai");
  return { instagram: j.instagram.slice(0, 2200), whatsapp: j.whatsapp.slice(0, 1500), ringkas: j.ringkas.slice(0, 200) };
}
