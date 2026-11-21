/**
 * "Tinggal kasih foto + konteks": Gemini menyusun judul, isi tulisan,
 * ringkasan, dan caption Instagram sekaligus. Server-only.
 *
 * Gemini ikut melihat foto (maks. 3) supaya isi sesuai suasana di foto,
 * tetapi fakta (nama, tanggal, angka, kutipan) hanya boleh dari konteks.
 */
import { AssistUnavailableError } from "./assist";

export type WriteKind = "kegiatan" | "buletin" | "pengumuman";

export type WriteResult = {
  title: string;
  summary: string;
  body: string;
  caption: string;
  hashtags: string;
};

const GUIDE: Record<WriteKind, string> = {
  kegiatan:
    "Tulis BERITA KEGIATAN untuk website prodi (gaya rilis humas kampus). Isi 3–5 paragraf: " +
    "pembuka yang menjawab apa, siapa, kapan, di mana; lalu jalannya acara dan poin penting; " +
    "tutup dengan manfaat atau harapan. Kutipan hanya boleh bila ada di konteks.",
  buletin:
    "Tulis ARTIKEL BULETIN MAHASISWA tentang ekonomi/keuangan syariah (bukan berita kegiatan). " +
    "Isi 5–8 paragraf dengan 2–3 subjudul markdown (## ...): pendahuluan masalah, pembahasan konsep " +
    "dan argumen dari konteks, lalu kesimpulan/rekomendasi. Boleh menjelaskan konsep umum ekonomi " +
    "syariah, tetapi JANGAN mengarang statistik, kutipan, atau sumber; tandai [perlu sumber] bila " +
    "sebuah klaim butuh data.",
  pengumuman:
    "Tulis PENGUMUMAN resmi singkat: 1–3 paragraf jelas berisi apa, siapa yang dituju, tanggal/batas " +
    "waktu, dan cara/tautan. Tanpa basa-basi.",
};

async function imagePart(url: string) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !type.startsWith("image/")) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 6_000_000) return null;
    return { inlineData: { mimeType: type.split(";")[0], data: buf.toString("base64") } };
  } catch {
    return null;
  }
}

export async function writePost(input: {
  kind: WriteKind;
  context: string;
  title?: string;
  imageUrls?: string[];
  signature?: string;
  hashtags?: string;
}): Promise<WriteResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AssistUnavailableError("AI belum aktif: tambahkan GEMINI_API_KEY di environment.");
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey: key });

  const prompt =
    "Kamu penulis Humas Program Studi Ekonomi Syariah UIN Sunan Gunung Djati Bandung. Bahasa Indonesia baku yang hangat dan mudah dibaca.\n" +
    `${GUIDE[input.kind]}\n` +
    "ATURAN FAKTA: nama orang, jabatan, tanggal, angka, tempat, dan kutipan HANYA boleh diambil dari KONTEKS. " +
    "Foto hanya untuk menggambarkan suasana (jangan menebak nama orang di foto). Jangan menulis hal yang tidak ada di konteks.\n" +
    "Kembalikan JSON: {" +
    '"title": judul jelas yang menyebut bendanya, maks 10 kata, tanpa titik di akhir; ' +
    '"summary": satu kalimat ringkasan maks 25 kata; ' +
    '"body": isi lengkap dalam markdown (paragraf dipisah baris kosong); ' +
    '"caption": caption Instagram 3–6 kalimat pendek dengan baris baru antarbagian, ajakan membaca selengkapnya di website, ' +
    `diakhiri tanda tangan "${input.signature ?? "Humas Ekonomi Syariah UIN SGD"}"; ` +
    `"hashtags": 5–8 hashtag relevan dipisah spasi, wajib memuat ${input.hashtags || "#EkonomiSyariah #UINSGD"}` +
    "}.\n" +
    (input.title ? `Judul usulan penulis (boleh diperbaiki): ${input.title}\n` : "") +
    `KONTEKS:\n"""${input.context.slice(0, 6000)}"""`;

  const images = (await Promise.all((input.imageUrls ?? []).slice(0, 3).map(imagePart))).filter(Boolean);
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }, ...(images as object[])] }],
    config: { responseMimeType: "application/json" },
  });
  const j = JSON.parse(res.text ?? "{}") as Partial<WriteResult>;
  if (!j.body || !j.title) throw new Error("AI tidak menghasilkan tulisan. Tambahkan konteks lalu coba lagi.");
  return {
    title: String(j.title).replace(/[.。]$/, "").slice(0, 160),
    summary: String(j.summary ?? "").slice(0, 300),
    body: String(j.body).slice(0, 12000),
    caption: String(j.caption ?? "").slice(0, 2000),
    hashtags: String(j.hashtags ?? input.hashtags ?? "").slice(0, 300),
  };
}
