import { z } from "@/lib/zod";

/**
 * Skema konten website publik prodi (/prodi). Seluruh isi ini dapat diubah
 * admin dari CMS (Settings → Website) dan disimpan di `siteSettings["website"]`.
 *
 * Semua URL divalidasi: hanya http(s), path lokal ("/..."), atau mailto:
 * agar tidak bisa disisipi `javascript:` dan sejenisnya.
 */

const SAFE_URL = /^(https?:\/\/[^\s]+|\/(?!\/)[^\s]*|mailto:[^\s]+)$/i;
const SAFE_IMAGE = /^(https:\/\/[^\s]+|\/(?!\/)[^\s]*)$/i;

const text = (max = 300) => z.string().trim().max(max);
const longText = (max = 2000) => z.string().trim().max(max);
const url = z
  .string()
  .trim()
  .max(2000)
  .refine(
    (v) => v === "" || SAFE_URL.test(v),
    "URL harus diawali https://, / atau mailto:",
  );
const image = z
  .string()
  .trim()
  .max(2000)
  .refine(
    (v) => v === "" || SAFE_IMAGE.test(v),
    "URL gambar harus diawali https:// atau /",
  )
  .nullable()
  .optional();
const isoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal YYYY-MM-DD");

const list = <T extends z.ZodType>(item: T, max = 60) => z.array(item).max(max);

export const titledItemSchema = z.object({
  title: text(160),
  description: longText(600),
});

export const personSchema = z.object({
  name: text(160),
  role: text(160),
  photo: image,
  expertise: list(text(60), 8).optional(),
  pendidikan: longText(1000).optional(),
  sinta: url.optional(),
  scholar: url.optional(),
  konsultasi: text(200).optional(),
  email: z.string().trim().max(200).optional(),
});

export const prestasiSchema = z.object({
  name: text(160),
  achievement: text(300),
  group: text(60),
  photo: image,
});

export const kegiatanSchema = z.object({
  date: isoDate,
  category: text(60),
  title: text(200),
  summary: longText(800),
  source: url.optional(),
  image,
});

export const fasilitasSchema = titledItemSchema.extend({ image });

export const unduhanSchema = z.object({
  title: text(160),
  category: text(60),
  description: text(300).optional(),
  url: z
    .string()
    .trim()
    .max(2000)
    .refine((v) => SAFE_IMAGE.test(v), "Tautan dokumen harus https:// atau /"),
});

export const beasiswaSchema = z.object({
  name: text(120),
  provider: text(120),
  period: text(160),
  description: longText(600),
  requirements: list(text(200), 12),
  url: url,
});

export const mitraSchema = z.object({
  name: text(120),
  description: text(300),
  url: url,
});

export const galeriSchema = z.object({
  image: z
    .string()
    .trim()
    .max(2000)
    .refine(
      (v) => SAFE_IMAGE.test(v),
      "URL gambar harus diawali https:// atau /",
    ),
  caption: text(200),
  album: text(60),
  date: z.union([isoDate, z.literal("")]).optional(),
});

export const videoSchema = z.object({
  title: text(160),
  url: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => /^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(v),
      "Harus tautan YouTube",
    ),
  kategori: text(40).optional(),
});

export const publikasiSchema = z.object({
  title: text(400),
  authors: text(300),
  year: text(10),
  venue: text(200),
  type: text(40),
  url: url,
});

export const tautanSchema = z.object({
  name: text(160),
  description: text(400),
  url: url,
});

export const testimoniSchema = z.object({
  name: text(120),
  role: text(160),
  quote: longText(600),
  photo: image,
});

export const kalenderSchema = z.object({
  mulai: isoDate,
  selesai: z.union([isoDate, z.literal("")]).optional(),
  kegiatan: text(200),
  kategori: text(40),
  sumber: url.optional(),
});

export const prosedurSchema = z.object({
  title: text(160),
  description: text(400),
  steps: list(text(300), 15),
  url: url,
});

const optDate = z.union([isoDate, z.literal("")]).optional();
const num = z.number().min(0).max(1e9);

