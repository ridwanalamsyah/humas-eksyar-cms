/**
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
    "Belajar ilmu ekonomi modern berlandaskan prinsip muamalah Islam — untuk karir di keuangan syariah, industri halal, filantropi, dan riset kebijakan.",
  /**
   * Foto utama beranda (mis. "/prodi/hero.jpg" di folder public, atau URL
   * dari Media Library CMS). Kosongkan untuk memakai kartu sorotan.
   */
  image: null as string | null,
  imageAlt: "Mahasiswa Program Studi Ekonomi Syariah UIN Sunan Gunung Djati Bandung",
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
    description: "Operasional bank syariah, pasar modal syariah, asuransi syariah, manajemen risiko, dan fintech.",
  },
  {
    title: "Ekonomi Sosial Islam (ZISWAF)",
    description: "Zakat, infak, sedekah, dan wakaf produktif sebagai instrumen pemberdayaan dan pengentasan kemiskinan.",
  },
  {
    title: "Industri & Bisnis Halal",
    description: "Rantai pasok halal, sertifikasi halal UMK, kewirausahaan syariah, dan pemasaran produk halal.",
  },
  {
    title: "Kebijakan & Pembangunan",
    description: "Ekonomi pembangunan Islam, kebijakan fiskal & moneter, serta analisis data ekonomi.",
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
        courses: ["Ekonomi Makro Islam", "Ekonometrika", "Manajemen ZISWAF", "Pasar Modal Syariah", "Etika Bisnis Islam"],
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
      { name: "Semester 7", courses: ["Praktik Kerja Lapangan / Magang", "Kuliah Kerja Nyata", "Mata Kuliah Pilihan"] },
      { name: "Semester 8", courses: ["Skripsi", "Ujian Komprehensif"] },
    ],
  },
];

export const profilLulusan = [
  {
    title: "Praktisi Keuangan Syariah",
    description: "Mampu menjalankan operasional, analisis pembiayaan, dan pengembangan produk di lembaga keuangan syariah.",
  },
  {
    title: "Pengelola Filantropi Islam",
    description: "Mampu merancang dan mengelola program zakat, infak, sedekah, dan wakaf secara profesional dan akuntabel.",
  },
  {
    title: "Wirausaha & Pelaku Industri Halal",
    description: "Mampu membangun dan mengembangkan usaha berbasis prinsip syariah serta ekosistem halal.",
  },
  {
    title: "Peneliti & Analis Ekonomi",
    description: "Mampu melakukan riset dan analisis kebijakan ekonomi Islam berbasis data dan metodologi ilmiah.",
  },
];

export const capaianPembelajaran = [
  {
    title: "Sikap",
    description: "Bertakwa, berakhlak karimah, jujur, dan menjunjung etika bisnis Islam dalam setiap aktivitas ekonomi.",
  },
  {
    title: "Pengetahuan",
    description: "Menguasai teori ekonomi konvensional dan Islam, fiqh muamalah, serta sistem keuangan syariah.",
  },
  {
    title: "Keterampilan Umum",
    description: "Berpikir kritis, sistematis, dan inovatif; mampu berkomunikasi dan bekerja dalam tim lintas disiplin.",
  },
  {
    title: "Keterampilan Khusus",
    description: "Mampu menganalisis masalah ekonomi dan keuangan dengan pendekatan syariah serta merumuskan solusi aplikatif.",
  },
];

export const prospekKarir = [
  { title: "Bankir Syariah", description: "Bank umum syariah, unit usaha syariah, dan BPR syariah." },
  { title: "Analis Keuangan & Investasi", description: "Sekuritas, manajer investasi, dan pasar modal syariah." },
  { title: "Auditor & Pengawas Syariah", description: "Kantor akuntan, dewan pengawas syariah, dan lembaga audit." },
  { title: "Amil & Manajer Filantropi", description: "BAZNAS, LAZ, badan wakaf, dan program CSR korporasi." },
  { title: "Regulator & ASN", description: "OJK, Bank Indonesia, Kementerian Agama, dan instansi ekonomi." },
  { title: "Wirausaha & Konsultan Halal", description: "UMKM, startup, dan pendampingan sertifikasi halal." },
  { title: "Peneliti & Akademisi", description: "Dosen, peneliti, dan analis kebijakan ekonomi Islam." },
  { title: "Profesional Fintech Syariah", description: "Produk, kepatuhan syariah, dan riset di industri teknologi finansial." },
];

/**
 * Sorotan kegiatan yang sudah diberitakan media resmi kampus. Ditampilkan
 * di beranda saat CMS belum punya konten `published`, dan di halaman
 * Kemahasiswaan.
 */
