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
  prodiAccreditation: "Baik Sekali",
  universityAccreditation: "Unggul",
  universityAccreditationPeriod: "2024–2029",
  officialSite: "https://es.uinsgd.ac.id",
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
  image:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=85" as
      | string
      | null,
  imageAlt:
    "Mahasiswa Program Studi Ekonomi Syariah UIN Sunan Gunung Djati Bandung",
};

export const pimpinan = [
  {
    name: "Prof. Dr. H. Dudang Gojali, S.Ag., M.Ag.",
    role: "Dekan Fakultas Ekonomi dan Bisnis Islam",
    initials: "DG",
  },
  {
    name: "Prof. Dr. Iwan Setiawan, S.Ag., M.Pd., M.E.Sy.",
    role: "Wakil Dekan I Bidang Akademik FEBI",
    initials: "IS",
  },
  {
    name: "Dr. Muhammad Zaky, M.Si.",
    role: "Wakil Dekan II Bidang Administrasi Umum, Perencanaan & Keuangan FEBI",
    initials: "MZ",
  },
  {
    name: "Dr. H. Kadar Nurjaman, S.E., M.M.",
    role: "Wakil Dekan III Bidang Kemahasiswaan, Alumni & Kerja Sama FEBI",
    initials: "KN",
  },
  {
    name: "Dr. Evi Sopiah, M.Ag., CIIQA, CIELP",
    role: "Ketua Program Studi Ekonomi Syariah",
    initials: "ES",
  },
  {
    name: "Anisa Ilmia, M.E.",
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
  "Program Studi Ekonomi Syariah (S1) UIN Sunan Gunung Djati Bandung berdiri secara resmi melalui Keputusan Direktur Jenderal Pendidikan Islam Nomor 1279 Tahun 2015 tanggal 3 Februari 2015. Pada fase awal penyelenggaraannya, program studi ini bernaung di bawah Fakultas Syariah dan Hukum (FSH) di Kampus 1 Cibiru.",
  "Seiring terbitnya Peraturan Menteri Agama (PMA) Republik Indonesia Nomor 27 Tahun 2020 tentang pembentukan Fakultas Ekonomi dan Bisnis Islam (FEBI), Program Studi Ekonomi Syariah resmi bertransformasi menjadi salah satu program studi unggulan di bawah FEBI UIN Sunan Gunung Djati Bandung yang berpusat di Kampus 2 Jl. Cimencrang, Gedebage, Kota Bandung.",
  "Dalam perjalanannya, dosen dan sivitas akademika Ekonomi Syariah dikenal aktif melahirkan inovasi riset dan pengabdian masyarakat, termasuk menginisiasi Desa Ekowisata Halal di Desa Indragiri, Kecamatan Rancabali, Kabupaten Bandung yang meraih penghargaan konservasi lingkungan dari Bupati Bandung, pengelolaan Galeri Investasi Syariah BEI bersama MNC Sekuritas, serta kolaborasi strategis bersama Bank Indonesia, OJK, BAZNAS, dan industri keuangan syariah nasional.",
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
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80",
  },
  {
    date: "2026-06-08",
    category: "Akademik",
    title: "Sekolah Pasar Modal Syariah 2026 di IDX Jawa Barat",
    summary:
      "115 mahasiswa semester enam Ekonomi Syariah belajar konsep pasar modal syariah, instrumen investasi, hingga pengelolaan portofolio di Kantor Perwakilan BEI Jawa Barat.",
    source:
      "https://uinsgd.ac.id/spms-2026-di-idx-jabar-mahasiswa-ekonomi-syariah-didorong-melek-investasi-islam/",
    image:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1000&q=80",
  },
  {
    date: "2026-09-24",
    category: "Pengabdian",
    title: "Literasi Digitalisasi Keuangan Syariah & Pengelolaan Aset Masjid",
    summary:
      "Program pengabdian kepada masyarakat menuju tata kelola aset masjid yang akuntabel, bekerja sama dengan Bank Indonesia dan Bank Muamalat.",
    source: "https://www.instagram.com/eksyaruinsgd/",
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1000&q=80",
  },
  {
    date: "2026-06-19",
    category: "Karir",
    title: "Seminar Karir 2026",
    summary:
      "“Menjadi SDM Unggul dan Kompetitif dalam Industri Keuangan Syariah” — menghadirkan Dekan FEBI, Kaprodi, dan praktisi Bank Muamalat di Aula FEBI Kampus 2.",
    source: "https://www.instagram.com/eksyaruinsgd/",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80",
  },
  {
    date: "2026-04-15",
    category: "Akademik",
    title: "Kuliah Bersama Praktisi Bank Muamalat",
    summary:
      "120 mahasiswa semester enam belajar langsung dari praktisi Bank Muamalat Indonesia di KCP Buahbatu tentang operasional bank syariah, layanan nasabah, dan peluang industri keuangan syariah di era digital.",
    source:
      "https://uinsgd.ac.id/tingkatkan-wawasan-prodi-ekonomi-syariah-uin-bandung-gelar-kuliah-bersama-praktisi-bank-muamalat/",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80",
  },
  {
    date: "2026-04-08",
    category: "Pengabdian",
    title: "Sertifikasi Juru Sembelih Halal di Cibiru Wetan",
    summary:
      "Sertifikat Juru Sembelih Halal (Juleha) diserahkan kepada 15 warga Desa Cibiru Wetan yang mengikuti pelatihan berbasis SKKNI pada November 2025. Program pengabdian ini memperkuat ekosistem halal di tingkat desa.",
    source:
      "https://uinsgd.ac.id/prodi-ekonomi-syariah-uin-bandung-serahkan-sertifikat-juleha-di-cibiru-wetan/",
    image:
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80",
  },
  {
    date: "2024-04-25",
    category: "Penjaminan Mutu",
    title: "FGD Penyusunan Visi Misi & Review Kurikulum",
    summary:
      "Prodi melibatkan asosiasi program studi, OJK, praktisi industri, alumni, dan mahasiswa untuk meninjau visi, misi, dan kurikulum menuju akreditasi unggul.",
    source:
      "https://uinsgd.ac.id/tingkatkan-kualitas-prodi-ekonomi-syariah-gelar-fgd-penyusunan-visi-misi-dan-review-kurikulum/",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80",
  },
  {
    date: "2020-11-15",
    category: "Pengabdian",
    title: "Tanam 150 Pohon Upaya Mewujudkan Green Halal Village di Desa Indragiri",
    summary:
      "Kaprodi dan dosen Ekonomi Syariah bersama komunitas Sabilulungan Bersih (SABER) serta masyarakat Desa Indragiri Kabupaten Bandung menanam 150 pohon untuk menjaga ekosistem desa ekowisata halal.",
    source:
      "https://web.archive.org/web/20210212212000/https://es.uinsgd.ac.id/tanam-pohon-upaya-mewujudkan-green-halal-village/",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
  },
  {
    date: "2020-09-15",
    category: "Akademik",
    title: "Desa Wisata Halal: Kajian Focus Group Discussion dari Berbagai Aspek",
    summary:
      "Diskusi lintas disiplin membedah konsep praksis pemberdayaan masyarakat desa berbasis ekowisata halal, kearifan lokal, dan keuangan mikro syariah.",
    source:
      "https://web.archive.org/web/20210212213645/https://es.uinsgd.ac.id/desa-wisata-halal-kajian-focus-group-discussion-dari-berbagai-aspek/",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    date: "2019-12-18",
    category: "Penghargaan",
    title: "Kembangkan Ekowisata Halal Indragiri, UIN SGD Raih Penghargaan Bupati Bandung",
    summary:
      "Program Desa Ekowisata Halal di Kecamatan Rancabali yang diinisiasi dosen Ekonomi Syariah meraih penghargaan Sinergi Kolaborasi Program Konservasi Pengembangan Wisata Halal pada Jambore Lingkungan II.",
    source:
      "https://web.archive.org/web/20210212190710/https://es.uinsgd.ac.id/kembangkan-ecowisata-halal-rektor-uin-sgd-raih-penghargaan-dari-bupati-bandung/",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
  },
];

