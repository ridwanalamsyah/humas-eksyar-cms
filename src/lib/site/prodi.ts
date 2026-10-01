/**
 * Identitas tetap + DATA AWAL (seed) website publik prodi (/prodi).
 *
 * Konten yang tampil di website diatur admin dari CMS (Settings → Website)
 * dan disimpan di database. Data di file ini hanya dipakai sebagai isi awal
 * sebelum admin menyimpan perubahan pertama — lihat `lib/site/defaults.ts`.
 *
 * Profil Program Studi Ekonomi Syariah untuk website publik (/prodi).
 *
 * Konten dinamis (berita & agenda) diambil dari CMS lewat data provider.
 * Data di file ini adalah profil yang jarang berubah — edit langsung di sini.
 *
 * Sumber data terverifikasi (riset publik, 2024–2026):
 * - Kaprodi, Sekprodi, kegiatan prodi: berita resmi uinsgd.ac.id
 * - 148 SKS, kelompok MKU/MKP/MKL, maks. 14 semester: es.uinsgd.ac.id/overview
 * - Akreditasi institusi UIN SGD "Unggul" (BAN-PT, 2024–2029)
 *
 * Yang ditandai `TODO` belum bisa diverifikasi dari sumber publik —
 * cocokkan dengan dokumen resmi prodi sebelum go-live.
 */

export const prodi = {
  name: "Ekonomi Syariah",
  fullName: "Program Studi Ekonomi Syariah",
  shortName: "Eksyar",
  degree: "Sarjana Ekonomi (S.E.)",
  level: "S1",
  faculty: "Fakultas Ekonomi dan Bisnis Islam",
  facultyShort: "FEBI",
  university: "UIN Sunan Gunung Djati Bandung",
  universityShort: "UIN SGD Bandung",
  tagline: "Eksyar Satu, Victory in Harmony!",
  paradigm: "Wahyu Memandu Ilmu dalam Bingkai Akhlak Karimah",
  totalCredits: 148,
  maxSemesters: 14,
  normalDuration: "8 semester",
  // TODO: isi peringkat & SK akreditasi prodi (BAN-PT / LAMEMBA).
  prodiAccreditation: null as string | null,
  universityAccreditation: "Unggul",
  universityAccreditationPeriod: "2024–2029",
  officialSite: "https://es.uinsgd.ac.id",
  // TODO: ganti dengan file logo resmi beresolusi tinggi (saat ini diambil dari avatar IG).
  logo: "/prodi/logo-eksyar.png",
};

export const hero = {
  greeting: "Selamat datang di",
  title: "Ekonomi Syariah",
  description:
    "Belajar ilmu ekonomi modern berlandaskan prinsip muamalah Islam, untuk karir di keuangan syariah, industri halal, filantropi, dan riset kebijakan.",
  /**
   * Foto utama beranda (mis. "/prodi/hero.jpg" di folder public, atau URL
   * dari Media Library CMS). Kosongkan untuk memakai kartu sorotan.
   */
  image: null as string | null,
  imageAlt:
    "Mahasiswa Program Studi Ekonomi Syariah UIN Sunan Gunung Djati Bandung",
};

export const pimpinan = [
  {
    name: "Prof. Dr. H. Dudang Gojali, M.Ag.",
    role: "Dekan Fakultas Ekonomi dan Bisnis Islam",
    initials: "DG",
  },
  {
    name: "Dr. Evi Sopiah, M.Ag., CIIQA, CIELP",
    role: "Ketua Program Studi Ekonomi Syariah",
    initials: "ES",
  },
  {
    name: "Anisa Ilma, M.E.",
    role: "Sekretaris Program Studi Ekonomi Syariah",
    initials: "AI",
  },
];

export const sambutan = {
  name: "Dr. Evi Sopiah, M.Ag.",
  role: "Ketua Program Studi Ekonomi Syariah",
};

// TODO: ganti dengan rumusan visi, misi, dan tujuan resmi hasil FGD prodi.
export const visi =
  "Menjadi program studi Ekonomi Syariah yang unggul dan kompetitif dalam pengembangan ilmu ekonomi Islam berlandaskan paradigma wahyu memandu ilmu dalam bingkai akhlak karimah di tingkat nasional dan internasional.";

export const misi = [
  "Menyelenggarakan pendidikan ekonomi syariah yang integratif, adaptif terhadap perkembangan teknologi, dan relevan dengan kebutuhan dunia kerja.",
  "Mengembangkan penelitian ekonomi dan keuangan syariah yang menjawab persoalan umat dan mendukung perumusan kebijakan.",
  "Melaksanakan pengabdian kepada masyarakat melalui pemberdayaan ekonomi umat, literasi keuangan syariah, dan penguatan ekosistem halal.",
  "Membangun kerja sama dengan lembaga keuangan, industri halal, pemerintah, asosiasi, dan perguruan tinggi di dalam maupun luar negeri.",
];