export const kamusSchema = z.object({
  istilah: text(80),
  arti: longText(800),
  kategori: text(40),
});
export const lombaSchema = z.object({
  nama: text(200),
  penyelenggara: text(160),
  tingkat: text(40),
  deadline: optDate,
  deskripsi: longText(600),
  url: url,
});
export const lowonganSchema = z.object({
  title: text(160),
  jenis: text(40),
  deskripsi: longText(800),
  deadline: optDate,
  /** Kosongkan bila pendaftaran lewat formulir website. */
  url: url,
});
export const topikSkripsiSchema = z.object({
  topik: text(200),
  deskripsi: longText(600),
  dosen: text(160),
});
export const sidangSchema = z.object({
  tanggal: isoDate,
  jenis: text(40),
  nama: text(120),
  judul: text(400),
  ruang: text(80),
});
export const rpsSchema = z.object({
  mk: text(160),
  semester: text(20),
  url: url,
  referensi: list(text(300), 20),
});
export const peminatanSchema = z.object({
  nama: text(120),
  deskripsi: longText(600),
  mataKuliah: list(text(160), 20),
  karier: list(text(120), 12),
});
export const apresiasiSchema = z.object({
  bulan: z.string().regex(/^\d{4}-\d{2}$/, "Format bulan YYYY-MM"),
  nama: text(160),
  peran: text(80),
  alasan: longText(600),
  photo: image,
});
export const strukturSchema = z.object({
  jabatan: text(120),
  nama: text(160),
  level: z.number().int().min(1).max(4),
});
export const statistikSchema = z.object({
  tahun: text(10),
  mahasiswaAktif: num,
  mahasiswaBaru: num,
  lulusan: num,
  dosen: num,
});
export const infografisSchema = z.object({
  judul: text(160),
  deskripsi: longText(600),
  satuan: text(40),
  sumber: text(200),
  data: list(z.object({ label: text(60), nilai: z.number() }), 30),
});
export const ruangAlatSchema = z.object({
  name: text(120),
  description: text(400),
  image,
});
export const wisudaSchema = z.object({
  periode: text(80),
  tanggal: optDate,
  /** Satu per baris: "Nama | Judul skripsi". */
  wisudawan: list(text(500), 400),
  url: url,
  image,
});
export const karyaSchema = z.object({
  judul: text(200),
  jenis: text(60),
  pembuat: text(200),
  deskripsi: longText(800),
  url: url,
  image,
});
export const sertifikatSchema = z.object({
  kode: z
    .string()
    .trim()
    .regex(/^[A-Z0-9-]{4,40}$/, "Kode: huruf besar/angka/tanda hubung"),
  nama: text(160),
  kegiatan: text(200),
  peran: text(60),
  tanggal: isoDate,
});

export const timelineSchema = z.object({
  year: text(10),
  title: text(160),
  description: longText(600),
});

export const kurikulumYearSchema = z.object({
  label: text(40),
  semesters: list(
    z.object({
      name: text(40),
      courses: list(text(120), 20),
    }),
    4,
  ),
});

