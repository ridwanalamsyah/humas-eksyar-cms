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
import { kamusAwal } from "./kamus-data";
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
  tendik: [
    {
      name: "Staf Administrasi Akademik Prodi Ekonomi Syariah",
      role: "Layanan Administrasi & Persuratan Mahasiswa FEBI",
      photo: null,
    },
    {
      name: "Pengelola Laboratorium & Galeri Investasi Syariah BEI",
      role: "Layanan Praktikum & Literasi Pasar Modal Syariah",
      photo: null,
    },
  ],
  galeri: [
    {
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1000&q=80",
      caption: "115 Mahasiswa Ekonomi Syariah mengikuti Sekolah Pasar Modal Syariah (SPMS) 2026 di Kantor Perwakilan BEI Jawa Barat.",
      album: "Akademik",
      date: "2026-06-08",
    },
    {
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
      caption: "Edukasi Literasi Keuangan Syariah: Keluarga Cerdas Lawan Judol & Pinjol Ilegal bersama GIS BEI FEBI di Kelurahan Padasuka.",
      album: "Pengabdian",
      date: "2026-08-04",
    },
    {
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80",
      caption: "Kuliah Bersama Praktisi Bank Muamalat Indonesia diikuti 120 mahasiswa semester enam di KCP Buahbatu.",
      album: "Akademik",
      date: "2026-04-15",
    },
    {
      image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1000&q=80",
      caption: "Penyerahan Sertifikat Juru Sembelih Halal (Juleha) berbasis SKKNI kepada 15 warga Desa Cibiru Wetan.",
      album: "Pengabdian",
      date: "2026-04-08",
    },
    {
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
      caption: "Penanaman 150 pohon bersama komunitas Sabilulungan Bersih (SABER) menuju Green Halal Village di Desa Indragiri, Rancabali.",
      album: "Desa Binaan",
      date: "2020-11-15",
    },
    {
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80",
      caption: "Focus Group Discussion (FGD) Peninjauan Visi Misi & Kurikulum OBE bersama OJK, Asosiasi Prodi, Praktisi, dan Alumni.",
      album: "Penjaminan Mutu",
      date: "2024-04-25",
    },
  ],
  video: [
    {
      title: "Video Profil Fakultas Ekonomi dan Bisnis Islam (FEBI) UIN Sunan Gunung Djati Bandung",
      url: "https://www.youtube.com/watch?v=rWkNdsULnd0",
      kategori: "Profil Kampus & Fakultas",
    },
    {
      title: "Mengenal UIN Sunan Gunung Djati Bandung — Kampus Unggul dan Kompetitif",
      url: "https://www.youtube.com/watch?v=5v_dB2dlyEk",
      kategori: "Profil Kampus & Fakultas",
    },
    {
      title: "Profil Forum Studi Ekonomi Islam (FoSEI) UIN Sunan Gunung Djati Bandung",
      url: "https://www.youtube.com/watch?v=lw2S5M5PdbQ",
      kategori: "Kemahasiswaan & Kajian",
    },
    {
      title: "Profil Green Kampus UIN Sunan Gunung Djati Bandung",
      url: "https://www.youtube.com/watch?v=S6zX6UChHoY",
      kategori: "Profil Kampus & Fakultas",
    },
    {
      title: "Mengenal Pasar Modal Syariah — Edukasi Investasi Bursa Efek Indonesia (IDX Islamic)",
      url: "https://www.youtube.com/watch?v=ojBWKVTOEew",
      kategori: "Edukasi Ekonomi Syariah",
    },
    {
      title: "Perbedaan Pasar Modal Syariah dan Non-Syariah — Literasi Galeri Investasi Syariah",
      url: "https://www.youtube.com/watch?v=_drkkIMNQmA",
      kategori: "Edukasi Ekonomi Syariah",
    },
  ],
  publikasi: [
    {
      title:
        "Pengaruh Pengetahuan dan Religiusitas terhadap Niat Usaha Mikro dan Kecil Penerima Program Sertifikasi Halal Gratis (SEHATI) 2025 di Jawa Barat",
      authors: "Dr. Evi Sopiah, M.Ag., dkk.",
      year: "2025",
      venue: "JEMSI (Jurnal Ekonomi, Manajemen, dan Akuntansi) Vol. 12 No. 2",
      type: "Artikel jurnal",
      url: "https://journal.uinsgd.ac.id/",
    },
    {
      title:
        "Desa Ekowisata Halal Berbasis Kearifan Lokal dan Nilai Religiusitas: Studi Pemberdayaan Masyarakat Desa Indragiri Kecamatan Rancabali",
      authors: "Dr. H. Muhammad Hasanuddin, M.Ag., Dr. Sofian Al Hakim, M.Ag., Prof. Dr. H. Atang Abd. Hakim, M.A.",
      year: "2020",
      venue: "LIKUID: Jurnal Ekonomi Industri Halal · Arsip Riset Prodi Ekonomi Syariah",
      type: "Penelitian & Pengabdian",
      url: "https://journal.uinsgd.ac.id/index.php/likuid",
    },
    {
      title:
        "Akuntabilitas dan Kepatuhan Syariah dalam Pelaporan Keuangan Lembaga Pengelola Zakat dan Wakaf di Jawa Barat",
      authors: "Dr. H. Endang Jumali, Lc., M.Si., M.Ak.",
      year: "2025",
      venue: "Jurnal Internasional Terindeks Scopus Q2",
      type: "Artikel jurnal",
      url: "https://sinta.kemdikbud.go.id/",
    },
    {
      title:
        "Literasi Wakaf Uang, Religiusitas, dan Altruisme Generasi Z pada Ekosistem Keuangan Sosial Islam di Kota Bandung",
      authors: "Anisa Ilmia, M.E., Suteja Wira Dana Kusuma, M.E.",
      year: "2024",
      venue: "Journal of Islamic Economics and Business (JIEB) FEBI UIN SGD",
      type: "Artikel jurnal",
      url: "https://journal.uinsgd.ac.id/",
    },
    {
      title:
        "Pengaruh Diskon dan Voucher terhadap Keputusan Konsumen untuk Melakukan Pembelian Produk Fashion Halal di Marketplace",
      authors: "Dr. Evi Sopiah, M.Ag., dkk.",
      year: "2024",
      venue: "Al-Muamalat: Jurnal Ekonomi Syariah",
      type: "Artikel jurnal",
      url: "https://journal.uinsgd.ac.id/index.php/mua",
    },
    {
      title:
        "Determinan Penghimpunan Dana ZISWAF dan Stabilitas Makroekonomi terhadap Pengentasan Kemiskinan di Jawa Barat",
      authors: "Annisa Nur Salam, M.E., Reza Fauzi Nazar, M.E.",
      year: "2024",
      venue: "LOBI: Jurnal Laboratorium FEBI UIN SGD",
      type: "Artikel jurnal",
      url: "https://journal.uinsgd.ac.id/",
    },
  ],
  jurnal: [
    {
      name: "LIKUID: Jurnal Ekonomi Industri Halal",
      description:
        "Jurnal ilmiah resmi Program Studi Ekonomi Syariah UIN SGD yang memfokuskan kajian pada industri halal, pariwisata halal, rantai pasok halal, dan bisnis Islam.",
      url: "https://journal.uinsgd.ac.id/index.php/likuid",
    },
    {
      name: "JIEB: Journal of Islamic Economics and Business (SINTA 2)",
      description:
        "Jurnal unggulan Fakultas Ekonomi dan Bisnis Islam (FEBI) UIN SGD terakreditasi nasional SINTA 2 untuk riset ekonomi, keuangan, dan bisnis syariah.",
      url: "https://journal.uinsgd.ac.id/index.php/jieb",
    },
    {
      name: "Al-Muamalat: Jurnal Ekonomi Syariah (SINTA 3)",
      description:
        "Jurnal berkala ilmiah UIN SGD terakreditasi SINTA 3 yang memuat kajian ekonomi Islam, keuangan syariah, inovasi bisnis Islam, dan fiqh muamalah.",
      url: "https://journal.uinsgd.ac.id/index.php/mua",
    },
    {
      name: "Asy-Syari'ah: Jurnal Hukum dan Ekonomi Islam",
      description:
        "Jurnal ilmiah bereputasi di lingkungan UIN SGD yang menjadi rujukan riset hukum ekonomi syariah dan kajian muamalah kontemporer.",
      url: "https://journal.uinsgd.ac.id/index.php/asy-syariah",
    },
    {
      name: "LOBI: Jurnal Laboratorium FEBI",
      description:
        "Terbitan Laboratorium FEBI UIN SGD (Maret & September) yang memuat hasil kajian, penelitian, dan pengabdian di bidang ekonomi, manajemen, dan bisnis Islam.",
      url: "https://journal.uinsgd.ac.id/",
    },
    {
      name: "Rumah Jurnal UIN Sunan Gunung Djati Bandung",
      description:
        "Portal terpadu seluruh jurnal ilmiah terakreditasi di lingkungan UIN Sunan Gunung Djati Bandung.",
      url: "https://ejournal.uinsgd.ac.id/",
    },
  ],
  testimoni: [
    {
      name: "Dr. Evi Sopiah, M.Ag., CIIQA, CIELP",
      role: "Ketua Program Studi Ekonomi Syariah FEBI UIN SGD",
      quote:
        "Kurikulum Ekonomi Syariah dirancang integratif antara fondasi wahyu memandu ilmu dan kompetensi analitis ekonomi modern agar lulusan siap memimpin di industri keuangan syariah maupun ekosistem halal global.",
      photo: null,
    },
    {
      name: "Dr. H. Muhammad Hasanuddin, M.Ag.",
      role: "Dosen & Inisiator Desa Ekowisata Halal Indragiri",
      quote:
        "Tujuan filosofis ekonomi syariah adalah mengantarkan umat manusia menuju kesejahteraan material dan spiritual, jasmani dan rohani, duniawi dan ukhrawi melalui riset yang membumi.",
      photo: null,
    },
    {
      name: "Hakiki Ramadhan",
      role: "Mahasiswa Ekonomi Syariah · Kontributor Islamic Finance News (IFN)",
      quote:
        "Ekosistem akademik di Eksyar UIN SGD membuka akses langsung ke pasar modal syariah BEI, perbankan syariah, hingga publikasi riset internasional.",
      photo: null,
    },
  ],
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
  prosedur: [
    {
      title: "Alur Pengajuan Judul & Seminar Proposal Skripsi",
      description:
        "Panduan resmi tahapan pengajuan topik tugas akhir mahasiswa S1 Ekonomi Syariah FEBI.",
      steps: [
        "Cek kemiripan rencana judul skripsi melalui Direktori Skripsi (515+ arsip Digilib) di website prodi.",
        "Konsultasikan minimal 2 alternatif judul dan outline masalah dengan Dosen Pembimbing Akademik.",
        "Ajukan draf proposal dan berkas persyaratan (KHS, bukti lulus Metodologi Penelitian) ke Sekretariat Prodi.",
        "Ikuti jadwal Seminar Proposal (UP) sesuai penetapan prodi dan lakukan perbaikan naskah bersama dosen pembimbing.",
      ],
      url: "/prodi/skripsi/pojok",
    },
    {
      title: "Alur Praktik Kerja Lapangan (PKL) & Magang Industri",
      description:
        "Prosedur pelaksanaan magang di bank syariah, BEI, BAZNAS, OJK, atau lembaga mitra FEBI.",
      steps: [
        "Pilih instansi mitra (Bank Muamalat, bank bjb syariah, GIS BEI, BAZNAS, UMKM Halal) di semester 6–7.",
        "Ajukan surat pengantar permohonan PKL melalui layanan administrasi FEBI / SALAM.",
        "Laksanakan program magang sesuai bobot SKS dan susun laporan praktik kerja di bawah arahan dosen pembimbing.",
      ],
      url: "/prodi/karier",
    },
    {
      title: "Alur Ujian Komprehensif & Sidang Munaqasyah",
      description:
        "Tahapan akhir penyelesaian studi Sarjana Ekonomi (S.E.) dan unggah mandiri ke Digilib UIN SGD.",
      steps: [
        "Selesaikan seluruh mata kuliah teori (MKU, MKP, MKL) dan daftar Ujian Komprehensif.",
        "Pastikan naskah skripsi telah disetujui pembimbing dan lulus uji kemiripan (Turnitin) sesuai batas maksimal fakultas.",
        "Daftar Sidang Munaqasyah dan unggah berkas final ke repositori Digital Library (digilib.uinsgd.ac.id).",
      ],
      url: "https://digilib.uinsgd.ac.id",
    },
  ],
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
      name: "Jurnal LIKUID Prodi Eksyar",
      description: "Jurnal Ekonomi Industri Halal terbitan resmi Prodi Ekonomi Syariah.",
      url: "https://journal.uinsgd.ac.id/index.php/likuid",
    },
    {
      name: "Website FEBI UIN SGD",
      description: "Portal resmi Fakultas Ekonomi dan Bisnis Islam UIN Bandung.",
      url: "https://febi.uinsgd.ac.id",
    },
    {
      name: "YouTube Resmi FEBI & UIN SGD",
      description: "Dokumentasi video profil, kuliah umum, dan kegiatan akademik.",
      url: "https://www.youtube.com/channel/UC7loqPCpEN3H_IbrulKBi6w",
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
  banner: {
    aktif: true,
    teks: "Direktori 515+ Skripsi Digilib & Arsip Resmi Prodi Ekonomi Syariah telah diperbarui dan bebas malware",
    url: "/prodi/skripsi",
  },
  kamus: kamusAwal,
  lomba: [
    {
      nama: "Indonesia Sharia Economic Festival (ISEF) — Kompetisi Ekonomi Syariah",
      penyelenggara: "Bank Indonesia",
      tingkat: "Nasional",
      deadline: "2026-10-31",
      deskripsi:
        "Kompetisi karya tulis ilmiah, business plan halal, dan debat ekonomi Islam tingkat nasional yang diselenggarakan Bank Indonesia.",
      url: "https://www.bi.go.id/",
    },
    {
      nama: "Sekolah & Kompetisi Pasar Modal Syariah (SPMS)",
      penyelenggara: "Bursa Efek Indonesia (IDX Jawa Barat) & GIS BEI FEBI",
      tingkat: "Nasional",
      deadline: "2026-11-30",
      deskripsi:
        "Program edukasi dan kompetisi analisis portofolio saham syariah bagi mahasiswa Ekonomi Syariah bekerja sama dengan BEI dan MNC Sekuritas.",
      url: "https://www.idx.co.id/",
    },
  ],
  lowongan: [
    {
      title: "Program Magang Operasional & Pembiayaan Bank Muamalat",
      jenis: "Magang",
      deskripsi:
        "Kesempatan Praktik Kerja Lapangan (PKL) bagi mahasiswa semester 6–7 di jaringan Kantor Cabang Bank Muamalat Indonesia wilayah Bandung.",
      deadline: "2026-12-15",
      url: "https://www.bankmuamalat.co.id/",
    },
    {
      title: "Program Duta Maslahah bank bjb syariah",
      jenis: "Beasiswa & Magang",
      deskripsi:
        "Program kolaborasi literasi keuangan syariah dan pengembangan talenta mahasiswa UIN Sunan Gunung Djati Bandung bersama bank bjb syariah.",
      deadline: "2026-11-30",
      url: "https://www.bjbsyariah.co.id/",
    },
    {
      title: "Asisten Riset & Edukasi Galeri Investasi Syariah BEI FEBI",
      jenis: "Relawan Kampus",
      deskripsi:
        "Terbuka bagi mahasiswa Ekonomi Syariah yang berminat mendalami analisis saham syariah dan edukasi literasi investasi masyarakat.",
      deadline: "2026-11-20",
      url: "/prodi/layanan#formulir",
    },
  ],
  topikSkripsi: [
    {
      topik: "Industri Halal, Sertifikasi Halal UMKM (SEHATI), & Ekowisata Halal",
      deskripsi:
        "Analisis perilaku konsumen muslim, kepatuhan sertifikasi halal, rantai pasok halal, serta pemberdayaan desa wisata halal.",
      dosen: "Dr. Evi Sopiah, M.Ag., Dr. H. Muhammad Hasanuddin, M.Ag., Dr. Sofian Al Hakim, M.Ag.",
    },
    {
      topik: "Ekonomi Sosial Islam: Zakat, Infak, Sedekah, & Wakaf Produktif (ZISWAF)",
      deskripsi:
        "Optimalisasi penghimpunan dan pendistribusian dana zakat serta wakaf uang pada BAZNAS, LAZ, dan lembaga filantropi Islam.",
      dosen: "Anisa Ilmia, M.E., Prof. Dr. H. Ahmad Hasan Ridwan, M.Ag., Dr. Dedi Suyandi, M.Ag.",
    },
    {
      topik: "Pasar Modal Syariah, Saham Syariah, & Manajemen Investasi",
      deskripsi:
        "Kinerja indeks saham syariah (JII/ISSI), literasi investasi generasi muda, sukuk, dan manajemen portofolio syariah.",
      dosen: "Suteja Wira Dana Kusuma, M.E., Zia Sidqurrahman, M.E.",
    },
    {
      topik: "Perbankan Syariah, Fintech Syariah, & Keuangan Mikro Islam",
      deskripsi:
        "Analisis pembiayaan murabahah/mudharabah/musyarakah, tata kelola bank syariah, serta adopsi pembayaran dan keuangan digital syariah.",
      dosen: "Reza Fauzi Nazar, M.E., Dr. H. Endang Jumali, Lc., M.Si., M.Ak., Widiawati, M.E.",
    },
  ],
  panduanSkripsi: [
    {
      name: "Cari referensi di Digital Library",
      description: "Repositori skripsi, tesis, dan karya ilmiah UIN SGD.",
      url: "https://digilib.uinsgd.ac.id",
    },
    {
      name: "Rumah Jurnal UIN SGD",
      description: "Jurnal ilmiah untuk referensi penelitian.",
      url: "https://ejournal.uinsgd.ac.id/",
    },
    {
      name: "Jurnal LIKUID: Ekonomi Industri Halal",
      description: "Referensi riset industri halal, pariwisata syariah, dan bisnis Islam.",
      url: "https://journal.uinsgd.ac.id/index.php/likuid",
    },
  ],
  jadwalSidang: [
    {
      tanggal: "2026-11-12",
      jenis: "Seminar Proposal (UP)",
      nama: "Ahmad Fauzan Al-Farisi",
      judul: "Pengaruh Literasi Wakaf Uang dan Kemudahan QRIS terhadap Minat Generasi Z Berwakaf Produktif di Kota Bandung",
      ruang: "Ruang Sidang 1 FEBI Kampus 2",
    },
    {
      tanggal: "2026-11-19",
      jenis: "Sidang Munaqasyah",
      nama: "Siti Nurhaliza Rahmawati",
      judul: "Analisis Kepatuhan Sertifikasi Halal Program SEHATI dan Dampaknya terhadap Omzet UMKM Kuliner di Kabupaten Bandung",
      ruang: "Ruang Sidang Utama FEBI Kampus 2",
    },
    {
      tanggal: "2026-11-26",
      jenis: "Ujian Komprehensif",
      nama: "Gelombang IV Semester Ganjil 2026/2027",
      judul: "Ujian Komprehensif Teori Ekonomi Islam, Fiqh Muamalah, & Keislaman",
      ruang: "Laboratorium FEBI Kampus 2",
    },
    {
      tanggal: "2026-12-03",
      jenis: "Sidang Munaqasyah",
      nama: "Rizky Pratama Putra",
      judul: "Determinan Kinerja Indeks Saham Syariah Indonesia (ISSI) terhadap Stabilitas Makroekonomi Periode 2021–2026",
      ruang: "Ruang Sidang Utama FEBI Kampus 2",
    },
  ],
  rps: [
    {
      mk: "Pengantar Ekonomi Islam",
      semester: "Semester 1",
      url: "https://eknows.uinsgd.ac.id/course/index.php?categoryid=40",
      referensi: [
        "Prinsip dasar dan filosofi ekonomi Islam (Wahyu Memandu Ilmu)",
        "Sejarah pemikiran dan sistem ekonomi Islam vs konvensional",
      ],
    },
    {
      mk: "Fiqh Muamalah & Ushul Fiqh Ekonomi",
      semester: "Semester 2–3",
      url: "https://eknows.uinsgd.ac.id/course/index.php?categoryid=40",
      referensi: [
        "Teori akad tijarah dan tabarru dalam transaksi keuangan kontemporer",
        "Fatwa DSN-MUI terkait lembaga keuangan dan bisnis syariah",
      ],
    },
    {
      mk: "Ekonomi Mikro & Makro Islam",
      semester: "Semester 3–4",
      url: "https://eknows.uinsgd.ac.id/course/index.php?categoryid=40",
      referensi: [
        "Teori konsumsi, produksi, dan mekanisme pasar berkeadilan dalam Islam",
        "Kebijakan fiskal, moneter bebas riba, dan stabilitas ekonomi makro",
      ],
    },
    {
      mk: "Manajemen ZISWAF & Industri Halal",
      semester: "Semester 4–5",
      url: "https://eknows.uinsgd.ac.id/course/index.php?categoryid=40",
      referensi: [
        "Tata kelola penghimpunan dan pendayagunaan zakat & wakaf produktif",
        "Regulasi jaminan produk halal, sertifikasi halal UMKM, dan ekowisata halal",
      ],
    },
  ],
  peminatan: [
    {
      nama: "Perbankan, Pasar Modal & Fintech Syariah",
      deskripsi:
        "Mempersiapkan analis keuangan, praktisi perbankan syariah, manajer investasi pasar modal syariah, dan inovator teknologi finansial syariah.",
      mataKuliah: [
        "Bank & Lembaga Keuangan Syariah",
        "Pasar Modal Syariah",
        "Manajemen Keuangan Syariah",
        "Analisis Laporan Keuangan Syariah",
        "Fintech Syariah & Ekonomi Digital",
      ],
      karier: [
        "Analis Pembiayaan Bank Syariah",
        "Investment Specialist Pasar Modal Syariah",
        "Product Manager Fintech Syariah",
        "Auditor & Kepatuhan Syariah",
      ],
    },
    {
      nama: "Ekonomi Sosial Islam (ZISWAF) & Pemberdayaan",
      deskripsi:
        "Fokus pada pengelolaan zakat, infak, sedekah, dan wakaf produktif secara profesional untuk pengentasan kemiskinan dan pemberdayaan umat.",
      mataKuliah: [
        "Manajemen ZISWAF",
        "Ekonomi Pembangunan Islam",
        "Filsafat Ekonomi Syariah",
        "Akuntansi Syariah",
      ],
      karier: [
        "Manajer Program BAZNAS / LAZ",
        "Nazhir Wakaf Produktif Profesional",
        "Spesialis CSR & Pemberdayaan Masyarakat",
      ],
    },
    {
      nama: "Industri Halal, Kewirausahaan & Ekowisata Syariah",
      deskripsi:
        "Mengembangkan ekosistem bisnis halal, pendampingan sertifikasi halal UMKM, rantai pasok halal, serta inovasi desa ekowisata halal.",
      mataKuliah: [
        "Industri Halal & Ekowisata Syariah",
        "Kewirausahaan Syariah",
        "Etika Bisnis Syariah",
        "Ekonomi Kreatif",
      ],
      karier: [
        "Penyelia & Konsultan Industri Halal",
        "Wirausaha Bisnis Syariah",
        "Pengembang Destinasi Ekowisata Halal",
      ],
    },
  ],
  apresiasi: [],
  statusLayanan: {
    status: "normal",
    pesan: "Layanan akademik Prodi Ekonomi Syariah beroperasi normal (Senin–Jumat, 08.00–16.00 WIB di Gedung FEBI Kampus 2).",
  },
  struktur: pimpinan.map((p, i) => ({
    jabatan: p.role,
    nama: p.name,
    level: i === 0 ? 1 : 2,
  })),
  statistik: [
    { tahun: "2023", mahasiswaAktif: 740, mahasiswaBaru: 195, lulusan: 142, dosen: 20 },
    { tahun: "2024", mahasiswaAktif: 785, mahasiswaBaru: 210, lulusan: 158, dosen: 21 },
    { tahun: "2025", mahasiswaAktif: 820, mahasiswaBaru: 220, lulusan: 165, dosen: 22 },
    { tahun: "2026", mahasiswaAktif: 850, mahasiswaBaru: 225, lulusan: 172, dosen: 22 },
  ],
  infografis: [
    {
      judul: "Katalog Skripsi Ekonomi Syariah di Digilib UIN SGD",
      deskripsi:
        "Rekapitulasi jumlah karya ilmiah skripsi S1 Ekonomi Syariah yang terindeks resmi di repositori Digital Library UIN Sunan Gunung Djati Bandung.",
      satuan: "Skripsi",
      sumber: "digilib.uinsgd.ac.id (Divisi Prodi Ekonomi Syariah)",
      data: [
        { label: "2018–2020", nilai: 78 },
        { label: "2021–2022", nilai: 112 },
        { label: "2023", nilai: 96 },
        { label: "2024", nilai: 104 },
        { label: "2025–2026", nilai: 125 },
      ],
    },
  ],
  ruangAlat: [
    {
      name: "Aula & Auditorium FEBI Kampus 2",
      description: "Kapasitas 250 peserta untuk seminar nasional, studium generale, dan kegiatan HMJ Ekonomi Syariah.",
      image: null,
    },
    {
      name: "Galeri Investasi Syariah (GIS) BEI FEBI",
      description: "Ruang edukasi, terminal data pasar modal syariah, dan diskusi kelompok studi pasar modal.",
      image: null,
    },
    {
      name: "Laboratorium Mini Banking & Keuangan Syariah",
      description: "Ruang praktikum operasional bank syariah, simulasi akad muamalah, dan pelatihan aplikasi keuangan.",
      image: null,
    },
    {
      name: "Ruang Sidang Munaqasyah & Diskusi Prodi",
      description: "Ruang seminar proposal, ujian komprehensif, sidang skripsi, dan rapat kepanitiaan mahasiswa.",
      image: null,
    },
  ],
  wisuda: [],
  karya: [],
  panduanMaba: [
    {
      name: "Aktifkan akun SALAM",
      description: "Portal akademik untuk KRS, nilai, dan tagihan UKT.",
      url: "https://simak.uinsgd.ac.id/beranda/",
    },
    {
      name: "Masuk ke e-Knows",
      description: "Kelas daring dan materi kuliah.",
      url: "https://eknows.uinsgd.ac.id",
    },
    {
      name: "Pelajari tata cara pembayaran UKT",
      description: "Bayar lewat SALAM di bank mitra UIN SGD.",
      url: "https://uinsgd.ac.id/tata-cara-pembayaran-ukt/",
    },
    {
      name: "Unduh kalender akademik",
      description: "Jadwal perkuliahan, ujian, dan libur semester.",
      url: "https://s.id/KalenderAkademik2026_2027",
    },
  ],
  integritas: [
    "Skripsi dan tugas kuliah harus merupakan karya sendiri. Setiap gagasan, data, atau kutipan dari orang lain wajib dicantumkan sumbernya sesuai gaya sitasi yang ditetapkan pedoman penulisan.",
    "Gunakan aplikasi pengelola referensi (misalnya Mendeley atau Zotero) agar sitasi dan daftar pustaka rapi dan konsisten.",
    "Periksa kemiripan naskah sebelum dikumpulkan sesuai ketentuan prodi/fakultas, dan konsultasikan hasilnya dengan dosen pembimbing.",
    "Penggunaan alat bantu AI untuk menulis harus mengikuti ketentuan dosen dan prodi. Hasil AI tidak boleh diakui sebagai karya sendiri tanpa pengungkapan.",
  ],
  sertifikat: [
    {
      kode: "EKSYAR-2610-AB12C",
      nama: "Hakiki Ramadhan",
      kegiatan: "Seminar Karir & Literasi Industri Keuangan Syariah 2026",
      peran: "Peserta Terbaik",
      tanggal: "2026-06-19",
    },
    {
      kode: "EKSYAR-2606-SPMS01",
      nama: "Muhamad Halabi Muzaini",
      kegiatan: "Sekolah Pasar Modal Syariah (SPMS) 2026 di Kantor Perwakilan BEI Jawa Barat",
      peran: "Peserta",
      tanggal: "2026-06-08",
    },
    {
      kode: "EKSYAR-2608-GISPKM",
      nama: "Tim Galeri Investasi Syariah BEI FEBI",
      kegiatan: "Pengabdian Masyarakat: Keluarga Cerdas Lawan Judol & Pinjol lewat Investasi Syariah",
      peran: "Pemateri & Fasilitator",
      tanggal: "2026-08-04",
    },
    {
      kode: "EKSYAR-2604-JULEHA",
      nama: "Panitia Pelatihan Juru Sembelih Halal FEBI",
      kegiatan: "Pelatihan & Sertifikasi Juru Sembelih Halal (Juleha) Berbasis SKKNI di Desa Cibiru Wetan",
      peran: "Tim Pengabdi",
      tanggal: "2026-04-08",
    },
  ],
  pressKit: {
    profilSingkat:
      "Program Studi Ekonomi Syariah adalah program sarjana (S.E.) di Fakultas Ekonomi dan Bisnis Islam UIN Sunan Gunung Djati Bandung yang mengkaji ekonomi dan keuangan berdasarkan prinsip syariah, meliputi perbankan dan keuangan syariah, zakat dan wakaf, industri halal, serta kebijakan ekonomi.",
    kontakMedia: kontak.email,
  },
  sorotan: [
    {
      nilai: "115",
      judul: "Pasar modal syariah",
      keterangan:
        "mahasiswa mengikuti Sekolah Pasar Modal Syariah 2026 di Kantor Perwakilan BEI Jawa Barat.",
    },
    {
      nilai: "15",
      judul: "Pengabdian masyarakat",
      keterangan:
        "warga Desa Cibiru Wetan meraih sertifikat Juru Sembelih Halal lewat pelatihan berbasis SKKNI.",
    },
  ],
  kampanyePmb: { aktif: false, judul: "", teks: "", tenggat: "" },
  zakat: {
    nisabPenghasilanTahun: 91681728,
    hargaEmas: 0,
    nisabGram: 85,
    sumber: "SK Ketua BAZNAS No. 15 Tahun 2026 (nisab zakat pendapatan)",
    diperbarui: "2026-02-25",
  },
  medsos: {
    youtubeChannelId: "UC7loqPCpEN3H_IbrulKBi6w",
    whatsappChannel: "https://whatsapp.com/channel/0029VaeksyarUINSGD",
  },
  mutu: {
    description:
      "Penjaminan mutu prodi mengikuti Sistem Penjaminan Mutu Internal (SPMI) UIN SGD. Visi, misi, dan kurikulum ditinjau berkala bersama asosiasi program studi, regulator, praktisi industri, alumni, dan mahasiswa.",
    surveiUrl: "/prodi/formulir/saran",
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
    {
      title: "Repositori 515+ Skripsi S1 Ekonomi Syariah (Digilib UIN SGD)",
      category: "Skripsi & Riset",
      description: "Akses naskah lengkap skripsi mahasiswa Ekonomi Syariah tahun 2018–2026.",
      url: "https://digilib.uinsgd.ac.id",
    },
    {
      title: "Portal E-Learning & RPS Mata Kuliah Ekonomi Syariah (e-Knows)",
      category: "Kurikulum & RPS",
      description: "Silabus, kontrak belajar, dan materi perkuliahan daring S1 Ekonomi Syariah.",
      url: "https://eknows.uinsgd.ac.id/course/index.php?categoryid=40",
    },
    {
      title: "Template Artikel Jurnal LIKUID (Ekonomi Industri Halal)",
      category: "Publikasi Ilmiah",
      description: "Panduan penulisan dan template publikasi jurnal resmi Prodi Ekonomi Syariah.",
      url: "https://journal.uinsgd.ac.id/index.php/likuid",
    },
    {
      title: "Panduan Pembayaran UKT & Layanan Akademik SALAM",
      category: "Administrasi",
      description: "Petunjuk resmi pembayaran Uang Kuliah Tunggal melalui bank mitra UIN SGD.",
      url: "https://uinsgd.ac.id/tata-cara-pembayaran-ukt/",
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
    whatsapp: "https://wa.me/6281220001997",
  },
};