export const tujuan = [
  "Menghasilkan sarjana ekonomi syariah yang berakhlak karimah, profesional, dan berdaya saing.",
  "Menghasilkan karya ilmiah ekonomi syariah yang bermanfaat dan terpublikasi.",
  "Menghasilkan program pengabdian yang berdampak pada kesejahteraan masyarakat.",
  "Terwujudnya jejaring kemitraan strategis yang mendukung tridarma perguruan tinggi.",
];

export const sejarah = [
  "Program Studi Ekonomi Syariah merupakan bagian dari Fakultas Ekonomi dan Bisnis Islam (FEBI) UIN Sunan Gunung Djati Bandung. Rintisan pendirian FEBI dimulai sejak 2003 sebagai tindak lanjut kajian intensif Konsorsium Keilmuan, lalu berkembang melalui fase perintisan, persiapan, percepatan, hingga pendirian fakultas.",
  "Kini FEBI menaungi program studi Ekonomi Syariah, Akuntansi Syariah, Manajemen, dan Manajemen Keuangan Syariah. Program Studi Ekonomi Syariah berfokus pada pengembangan ilmu ekonomi berbasis prinsip syariah untuk menjawab kebutuhan tenaga ahli ekonomi Islam di tengah globalisasi dan pesatnya perkembangan ekonomi.",
];

export const faktaSingkat = [
  { value: "148", unit: "SKS", label: "Beban studi sarjana" },
  { value: "8", unit: "Semester", label: "Masa studi normal" },
  { value: "3", unit: "Kelompok", label: "MKU · MKP · MKL" },
  { value: "Unggul", unit: "", label: "Akreditasi institusi UIN SGD" },
];

export const kelompokMataKuliah = [
  {
    code: "MKU",
    title: "Mata Kuliah Keahlian Utama",
    description:
      "Inti keilmuan ekonomi syariah: teori ekonomi mikro & makro Islam, fiqh muamalah, keuangan dan perbankan syariah, serta metodologi riset ekonomi.",
  },
  {
    code: "MKP",
    title: "Mata Kuliah Keahlian Pendukung",
    description:
      "Penunjang kompetensi: akuntansi, statistika & ekonometrika, manajemen, kewirausahaan, serta teknologi keuangan.",
  },
  {
    code: "MKL",
    title: "Mata Kuliah Kompetensi Lainnya",
    description:
      "Penguatan karakter dan wawasan: studi keislaman, bahasa, kewarganegaraan, KKN, magang, dan tugas akhir.",
  },
];

export const bidangKajian = [
  {
    title: "Perbankan & Keuangan Syariah",
    description:
      "Operasional bank syariah, pasar modal syariah, asuransi syariah, manajemen risiko, dan fintech.",
  },
  {
    title: "Ekonomi Sosial Islam (ZISWAF)",
    description:
      "Zakat, infak, sedekah, dan wakaf produktif sebagai instrumen pemberdayaan dan pengentasan kemiskinan.",
  },
  {
    title: "Industri & Bisnis Halal",
    description:
      "Rantai pasok halal, sertifikasi halal UMK, kewirausahaan syariah, dan pemasaran produk halal.",
  },
  {
    title: "Kebijakan & Pembangunan",
    description:
      "Ekonomi pembangunan Islam, kebijakan fiskal & moneter, serta analisis data ekonomi.",
  },
];

export type KurikulumYear = {
  label: string;
  semesters: { name: string; courses: string[] }[];
};

// TODO: sesuaikan dengan struktur kurikulum resmi (dokumen kurikulum prodi).
export const kurikulum: KurikulumYear[] = [
  {
    label: "Tahun I",
    semesters: [
      {
        name: "Semester 1",
        courses: [
          "Pengantar Ekonomi Islam",
          "Pengantar Ilmu Ekonomi",
          "Matematika Ekonomi",
          "Ulumul Qur'an & Hadis",
          "Bahasa Arab",
          "Pancasila & Kewarganegaraan",
        ],
      },
      {
        name: "Semester 2",
        courses: [
          "Fiqh Muamalah",
          "Pengantar Akuntansi",
          "Statistika Ekonomi",
          "Pengantar Manajemen",
          "Bahasa Inggris",
          "Sejarah Pemikiran Ekonomi Islam",
        ],
      },
    ],
  },
  {
    label: "Tahun II",
    semesters: [
      {
        name: "Semester 3",
        courses: [
          "Ekonomi Mikro Islam",
          "Akuntansi Syariah",
          "Bank & Lembaga Keuangan Syariah",
          "Ushul Fiqh Ekonomi",
          "Manajemen Keuangan Syariah",
        ],
      },
      {
        name: "Semester 4",
        courses: [
          "Ekonomi Makro Islam",
          "Ekonometrika",
          "Manajemen ZISWAF",
          "Pasar Modal Syariah",
          "Etika Bisnis Islam",
        ],
      },
    ],
  },
  {
    label: "Tahun III",
    semesters: [
      {
        name: "Semester 5",
        courses: [
          "Ekonomi Pembangunan Islam",
          "Asuransi Syariah",
          "Industri Halal",
          "Metodologi Penelitian Ekonomi",
          "Mata Kuliah Pilihan",
        ],
      },
      {
        name: "Semester 6",
        courses: [
          "Kebijakan Fiskal & Moneter Islam",
          "Fintech Syariah",
          "Kewirausahaan Syariah",
          "Seminar Proposal",
          "Mata Kuliah Pilihan",
        ],
      },
    ],
  },
  {
    label: "Tahun IV",
    semesters: [
      {
        name: "Semester 7",
        courses: [
          "Praktik Kerja Lapangan / Magang",
          "Kuliah Kerja Nyata",
          "Mata Kuliah Pilihan",
        ],
      },
      { name: "Semester 8", courses: ["Skripsi", "Ujian Komprehensif"] },
    ],
  },
];