/** Apresiasi "Selamat & Sukses" dari feed IG @eksyaruinsgd & arsip resmi es.uinsgd.ac.id. */
export const prestasi = [
  {
    name: "Dr. H. Endang Jumali, Lc., M.Si., M.Ak.",
    initials: "EJ",
    achievement: "Artikel terbit di jurnal internasional terindeks Scopus Q2",
    group: "Dosen",
    photo:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Hakiki Ramadhan",
    initials: "HR",
    achievement: "Tulisan dimuat di Islamic Finance News (IFN)",
    group: "Eksyar Appreciation",
    photo:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Muhammad Azzam Abdillah",
    initials: "MA",
    achievement: "Juara 1 Bandung Open Tournament Pencak Silat",
    group: "Mahasiswa",
    photo:
      "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Muhamad Halabi Muzaini",
    initials: "HM",
    achievement: "Ketua DEMA Fakultas Ekonomi dan Bisnis Islam 2026",
    group: "Mahasiswa",
    photo:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Raditya Fitra",
    initials: "RF",
    achievement: "Wakil Ketua DEMA Universitas 2026",
    group: "Mahasiswa",
    photo:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dr. H. Muhammad Hasanuddin, M.Ag. & Dr. Sofian Al Hakim, M.Ag.",
    initials: "MH",
    achievement: "Inisiator Desa Ekowisata Halal Indragiri — Penghargaan Bupati Bandung",
    group: "Dosen",
    photo:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Evita Farcha",
    initials: "EF",
    achievement: "Delegasi Mahasiswa Ekonomi Syariah di Universiti Teknologi MARA (UiTM) Malaysia",
    group: "Mahasiswa",
    photo:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Tim Mahasiswa Ekonomi Syariah UIN Bandung",
    initials: "TE",
    achievement: "Juara 1 Indonesia Sharia Economic Festival (ISEF) Bank Indonesia",
    group: "Mahasiswa",
    photo:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Delegasi Mahasiswa Eksyar UIN SGD",
    initials: "DM",
    achievement: "Peserta Student Exchange di Universiti Malaya (UM) Kuala Lumpur",
    group: "Mahasiswa",
    photo:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
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
    title: "HMJ Ekonomi Syariah (SE-FEST & Eksphoria)",
    description:
      "Himpunan Mahasiswa Jurusan Ekonomi Syariah yang menyelenggarakan Sharia Economic Festival (SE-FEST), Eksphoria, seminar nasional, dan advokasi mahasiswa.",
  },
  {
    title: "FoSEI (Forum Silaturahmi Studi Ekonomi Islam)",
    description:
      "Kelompok studi ekonomi Islam tempat mahasiswa mendalami riset fikih muamalah, kebijakan ekonomi syariah, dan persiapan kompetisi ilmiah nasional (Temilnas/Temilreg).",
  },
  {
    title: "KSPM & Galeri Investasi Syariah (GIS) BEI FEBI",
    description:
      "Kelompok Studi Pasar Modal yang mengelola edukasi investasi saham syariah, Sekolah Pasar Modal Syariah (SPMS), dan riset portofolio bersama BEI & MNC Sekuritas.",
  },
  {
    title: "Kuliah Praktisi, Klinik Halal & Pengabdian Desa Binaan",
    description:
      "Pembelajaran langsung bersama praktisi bank syariah/regulator, pendampingan sertifikasi halal UMKM & Juleha, serta program Green Halal Village di Desa Indragiri.",
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
    title: "Menjadi UIN Sunan Gunung Djati",
    description:
      "10 Oktober 2005, IAIN bertransformasi menjadi UIN Sunan Gunung Djati Bandung (Perpres No. 57 Tahun 2005).",
  },
  {
    year: "2015",
    title: "SK Penyelenggaraan S1 Ekonomi Syariah",
    description:
      "3 Februari 2015, terbit SK Dirjen Pendidikan Islam Nomor 1279 Tahun 2015 tentang izin penyelenggaraan Program Studi S1 Ekonomi Syariah.",
  },
  {
    year: "2018",
    title: "Juara 1 ISEF BI & Rekognisi Internasional",
    description:
      "Mahasiswa Ekonomi Syariah meraih Juara 1 Indonesia Sharia Economic Festival (ISEF) Bank Indonesia dan mengikuti Student Exchange di Universiti Malaya serta UiTM Malaysia.",
  },
  {
    year: "2019",
    title: "Penghargaan Desa Ekowisata Halal Indragiri",
    description:
      "Inovasi Desa Ekowisata Halal di Kecamatan Rancabali yang digagas dosen Ekonomi Syariah meraih penghargaan konservasi dari Bupati Bandung.",
  },
  {
    year: "2020",
    title: "Resmi Bernaung di Bawah FEBI",
    description:
      "Berdasarkan PMA RI Nomor 27 Tahun 2020, Fakultas Ekonomi dan Bisnis Islam (FEBI) resmi berdiri dan menaungi Prodi Ekonomi Syariah di Kampus 2 Gedebage.",
  },
  {
    year: "2021",
    title: "Galeri Investasi Syariah BEI",
    description:
      "13 Oktober 2021, FEBI meresmikan Galeri Investasi Syariah BEI bersama MNC Sekuritas sebagai laboratorium pasar modal syariah.",
  },
  {
    year: "2024",
    title: "UIN SGD Terakreditasi Unggul",
    description:
      "Akreditasi institusi peringkat Unggul dari BAN-PT berlaku 2024–2029, diikuti FGD pemutakhiran kurikulum Ekonomi Syariah menuju Unggul.",
  },
];

