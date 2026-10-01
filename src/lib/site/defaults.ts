import {
  beasiswa,
  bidangKajian,
  timeline,
  capaianPembelajaran,
  dosen,
  faq,
  fasilitas,
  hero,
  jalurMasuk,
  kegiatanMahasiswa,
  kelompokMataKuliah,
  kontak,
  kurikulum,
  misi,
  mitra,
  pimpinan,
  prestasi,
  prodi,
  profilLulusan,
  prospekKarir,
  sejarah,
  sorotan,
  tujuan,
  visi,
} from "./prodi";
import type { WebsiteConfig } from "./schema";

/** Isi awal website sebelum admin menyimpan perubahan dari CMS. */
export const defaultWebsiteConfig: WebsiteConfig = {
  identity: {
    heroTitle: hero.title,
    heroDescription: hero.description,
    heroImage: hero.image,
    statement:
      "Program Studi Ekonomi Syariah mempelajari ekonomi dengan prinsip syariah: perbankan dan keuangan syariah, zakat dan wakaf, pasar modal syariah, hingga industri halal. Mahasiswa belajar langsung bersama bursa, perbankan, dan regulator mitra prodi.",
    tagline: prodi.tagline,
    degree: prodi.degree,
    totalCredits: prodi.totalCredits,
    normalDuration: prodi.normalDuration,
    maxSemesters: prodi.maxSemesters,
    prodiAccreditation: prodi.prodiAccreditation ?? "",
    universityAccreditation: prodi.universityAccreditation,
    universityAccreditationPeriod: prodi.universityAccreditationPeriod,
  },
  profil: { sejarah, visi, misi, tujuan },
  pimpinan: pimpinan.map((p) => ({ name: p.name, role: p.role, photo: null })),
  dosen: dosen.map((d) => ({
    name: d.name,
    role: d.role,
    photo: null,
    expertise: d.expertise,
  })),
  prestasi: prestasi.map((p) => ({
    name: p.name,
    achievement: p.achievement,
    group: p.group,
    photo: null,
  })),
  kegiatan: sorotan.map((k) => ({ ...k, image: null })),
  bidangKajian,
  kelompokMataKuliah,
  kurikulum,
  profilLulusan,
  capaianPembelajaran,
  prospekKarir,
  kegiatanMahasiswa,
  beasiswa,
  timeline,
  mitra,
  tendik: [],
  galeri: [],
  video: [],
  publikasi: [
    {
      title:
        "Pengaruh pengetahuan dan religiusitas terhadap niat usaha mikro dan kecil penerima program Sertifikasi Halal Gratis (SEHATI) 2025 di Jawa Barat",
      authors: "Evi Sopiah, dkk.",
      year: "",
      venue: "JEMSI (Jurnal Ekonomi, Manajemen, dan Akuntansi) Vol. 12 No. 2",
      type: "Artikel jurnal",
      url: "",
    },
    {
      title:
        "Pengaruh Diskon dan Voucher Terhadap Keputusan Konsumen untuk Melakukan Pembelian Produk Fashion di Market Place",
      authors: "Evi Sopiah, dkk.",
      year: "",
      venue: "",
      type: "Artikel jurnal",
      url: "",
    },
  ],
  jurnal: [
    {
      name: "Al-Muamalat: Jurnal Ekonomi Syariah",
      description:
        "Jurnal Jurusan Hukum Ekonomi Syariah FSH UIN SGD: ekonomi Islam, keuangan Islam, inovasi bisnis Islam, dan hukum ekonomi Islam.",
      url: "https://journal.uinsgd.ac.id/index.php/mua",
    },
    {
      name: "LOBI: Jurnal Laboratorium FEBI",
      description:
        "Terbitan Laboratorium FEBI UIN SGD (Maret & September) yang memuat hasil kajian, penelitian, dan pengabdian di bidang ekonomi, manajemen, dan bisnis Islam.",
      url: "https://journal.uinsgd.ac.id/",
    },
    {
      name: "Rumah Jurnal UIN SGD",
      description:
        "Portal seluruh jurnal ilmiah UIN Sunan Gunung Djati Bandung.",
      url: "https://ejournal.uinsgd.ac.id/",
    },
  ],
  testimoni: [],
  // Sumber: uinsgd.ac.id (jadwal UKT) dan Kalender Akademik UIN SGD 2026/2027.
  kalender: [
    {
      mulai: "2026-07-06",
      selesai: "2026-08-14",
      kegiatan: "Pembayaran UKT mahasiswa lama semester ganjil 2026/2027",
      kategori: "Administrasi",
      sumber:
        "https://uinsgd.ac.id/jadwal-pembayaran-ukt-mahasiswa-lama-semester-ganjil-2026-2027/",
    },
    {
      mulai: "2026-08-15",
      selesai: "2026-08-28",
      kegiatan: "Perpanjangan pembayaran UKT semester ganjil 2026/2027",
      kategori: "Administrasi",
      sumber:
        "https://uinsgd.ac.id/perpanjangan-jadwal-pembayaran-ukt-mahasiswa-lama-semester-ganjil-2026-2027/",
    },
    {
      mulai: "2026-08-31",
      selesai: "2026-09-04",
      kegiatan: "Awal perkuliahan semester ganjil 2026/2027",
      kategori: "Perkuliahan",
      sumber: "https://uinsgd.ac.id/ingat-kalender-akademik-2026-2027/",
    },
  ],
  prosedur: [],
  aksesCepat: [
    {
      name: "SALAM",
      description: "KRS, nilai, tagihan UKT, dan administrasi akademik.",
      url: "https://simak.uinsgd.ac.id/beranda/",
    },
    {
      name: "e-Knows",
      description: "Kelas daring dan materi kuliah.",
      url: "https://eknows.uinsgd.ac.id",
    },
    {
      name: "Digital Library",
      description: "Repositori skripsi dan karya ilmiah UIN SGD.",
      url: "https://digilib.uinsgd.ac.id",
    },
    {
      name: "Kalender Akademik 2026/2027",
      description: "Dokumen resmi kalender akademik UIN SGD.",
      url: "https://s.id/KalenderAkademik2026_2027",
    },
    {
      name: "Tata cara pembayaran UKT",
      description: "Langkah membayar UKT lewat SALAM dan bank mitra.",
      url: "https://uinsgd.ac.id/tata-cara-pembayaran-ukt/",
    },
    {
      name: "Career Development Center",
      description: "Info karier, lowongan, dan tracer study.",
      url: "https://cdc.uinsgd.ac.id/tracer_study/",
    },
    {
      name: "Rumah Jurnal",
      description: "Portal jurnal ilmiah UIN SGD.",
      url: "https://ejournal.uinsgd.ac.id/",
    },
    {
      name: "PMB UIN SGD",
      description: "Pendaftaran mahasiswa baru.",
      url: "https://pmb.uinsgd.ac.id",
    },
  ],
  infoMaba: [
    {
      name: "Tarif UKT mahasiswa baru 2026/2027",
      description:
        "Informasi resmi tarif Uang Kuliah Tunggal dari panitia PMB UIN SGD.",
      url: "https://pmb.uinsgd.ac.id/2026/04/14/informasi-tarif-uang-kuliah-tunggal-ukt-mahasiswa-baru-uin-sunan-gunung-djati-bandung-tahun-akademik-2026-2027/",
    },
    {
      name: "Tata cara pembayaran UKT",
      description:
        "Bayar lewat SALAM (menu Keuangan → Tagihan UKT) di bank mitra UIN SGD.",
      url: "https://uinsgd.ac.id/tata-cara-pembayaran-ukt/",
    },
    {
      name: "Portal PMB UIN SGD",
      description: "Jadwal, jalur, dan pendaftaran.",
      url: "https://pmb.uinsgd.ac.id",
    },
  ],
  banner: { aktif: false, teks: "", url: "" },
  mutu: {
    description:
      "Penjaminan mutu prodi mengikuti Sistem Penjaminan Mutu Internal (SPMI) UIN SGD. Visi, misi, dan kurikulum ditinjau berkala bersama asosiasi program studi, regulator, praktisi industri, alumni, dan mahasiswa.",
    surveiUrl: "",
    tracerUrl: "https://cdc.uinsgd.ac.id/tracer_study/",
    sebaranUrl: "https://cdc.uinsgd.ac.id/tracer_study/sebaran_alumni",
  },
  fasilitas: fasilitas.map((f) => ({ ...f, image: null })),
  jalurMasuk,
  unduhan: [
    {
      title: "Kalender Akademik UIN SGD 2026/2027",
      category: "Akademik",
      description: "Dokumen resmi kalender akademik tahun 2026/2027.",
      url: "https://s.id/KalenderAkademik2026_2027",
    },
    {
      title: "Sertifikat Akreditasi UIN Sunan Gunung Djati Bandung 2024–2029",
      category: "Akreditasi",
      description: "Akreditasi institusi peringkat Unggul dari BAN-PT.",
      url: "https://ppg.uinsgd.ac.id/wp-content/uploads/2024/11/Sertifikat-Akreditasi-UIN-Bandung-2024-2029.pdf",
    },
  ],
  faq,
  kontak: {
    address: kontak.address,
    street: kontak.street,
    email: kontak.email,
    hours: kontak.hours,
    instagram: kontak.instagram,
    instagramHandle: kontak.instagramHandle,
    tiktok: kontak.tiktok,
    x: kontak.x,
    facebookName: "eksyar uin sgd",
    linktree: kontak.linktree,
    website: prodi.officialSite,
    pmbUrl: kontak.pmbUrl,
    mapsUrl: kontak.mapsUrl,
    whatsapp: "",
  },
};