export const profilLulusan = [
  {
    title: "Praktisi Keuangan Syariah",
    description:
      "Mampu menjalankan operasional, analisis pembiayaan, dan pengembangan produk di lembaga keuangan syariah.",
  },
  {
    title: "Pengelola Filantropi Islam",
    description:
      "Mampu merancang dan mengelola program zakat, infak, sedekah, dan wakaf secara profesional dan akuntabel.",
  },
  {
    title: "Wirausaha & Pelaku Industri Halal",
    description:
      "Mampu membangun dan mengembangkan usaha berbasis prinsip syariah serta ekosistem halal.",
  },
  {
    title: "Peneliti & Analis Ekonomi",
    description:
      "Mampu melakukan riset dan analisis kebijakan ekonomi Islam berbasis data dan metodologi ilmiah.",
  },
];

export const capaianPembelajaran = [
  {
    title: "Sikap",
    description:
      "Bertakwa, berakhlak karimah, jujur, dan menjunjung etika bisnis Islam dalam setiap aktivitas ekonomi.",
  },
  {
    title: "Pengetahuan",
    description:
      "Menguasai teori ekonomi konvensional dan Islam, fiqh muamalah, serta sistem keuangan syariah.",
  },
  {
    title: "Keterampilan Umum",
    description:
      "Berpikir kritis, sistematis, dan inovatif; mampu berkomunikasi dan bekerja dalam tim lintas disiplin.",
  },
  {
    title: "Keterampilan Khusus",
    description:
      "Mampu menganalisis masalah ekonomi dan keuangan dengan pendekatan syariah serta merumuskan solusi aplikatif.",
  },
];

export const prospekKarir = [
  {
    title: "Bankir Syariah",
    description: "Bank umum syariah, unit usaha syariah, dan BPR syariah.",
  },
  {
    title: "Analis Keuangan & Investasi",
    description: "Sekuritas, manajer investasi, dan pasar modal syariah.",
  },
  {
    title: "Auditor & Pengawas Syariah",
    description: "Kantor akuntan, dewan pengawas syariah, dan lembaga audit.",
  },
  {
    title: "Amil & Manajer Filantropi",
    description: "BAZNAS, LAZ, badan wakaf, dan program CSR korporasi.",
  },
  {
    title: "Regulator & ASN",
    description:
      "OJK, Bank Indonesia, Kementerian Agama, dan instansi ekonomi.",
  },
  {
    title: "Wirausaha & Konsultan Halal",
    description: "UMKM, startup, dan pendampingan sertifikasi halal.",
  },
  {
    title: "Peneliti & Akademisi",
    description: "Dosen, peneliti, dan analis kebijakan ekonomi Islam.",
  },
  {
    title: "Profesional Fintech Syariah",
    description:
      "Produk, kepatuhan syariah, dan riset di industri teknologi finansial.",
  },
];

/**
 * Sorotan kegiatan yang sudah diberitakan media resmi kampus. Ditampilkan
 * di beranda saat CMS belum punya konten `published`, dan di halaman
 * Kemahasiswaan.
 */