export const websiteConfigSchema = z.object({
  identity: z.object({
    heroTitle: text(80),
    heroDescription: longText(400),
    heroImage: image,
    statement: longText(600).optional(),
    tagline: text(120),
    degree: text(80),
    totalCredits: z.number().int().min(1).max(400),
    normalDuration: text(40),
    maxSemesters: z.number().int().min(1).max(30),
    prodiAccreditation: text(80),
    universityAccreditation: text(80),
    universityAccreditationPeriod: text(40),
  }),
  profil: z.object({
    sejarah: list(longText(2000), 10),
    visi: longText(800),
    misi: list(longText(600), 12),
    tujuan: list(longText(600), 12),
  }),
  pimpinan: list(personSchema, 12),
  dosen: list(personSchema, 80),
  prestasi: list(prestasiSchema, 40),
  kegiatan: list(kegiatanSchema, 40),
  bidangKajian: list(titledItemSchema, 8),
  kelompokMataKuliah: list(
    z.object({ code: text(10), title: text(120), description: longText(600) }),
    6,
  ),
  kurikulum: list(kurikulumYearSchema, 6),
  profilLulusan: list(titledItemSchema, 10),
  capaianPembelajaran: list(titledItemSchema, 10),
  prospekKarir: list(titledItemSchema, 16),
  kegiatanMahasiswa: list(titledItemSchema, 12),
  beasiswa: list(beasiswaSchema, 30),
  timeline: list(timelineSchema, 30),
  mitra: list(mitraSchema, 40),
  tendik: list(personSchema, 30),
  galeri: list(galeriSchema, 200),
  video: list(videoSchema, 30),
  publikasi: list(publikasiSchema, 300),
  jurnal: list(tautanSchema, 12),
  testimoni: list(testimoniSchema, 30),
  kalender: list(kalenderSchema, 80),
  prosedur: list(prosedurSchema, 20),
  aksesCepat: list(tautanSchema, 24),
  infoMaba: list(tautanSchema, 12),
  banner: z.object({ aktif: z.boolean(), teks: text(200), url: url }),
  kamus: list(kamusSchema, 300),
  lomba: list(lombaSchema, 60),
  lowongan: list(lowonganSchema, 60),
  topikSkripsi: list(topikSkripsiSchema, 100),
  panduanSkripsi: list(tautanSchema, 20),
  jadwalSidang: list(sidangSchema, 300),
  rps: list(rpsSchema, 120),
  peminatan: list(peminatanSchema, 8),
  apresiasi: list(apresiasiSchema, 60),
  statusLayanan: z.object({ status: text(20), pesan: text(200) }),
  struktur: list(strukturSchema, 40),
  statistik: list(statistikSchema, 20),
  infografis: list(infografisSchema, 20),
  ruangAlat: list(ruangAlatSchema, 30),
  wisuda: list(wisudaSchema, 30),
  karya: list(karyaSchema, 100),
  panduanMaba: list(tautanSchema, 20),
  integritas: list(longText(1500), 12),
  sertifikat: list(sertifikatSchema, 3000),
  pressKit: z.object({ profilSingkat: longText(1500), kontakMedia: text(200) }),
  /** Angka sorotan di bagian "Sekilas" beranda (selain kurikulum & akreditasi). */
  sorotan: list(
    z.object({
      nilai: text(20),
      judul: text(60),
      keterangan: text(240),
    }),
    4,
  ),
  kampanyePmb: z.object({
    aktif: z.boolean(),
    judul: text(160),
    teks: longText(600),
    tenggat: optDate,
  }),
  zakat: z.object({
    nisabPenghasilanTahun: num,
    hargaEmas: num,
    nisabGram: num,
    sumber: text(200),
    diperbarui: optDate,
  }),
  medsos: z.object({ youtubeChannelId: text(40), whatsappChannel: url }),
  mutu: z.object({
    description: longText(1200),
    surveiUrl: url,
    tracerUrl: url,
    sebaranUrl: url,
  }),
  fasilitas: list(fasilitasSchema, 16),
  jalurMasuk: list(titledItemSchema, 8),
  unduhan: list(unduhanSchema, 100),
  faq: list(z.object({ q: text(300), a: longText(1200) }), 30),
  kontak: z.object({
    address: text(200),
    street: text(200),
    email: z.string().trim().max(200).email("Email tidak valid"),
    hours: text(120),
    instagram: url,
    instagramHandle: text(60),
    tiktok: url,
    x: url,
    facebookName: text(80),
    linktree: url,
    website: url,
    pmbUrl: url,
    mapsUrl: url,
    /** Tautan wa.me untuk tombol "Tanya prodi" (opsional). */
    whatsapp: url.optional(),
  }),
});

export type WebsiteConfig = z.infer<typeof websiteConfigSchema>;
export type Person = z.infer<typeof personSchema>;
export type Prestasi = z.infer<typeof prestasiSchema>;
export type Kegiatan = z.infer<typeof kegiatanSchema>;
export type TitledItem = z.infer<typeof titledItemSchema>;
export type KurikulumYear = z.infer<typeof kurikulumYearSchema>;
export type Fasilitas = z.infer<typeof fasilitasSchema>;
export type Unduhan = z.infer<typeof unduhanSchema>;
export type Beasiswa = z.infer<typeof beasiswaSchema>;
export type Mitra = z.infer<typeof mitraSchema>;
export type Galeri = z.infer<typeof galeriSchema>;
export type Video = z.infer<typeof videoSchema>;
export type Publikasi = z.infer<typeof publikasiSchema>;
export type Tautan = z.infer<typeof tautanSchema>;
export type Testimoni = z.infer<typeof testimoniSchema>;
export type Kamus = z.infer<typeof kamusSchema>;
export type Lomba = z.infer<typeof lombaSchema>;
export type Lowongan = z.infer<typeof lowonganSchema>;
export type Infografis = z.infer<typeof infografisSchema>;
export type Statistik = z.infer<typeof statistikSchema>;
export type Wisuda = z.infer<typeof wisudaSchema>;
export type Karya = z.infer<typeof karyaSchema>;
export type KalenderItem = z.infer<typeof kalenderSchema>;
export type Prosedur = z.infer<typeof prosedurSchema>;
export type TimelineItem = z.infer<typeof timelineSchema>;
