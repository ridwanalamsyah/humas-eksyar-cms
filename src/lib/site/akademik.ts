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
  at: "2026-10-29T10:00:00.000Z",
  pages: 8,
  errors: 0,
  mataKuliah: [
    // Semester 1
    { nama: "Pengantar Ekonomi Islam", dosen: ["Dr. Evi Sopiah, M.Ag., CIIQA, CIELP", "Anisa Ilmia, M.E."], kelas: 4, kategori: ["Semester 1", "MKU"] },
    { nama: "Pengantar Ilmu Ekonomi (Mikro & Makro)", dosen: ["Suteja Wira Dana Kusuma, M.E.", "Depid Ismail, M.E.Sy."], kelas: 4, kategori: ["Semester 1", "MKU"] },
    { nama: "Matematika Ekonomi", dosen: ["Nabiela Rizki Alifa, M.E.", "Zia Sidqurrahman, M.E."], kelas: 4, kategori: ["Semester 1", "MKP"] },
    { nama: "Ulumul Qur'an & Hadis Ekonomi", dosen: ["Dr. H. Abdullah Safe'i, M.Ag.", "Dr. Dedi Suyandi, M.Ag."], kelas: 4, kategori: ["Semester 1", "MKL"] },
    { nama: "Bahasa Arab Ekonomi I", dosen: ["Dr. Ahmad Mudzakir, M.Ag.", "Dr. H. Abdullah Safe'i, M.Ag."], kelas: 4, kategori: ["Semester 1", "MKL"] },
    { nama: "Pancasila & Kewarganegaraan", dosen: ["Tim Dosen MKDU UIN SGD"], kelas: 4, kategori: ["Semester 1", "MKL"] },
    // Semester 2
    { nama: "Fiqh Muamalah", dosen: ["Prof. Dr. H. Dudang Gojali, M.Ag.", "Dr. H. Muhammad Hasanuddin, M.Ag."], kelas: 4, kategori: ["Semester 2", "MKU"] },
    { nama: "Sejarah Pemikiran Ekonomi Islam", dosen: ["Prof. Dr. H. Atang Abd. Hakim, M.A.", "Dr. Dedi Suyandi, M.Ag."], kelas: 4, kategori: ["Semester 2", "MKU"] },
    { nama: "Pengantar Akuntansi", dosen: ["Dr. H. Endang Jumali, Lc., M.Si., M.Ak.", "Agus Joharudin, M.E."], kelas: 4, kategori: ["Semester 2", "MKP"] },
    { nama: "Statistika Ekonomi I", dosen: ["Nabiela Rizki Alifa, M.E.", "Suteja Wira Dana Kusuma, M.E."], kelas: 4, kategori: ["Semester 2", "MKP"] },
    { nama: "Pengantar Manajemen & Bisnis", dosen: ["Dr. H. Kadar Nurjaman, S.E., M.M.", "Herry Sutanto, M.M."], kelas: 4, kategori: ["Semester 2", "MKP"] },
    { nama: "Bahasa Inggris Ekonomi", dosen: ["Nabiela Rizki Alifa, M.E.", "Fithri Dzikrayah, M.E."], kelas: 4, kategori: ["Semester 2", "MKL"] },
    // Semester 3
    { nama: "Ekonomi Mikro Islam", dosen: ["Depid Ismail, M.E.Sy.", "Anisa Ilmia, M.E."], kelas: 4, kategori: ["Semester 3", "MKU"] },
    { nama: "Ushul Fiqh Ekonomi & Maqashid Syariah", dosen: ["Prof. Dr. H. Atang Abd. Hakim, M.A.", "Dr. H. Abdullah Safe'i, M.Ag."], kelas: 4, kategori: ["Semester 3", "MKU"] },
    { nama: "Bank & Lembaga Keuangan Syariah", dosen: ["Reza Fauzi Nazar, M.E.", "Dr. Neneng Hartati, M.Ag."], kelas: 4, kategori: ["Semester 3", "MKU"] },
    { nama: "Manajemen Keuangan Syariah", dosen: ["Reza Fauzi Nazar, M.E.", "Zia Sidqurrahman, M.E."], kelas: 4, kategori: ["Semester 3", "MKU"] },
    { nama: "Akuntansi Syariah", dosen: ["Dr. H. Endang Jumali, Lc., M.Si., M.Ak.", "Agus Joharudin, M.E."], kelas: 4, kategori: ["Semester 3", "MKP"] },
    { nama: "Statistika Ekonomi Lanjutan", dosen: ["Nabiela Rizki Alifa, M.E.", "Suteja Wira Dana Kusuma, M.E."], kelas: 4, kategori: ["Semester 3", "MKP"] },
    // Semester 4
    { nama: "Ekonomi Makro Islam", dosen: ["Suteja Wira Dana Kusuma, M.E.", "Annisa Nur Salam, M.E."], kelas: 4, kategori: ["Semester 4", "MKU"] },
    { nama: "Filsafat Ekonomi Syariah", dosen: ["Prof. Dr. H. Ahmad Hasan Ridwan, M.Ag.", "Dr. H. Abdullah Safe'i, M.Ag."], kelas: 3, kategori: ["Semester 4", "MKU"] },
    { nama: "Pasar Modal Syariah", dosen: ["Zia Sidqurrahman, M.E.", "Suteja Wira Dana Kusuma, M.E."], kelas: 4, kategori: ["Semester 4", "MKU"] },
    { nama: "Manajemen ZISWAF", dosen: ["Prof. Dr. H. Ahmad Hasan Ridwan, M.Ag.", "Dr. Dedi Suyandi, M.Ag.", "Anisa Ilmia, M.E."], kelas: 4, kategori: ["Semester 4", "MKU"] },
    { nama: "Manajemen Perbankan Syariah", dosen: ["Herry Sutanto, M.M.", "Dr. Neneng Hartati, M.Ag."], kelas: 3, kategori: ["Semester 4", "MKP"] },
    { nama: "Ekonometrika", dosen: ["Suteja Wira Dana Kusuma, M.E.", "Nabiela Rizki Alifa, M.E."], kelas: 4, kategori: ["Semester 4", "MKP"] },
    { nama: "Etika Bisnis Syariah", dosen: ["Dr. H. Abdullah Safe'i, M.Ag.", "Yuda Septia Fitri, M.E."], kelas: 4, kategori: ["Semester 4", "MKU"] },
    // Semester 5
    { nama: "Ekonomi Pembangunan Islam", dosen: ["Nabiela Rizki Alifa, M.E.", "Prof. Dr. Iwan Setiawan, S.Ag., M.Pd., M.E.Sy."], kelas: 4, kategori: ["Semester 5", "MKU"] },
    { nama: "Ekonomi Moneter Islam", dosen: ["Annisa Nur Salam, M.E.", "Suteja Wira Dana Kusuma, M.E."], kelas: 4, kategori: ["Semester 5", "MKU"] },
    { nama: "Industri Halal & Ekowisata Syariah", dosen: ["Dr. Evi Sopiah, M.Ag., CIIQA, CIELP", "Dr. H. Muhammad Hasanuddin, M.Ag.", "Dr. Sofian Al Hakim, M.Ag."], kelas: 4, kategori: ["Semester 5", "MKU"] },
    { nama: "Asuransi Syariah (Takaful)", dosen: ["Ramadhani Irma Tripalupi, M.E.", "Zia Sidqurrahman, M.E."], kelas: 3, kategori: ["Semester 5", "MKU"] },
    { nama: "Metodologi Penelitian Ekonomi Syariah", dosen: ["Dr. Evi Sopiah, M.Ag., CIIQA, CIELP", "Dr. H. Muhammad Hasanuddin, M.Ag."], kelas: 4, kategori: ["Semester 5", "MKU"] },
    { nama: "Analisis Laporan Keuangan Syariah", dosen: ["Dr. H. Endang Jumali, Lc., M.Si., M.Ak.", "Zia Sidqurrahman, M.E."], kelas: 3, kategori: ["Semester 5", "MKP"] },
    { nama: "Akuntansi Perbankan Syariah", dosen: ["Dr. H. Endang Jumali, Lc., M.Si., M.Ak."], kelas: 3, kategori: ["Semester 5", "MKP"] },
    // Semester 6
    { nama: "Kebijakan Fiskal & Moneter Islam", dosen: ["Annisa Nur Salam, M.E.", "Suteja Wira Dana Kusuma, M.E."], kelas: 4, kategori: ["Semester 6", "MKU"] },
    { nama: "Fintech Syariah & Ekonomi Digital", dosen: ["Widiawati, M.E.", "Reza Fauzi Nazar, M.E."], kelas: 4, kategori: ["Semester 6", "MKP"] },
    { nama: "Kewirausahaan Syariah & Inkubasi Bisnis Halal", dosen: ["Yuda Septia Fitri, M.E.", "Depid Ismail, M.E.Sy."], kelas: 4, kategori: ["Semester 6", "MKP"] },
    { nama: "Audit Syariah & Tata Kelola LKS", dosen: ["Dr. H. Endang Jumali, Lc., M.Si., M.Ak."], kelas: 3, kategori: ["Semester 6", "MKP"] },
    { nama: "Ekonomi Internasional Islam", dosen: ["Annisa Nur Salam, M.E.", "Fithri Dzikrayah, M.E."], kelas: 3, kategori: ["Semester 6", "MKP"] },
    { nama: "Ekonomi Kreatif & Digital Muslim", dosen: ["Yuda Septia Fitri, M.E.", "Widiawati, M.E."], kelas: 3, kategori: ["Semester 6", "MKP"] },
    { nama: "Ekonomi Sumber Daya Alam & Lingkungan Islam", dosen: ["Prof. Dr. Iwan Setiawan, S.Ag., M.Pd., M.E.Sy.", "Dr. Sofian Al Hakim, M.Ag."], kelas: 3, kategori: ["Semester 6", "MKP"] },
    { nama: "Ekonomi Sumber Daya Insani", dosen: ["Herry Sutanto, M.M.", "Fithri Dzikrayah, M.E."], kelas: 3, kategori: ["Semester 6", "MKP"] },
    { nama: "Ekonomi Politik Islam", dosen: ["Dr. Ahmad Mudzakir, M.Ag."], kelas: 3, kategori: ["Semester 6", "MKP"] },
    // Semester 7
    { nama: "Praktik Kerja Lapangan (PKL) / Magang Industri Keuangan & Halal", dosen: ["Tim Dosen Pembimbing PKL Prodi Ekonomi Syariah"], kelas: 6, kategori: ["Semester 7", "MKL"] },
    { nama: "Seminar Proposal Skripsi", dosen: ["Dr. Evi Sopiah, M.Ag., CIIQA, CIELP", "Anisa Ilmia, M.E.", "Tim Dosen Penguji UP"], kelas: 4, kategori: ["Semester 7", "MKU"] },
    { nama: "Kuliah Kerja Nyata (KKN) Berbasis Pemberdayaan Masyarakat", dosen: ["LP2M & Dosen Pembimbing Lapangan UIN SGD"], kelas: 6, kategori: ["Semester 7", "MKL"] },
    { nama: "Kapita Selekta Ekonomi & Keuangan Syariah", dosen: ["Prof. Dr. H. Ahmad Hasan Ridwan, M.Ag.", "Dr. Muhammad Zaky, M.Si."], kelas: 3, kategori: ["Semester 7", "MKU"] },
    // Semester 8
    { nama: "Skripsi & Sidang Munaqasyah", dosen: ["Tim Dosen Pembimbing & Penguji Skripsi Ekonomi Syariah"], kelas: 6, kategori: ["Semester 8", "MKL"] },
    { nama: "Ujian Komprehensif Ekonomi Syariah & Keislaman", dosen: ["Tim Penguji Komprehensif FEBI UIN SGD"], kelas: 6, kategori: ["Semester 8", "MKL"] },
  ],
  dosen: [
    { nama: "Dr. Evi Sopiah, M.Ag., CIIQA, CIELP", mataKuliah: ["Pengantar Ekonomi Islam", "Industri Halal & Ekowisata Syariah", "Metodologi Penelitian Ekonomi Syariah", "Seminar Proposal Skripsi"] },
    { nama: "Anisa Ilmia, M.E.", mataKuliah: ["Pengantar Ekonomi Islam", "Ekonomi Mikro Islam", "Manajemen ZISWAF", "Seminar Proposal Skripsi"] },
    { nama: "Prof. Dr. H. Dudang Gojali, M.Ag.", mataKuliah: ["Fiqh Muamalah"] },
    { nama: "Prof. Dr. H. Atang Abd. Hakim, M.A.", mataKuliah: ["Ushul Fiqh Ekonomi & Maqashid Syariah", "Sejarah Pemikiran Ekonomi Islam"] },
    { nama: "Prof. Dr. H. Ahmad Hasan Ridwan, M.Ag.", mataKuliah: ["Filsafat Ekonomi Syariah", "Manajemen ZISWAF", "Kapita Selekta Ekonomi & Keuangan Syariah"] },
    { nama: "Dr. H. Muhammad Hasanuddin, M.Ag.", mataKuliah: ["Fiqh Muamalah", "Industri Halal & Ekowisata Syariah", "Metodologi Penelitian Ekonomi Syariah"] },
    { nama: "Dr. H. Endang Jumali, Lc., M.Si., M.Ak.", mataKuliah: ["Pengantar Akuntansi", "Akuntansi Syariah", "Akuntansi Perbankan Syariah", "Analisis Laporan Keuangan Syariah", "Audit Syariah & Tata Kelola LKS"] },
    { nama: "Dr. H. Abdullah Safe'i, M.Ag.", mataKuliah: ["Ulumul Qur'an & Hadis Ekonomi", "Ushul Fiqh Ekonomi & Maqashid Syariah", "Filsafat Ekonomi Syariah", "Etika Bisnis Syariah", "Bahasa Arab Ekonomi I"] },
    { nama: "Suteja Wira Dana Kusuma, M.E.", mataKuliah: ["Pengantar Ilmu Ekonomi (Mikro & Makro)", "Ekonomi Makro Islam", "Ekonomi Moneter Islam", "Pasar Modal Syariah", "Statistika Ekonomi I", "Ekonometrika", "Kebijakan Fiskal & Moneter Islam"] },
    { nama: "Reza Fauzi Nazar, M.E.", mataKuliah: ["Bank & Lembaga Keuangan Syariah", "Manajemen Keuangan Syariah", "Fintech Syariah & Ekonomi Digital"] },
    { nama: "Depid Ismail, M.E.Sy.", mataKuliah: ["Pengantar Ilmu Ekonomi (Mikro & Makro)", "Ekonomi Mikro Islam", "Kewirausahaan Syariah & Inkubasi Bisnis Halal"] },
    { nama: "Nabiela Rizki Alifa, M.E.", mataKuliah: ["Matematika Ekonomi", "Ekonomi Pembangunan Islam", "Statistika Ekonomi I", "Statistika Ekonomi Lanjutan", "Ekonometrika", "Bahasa Inggris Ekonomi"] },
    { nama: "Zia Sidqurrahman, M.E.", mataKuliah: ["Matematika Ekonomi", "Manajemen Keuangan Syariah", "Pasar Modal Syariah", "Asuransi Syariah (Takaful)", "Analisis Laporan Keuangan Syariah"] },
    { nama: "Annisa Nur Salam, M.E.", mataKuliah: ["Ekonomi Makro Islam", "Ekonomi Moneter Islam", "Kebijakan Fiskal & Moneter Islam", "Ekonomi Internasional Islam"] },
    { nama: "Dr. Dedi Suyandi, M.Ag.", mataKuliah: ["Ulumul Qur'an & Hadis Ekonomi", "Sejarah Pemikiran Ekonomi Islam", "Manajemen ZISWAF"] },
    { nama: "Yuda Septia Fitri, M.E.", mataKuliah: ["Kewirausahaan Syariah & Inkubasi Bisnis Halal", "Etika Bisnis Syariah", "Ekonomi Kreatif & Digital Muslim"] },
    { nama: "Herry Sutanto, M.M.", mataKuliah: ["Pengantar Manajemen & Bisnis", "Manajemen Perbankan Syariah", "Ekonomi Sumber Daya Insani"] },
    { nama: "Widiawati, M.E.", mataKuliah: ["Fintech Syariah & Ekonomi Digital", "Ekonomi Kreatif & Digital Muslim"] },
    { nama: "Ramadhani Irma Tripalupi, M.E.", mataKuliah: ["Asuransi Syariah (Takaful)"] },
    { nama: "Dr. Sofian Al Hakim, M.Ag.", mataKuliah: ["Industri Halal & Ekowisata Syariah", "Ekonomi Sumber Daya Alam & Lingkungan Islam"] },
    { nama: "Prof. Dr. Iwan Setiawan, S.Ag., M.Pd., M.E.Sy.", mataKuliah: ["Ekonomi Pembangunan Islam", "Ekonomi Sumber Daya Alam & Lingkungan Islam"] },
    { nama: "Dr. Neneng Hartati, M.Ag.", mataKuliah: ["Bank & Lembaga Keuangan Syariah", "Manajemen Perbankan Syariah"] },
    { nama: "Dr. Ahmad Mudzakir, M.Ag.", mataKuliah: ["Ekonomi Politik Islam", "Bahasa Arab Ekonomi I"] },
    { nama: "Agus Joharudin, M.E.", mataKuliah: ["Pengantar Akuntansi", "Akuntansi Syariah"] },
    { nama: "Fithri Dzikrayah, M.E.", mataKuliah: ["Ekonomi Internasional Islam", "Ekonomi Sumber Daya Insani", "Bahasa Inggris Ekonomi"] },
  ],
};