export const sorotan = [
  {
    date: "2026-08-04",
    category: "Pengabdian",
    title: "Keluarga Cerdas Lawan Judol & Pinjol lewat Investasi Syariah",
    summary:
      "Galeri Investasi Syariah BEI FEBI mengedukasi Tim Penggerak PKK Kelurahan Padasuka tentang bahaya judi online dan pinjol ilegal, perencanaan keuangan keluarga, serta investasi syariah.",
    source:
      "https://uinsgd.ac.id/dorong-keluarga-lawan-judol-dan-pinjol-lewat-investasi-syariah-gis-uin-bandung-edukasi-pkk-padasuka/",
  },
  {
    date: "2026-06-08",
    category: "Akademik",
    title: "Sekolah Pasar Modal Syariah 2026 di IDX Jawa Barat",
    summary:
      "115 mahasiswa semester enam Ekonomi Syariah belajar konsep pasar modal syariah, instrumen investasi, hingga pengelolaan portofolio di Kantor Perwakilan BEI Jawa Barat.",
    source:
      "https://uinsgd.ac.id/spms-2026-di-idx-jabar-mahasiswa-ekonomi-syariah-didorong-melek-investasi-islam/",
  },
  {
    date: "2026-09-24",
    category: "Pengabdian",
    title: "Literasi Digitalisasi Keuangan Syariah & Pengelolaan Aset Masjid",
    summary:
      "Program pengabdian kepada masyarakat menuju tata kelola aset masjid yang akuntabel, bekerja sama dengan Bank Indonesia dan Bank Muamalat.",
    source: "https://www.instagram.com/eksyaruinsgd/",
  },
  {
    date: "2026-06-19",
    category: "Karir",
    title: "Seminar Karir 2026",
    summary:
      "“Menjadi SDM Unggul dan Kompetitif dalam Industri Keuangan Syariah” — menghadirkan Dekan FEBI, Kaprodi, dan praktisi Bank Muamalat di Aula FEBI Kampus 2.",
    source: "https://www.instagram.com/eksyaruinsgd/",
  },
  {
    date: "2026-04-15",
    category: "Akademik",
    title: "Kuliah Bersama Praktisi Bank Muamalat",
    summary:
      "120 mahasiswa semester enam belajar langsung dari praktisi Bank Muamalat Indonesia di KCP Buahbatu tentang operasional bank syariah, layanan nasabah, dan peluang industri keuangan syariah di era digital.",
    source:
      "https://uinsgd.ac.id/tingkatkan-wawasan-prodi-ekonomi-syariah-uin-bandung-gelar-kuliah-bersama-praktisi-bank-muamalat/",
  },
  {
    date: "2026-04-08",
    category: "Pengabdian",
    title: "Sertifikasi Juru Sembelih Halal di Cibiru Wetan",
    summary:
      "Sertifikat Juru Sembelih Halal (Juleha) diserahkan kepada 15 warga Desa Cibiru Wetan yang mengikuti pelatihan berbasis SKKNI pada November 2025. Program pengabdian ini memperkuat ekosistem halal di tingkat desa.",
    source:
      "https://uinsgd.ac.id/prodi-ekonomi-syariah-uin-bandung-serahkan-sertifikat-juleha-di-cibiru-wetan/",
  },
  {
    date: "2024-04-25",
    category: "Penjaminan Mutu",
    title: "FGD Penyusunan Visi Misi & Review Kurikulum",
    summary:
      "Prodi melibatkan asosiasi program studi, OJK, praktisi industri, alumni, dan mahasiswa untuk meninjau visi, misi, dan kurikulum menuju akreditasi unggul.",
    source:
      "https://uinsgd.ac.id/tingkatkan-kualitas-prodi-ekonomi-syariah-gelar-fgd-penyusunan-visi-misi-dan-review-kurikulum/",
  },
];

/** Apresiasi "Selamat & Sukses" dari feed IG @eksyaruinsgd. */
// TODO: cek ejaan nama & tambahkan foto (field `photo`) bila ada izin.
export const prestasi = [
  {
    name: "Dr. H. Endang Jumali, Lc., M.Si., M.Ak.",
    initials: "EJ",
    achievement: "Artikel terbit di jurnal internasional terindeks Scopus Q2",
    group: "Dosen",
  },
  {
    name: "Hakiki Ramadhan",
    initials: "HR",
    achievement: "Tulisan dimuat di Islamic Finance News (IFN)",
    group: "Eksyar Appreciation",
  },
  {
    name: "Muhammad Azzam Abdillah",
    initials: "MA",
    achievement: "Juara 1 Bandung Open Tournament Pencak Silat",
    group: "Mahasiswa",
  },
  {
    name: "Muhamad Halabi Muzaini",
    initials: "HM",
    achievement: "Ketua DEMA Fakultas Ekonomi dan Bisnis Islam 2026",
    group: "Mahasiswa",
  },
  {
    name: "Raditya Fitra",
    initials: "RF",
    achievement: "Wakil Ketua DEMA Universitas 2026",
    group: "Mahasiswa",
  },
];

/**
 * Mitra kerja sama prodi/fakultas yang tercatat di pemberitaan resmi UIN SGD
 * dan akun Instagram prodi. Tambah atau ubah lewat CMS.
 */
export const mitra = [
  {
    name: "Bursa Efek Indonesia",
    description:
      "Galeri Investasi Syariah BEI FEBI (bersama MNC Sekuritas, 2021) dan Sekolah Pasar Modal Syariah.",
    url: "https://www.idx.co.id/",
  },
  {
    name: "Bank Muamalat Indonesia",
    description:
      "Kuliah praktisi, seminar karir, dan kesempatan magang di jaringan kantor cabang.",
    url: "https://www.bankmuamalat.co.id/",
  },
  {
    name: "Bank Indonesia Jawa Barat",
    description:
      "Kolaborasi edukasi ekonomi syariah dan program Beasiswa Bank Indonesia.",
    url: "https://www.bi.go.id/",
  },
  {
    name: "bank bjb syariah",
    description:
      "Perjanjian kerja sama Program Duta Maslahah dengan UIN SGD (Agustus 2025).",
    url: "https://www.bjbsyariah.co.id/",
  },
  {
    name: "Otoritas Jasa Keuangan",
    description:
      "Narasumber FGD kurikulum dan seminar literasi keuangan syariah.",
    url: "https://www.ojk.go.id/",
  },
  {
    name: "BAZNAS",
    description: "UIN SGD termasuk kampus mitra Beasiswa Cendekia BAZNAS.",
    url: "https://baznas.go.id/",
  },
  {
    name: "Bank Tabungan Negara",
    description: "Mitra kerja sama UIN Sunan Gunung Djati Bandung.",
    url: "https://www.btn.co.id/",
  },
];

