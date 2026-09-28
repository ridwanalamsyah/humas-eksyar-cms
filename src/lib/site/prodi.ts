/**
 * Profil statis Program Studi Ekonomi Syariah untuk website publik (/prodi).
 *
 * Konten dinamis (berita & agenda) diambil dari CMS lewat data provider.
 * Data di file ini adalah profil yang jarang berubah — edit langsung di sini.
 *
 * PENTING: angka statistik, status akreditasi, nama pimpinan, dan kontak di
 * bawah masih contoh. Verifikasi dengan data resmi prodi sebelum go-live.
 */

export const prodi = {
  name: "Ekonomi Syariah",
  fullName: "Program Studi Ekonomi Syariah",
  degree: "Sarjana Ekonomi (S.E.)",
  level: "S1",
  faculty: "Fakultas Ekonomi dan Bisnis Islam",
  university: "UIN Sunan Gunung Djati Bandung",
  tagline: "Eksyar Satu, Victory in Harmony!",
  heroTitle: "Membangun ekonom muda yang",
  heroHighlight: "amanah, analitis, dan berdaya saing global.",
  heroDescription:
    "Program Studi Ekonomi Syariah memadukan ilmu ekonomi modern dengan prinsip muamalah Islam — menyiapkan lulusan untuk perbankan syariah, industri halal, filantropi Islam, dan riset kebijakan.",
  // TODO: verifikasi status akreditasi terbaru.
  accreditation: "Terakreditasi",
  accreditationBody: "BAN-PT / LAMEMBA",
  totalCredits: 144,
  studyDuration: "8 Semester",
};

// TODO: ganti dengan angka resmi dari prodi.
export const stats = [
  { value: "1.200+", label: "Mahasiswa aktif" },
  { value: "30+", label: "Dosen & praktisi" },
  { value: "40+", label: "Mitra industri & lembaga" },
  { value: "3.000+", label: "Alumni tersebar" },
];

export const sambutan = {
  // TODO: isi nama & foto Ketua Program Studi.
  name: "Ketua Program Studi",
  role: "Ketua Program Studi Ekonomi Syariah",
  quote:
    "Ekonomi syariah bukan sekadar label, melainkan cara pandang yang menempatkan keadilan, keberkahan, dan kemaslahatan di pusat aktivitas ekonomi. Kami mengajak generasi muda untuk tumbuh menjadi ekonom yang kompeten secara ilmu dan kokoh secara akhlak.",
};

export const visi =
  "Menjadi program studi Ekonomi Syariah yang unggul dan kompetitif dalam pengembangan ilmu ekonomi berbasis wahyu memandu ilmu, berakhlakul karimah, dan berdaya saing di tingkat nasional maupun internasional.";

export const misi = [
  "Menyelenggarakan pendidikan ekonomi syariah yang integratif, adaptif terhadap perkembangan teknologi, dan berorientasi pada kebutuhan industri.",
  "Mengembangkan penelitian ekonomi dan keuangan syariah yang relevan dengan persoalan umat dan kebijakan publik.",
  "Melaksanakan pengabdian kepada masyarakat melalui pemberdayaan ekonomi umat, literasi keuangan syariah, dan penguatan UMKM halal.",
  "Membangun jejaring kerja sama dengan lembaga keuangan, industri halal, pemerintah, dan perguruan tinggi dalam dan luar negeri.",
];

