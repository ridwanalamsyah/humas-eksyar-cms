import { z } from "zod";

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
export type TimelineItem = z.infer<typeof timelineSchema>;