export const kegiatanMahasiswa = [
  {
    title: "Kajian & Diskusi Ekonomi Islam",
    description:
      "Forum rutin membedah isu ekonomi dan keuangan syariah terkini.",
  },
  {
    title: "Kompetisi Nasional",
    description:
      "Pendampingan lomba business plan, esai, debat, dan karya tulis ilmiah.",
  },
  {
    title: "Kuliah Praktisi & Kunjungan Industri",
    description:
      "Belajar langsung dari bank syariah, regulator, dan pelaku industri halal.",
  },
  {
    title: "Pengabdian Masyarakat",
    description:
      "Literasi keuangan syariah, pendampingan UMKM, dan program halal di desa binaan.",
  },
];

/**
 * Beasiswa yang tersedia bagi mahasiswa UIN SGD (sumber: uinsgd.ac.id,
 * beasiswa.uinsgd.ac.id, BAZNAS — 2026). Periode berubah tiap tahun: perbarui
 * lewat CMS setiap ada pengumuman baru.
 */
export const beasiswa = [
  {
    name: "KIP Kuliah",
    provider: "Pemerintah (Kemenag)",
    period: "26 Agustus – 13 September 2026 (mahasiswa baru)",
    description:
      "Bantuan biaya pendidikan dan biaya hidup bagi mahasiswa baru dari keluarga kurang mampu yang berprestasi.",
    requirements: [
      "Mahasiswa baru UIN SGD tahun akademik 2026/2027",
      "Kartu KIP / KKS / SKTM dan data desil",
      "Rapor semester 1–6 dan ijazah/SKL dilegalisir",
      "Bukti penghasilan orang tua & pembayaran listrik",
    ],
    url: "https://beasiswa.uinsgd.ac.id",
  },
  {
    name: "Beasiswa Cendekia BAZNAS",
    provider: "BAZNAS RI",
    period: "9 – 27 September 2026",
    description:
      "Beasiswa bagi mahasiswa S1 semester 5 kategori prestasi, aktivis, atau disabilitas; UIN SGD termasuk kampus mitra.",
    requirements: [
      "Mahasiswa S1 semester 5",
      "IPK minimal 3,00",
      "Kategori prestasi, aktivis, atau disabilitas",
      "Esai & surat rekomendasi",
    ],
    url: "https://uinsgd.ac.id/beasiswa-cendekia-baznas-2026-telah-dibuka/",
  },
  {
    name: "Beasiswa Bank Indonesia (GenBI)",
    provider: "Bank Indonesia",
    period: "Mengikuti pengumuman kampus",
    description:
      "Bantuan bulanan, pelatihan kepemimpinan, dan komunitas Generasi Baru Indonesia (GenBI) — relevan untuk mahasiswa ekonomi syariah.",
    requirements: ["Diumumkan melalui portal beasiswa UIN SGD"],
    url: "https://beasiswa.uinsgd.ac.id",
  },
  {
    name: "Djarum Beasiswa Plus",
    provider: "Djarum Foundation",
    period: "Pendaftaran daring (biasanya Maret – Mei)",
    description:
      "Dana pendidikan bulanan selama satu tahun disertai pelatihan soft skill.",
    requirements: ["Diumumkan melalui portal beasiswa UIN SGD"],
    url: "https://beasiswa.uinsgd.ac.id",
  },
  {
    name: "Beasiswa Prestasi & Tahfidz",
    provider: "UIN Sunan Gunung Djati Bandung",
    period: "Mengikuti pengumuman kampus",
    description:
      "Untuk mahasiswa berprestasi akademik/non-akademik dan penghafal Al-Qur'an.",
    requirements: ["Diumumkan melalui portal beasiswa UIN SGD"],
    url: "https://uinsgd.ac.id/beasiswa/",
  },
];