/**
 * Dosen tetap & pengajar Program Studi Ekonomi Syariah FEBI UIN SGD
 * (diimpor & diverifikasi dari arsip es.uinsgd.ac.id, Digilib UIN SGD, SINTA, dan FEBI).
 */
export const dosen = [
  {
    name: "Dr. Evi Sopiah, M.Ag., CIIQA, CIELP",
    initials: "ES",
    role: "Ketua Program Studi · Lektor",
    expertise: ["Ekonomi Islam", "Industri Halal", "Perilaku Konsumen Muslim"],
    pendidikan: "S3 Studi Islam / Ekonomi Islam — UIN Sunan Gunung Djati Bandung",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Evi+Sopiah+UIN+Sunan+Gunung+Djati",
    konsultasi: "Senin–Kamis, 09.00–15.00 WIB (Ruang Prodi Ekonomi Syariah Lt. 2 FEBI)",
  },
  {
    name: "Anisa Ilmia, M.E.",
    initials: "AI",
    role: "Sekretaris Program Studi · Asisten Ahli",
    expertise: ["Ekonomi Syariah", "Keuangan Sosial Islam", "ZISWAF"],
    pendidikan: "S2 Ekonomi Syariah",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Anisa+Ilmia+UIN+Sunan+Gunung+Djati",
    konsultasi: "Senin–Jumat, 09.00–15.00 WIB (Ruang Prodi Ekonomi Syariah Lt. 2 FEBI)",
  },
  {
    name: "Prof. Dr. H. Dudang Gojali, S.Ag., M.Ag.",
    initials: "DG",
    role: "Guru Besar · Dekan FEBI",
    expertise: ["Fiqh Muamalah", "Hukum Ekonomi Syariah", "Filsafat Hukum Islam"],
    pendidikan: "S3 Hukum Islam — UIN Sunan Gunung Djati Bandung",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Dudang+Gojali+UIN+Sunan+Gunung+Djati",
  },
  {
    name: "Prof. Dr. Iwan Setiawan, S.Ag., M.Pd., M.E.Sy.",
    initials: "IS",
    role: "Guru Besar · Wakil Dekan I FEBI",
    expertise: ["Ekonomi Pembangunan Islam", "Pemberdayaan Ekonomi Umat", "Manajemen Pendidikan"],
    pendidikan: "S3 Ekonomi Islam — UIN Sunan Gunung Djati Bandung",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Iwan+Setiawan+UIN+Sunan+Gunung+Djati",
  },
  {
    name: "Dr. Muhammad Zaky, M.Si.",
    initials: "MZ",
    role: "Wakil Dekan II FEBI · Lektor Kepala",
    expertise: ["Manajemen Keuangan Syariah", "Tata Kelola Organisasi", "Ekonomi Makro"],
    pendidikan: "S3 Ilmu Ekonomi / Manajemen",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Muhammad+Zaky+UIN+Sunan+Gunung+Djati",
  },
  {
    name: "Dr. H. Kadar Nurjaman, S.E., M.M.",
    initials: "KN",
    role: "Wakil Dekan III FEBI · Lektor Kepala",
    expertise: ["Kewirausahaan Syariah", "Manajemen SDM", "Studi Kelayakan Bisnis"],
    pendidikan: "S3 Ilmu Manajemen",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Kadar+Nurjaman+UIN+Sunan+Gunung+Djati",
  },
  {
    name: "Prof. Dr. H. Atang Abd. Hakim, M.A.",
    initials: "AH",
    role: "Guru Besar Ekonomi Islam",
    expertise: ["Pemikiran Ekonomi Islam", "Ushul Fiqh Ekonomi", "Metodologi Studi Islam"],
    pendidikan: "S3 Studi Islam — IAIN Syarif Hidayatullah Jakarta",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Atang+Abd+Hakim+UIN+Sunan+Gunung+Djati",
  },
  {
    name: "Prof. Dr. H. Ahmad Hasan Ridwan, M.Ag.",
    initials: "AR",
    role: "Guru Besar",
    expertise: ["Filsafat Ekonomi Syariah", "Fiqh Zakat & Wakaf", "Hukum Ekonomi Islam"],
    pendidikan: "S3 Hukum Islam — UIN Sunan Gunung Djati Bandung",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Ahmad+Hasan+Ridwan+UIN+Sunan+Gunung+Djati",
  },
  {
    name: "Dr. H. Muhammad Hasanuddin, M.Ag.",
    initials: "MH",
    role: "Dosen Tetap · Inisiator Desa Ekowisata Halal",
    expertise: ["Ekowisata Halal", "Fiqh Muamalah", "Lembaga Keuangan Syariah"],
    pendidikan: "S3 Hukum Ekonomi Syariah — UIN Sunan Gunung Djati Bandung",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Muhammad+Hasanuddin+UIN+Sunan+Gunung+Djati",
  },
  {
    name: "Dr. H. Endang Jumali, Lc., M.Si., M.Ak.",
    initials: "EJ",
    role: "Dosen Tetap · Lektor",
    expertise: ["Akuntansi Syariah", "Audit Syariah", "Hukum Islam"],
    pendidikan: "S1 Al-Azhar Kairo · S2 & S3 Ekonomi/Akuntansi Islam",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Endang+Jumali+UIN+Sunan+Gunung+Djati",
  },
  {
    name: "Dr. H. Abdullah Safe'i, M.Ag.",
    initials: "AS",
    role: "Dosen Tetap · Lektor Kepala",
    expertise: ["Etika Bisnis Islam", "Ushul Fiqh", "Tafsir & Hadis Ekonomi"],
    pendidikan: "S3 Studi Islam — UIN Sunan Gunung Djati Bandung",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Abdullah+Safei+UIN+Sunan+Gunung+Djati",
  },
  {
    name: "Suteja Wira Dana Kusuma, M.E.",
    initials: "SW",
    role: "Dosen Tetap · Pembina GIS BEI FEBI",
    expertise: ["Ekonomi Makro Islam", "Pasar Modal Syariah", "Ekonometrika"],
    pendidikan: "S2 Ilmu Ekonomi & Keuangan Syariah",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Suteja+Wira+Dana+Kusuma",
  },
  {
    name: "Reza Fauzi Nazar, M.E.",
    initials: "RN",
    role: "Dosen Tetap",
    expertise: ["Perbankan Syariah", "Manajemen Keuangan Syariah", "Fintech Syariah"],
    pendidikan: "S2 Ekonomi Syariah",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Reza+Fauzi+Nazar",
  },
  {
    name: "Depid Ismail, M.E.Sy.",
    initials: "DI",
    role: "Dosen Tetap",
    expertise: ["Ekonomi Mikro Islam", "Kewirausahaan Syariah", "Bisnis Halal"],
    pendidikan: "S2 Ekonomi Syariah — UIN Sunan Gunung Djati Bandung",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Depid+Ismail",
  },
  {
    name: "Nabiela Rizki Alifa, M.E.",
    initials: "NR",
    role: "Dosen Tetap",
    expertise: ["Ekonomi Pembangunan Islam", "Statistika Ekonomi", "Industri Halal"],
    pendidikan: "S2 Ekonomi Islam",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Nabiela+Rizki+Alifa",
  },
  {
    name: "Zia Sidqurrahman, M.E.",
    initials: "ZS",
    role: "Dosen Tetap",
    expertise: ["Pasar Modal Syariah", "Manajemen Risiko Syariah", "Investasi Islam"],
    pendidikan: "S2 Ekonomi & Keuangan Syariah",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Zia+Sidqurrahman",
  },
  {
    name: "Annisa Nur Salam, M.E.",
    initials: "AN",
    role: "Dosen Tetap",
    expertise: ["Ekonomi Moneter Islam", "Kebijakan Fiskal Islam", "Ekonomi Internasional"],
    pendidikan: "S2 Ilmu Ekonomi Islam",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Annisa+Nur+Salam",
  },
  {
    name: "Dr. Dedi Suyandi, M.Ag.",
    initials: "DS",
    role: "Dosen Tetap · Lektor",
    expertise: ["Sejarah Pemikiran Ekonomi Islam", "Manajemen ZISWAF"],
    pendidikan: "S3 Ekonomi Islam — UIN Sunan Gunung Djati Bandung",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Dedi+Suyandi",
  },
  {
    name: "Yuda Septia Fitri, M.E.",
    initials: "YF",
    role: "Dosen Tetap",
    expertise: ["Kewirausahaan Syariah", "Pemasaran Islami", "UMKM Halal"],
    pendidikan: "S2 Ekonomi Syariah",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Yuda+Septia+Fitri",
  },
  {
    name: "Herry Sutanto, M.M.",
    initials: "HS",
    role: "Dosen Tetap · Lektor",
    expertise: ["Manajemen Perbankan Syariah", "Manajemen Sumber Daya Insani"],
    pendidikan: "S2 Magister Manajemen",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Herry+Sutanto+UIN+Bandung",
  },
  {
    name: "Widiawati, M.E.",
    initials: "WW",
    role: "Dosen Tetap",
    expertise: ["Fintech Syariah", "Ekonomi Digital Islam", "Keuangan Mikro Syariah"],
    pendidikan: "S2 Ekonomi Syariah",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Widiawati+Ekonomi+Syariah",
  },
  {
    name: "Ramadhani Irma Tripalupi, M.E.",
    initials: "RT",
    role: "Dosen Tetap",
    expertise: ["Asuransi Syariah (Takaful)", "Perencanaan Keuangan Islam"],
    pendidikan: "S2 Ekonomi Syariah",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Ramadhani+Irma+Tripalupi",
  },
  {
    name: "Dr. Sofian Al Hakim, M.Ag.",
    initials: "SH",
    role: "Dosen Tetap · Lektor Kepala",
    expertise: ["Pariwisata & Ekowisata Halal", "Sosiologi Ekonomi Islam"],
    pendidikan: "S3 Studi Islam — UIN Sunan Gunung Djati Bandung",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Sofian+Al+Hakim+UIN+Sunan+Gunung+Djati",
  },
  {
    name: "Dr. Neneng Hartati, M.Ag.",
    initials: "NH",
    role: "Dosen Tetap · Lektor Kepala",
    expertise: ["Manajemen Pembiayaan Syariah", "Operasional Bank Syariah"],
    pendidikan: "S3 Ekonomi Islam — UIN Sunan Gunung Djati Bandung",
    sinta: "https://sinta.kemdikbud.go.id/",
    scholar: "https://scholar.google.com/citations?hl=id&q=Neneng+Hartati+UIN+Sunan+Gunung+Djati",
  },
];