export const keunggulan = [
  {
    icon: "Landmark",
    title: "Integrasi Ilmu & Syariah",
    description:
      "Kurikulum memadukan teori ekonomi modern, fiqh muamalah, dan etika bisnis Islam dalam satu kerangka keilmuan.",
  },
  {
    icon: "Briefcase",
    title: "Praktik Industri",
    description:
      "Magang di bank syariah, LAZ, dan pelaku industri halal, ditambah kelas praktisi setiap semester.",
  },
  {
    icon: "LineChart",
    title: "Laboratorium Ekonomi",
    description:
      "Lab bank mini syariah, galeri investasi, dan lab data untuk analisis ekonometrika & riset pasar.",
  },
  {
    icon: "Globe2",
    title: "Jejaring Global",
    description:
      "Program pertukaran, konferensi internasional, dan kolaborasi riset dengan kampus mitra di luar negeri.",
  },
  {
    icon: "Award",
    title: "Sertifikasi Profesi",
    description:
      "Pendampingan sertifikasi perbankan syariah, pasar modal syariah, dan amil zakat sebelum lulus.",
  },
  {
    icon: "Users",
    title: "Ekosistem Mahasiswa",
    description:
      "Himpunan mahasiswa yang aktif, KSEI, komunitas riset, dan kompetisi nasional yang rutin berprestasi.",
  },
] as const;

export const konsentrasi = [
  {
    title: "Perbankan & Keuangan Syariah",
    description:
      "Operasional bank syariah, manajemen risiko, pasar modal syariah, dan fintech syariah.",
    topics: ["Bank & LKS", "Pasar Modal Syariah", "Fintech Syariah", "Manajemen Risiko"],
  },
  {
    title: "Manajemen ZISWAF",
    description:
      "Pengelolaan zakat, infak, sedekah, dan wakaf produktif untuk pemberdayaan ekonomi umat.",
    topics: ["Manajemen Zakat", "Wakaf Produktif", "Filantropi Islam", "Social Finance"],
  },
  {
    title: "Bisnis & Industri Halal",
    description:
      "Rantai pasok halal, kewirausahaan syariah, pemasaran, dan sertifikasi produk halal.",
    topics: ["Halal Supply Chain", "Kewirausahaan", "Pemasaran Syariah", "Sertifikasi Halal"],
  },
];

export type KurikulumYear = {
  label: string;
  semesters: { name: string; courses: string[] }[];
};

export const kurikulum: KurikulumYear[] = [
  {
    label: "Tahun 1",
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
    label: "Tahun 2",
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
    label: "Tahun 3",
    semesters: [
      {
        name: "Semester 5",
        courses: [
          "Ekonomi Pembangunan Islam",
          "Asuransi Syariah",
          "Industri Halal",
          "Metodologi Penelitian Ekonomi",
          "Mata Kuliah Konsentrasi I",
        ],
      },
      {
        name: "Semester 6",
        courses: [
          "Kebijakan Fiskal & Moneter Islam",
          "Fintech Syariah",
          "Kewirausahaan Syariah",
          "Seminar Proposal",
          "Mata Kuliah Konsentrasi II",
        ],
      },
    ],
  },
  {
    label: "Tahun 4",
    semesters: [
      {
        name: "Semester 7",
        courses: ["Praktik Kerja Lapangan (Magang)", "Kuliah Kerja Nyata", "Mata Kuliah Konsentrasi III"],
      },
      {
        name: "Semester 8",
        courses: ["Skripsi / Tugas Akhir", "Komprehensif"],
      },
    ],
  },
];

export const prospekKarir = [
  { icon: "Building2", title: "Bankir Syariah", description: "Bank umum & BPR syariah, unit usaha syariah." },
  { icon: "TrendingUp", title: "Analis Keuangan & Investasi", description: "Sekuritas, manajer investasi, pasar modal syariah." },
  { icon: "ShieldCheck", title: "Auditor & Pengawas Syariah", description: "KAP, DPS, dan lembaga audit syariah." },
  { icon: "HandHeart", title: "Amil & Manajer Filantropi", description: "BAZNAS, LAZ, badan wakaf, dan CSR korporasi." },
  { icon: "Scale", title: "Regulator & ASN", description: "OJK, Bank Indonesia, Kemenag, dan kementerian ekonomi." },
  { icon: "Store", title: "Wirausaha & Konsultan Halal", description: "Startup, UMKM halal, dan konsultan bisnis syariah." },
  { icon: "BookOpenText", title: "Peneliti & Akademisi", description: "Dosen, peneliti, dan analis kebijakan ekonomi." },
  { icon: "Cpu", title: "Profesional Fintech", description: "Produk, compliance, dan riset di perusahaan fintech syariah." },
] as const;