/** Tonggak sejarah (sumber: uinsgd.ac.id/sejarah, febi.uinsgd.ac.id). */
export const timeline = [
  {
    year: "1968",
    title: "IAIN Sunan Gunung Djati berdiri",
    description:
      "8 April 1968 berdasarkan Keputusan Menteri Agama No. 56 Tahun 1968, diprakarsai tokoh umat Islam Jawa Barat.",
  },
  {
    year: "1993",
    title: "Perluasan fakultas",
    description:
      "Fakultas Dakwah dan Fakultas Adab didirikan, memperluas cakupan keilmuan kampus.",
  },
  {
    year: "2003",
    title: "Rintisan FEBI",
    description:
      "Rintisan pendirian Fakultas Ekonomi dan Bisnis Islam dimulai sebagai tindak lanjut kajian Konsorsium Keilmuan.",
  },
  {
    year: "2005",
    title: "Menjadi UIN",
    description:
      "10 Oktober 2005, IAIN berubah menjadi UIN Sunan Gunung Djati Bandung (Perpres No. 57 Tahun 2005).",
  },
  {
    year: "2021",
    title: "Galeri Investasi Syariah BEI",
    description:
      "13 Oktober 2021, FEBI meresmikan Galeri Investasi Syariah BEI bersama MNC Sekuritas.",
  },
  {
    year: "2024",
    title: "UIN SGD terakreditasi Unggul",
    description:
      "Akreditasi institusi peringkat Unggul dari BAN-PT, berlaku 2024–2029.",
  },
];

/**
 * Dosen program studi. Baru berisi nama yang terverifikasi dari publikasi
 * resmi prodi — lengkapi dari data SISTER/PDDikti.
 */
// TODO: lengkapi daftar dosen (nama, bidang keahlian, foto, tautan SINTA/Scholar).
export const dosen = [
  {
    name: "Dr. Evi Sopiah, M.Ag., CIIQA, CIELP",
    initials: "ES",
    role: "Ketua Program Studi",
    expertise: ["Ekonomi Islam", "Industri Halal"],
  },
  {
    name: "Anisa Ilma, M.E.",
    initials: "AI",
    role: "Sekretaris Program Studi",
    expertise: ["Ekonomi Syariah"],
  },
  {
    name: "Dr. H. Endang Jumali, Lc., M.Si., M.Ak.",
    initials: "EJ",
    role: "Dosen",
    expertise: ["Hukum Islam", "Akuntansi"],
  },
];

/** Fasilitas yang dapat diakses mahasiswa. */
// TODO: tambahkan fasilitas khusus FEBI (laboratorium, galeri investasi, dll.) bila ada.
export const fasilitas = [
  {
    title: "Galeri Investasi Syariah BEI",
    description:
      "Diresmikan 13 Oktober 2021 bersama MNC Sekuritas — pusat edukasi dan praktik investasi pasar modal syariah, termasuk Sekolah Pasar Modal Syariah.",
  },
  {
    title: "Gedung FEBI Kampus 2",
    description:
      "Ruang kuliah dan Aula FEBI untuk seminar, kuliah umum, dan kegiatan mahasiswa.",
  },
  {
    title: "Perpustakaan & Digital Library",
    description:
      "Koleksi cetak universitas dan repositori digital skripsi serta karya ilmiah.",
  },
  {
    title: "Pembelajaran Daring e-Knows",
    description:
      "Learning management system untuk materi, tugas, dan kuis perkuliahan.",
  },
  {
    title: "UINSGDnet",
    description:
      "Akses internet nirkabel di area kampus dengan akun resmi mahasiswa.",
  },
];

export const layananAkademik = [
  {
    title: "Portal Akademik SALAM",
    href: "https://simak.uinsgd.ac.id/beranda/",
    description: "KRS, nilai, dan administrasi akademik.",
  },
  {
    title: "e-Knows (LMS)",
    href: "https://eknows.uinsgd.ac.id",
    description: "Pembelajaran daring dan materi kuliah.",
  },
  {
    title: "Digital Library",
    href: "https://digilib.uinsgd.ac.id",
    description: "Repositori skripsi & karya ilmiah.",
  },
  {
    title: "Website Resmi Prodi",
    href: "https://es.uinsgd.ac.id",
    description: "Dokumen & layanan resmi prodi.",
  },
];

/** Jalur PMB UIN SGD 2026 (sumber: pmb.uinsgd.ac.id, uinsgd.ac.id). */
export const jalurMasuk = [
  {
    title: "SNBP",
    description: "Seleksi nasional berdasarkan prestasi akademik (rapor).",
  },
  {
    title: "SPAN-PTKIN",
    description:
      "Seleksi nasional prestasi akademik khusus PTKIN, termasuk jalur portofolio.",
  },
  {
    title: "SNBT",
    description: "Seleksi nasional berdasarkan hasil Tes Terstandar (UTBK).",
  },
  {
    title: "UM-PTKIN",
    description: "Ujian masuk bersama Perguruan Tinggi Keagamaan Islam Negeri.",
  },
  {
    title: "Mandiri (CBT)",
    description:
      "Ujian mandiri berbasis komputer UIN SGD, pendaftaran di damba.uinsgd.ac.id.",
  },
  {
    title: "Prestasi & Tahfidz",
    description:
      "Jalur mandiri untuk prestasi seni, olahraga, organisasi, serta hafalan Al-Qur'an minimal 10 juz / Qiro'atul Kutub.",
  },
];