/** Fasilitas yang dapat diakses mahasiswa. */
export const fasilitas = [
  {
    title: "Galeri Investasi Syariah BEI FEBI",
    description:
      "Diresmikan 13 Oktober 2021 bersama MNC Sekuritas — pusat edukasi, riset data pasar modal, dan praktik investasi saham syariah serta Sekolah Pasar Modal Syariah.",
    image:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Laboratorium Perbankan & Keuangan Syariah",
    description:
      "Fasilitas praktikum mini banking syariah, simulasi akad muamalah, layanan teller/customer service, dan analisis pembiayaan.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Gedung FEBI Kampus 2 Gedebage",
    description:
      "Ruang perkuliahan terpadu, ruang diskusi mahasiswa, dan Aula FEBI untuk seminar nasional, kuliah praktisi, serta kegiatan kemahasiswaan.",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Perpustakaan & Digital Library (Digilib)",
    description:
      "Akses koleksi literatur ekonomi Islam, jurnal terakreditasi SINTA, serta 515+ repositori digital skripsi Ekonomi Syariah.",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Pembelajaran Daring e-Knows",
    description:
      "Learning management system terintegrasi untuk perkuliahan, modul RPS, penugasan, dan evaluasi akademik.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Desa Binaan Ekowisata Halal Indragiri",
    description:
      "Laboratorium pengabdian masyarakat inklusif di Kecamatan Rancabali, Kabupaten Bandung untuk riset ekosistem halal dan pemberdayaan desa.",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
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
  address:
    "Gedung Fakultas Ekonomi dan Bisnis Islam (FEBI), Kampus II UIN Sunan Gunung Djati Bandung",
  street:
    "Jl. Cimencrang, Kec. Gedebage, Kota Bandung 40292 · Kampus I: Jl. A.H. Nasution No. 105, Cibiru, Bandung 40614",
  email: "eksyar@uinsgd.ac.id",
  hours: "Senin–Jumat, 08.00–16.00 WIB",
  instagram: "https://www.instagram.com/eksyaruinsgd/",
  instagramHandle: "@eksyaruinsgd",
  youtube: "https://www.youtube.com/channel/UC7loqPCpEN3H_IbrulKBi6w",
  youtubeUin: "https://www.youtube.com/watch?v=5v_dB2dlyEk",
  linktree: "https://linktr.ee/eksyaruinsgd",
  website: "https://es.uinsgd.ac.id",
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
        description: "Sejarah, visi-misi, mitra, fasilitas",
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
        href: "/prodi/mutu",
        label: "Mutu & data",
        description: "Akreditasi, survei, statistik",
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
        label: "Kalender & agenda",
        description: "Jadwal akademik dan kegiatan",
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
        href: "/prodi/alat",
        label: "Alat & kamus",
        description: "Kalkulator zakat, kamus istilah",
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
        label: "Karier & alumni",
        description: "Lowongan, magang, tracer study",
      },
    ],
  },
  {
    label: "Informasi",
    href: "/prodi/berita",
    items: [
      {
        href: "/prodi/berita",
        label: "Berita & pengumuman",
        description: "Kabar dan informasi resmi",
      },
      {
        href: "/prodi/galeri",
        label: "Galeri",
        description: "Foto dan video kegiatan",
      },
      {
        href: "/prodi/layanan",
        label: "Layanan & formulir",
        description: "Formulir, unduhan, FAQ",
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
  { href: "https://journal.uinsgd.ac.id/index.php/likuid", label: "Jurnal LIKUID" },
  { href: "https://febi.uinsgd.ac.id", label: "FEBI" },
  { href: "https://uinsgd.ac.id", label: "UIN SGD" },
];