// TODO: ganti dengan testimoni alumni asli (nama, angkatan, instansi).
export const testimoni = [
  {
    quote:
      "Kombinasi fiqh muamalah dan analisis keuangan di kelas sangat terpakai di pekerjaan saya sehari-hari sebagai analis pembiayaan.",
    name: "Alumni Angkatan 2017",
    role: "Analis Pembiayaan, Bank Syariah",
  },
  {
    quote:
      "Pengalaman magang di lembaga zakat membuka mata saya bahwa ekonomi syariah punya dampak sosial yang sangat nyata.",
    name: "Alumni Angkatan 2018",
    role: "Program Officer, Lembaga Amil Zakat",
  },
  {
    quote:
      "Dosen-dosennya terbuka untuk diskusi riset. Skripsi saya bahkan berlanjut jadi publikasi di jurnal nasional.",
    name: "Alumni Angkatan 2019",
    role: "Peneliti Ekonomi Islam",
  },
];

export const jalurMasuk = [
  { title: "SNBP", description: "Seleksi nasional berdasarkan prestasi rapor & portofolio." },
  { title: "SNBT", description: "Seleksi nasional berdasarkan hasil Tes Terstandar (UTBK)." },
  { title: "UM-PTKIN", description: "Ujian masuk bersama Perguruan Tinggi Keagamaan Islam Negeri." },
  { title: "Mandiri", description: "Seleksi mandiri UIN Sunan Gunung Djati Bandung." },
];

export const faq = [
  {
    q: "Apa gelar lulusan Program Studi Ekonomi Syariah?",
    a: "Lulusan memperoleh gelar Sarjana Ekonomi (S.E.) setelah menyelesaikan minimal 144 SKS, umumnya dalam 8 semester.",
  },
  {
    q: "Apakah harus lulusan pesantren atau madrasah?",
    a: "Tidak. Prodi terbuka untuk lulusan SMA, SMK, MA, maupun pesantren yang setara. Materi dasar keislaman dan bahasa Arab diberikan sejak semester awal.",
  },
  {
    q: "Apa bedanya Ekonomi Syariah dengan Perbankan Syariah?",
    a: "Ekonomi Syariah mempelajari ekonomi secara luas — mikro, makro, kebijakan, keuangan sosial, dan industri halal. Perbankan Syariah lebih fokus pada operasional lembaga keuangan.",
  },
  {
    q: "Apakah ada program magang dan beasiswa?",
    a: "Ada. Mahasiswa wajib magang di semester akhir, dan tersedia berbagai beasiswa dari kampus, pemerintah, lembaga zakat, serta mitra perbankan.",
  },
  {
    q: "Bagaimana cara mendaftar?",
    a: "Pendaftaran mengikuti jalur resmi UIN Sunan Gunung Djati Bandung (SNBP, SNBT, UM-PTKIN, dan Mandiri). Informasi jadwal lengkap tersedia di portal PMB kampus.",
  },
];

export const kontak = {
  address:
    "Fakultas Ekonomi dan Bisnis Islam, UIN Sunan Gunung Djati Bandung, Jl. A.H. Nasution No. 105, Cibiru, Kota Bandung, Jawa Barat 40614",
  email: "humas.eksyar@uinsgd.ac.id",
  instagram: "https://instagram.com/eksyaruinsgd",
  tiktok: "https://tiktok.com/@eksyaruinsgd",
  pmbUrl: "https://pmb.uinsgd.ac.id",
  mapsUrl: "https://maps.google.com/?q=UIN+Sunan+Gunung+Djati+Bandung",
};

export const navLinks = [
  { href: "/prodi#tentang", label: "Tentang" },
  { href: "/prodi#kurikulum", label: "Kurikulum" },
  { href: "/prodi#karir", label: "Karir" },
  { href: "/prodi/berita", label: "Berita" },
  { href: "/prodi#pmb", label: "Pendaftaran" },
  { href: "/prodi#kontak", label: "Kontak" },
];
