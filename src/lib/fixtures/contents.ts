import type { ContentItem, CaptionTemplate } from "@/lib/data/types";

/**
 * Default hashtag block. Generic & editable — program-specific tagline
 * (mis. motto angkatan) sebaiknya ditambahkan via UI per-konten, bukan
 * di-hardcode di repo.
 */
export const HASHTAG_BLOCK =
  "#EkonomiSyariah #FEBIUINBandung #UINSunanGunungDjati";

/**
 * Seed content is intentionally empty. The CMS starts on a blank slate so the
 * tim can build their own editorial pipeline through the UI. Add new posts via
 * `/content/new` once you are logged in.
 */
export const contents: ContentItem[] = [];

export const findContent = (id: string) =>
  contents.find((c) => c.id === id) ?? null;

/**
 * Generic few-shot examples used by the AI caption generator. These templates
 * are rubric-agnostic so they keep working even before the team defines its
 * own program-specific rubrics.
 */
export const captionTemplates: CaptionTemplate[] = [
  {
    id: "tpl-formal-pengumuman",
    rubric: "pengumuman",
    style: "formal_organisasi",
    example:
      "PENGUMUMAN: [JUDUL]\n\n[Isi pengumuman singkat — jelas, faktual, dan singkat].\n\nDetail:\n• Tanggal: [tanggal]\n• Tempat: [lokasi]\n• Kontak: [PIC]\n\n———\nAtas nama Program Studi Ekonomi Syariah",
    hashtags: HASHTAG_BLOCK,
  },
  {
    id: "tpl-cinematic-campaign",
    rubric: "campaign",
    style: "cinematic",
    example:
      "[JUDUL — kapital, kuat]\n\n[Hook visual satu baris yang menahan scroll]\n[Kalimat kontras yang membangun ekspektasi]\n[Detail spesifik yang membuat audiens berhenti]\n\n[Tanggal & lokasi]\n[CTA singkat]\n\n———\nAtas nama Program Studi Ekonomi Syariah",
    hashtags: HASHTAG_BLOCK,
  },
  {
    id: "tpl-emotional-ucapan",
    rubric: "selamat_sukses",
    style: "emotional_branding",
    example:
      "[JUDUL UCAPAN — kapital]\n\nUntuk [siapa] yang [konteks pencapaian].\n\nKami melihat kerja kerasmu. Kami bangga.\n\n[Doa atau harapan singkat].\n\n———\nAtas nama Program Studi Ekonomi Syariah",
    hashtags: HASHTAG_BLOCK,
  },
  {
    id: "tpl-genz-bisnis-halal",
    rubric: "bisnis_halal",
    style: "gen_z_friendly",
    example:
      "UMKM yang patut disorot\n\n[Nama brand] — [tagline satu baris]\n\n• Fakta unik 1\n• Fakta unik 2 (idealnya dengan angka)\n• Mengapa ini penting dalam satu kalimat\n\nSimpan dan bagikan ke teman yang sedang merintis usaha.\n\n———\nAtas nama Program Studi Ekonomi Syariah",
    hashtags: HASHTAG_BLOCK,
  },
  {
    id: "tpl-persuasif-recruitment",
    rubric: "campaign",
    style: "persuasif",
    example:
      "[CTA besar — apa yang harus dilakukan]\n\nPertanyaan retoris yang membuat pembaca berhenti sejenak.\n\nDi Eksyar, kami:\n• [Alasan 1]\n• [Alasan 2]\n• [Alasan 3]\n\nFormulir: [link di bio]\nDeadline: [tanggal]\n\n———\nAtas nama Program Studi Ekonomi Syariah",
    hashtags: HASHTAG_BLOCK,
  },
  {
    id: "tpl-profesional-kajian",
    rubric: "kajian",
    style: "profesional",
    example:
      "KAJIAN: [TEMA]\n\nNarasumber: [Nama, jabatan]\nWaktu: [tanggal] · [jam]\nLokasi: [tempat]\n\nTiga poin utama:\n1. [Poin 1]\n2. [Poin 2]\n3. [Poin 3]\n\nRegistrasi: [link di bio]\n\n———\nAtas nama Program Studi Ekonomi Syariah",
    hashtags: HASHTAG_BLOCK,
  },
  {
    id: "tpl-dokumentasi-recap",
    rubric: "dokumentasi",
    style: "profesional",
    example:
      "DOKUMENTASI: [NAMA KEGIATAN]\n\n[Ringkasan 2-3 kalimat tentang apa yang terjadi].\n\nTerima kasih kepada [pihak yang berkontribusi]. Sampai jumpa di kegiatan berikutnya.\n\n———\nAtas nama Program Studi Ekonomi Syariah",
    hashtags: HASHTAG_BLOCK,
  },
];