export const sorotan = [
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
    source: "https://uinsgd.ac.id/tingkatkan-wawasan-prodi-ekonomi-syariah-uin-bandung-gelar-kuliah-bersama-praktisi-bank-muamalat/",
  },
  {
    date: "2026-04-08",
    category: "Pengabdian",
    title: "Sertifikasi Juru Sembelih Halal di Cibiru Wetan",
    summary:
      "Prodi menyerahkan sertifikat Juru Sembelih Halal (Juleha) kepada warga Desa Cibiru Wetan sebagai bagian dari program pengabdian masyarakat untuk memperkuat ekosistem halal.",
    source: "https://uinsgd.ac.id/prodi-ekonomi-syariah-uin-bandung-serahkan-sertifikat-juleha-di-cibiru-wetan/",
  },
  {
    date: "2026-04-04",
    category: "Kemahasiswaan",
    title: "Eksphoria 2026: Literasi & Kompetisi Ekonomi Syariah",
    summary:
      "HMJ Ekonomi Syariah Kabinet Ekselensi menggelar seminar bersama OJK, kompetisi business plan dan esai dengan 359 peserta dari berbagai kampus, serta bazar UMKM halal.",
    source: "https://uinsgd.ac.id/tingkatkan-literasi-hmj-ekonomi-syariah-uin-bandung-gelar-eksphoria-2026/",
  },
  {
    date: "2024-04-25",
    category: "Penjaminan Mutu",
    title: "FGD Penyusunan Visi Misi & Review Kurikulum",
    summary:
      "Prodi melibatkan asosiasi program studi, OJK, praktisi industri, alumni, dan mahasiswa untuk meninjau visi, misi, dan kurikulum menuju akreditasi unggul.",
    source: "https://uinsgd.ac.id/tingkatkan-kualitas-prodi-ekonomi-syariah-gelar-fgd-penyusunan-visi-misi-dan-review-kurikulum/",
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
    name: "Muhamad Yudhi Saputra",
    initials: "YS",
    achievement: "Ketua HMJ Ekonomi Syariah 2026",
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

export const himpunan = {
  name: "HMJ Ekonomi Syariah UIN Bandung",
  cabinet: "Kabinet Ekselensi",
  chair: "Muhamad Yudhi Saputra",
  chairPeriod: "2026",
  description:
    "Himpunan Mahasiswa Jurusan Ekonomi Syariah menjadi wadah pengembangan diri, kepemimpinan, dan kreativitas mahasiswa melalui kajian, kompetisi, pengabdian, dan kegiatan kolaboratif.",
  flagship: {
    name: "Eksphoria",
    full: "Ekonomi Syariah Euphoria",
    description:
      "Agenda tahunan HMJ yang memadukan edukasi, pemberdayaan ekonomi, dan apresiasi: seminar nasional, kompetisi business plan & esai tingkat nasional, serta bazar UMKM halal.",
  },
  instagram: "https://www.instagram.com/hmjeksyaruinbdg/",
  youtube: "https://www.youtube.com/@hmjekonomisyariahuinbandun7767",
};

export const kegiatanMahasiswa = [
  { title: "Kajian & Diskusi Ekonomi Islam", description: "Forum rutin membedah isu ekonomi dan keuangan syariah terkini." },
  { title: "Kompetisi Nasional", description: "Pendampingan lomba business plan, esai, debat, dan karya tulis ilmiah." },
  { title: "Kuliah Praktisi & Kunjungan Industri", description: "Belajar langsung dari bank syariah, regulator, dan pelaku industri halal." },
  { title: "Pengabdian Masyarakat", description: "Literasi keuangan syariah, pendampingan UMKM, dan program halal di desa binaan." },
];

export const beasiswa = [
  "Beasiswa KIP Kuliah",
  "Beasiswa Kementerian Agama",
  "Beasiswa lembaga zakat & filantropi",
  "Beasiswa mitra perbankan & BUMN",
  "Beasiswa pemerintah daerah",
];

export const layananAkademik = [
  { title: "Portal Akademik SALAM", href: "https://simak.uinsgd.ac.id/beranda/", description: "KRS, nilai, dan administrasi akademik." },
  { title: "e-Knows (LMS)", href: "https://eknows.uinsgd.ac.id", description: "Pembelajaran daring dan materi kuliah." },
  { title: "Digital Library", href: "https://digilib.uinsgd.ac.id", description: "Repositori skripsi & karya ilmiah." },
  { title: "Website Resmi Prodi", href: "https://es.uinsgd.ac.id", description: "Dokumen & layanan resmi prodi." },
];

export const jalurMasuk = [
  { title: "SNBP", description: "Seleksi nasional berdasarkan prestasi akademik (rapor) dan portofolio." },
  { title: "SNBT", description: "Seleksi nasional berdasarkan hasil Tes Terstandar (UTBK)." },
  { title: "UM-PTKIN", description: "Ujian masuk bersama Perguruan Tinggi Keagamaan Islam Negeri." },
  { title: "Seleksi Mandiri", description: "Jalur seleksi mandiri yang diselenggarakan UIN Sunan Gunung Djati Bandung." },
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
    q: "Bagaimana cara mendaftar?",
    a: "Pendaftaran mengikuti jalur resmi UIN Sunan Gunung Djati Bandung: SNBP, SNBT, UM-PTKIN, dan Seleksi Mandiri. Jadwal dan persyaratan terbaru tersedia di portal PMB kampus.",
  },
];

export const kontak = {
  address: "Fakultas Ekonomi dan Bisnis Islam, UIN Sunan Gunung Djati Bandung",
  street: "Jl. A.H. Nasution No. 105, Cipadung, Cibiru, Kota Bandung, Jawa Barat 40614",
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
  mapsEmbed: "https://www.google.com/maps?q=UIN+Sunan+Gunung+Djati+Bandung&output=embed",
};

export const navLinks = [
  { href: "/prodi", label: "Beranda" },
  { href: "/prodi/profil", label: "Profil" },
  { href: "/prodi/akademik", label: "Akademik" },
  { href: "/prodi/kemahasiswaan", label: "Kemahasiswaan" },
  { href: "/prodi/berita", label: "Berita" },
  { href: "/prodi/kontak", label: "Kontak" },
];

export const utilityLinks = [
  { href: "https://simak.uinsgd.ac.id/beranda/", label: "SALAM" },
  { href: "https://eknows.uinsgd.ac.id", label: "e-Knows" },
  { href: "https://digilib.uinsgd.ac.id", label: "Digilib" },
  { href: "https://uinsgd.ac.id", label: "UIN SGD" },
];