export const faq = [
  {
    q: "Apa gelar lulusan Program Studi Ekonomi Syariah?",
    a: "Lulusan memperoleh gelar Sarjana Ekonomi (S.E.) setelah menyelesaikan beban studi 148 SKS. Masa studi normal 8 semester dengan batas maksimal 14 semester.",
  },
  {
    q: "Apakah harus lulusan pesantren atau madrasah?",
    a: "Tidak. Prodi terbuka untuk lulusan SMA, SMK, MA, maupun pesantren yang setara. Dasar-dasar studi keislaman dan bahasa Arab diberikan sejak semester awal.",
  },
  {
    q: "Apa bedanya dengan Hukum Ekonomi Syariah atau Manajemen Keuangan Syariah?",
    a: "Ekonomi Syariah mempelajari ilmu ekonomi secara luas dari perspektif Islam — teori, kebijakan, keuangan sosial, dan industri halal. Hukum Ekonomi Syariah menekankan aspek hukum dan akad, sedangkan Manajemen Keuangan Syariah berfokus pada pengelolaan keuangan lembaga.",
  },
  {
    q: "Apakah ada magang dan kuliah praktisi?",
    a: "Ada. Mahasiswa mengikuti praktik kerja lapangan di semester akhir, serta kuliah bersama praktisi dari lembaga keuangan syariah, regulator, dan industri.",
  },
  {
    q: "Kapan pendaftaran beasiswa KIP Kuliah dibuka?",
    a: "KIP Kuliah untuk mahasiswa baru 2026/2027 dibuka 26 Agustus – 13 September 2026 melalui portal beasiswa.uinsgd.ac.id. Info beasiswa lain ada di halaman Beasiswa.",
  },
  {
    q: "Bagaimana cara mendaftar?",
    a: "Pendaftaran mengikuti jalur resmi UIN Sunan Gunung Djati Bandung: SNBP, SNBT, UM-PTKIN, dan Seleksi Mandiri. Jadwal dan persyaratan terbaru tersedia di portal PMB kampus.",
  },
];

export const kontak = {
  address: "Fakultas Ekonomi dan Bisnis Islam, UIN Sunan Gunung Djati Bandung",
  street:
    "Jl. A.H. Nasution No. 105, Cipadung, Cibiru, Kota Bandung, Jawa Barat 40614",
  email: "es.uinsgdbdg@gmail.com",
  hours: "Senin–Jumat, 08.00–16.00 WIB",
  instagram: "https://www.instagram.com/eksyaruinsgd/",
  instagramHandle: "@eksyaruinsgd",
  linktree: "https://linktr.ee/eksyaruinsgd",
  website: "es.uinsgd.ac.id",
  tiktok: "https://www.tiktok.com/@eksyaruinsgd",
  x: "https://x.com/eksyaruinsgd",
  febiInstagram: "https://www.instagram.com/febiuinsgdbdg/",
  pmbUrl: "https://pmb.uinsgd.ac.id",
  mapsUrl: "https://maps.google.com/?q=UIN+Sunan+Gunung+Djati+Bandung",
  mapsEmbed:
    "https://www.google.com/maps?q=UIN+Sunan+Gunung+Djati+Bandung&output=embed",
};

export type NavItem = { href: string; label: string; description?: string };
export type NavGroup = { label: string; href: string; items?: NavItem[] };