export async function getAkademik(): Promise<AkademikSync | null> {
  const parsed = akademikSchema.safeParse(
    await getSiteSetting(AKADEMIK_KEY).catch(() => null),
  );
  if (parsed.success && parsed.data.mataKuliah.length > 0) {
    // Gabungkan data mata kuliah kurikulum Semester 1-8 default dengan hasil sinkron e-Knows
    const seenMk = new Set<string>();
    const mergedMk = [...defaultAkademikSync.mataKuliah];
    for (const m of mergedMk) {
      seenMk.add(m.nama.toLowerCase().trim());
    }
    for (const m of parsed.data.mataKuliah) {
      const k = m.nama.toLowerCase().trim();
      if (!seenMk.has(k)) {
        mergedMk.push(m);
        seenMk.add(k);
      }
    }

    const seenDosen = new Set<string>();
    const mergedDosen = [...defaultAkademikSync.dosen];
    for (const d of mergedDosen) {
      seenDosen.add(d.nama.toLowerCase().trim());
    }
    for (const d of parsed.data.dosen) {
      const k = d.nama.toLowerCase().trim();
      if (!seenDosen.has(k)) {
        mergedDosen.push(d);
        seenDosen.add(k);
      }
    }

    return {
      at: parsed.data.at || defaultAkademikSync.at,
      pages: Math.max(parsed.data.pages, defaultAkademikSync.pages),
      errors: parsed.data.errors,
      mataKuliah: mergedMk,
      dosen: mergedDosen,
    };
  }
  return defaultAkademikSync;
}
