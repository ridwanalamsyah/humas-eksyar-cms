import { z } from "@/lib/zod";
import { getSiteSetting } from "@/lib/data/provider";

/** Hasil sinkron mata kuliah & dosen pengampu dari e-Knows. */
export const AKADEMIK_KEY = "akademik_sync";

export const akademikSchema = z.object({
  at: z.string(),
  pages: z.number(),
  errors: z.number(),
  mataKuliah: z
    .array(
      z.object({
        nama: z.string().max(200),
        dosen: z.array(z.string().max(160)).max(40),
        kelas: z.number(),
        kategori: z.array(z.string().max(200)).max(40),
      }),
    )
    .max(3000),
  dosen: z
    .array(
      z.object({
        nama: z.string().max(160),
        mataKuliah: z.array(z.string().max(200)).max(200),
      }),
    )
    .max(1000),
});
export type AkademikSync = z.infer<typeof akademikSchema>;

export const defaultAkademikSync: AkademikSync = {
  at: "2026-10-28T09:50:00.000Z",
  pages: 4,
  errors: 0,
  mataKuliah: [
    { nama: "Pengantar Ekonomi Islam", dosen: ["Dr. Evi Sopiah, M.Ag., CIIQA, CIELP", "Anisa Ilmia, M.E."], kelas: 4, kategori: ["Semester 1 · MKU"] },
    { nama: "Fiqh Muamalah", dosen: ["Prof. Dr. H. Dudang Gojali, M.Ag.", "Dr. H. Muhammad Hasanuddin, M.Ag."], kelas: 4, kategori: ["Semester 2 · MKU"] },
    { nama: "Ushul Fiqh Ekonomi", dosen: ["Prof. Dr. H. Atang Abd. Hakim, M.A.", "Dr. H. Abdullah Safe'i, M.Ag."], kelas: 4, kategori: ["Semester 3 · MKU"] },
    { nama: "Ekonomi Mikro Islam", dosen: ["Depid Ismail, M.E.Sy.", "Anisa Ilmia, M.E."], kelas: 4, kategori: ["Semester 3 · MKU"] },
    { nama: "Ekonomi Makro Islam", dosen: ["Suteja Wira Dana Kusuma, M.E.", "Annisa Nur Salam, M.E."], kelas: 4, kategori: ["Semester 4 · MKU"] },
    { nama: "Ekonomi Moneter Islam", dosen: ["Annisa Nur Salam, M.E.", "Suteja Wira Dana Kusuma, M.E."], kelas: 4, kategori: ["Semester 5 · MKU"] },
    { nama: "Ekonomi Pembangunan Islam", dosen: ["Nabiela Rizki Alifa, M.E.", "Dr. Iwan Setiawan, M.Ag."], kelas: 4, kategori: ["Semester 5 · MKU"] },
    { nama: "Sejarah Pemikiran Ekonomi Islam", dosen: ["Prof. Dr. H. Atang Abd. Hakim, M.A.", "Dr. Dedi Suyandi, M.Ag."], kelas: 4, kategori: ["Semester 2 · MKU"] },
    { nama: "Filsafat Ekonomi Syariah", dosen: ["Prof. Dr. H. Ahmad Hasan Ridwan, M.Ag.", "Dr. H. Abdullah Safe'i, M.Ag."], kelas: 3, kategori: ["Semester 4 · MKU"] },
    { nama: "Bank & Lembaga Keuangan Syariah", dosen: ["Reza Fauzi Nazar, M.E.", "Dr. Neneng Hartati, M.Ag."], kelas: 4, kategori: ["Semester 3 · MKU"] },
    { nama: "Manajemen Perbankan Syariah", dosen: ["Herry Sutanto, M.M.", "Dr. Neneng Hartati, M.Ag."], kelas: 3, kategori: ["Semester 4 · MKP"] },
    { nama: "Manajemen Keuangan Syariah", dosen: ["Reza Fauzi Nazar, M.E.", "Zia Sidqurrahman, M.E."], kelas: 4, kategori: ["Semester 3 · MKU"] },
    { nama: "Pasar Modal Syariah", dosen: ["Zia Sidqurrahman, M.E.", "Suteja Wira Dana Kusuma, M.E."], kelas: 4, kategori: ["Semester 4 · MKU"] },
    { nama: "Manajemen ZISWAF", dosen: ["Prof. Dr. H. Ahmad Hasan Ridwan, M.Ag.", "Dr. Dedi Suyandi, M.Ag.", "Anisa Ilmia, M.E."], kelas: 4, kategori: ["Semester 4 · MKU"] },
    { nama: "Asuransi Syariah", dosen: ["Ramadhani Irma Tripalupi, M.E.", "Zia Sidqurrahman, M.E."], kelas: 3, kategori: ["Semester 5 · MKU"] },
    { nama: "Industri Halal & Ekowisata Syariah", dosen: ["Dr. Evi Sopiah, M.Ag., CIIQA, CIELP", "Dr. H. Muhammad Hasanuddin, M.Ag.", "Dr. Sofian Al Hakim, M.Ag."], kelas: 4, kategori: ["Semester 5 · MKU"] },
    { nama: "Fintech Syariah & Ekonomi Digital", dosen: ["Widiawati, M.E.", "Reza Fauzi Nazar, M.E."], kelas: 4, kategori: ["Semester 6 · MKP"] },
    { nama: "Kewirausahaan Syariah", dosen: ["Yuda Septia Fitri, M.E.", "Depid Ismail, M.E.Sy."], kelas: 4, kategori: ["Semester 6 · MKP"] },
    { nama: "Akuntansi Syariah", dosen: ["Dr. H. Endang Jumali, Lc., M.Si., M.Ak.", "Agus Joharudin, M.E."], kelas: 4, kategori: ["Semester 3 · MKP"] },
    { nama: "Akuntansi Perbankan Syariah", dosen: ["Dr. H. Endang Jumali, Lc., M.Si., M.Ak."], kelas: 3, kategori: ["e-Knows Kategori 40"] },
    { nama: "Analisis Laporan Keuangan Syariah", dosen: ["Dr. H. Endang Jumali, Lc., M.Si., M.Ak.", "Zia Sidqurrahman, M.E."], kelas: 3, kategori: ["e-Knows Kategori 40"] },
    { nama: "Audit Syariah", dosen: ["Dr. H. Endang Jumali, Lc., M.Si., M.Ak."], kelas: 3, kategori: ["e-Knows Kategori 40"] },
    { nama: "Akuntansi Biaya", dosen: ["Agus Joharudin, M.E."], kelas: 3, kategori: ["e-Knows Kategori 40"] },
    { nama: "Statistika Ekonomi", dosen: ["Nabiela Rizki Alifa, M.E.", "Suteja Wira Dana Kusuma, M.E."], kelas: 4, kategori: ["Semester 2 · MKP"] },
    { nama: "Ekonometrika", dosen: ["Suteja Wira Dana Kusuma, M.E.", "Nabiela Rizki Alifa, M.E."], kelas: 4, kategori: ["Semester 4 · MKP"] },
    { nama: "Metodologi Penelitian Ekonomi", dosen: ["Dr. Evi Sopiah, M.Ag., CIIQA, CIELP", "Dr. H. Muhammad Hasanuddin, M.Ag."], kelas: 4, kategori: ["Semester 5 · MKU"] },
    { nama: "Kebijakan Fiskal & Moneter Islam", dosen: ["Annisa Nur Salam, M.E.", "Suteja Wira Dana Kusuma, M.E."], kelas: 4, kategori: ["Semester 6 · MKU"] },
    { nama: "Etika Bisnis Syariah", dosen: ["Dr. H. Abdullah Safe'i, M.Ag.", "Yuda Septia Fitri, M.E."], kelas: 4, kategori: ["e-Knows Kategori 40"] },
    { nama: "Ekonomi Internasional", dosen: ["Annisa Nur Salam, M.E.", "Fithri Dzikrayah, M.E."], kelas: 3, kategori: ["e-Knows Kategori 40"] },
    { nama: "Ekonomi Kreatif", dosen: ["Yuda Septia Fitri, M.E.", "Widiawati, M.E."], kelas: 3, kategori: ["e-Knows Kategori 40"] },
    { nama: "Ekonomi Lingkungan", dosen: ["Dr. H. Muhammad Hasanuddin, M.Ag.", "Dr. Sofian Al Hakim, M.Ag."], kelas: 3, kategori: ["e-Knows Kategori 40"] },
    { nama: "Ekonomi Sumber Daya Alam dalam Islam", dosen: ["Dr. Iwan Setiawan, M.Ag."], kelas: 3, kategori: ["e-Knows Kategori 40"] },
    { nama: "Ekonomi Sumber Daya Manusia", dosen: ["Herry Sutanto, M.M.", "Fithri Dzikrayah, M.E."], kelas: 3, kategori: ["e-Knows Kategori 40"] },
    { nama: "Ekonomi Politik Islam", dosen: ["Dr. Ahmad Mudzakir, M.Ag."], kelas: 3, kategori: ["e-Knows Kategori 40"] },
    { nama: "Bahasa Arab Ekonomi I & II", dosen: ["Dr. Ahmad Mudzakir, M.Ag.", "Dr. H. Abdullah Safe'i, M.Ag."], kelas: 4, kategori: ["e-Knows Kategori 40 · MKL"] },
    { nama: "Bahasa Inggris Ekonomi I & II", dosen: ["Nabiela Rizki Alifa, M.E.", "Fithri Dzikrayah, M.E."], kelas: 4, kategori: ["e-Knows Kategori 40 · MKL"] },
  ],
  dosen: [
    { nama: "Dr. Evi Sopiah, M.Ag., CIIQA, CIELP", mataKuliah: ["Pengantar Ekonomi Islam", "Industri Halal & Ekowisata Syariah", "Metodologi Penelitian Ekonomi"] },
    { nama: "Anisa Ilmia, M.E.", mataKuliah: ["Pengantar Ekonomi Islam", "Ekonomi Mikro Islam", "Manajemen ZISWAF"] },
    { nama: "Prof. Dr. H. Dudang Gojali, M.Ag.", mataKuliah: ["Fiqh Muamalah"] },
    { nama: "Prof. Dr. H. Atang Abd. Hakim, M.A.", mataKuliah: ["Ushul Fiqh Ekonomi", "Sejarah Pemikiran Ekonomi Islam"] },
    { nama: "Prof. Dr. H. Ahmad Hasan Ridwan, M.Ag.", mataKuliah: ["Filsafat Ekonomi Syariah", "Manajemen ZISWAF"] },
    { nama: "Dr. H. Muhammad Hasanuddin, M.Ag.", mataKuliah: ["Fiqh Muamalah", "Industri Halal & Ekowisata Syariah", "Metodologi Penelitian Ekonomi", "Ekonomi Lingkungan"] },
    { nama: "Dr. H. Endang Jumali, Lc., M.Si., M.Ak.", mataKuliah: ["Akuntansi Syariah", "Akuntansi Perbankan Syariah", "Analisis Laporan Keuangan Syariah", "Audit Syariah"] },
    { nama: "Dr. H. Abdullah Safe'i, M.Ag.", mataKuliah: ["Ushul Fiqh Ekonomi", "Filsafat Ekonomi Syariah", "Etika Bisnis Syariah", "Bahasa Arab Ekonomi I & II"] },
    { nama: "Suteja Wira Dana Kusuma, M.E.", mataKuliah: ["Ekonomi Makro Islam", "Ekonomi Moneter Islam", "Pasar Modal Syariah", "Statistika Ekonomi", "Ekonometrika", "Kebijakan Fiskal & Moneter Islam"] },
    { nama: "Reza Fauzi Nazar, M.E.", mataKuliah: ["Bank & Lembaga Keuangan Syariah", "Manajemen Keuangan Syariah", "Fintech Syariah & Ekonomi Digital"] },
    { nama: "Depid Ismail, M.E.Sy.", mataKuliah: ["Ekonomi Mikro Islam", "Kewirausahaan Syariah"] },
    { nama: "Nabiela Rizki Alifa, M.E.", mataKuliah: ["Ekonomi Pembangunan Islam", "Statistika Ekonomi", "Ekonometrika", "Bahasa Inggris Ekonomi I & II"] },
    { nama: "Zia Sidqurrahman, M.E.", mataKuliah: ["Manajemen Keuangan Syariah", "Pasar Modal Syariah", "Asuransi Syariah", "Analisis Laporan Keuangan Syariah"] },
    { nama: "Annisa Nur Salam, M.E.", mataKuliah: ["Ekonomi Makro Islam", "Ekonomi Moneter Islam", "Kebijakan Fiskal & Moneter Islam", "Ekonomi Internasional"] },
    { nama: "Dr. Dedi Suyandi, M.Ag.", mataKuliah: ["Sejarah Pemikiran Ekonomi Islam", "Manajemen ZISWAF"] },
    { nama: "Yuda Septia Fitri, M.E.", mataKuliah: ["Kewirausahaan Syariah", "Etika Bisnis Syariah", "Ekonomi Kreatif"] },
    { nama: "Herry Sutanto, M.M.", mataKuliah: ["Manajemen Perbankan Syariah", "Ekonomi Sumber Daya Manusia"] },
    { nama: "Widiawati, M.E.", mataKuliah: ["Fintech Syariah & Ekonomi Digital", "Ekonomi Kreatif"] },
    { nama: "Ramadhani Irma Tripalupi, M.E.", mataKuliah: ["Asuransi Syariah"] },
    { nama: "Dr. Sofian Al Hakim, M.Ag.", mataKuliah: ["Industri Halal & Ekowisata Syariah", "Ekonomi Lingkungan"] },
    { nama: "Dr. Iwan Setiawan, M.Ag.", mataKuliah: ["Ekonomi Pembangunan Islam", "Ekonomi Sumber Daya Alam dalam Islam"] },
    { nama: "Dr. Neneng Hartati, M.Ag.", mataKuliah: ["Bank & Lembaga Keuangan Syariah", "Manajemen Perbankan Syariah"] },
    { nama: "Dr. Ahmad Mudzakir, M.Ag.", mataKuliah: ["Ekonomi Politik Islam", "Bahasa Arab Ekonomi I & II"] },
    { nama: "Agus Joharudin, M.E.", mataKuliah: ["Akuntansi Syariah", "Akuntansi Biaya"] },
    { nama: "Fithri Dzikrayah, M.E.", mataKuliah: ["Ekonomi Internasional", "Ekonomi Sumber Daya Manusia", "Bahasa Inggris Ekonomi I & II"] },
  ],
};

export async function getAkademik(): Promise<AkademikSync | null> {
  const parsed = akademikSchema.safeParse(
    await getSiteSetting(AKADEMIK_KEY).catch(() => null),
  );
  if (parsed.success && parsed.data.mataKuliah.length > 0) {
    return parsed.data;
  }
  return defaultAkademikSync;
}