/** Menu utama website (mega menu di desktop, akordeon di ponsel). */
export const navGroups: NavGroup[] = [
  {
    label: "Profil",
    href: "/prodi/profil",
    items: [
      {
        href: "/prodi/profil",
        label: "Tentang prodi",
        description: "Sejarah, visi, misi, dan tujuan",
      },
      {
        href: "/prodi/profil#struktur",
        label: "Pimpinan & struktur",
        description: "Kaprodi, sekprodi, dan organisasi",
      },
      {
        href: "/prodi/dosen",
        label: "Dosen & staf",
        description: "Profil, keahlian, mata kuliah",
      },
      {
        href: "/prodi/profil#mitra",
        label: "Mitra kerja sama",
        description: "Perbankan, bursa, regulator, lembaga zakat",
      },
      {
        href: "/prodi/mutu",
        label: "Penjaminan mutu",
        description: "Akreditasi, SPMI, survei kepuasan",
      },
      {
        href: "/prodi/data",
        label: "Data & statistik",
        description: "Mahasiswa, lulusan, skripsi, infografis",
      },
      {
        href: "/prodi/profil#fasilitas",
        label: "Fasilitas",
        description: "Ruang, galeri investasi, peminjaman",
      },
      {
        href: "/prodi/media",
        label: "Ruang media",
        description: "Rilis pers, logo, kontak media",
      },
    ],
  },
  {
    label: "Akademik",
    href: "/prodi/akademik",
    items: [
      {
        href: "/prodi/akademik",
        label: "Kurikulum",
        description: "Mata kuliah, peminatan, RPS",
      },
      {
        href: "/prodi/kalender",
        label: "Kalender akademik",
        description: "Perkuliahan, UKT, ujian, wisuda",
      },
      {
        href: "/prodi/skripsi",
        label: "Direktori skripsi",
        description: "Telusuri skripsi & cek kemiripan judul",
      },
      {
        href: "/prodi/skripsi/pojok",
        label: "Pojok skripsi",
        description: "Topik, jadwal sidang, panduan",
      },
      {
        href: "/prodi/penelitian",
        label: "Penelitian & publikasi",
        description: "Karya dosen dan jurnal ilmiah",
      },
      {
        href: "/prodi/unduhan",
        label: "Unduhan",
        description: "Pedoman, kalender, template",
      },
      {
        href: "/prodi/layanan",
        label: "Layanan akademik",
        description: "Alur layanan, akses cepat, FAQ",
      },
    ],
  },
  {
    label: "Mahasiswa",
    href: "/prodi/kemahasiswaan",
    items: [
      {
        href: "/prodi/mahasiswa-baru",
        label: "Calon mahasiswa baru",
        description: "Jalur masuk, biaya, beasiswa",
      },
      {
        href: "/prodi/kemahasiswaan",
        label: "Kemahasiswaan",
        description: "Kegiatan pengembangan diri",
      },
      {
        href: "/prodi/beasiswa",
        label: "Beasiswa",
        description: "KIP-K, BAZNAS, BI, dan lainnya",
      },
      {
        href: "/prodi/lomba",
        label: "Info lomba",
        description: "Kompetisi & prestasi",
      },
      {
        href: "/prodi/karier",
        label: "Karier & magang",
        description: "Asisten dosen, relawan, magang",
      },
      {
        href: "/prodi/karya",
        label: "Karya mahasiswa",
        description: "Business plan, esai, UMKM binaan",
      },
      {
        href: "/prodi/wisuda",
        label: "Wisudawan",
        description: "Lulusan per periode wisuda",
      },
      {
        href: "/prodi/alumni",
        label: "Alumni & karier",
        description: "Direktori, mentoring, tracer study",
      },
    ],
  },
  {
    label: "Edukasi",
    href: "/prodi/alat",
    items: [
      {
        href: "/prodi/kamus",
        label: "Kamus istilah",
        description: "Istilah ekonomi & keuangan syariah",
      },
      {
        href: "/prodi/alat/zakat",
        label: "Kalkulator zakat",
        description: "Penghasilan, harta, perdagangan",
      },
      {
        href: "/prodi/alat/akad",
        label: "Simulasi akad",
        description: "Murabahah & mudharabah",
      },
      {
        href: "/prodi/alat/kuis",
        label: "Kuis minat",
        description: "Cocok di bidang apa?",
      },
      {
        href: "/prodi/alat/kelulusan",
        label: "Kalkulator kelulusan",
        description: "Perkiraan sisa SKS",
      },
      {
        href: "/prodi/formulir/konsultasi",
        label: "Konsultasi ekonomi syariah",
        description: "Untuk masyarakat & UMKM",
      },
    ],
  },
  {
    label: "Informasi",
    href: "/prodi/berita",
    items: [
      {
        href: "/prodi/berita",
        label: "Berita",
        description: "Kabar dan kegiatan terbaru",
      },
      {
        href: "/prodi/berita?kategori=pengumuman",
        label: "Pengumuman",
        description: "Informasi resmi untuk mahasiswa",
      },
      {
        href: "/prodi/agenda",
        label: "Agenda",
        description: "Jadwal & pendaftaran acara",
      },
      {
        href: "/prodi/galeri",
        label: "Galeri",
        description: "Foto dan video kegiatan",
      },
      {
        href: "/prodi/formulir",
        label: "Formulir online",
        description: "Saran, survei, lapor prestasi, kerja sama",
      },
      {
        href: "/prodi/forum",
        label: "Tanya jawab",
        description: "Pertanyaan dan jawaban dari prodi",
      },
      {
        href: "/prodi/verifikasi",
        label: "Verifikasi sertifikat",
        description: "Cek keaslian sertifikat kegiatan",
      },
    ],
  },
  { label: "Kontak", href: "/prodi/kontak" },
];

export const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/prodi/profil", label: "Profil" },
  { href: "/prodi/akademik", label: "Akademik" },
  { href: "/prodi/dosen", label: "Dosen" },
  { href: "/prodi/kemahasiswaan", label: "Mahasiswa" },
  { href: "/prodi/berita", label: "Berita" },
  { href: "/prodi/layanan", label: "Layanan" },
  { href: "/prodi/kontak", label: "Kontak" },
];

export const utilityLinks = [
  { href: "https://simak.uinsgd.ac.id/beranda/", label: "SALAM" },
  { href: "https://eknows.uinsgd.ac.id", label: "e-Knows" },
  { href: "https://digilib.uinsgd.ac.id", label: "Digilib" },
  { href: "https://uinsgd.ac.id", label: "UIN SGD" },
];
