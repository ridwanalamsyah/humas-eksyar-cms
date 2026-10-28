import type { ContentItem, CaptionTemplate } from "@/lib/data/types";

export const HASHTAG_BLOCK =
  "#HumasEksyar #EkonomiSyariahUINSGD #FEBIUINSGD #EksyarUINSGD #UINSunanGunungDjati #EkonomiIslam #HalalEcotourism";

/**
 * Arsip berita, pengumuman, dan artikel resmi Program Studi Ekonomi Syariah
 * FEBI UIN Sunan Gunung Djati Bandung — hasil pemulihan & sanitasi dari
 * arsip bersih `es.uinsgd.ac.id` (2019–2022) serta publikasi resmi UIN SGD
 * & FEBI (2024–2026). Seluruh entri telah melewati `sanitizeLegacyContent()`
 * bebas dari injeksi spam/malware.
 */
export const contents: ContentItem[] = [
  {
    id: "cnt-spms-2026",
    title: "Mahasiswa Ekonomi Syariah UIN SGD Ikuti Sekolah Pasar Modal Syariah 2026 di BEI Jawa Barat",
    slug: "sekolah-pasar-modal-syariah-2026-bei-jawa-barat",
    rubric: "eksyar_talks",
    status: "published",
    divisionId: "div-humas-eksyar",
    authorId: "mbr-ridwan",
    body: `Program Studi Ekonomi Syariah Fakultas Ekonomi dan Bisnis Islam (FEBI) UIN Sunan Gunung Djati Bandung bersama Galeri Investasi Syariah (GIS) menyelenggarakan Sekolah Pasar Modal Syariah (SPMS) 2026 di Kantor Perwakilan Bursa Efek Indonesia (BEI) Jawa Barat, Jalan PH.H. Mustofa, Bandung.

Kegiatan ini dibuka oleh Ketua Program Studi Ekonomi Syariah, Dr. Evi Sopiah, M.Ag., yang menegaskan pentingnya literasi investasi pasar modal syariah bagi mahasiswa sebagai calon ekonom dan praktisi keuangan Islam.

## Materi & Simulasi SOTS
Para peserta mendapatkan pemaparan langsung mengenai mekanisme perdagangan saham syariah, penyaringan efek dalam Daftar Efek Syariah (DES) dan Indeks Saham Syariah Indonesia (ISSI), fatwa DSN-MUI Nomor 80/DSN-MUI/III/2011 tentang Penerapan Prinsip Syariah dalam Mekanisme Perdagangan Efek Bersifat Ekuitas di Pasar Reguler Bursa Efek, serta praktik langsung pembukaan rekening efek syariah melalui Shariah Online Trading System (SOTS).

Melalui program berkelanjutan bersama GIS FEBI dan KSPM UIN SGD, diharapkan mahasiswa mampu menjadi duta literasi investasi halal yang cerdas dan terhindar dari praktik investasi ilegal maupun spekulasi terlarang.`,
    caption:
      "Alhamdulillah, 120 mahasiswa Ekonomi Syariah FEBI UIN SGD mengikuti Sekolah Pasar Modal Syariah (SPMS) 2026 bersama BEI Jawa Barat & Galeri Investasi Syariah FEBI! Belajar langsung mekanisme ISSI, fatwa DSN-MUI, dan simulasi Shariah Online Trading System (SOTS).",
    hashtags: "#HumasEksyar #PasarModalSyariah #GISFEBI #EkonomiSyariahUINSGD #UINSGD",
    channels: ["instagram", "linktree"],
    mediaIds: [],
    scheduledFor: "2026-02-12T09:00:00.000Z",
    publishedAt: "2026-02-12T10:30:00.000Z",
    approvers: ["mbr-evi"],
    waitingOn: [],
    createdAt: "2026-02-11T14:00:00.000Z",
    updatedAt: "2026-02-12T10:30:00.000Z",
    metrics: {
      views: 1420,
      likes: 218,
      comments: 19,
      shares: 64,
      saves: 85,
      reach: 2840,
      engagementRate: 0.136,
      sentiment: 0.92,
    },
  },
  {
    id: "cnt-pkm-judol-pinjol-2025",
    title: "PKM Dosen & Mahasiswa Ekonomi Syariah: Edukasi Keluarga Cerdas Lawan Judol dan Pinjol Ilegal Lewat Investasi Syariah",
    slug: "pkm-edukasi-keluarga-cerdas-lawan-judol-pinjol-investasi-syariah",
    rubric: "kajian",
    status: "published",
    divisionId: "div-humas-eksyar",
    authorId: "mbr-alya",
    body: `Merespons maraknya kasus judi online (judol) dan pinjaman online (pinjol) ilegal yang menggerus ketahanan ekonomi rumah tangga, dosen dan mahasiswa Program Studi Ekonomi Syariah FEBI UIN Sunan Gunung Djati Bandung menyelenggarakan Pengabdian kepada Masyarakat (PKM) bertajuk "Keluarga Cerdas Finansial: Menangkal Judol & Pinjol Ilegal melalui Perencanaan Keuangan dan Investasi Syariah".

## Tiga Pilar Ketahanan Finansial Keluarga
Dalam pemaparannya, tim dosen Ekonomi Syariah menekankan tiga langkah praktis bagi masyarakat:
1. **Literasi Akad & Larangan Maisir/Riba**: Memahami bahaya maisir (perjudian spekulatif) dan riba berlipat ganda pada pinjol ilegal dari perspektif fikih muamalah dan regulasi OJK.
2. **Manajemen Kas & Dana Darurat Rumah Tangga**: Menyusun anggaran keluarga berbasis prioritas maqashid syariah (hifzh al-mal).
3. **Instrumen Keuangan & Investasi Syariah Resmi**: Mengenal produk tabungan emas syariah, sukuk ritel, dan koperasi syariah/BMT yang terdaftar serta diawasi OJK dan DSN-MUI.

Kegiatan ini juga disertai klinik konsultasi keuangan keluarga gratis yang disambut antusias oleh perangkat desa, tokoh masyarakat, dan pelaku UMKM setempat.`,
    caption:
      "Lawan bahaya Judol & Pinjol Ilegal mulai dari literasi keuangan keluarga! Tim PKM Dosen & Mahasiswa Ekonomi Syariah FEBI UIN SGD hadir mendampingi masyarakat menyusun perencanaan keuangan syariah yang berkah, aman, dan berdaya.",
    hashtags: "#HumasEksyar #LiterasiKeuanganSyariah #PKMEksyar #FEBIUINSGD",
    channels: ["instagram", "linktree"],
    mediaIds: [],
    scheduledFor: "2025-11-18T08:00:00.000Z",
    publishedAt: "2025-11-18T09:15:00.000Z",
    approvers: ["mbr-anisa-ilmia"],
    waitingOn: [],
    createdAt: "2025-11-17T13:00:00.000Z",
    updatedAt: "2025-11-18T09:15:00.000Z",
    metrics: {
      views: 1980,
      likes: 342,
      comments: 28,
      shares: 115,
      saves: 140,
      reach: 4120,
      engagementRate: 0.151,
      sentiment: 0.95,
    },
  },
  {
    id: "cnt-kuliah-praktisi-muamalat-2025",
    title: "Kuliah Praktisi bersama Bank Muamalat Indonesia: Transformasi Digital dan Manajemen Risiko Perbankan Syariah",
    slug: "kuliah-praktisi-bank-muamalat-transformasi-digital-perbankan-syariah",
    rubric: "eksyar_talks",
    status: "published",
    divisionId: "div-humas-eksyar",
    authorId: "mbr-husen",
    body: `Program Studi Ekonomi Syariah FEBI UIN Sunan Gunung Djati Bandung menggelar Kuliah Praktisi bersama manajemen PT Bank Muamalat Indonesia Tbk di Auditorium FEBI Kampus 1 Cibiru.

Hadir sebagai narasumber utama praktisi perbankan syariah yang mengupas penerapan akad murabahah, musyarakah mutanaqishah (MMQ), serta pengelolaan risiko pembiayaan (Non-Performing Financing) di era digital banking.

Wakil Dekan I FEBI, Dr. Iwan Setiawan, S.Ag., M.Pd., M.E.Sy., menyampaikan bahwa kolaborasi kurikulum dengan industri perbankan syariah memastikan lulusan Ekonomi Syariah UIN SGD memiliki kompetensi aplikatif yang selaras dengan kebutuhan industri keuangan syariah nasional.`,
    caption:
      "Kuliah Praktisi Prodi Ekonomi Syariah bersama Bank Muamalat Indonesia: membedah transformasi digital banking syariah dan kesiapan karier mahasiswa FEBI UIN SGD.",
    hashtags: "#HumasEksyar #PerbankanSyariah #BankMuamalat #FEBIUINSGD",
    channels: ["instagram", "linktree"],
    mediaIds: [],
    scheduledFor: "2025-10-08T09:00:00.000Z",
    publishedAt: "2025-10-08T11:00:00.000Z",
    approvers: ["mbr-evi"],
    waitingOn: [],
    createdAt: "2025-10-07T15:00:00.000Z",
    updatedAt: "2025-10-08T11:00:00.000Z",
    metrics: {
      views: 1150,
      likes: 184,
      comments: 12,
      shares: 41,
      saves: 63,
      reach: 2300,
      engagementRate: 0.13,
      sentiment: 0.89,
    },
  },
  {
    id: "cnt-juleha-halal-2025",
    title: "Sinergi Ekosistem Halal: Pelatihan & Pendampingan Sertifikasi Juru Sembelih Halal (Juleha) dan UMKM Pangan",
    slug: "pelatihan-pendampingan-sertifikasi-juleha-dan-umkm-halal",
    rubric: "bisnis_halal",
    status: "published",
    divisionId: "div-humas-eksyar",
    authorId: "mbr-arisman",
    body: `Dalam rangka memperkuat ekosistem industri halal di Jawa Barat, Program Studi Ekonomi Syariah FEBI UIN Sunan Gunung Djati Bandung berkolaborasi dengan Lembaga Pendamping Proses Produk Halal (LP3H) menyelenggarakan pelatihan Juru Sembelih Halal (Juleha) dan pendampingan sertifikasi halal bagi pelaku UMKM pangan di kawasan Bandung Timur.

Peserta mendapatkan pembekalan fikih penyembelihan, standar kesejahteraan hewan (animal welfare), titik kritis kehalalan bahan baku, hingga asistensi pendaftaran sertifikat halal melalui sistem SIHALAL BPJPH.`,
    caption:
      "Memperkuat rantai nilai halal dari hulu ke hilir: Prodi Ekonomi Syariah FEBI UIN SGD mendampingi pelatihan Juru Sembelih Halal (Juleha) dan sertifikasi halal UMKM Bandung Timur.",
    hashtags: "#HumasEksyar #IndustriHalal #Juleha #UMKMHalal #UINSGD",
    channels: ["instagram", "linktree"],
    mediaIds: [],
    scheduledFor: "2025-08-21T08:00:00.000Z",
    publishedAt: "2025-08-21T10:00:00.000Z",
    approvers: ["mbr-anisa-ilmia"],
    waitingOn: [],
    createdAt: "2025-08-20T16:00:00.000Z",
    updatedAt: "2025-08-21T10:00:00.000Z",
    metrics: {
      views: 980,
      likes: 165,
      comments: 11,
      shares: 38,
      saves: 52,
      reach: 1960,
      engagementRate: 0.135,
      sentiment: 0.91,
    },
  },
  {
    id: "cnt-pengumuman-ukt-sempro-2026",
    title: "Pengumuman Resmi: Jadwal Pendaftaran Seminar Proposal (Sempro), Ujian Komprehensif, dan Munaqosyah Semester Genap 2025/2026",
    slug: "pengumuman-jadwal-sempro-komprehensif-munaqosyah-2026",
    rubric: "pengumuman",
    status: "published",
    divisionId: "div-humas-eksyar",
    authorId: "mbr-ridwan",
    body: `Diberitahukan kepada seluruh mahasiswa Program Studi Ekonomi Syariah (S1) Fakultas Ekonomi dan Bisnis Islam UIN Sunan Gunung Djati Bandung yang sedang menyusun tugas akhir/skripsi bahwa pendaftaran layanan akademik dibuka secara berkala setiap bulan.

## Persyaratan Utama
1. **Seminar Usulan Penelitian (SUP / Sempro)**: Telah lulus mata kuliah Metodologi Penelitian Ekonomi Islam, menyelesaikan minimal 110 SKS, memiliki bukti pengajuan judul yang disetujui Ketua/Sekretaris Jurusan, serta kartu kendali menghadiri minimal 5 kali seminar proposal.
2. **Ujian Komprehensif**: Telah lulus seluruh mata kuliah teori, lulus tahfidz/tahsin Al-Qur'an sesuai ketentuan fakultas, dan melampirkan transkrip nilai sementara yang diverifikasi dosen wali.
3. **Sidang Munaqosyah**: Naskah skripsi telah disetujui Pembimbing I & II, bebas plagiarisme (Turnitin maksimal 25%), memiliki sertifikat TOAFL/TOEFL Pusat Bahasa UIN SGD, serta bukti submit/publikasi artikel ilmiah atau repositori Digilib UIN SGD.

Seluruh berkas diunggah melalui portal Layanan Prodi Ekonomi Syariah dan diverifikasi di Sekretariat Jurusan Lantai 2 Gedung FEBI.`,
    caption:
      "PENGUMUMAN AKADEMIK: Jadwal & persyaratan pendaftaran Seminar Proposal (SUP), Ujian Komprehensif, dan Sidang Munaqosyah Prodi Ekonomi Syariah FEBI UIN SGD.",
    hashtags: "#HumasEksyar #InfoAkademik #SkripsiEksyar #FEBIUINSGD",
    channels: ["instagram", "linktree"],
    mediaIds: [],
    scheduledFor: "2026-01-15T07:30:00.000Z",
    publishedAt: "2026-01-15T08:00:00.000Z",
    approvers: ["mbr-evi"],
    waitingOn: [],
    createdAt: "2026-01-14T12:00:00.000Z",
    updatedAt: "2026-01-15T08:00:00.000Z",
    metrics: {
      views: 2640,
      likes: 310,
      comments: 34,
      shares: 190,
      saves: 275,
      reach: 5280,
      engagementRate: 0.153,
      sentiment: 0.88,
    },
  },
  // --- ARSIP BERSIH DARI ES.UINSGD.AC.ID (2019–2020) ---
  {
    id: "cnt-arsip-es-penghargaan-bupati-2019",
    title: "[Arsip es.uinsgd.ac.id] Kembangkan Ekowisata Halal Indragiri, Rektor UIN SGD dan Prodi Ekonomi Syariah Raih Penghargaan Bupati Bandung",
    slug: "kembangkan-ekowisata-halal-indragiri-rektor-uin-sgd-raih-penghargaan-bupati-bandung",
    rubric: "selamat_sukses",
    status: "published",
    divisionId: "div-humas-eksyar",
    authorId: "mbr-evi",
    body: `*Artikel ini merupakan arsip resmi dari situs lama Program Studi Ekonomi Syariah (\`es.uinsgd.ac.id\`, 29 September 2019) yang telah dipulihkan dan disanitasi penuh.*

Bupati Bandung, H. Dadang M. Naser, S.H., S.Ip., M.I.Pol., memberikan penghargaan Sabilulungan kepada Rektor UIN Sunan Gunung Djati Bandung, Prof. Dr. H. Mahmud, M.Si., beserta tim dosen dan mahasiswa Jurusan Ekonomi Syariah pada puncak peringatan Jambore Lingkungan II di Bale Rame Sabilulungan, Soreang, Kabupaten Bandung (28/09/2019).

## Pelopor Desa Ekowisata Halal di Jawa Barat
Penghargaan ini diberikan atas kontribusi nyata Program Studi Ekonomi Syariah UIN SGD dalam menginisiasi, membina, dan mendampingi **Desa Ekowisata Halal Indragiri** di Kecamatan Rancabali, Kabupaten Bandung sejak tahun 2018.

Program pendampingan terpadu tersebut mencakup:
- **Edukasi & Literasi Wisata Ramah Muslim**: Pelatihan standar layanan homestay syariah, penyediaan fasilitas ibadah yang bersih, serta jaminan kehalalan kuliner lokal bagi wisatawan.
- **Konservasi Ekologi (Green Halal Village)**: Kolaborasi penanaman pohon di kawasan hulu Ciwidey–Rancabali sebagai implementasi etika lingkungan Islam (*hifzh al-bi'ah*).
- **Pemberdayaan UMKM & Koperasi Desa**: Penguatan kelembagaan ekonomi warga kebun teh dan pelaku usaha olahan pangan lokal agar memperoleh nilai tambah ekonomi secara berkeadilan.`,
    caption:
      "[Arsip Sejarah Eksyar] Dedikasi Prodi Ekonomi Syariah UIN SGD dalam mengembangkan Desa Ekowisata Halal Indragiri, Rancabali, membuahkan Penghargaan Bupati Bandung pada Jambore Lingkungan II.",
    hashtags: "#ArsipEksyar #EkowisataHalal #DesaIndragiri #EkonomiSyariahUINSGD",
    channels: ["linktree", "internal"],
    mediaIds: [],
    scheduledFor: "2019-09-29T08:00:00.000Z",
    publishedAt: "2019-09-29T09:00:00.000Z",
    approvers: ["mbr-ridwan"],
    waitingOn: [],
    createdAt: "2019-09-29T08:00:00.000Z",
    updatedAt: "2026-03-01T10:00:00.000Z",
    metrics: {
      views: 1850,
      likes: 275,
      comments: 16,
      shares: 92,
      saves: 110,
      reach: 3700,
      engagementRate: 0.133,
      sentiment: 0.96,
    },
  },
  {
    id: "cnt-arsip-es-green-halal-village-2019",
    title: "[Arsip es.uinsgd.ac.id] Tanam 150 Pohon Bersama Komunitas SABER: Mewujudkan Green Halal Village di Desa Indragiri",
    slug: "tanam-150-pohon-mewujudkan-green-halal-village-desa-indragiri",
    rubric: "dokumentasi",
    status: "published",
    divisionId: "div-humas-eksyar",
    authorId: "mbr-evi",
    body: `*Artikel ini merupakan arsip resmi dari situs lama Program Studi Ekonomi Syariah (\`es.uinsgd.ac.id\`, 24 September 2019) yang telah dipulihkan dan disanitasi penuh.*

Dosen dan mahasiswa Jurusan Ekonomi Syariah Fakultas Syariah dan Hukum (kini FEBI) UIN Sunan Gunung Djati Bandung bersama Komunitas Sapu Bersih (SABER) Kabupaten Bandung melaksanakan aksi nyata penanaman 150 bibit pohon di kawasan Desa Ekowisata Halal Indragiri, Kecamatan Rancabali, Kabupaten Bandung.

Kegiatan ini merupakan bagian integral dari peta jalan *Green Halal Village* yang memadukan konsep pariwisata ramah muslim (*Muslim-friendly tourism*) dengan pelestarian lingkungan hidup. Dalam perspektif ekonomi Islam, pembangunan ekonomi desa tidak boleh merusak daya dukung alam, melainkan harus menjaga keseimbangan ekologis (*mizan*) dan kebermanfaatan antargenerasi.`,
    caption:
      "[Arsip es.uinsgd.ac.id] Aksi penanaman 150 pohon bersama Komunitas SABER dan warga Desa Indragiri Rancabali dalam rangka mewujudkan Green Halal Village binaan Prodi Ekonomi Syariah UIN SGD.",
    hashtags: "#ArsipEksyar #GreenHalalVillage #EkowisataHalal #UINSGD",
    channels: ["linktree", "internal"],
    mediaIds: [],
    scheduledFor: "2019-09-24T08:00:00.000Z",
    publishedAt: "2019-09-24T09:00:00.000Z",
    approvers: ["mbr-ridwan"],
    waitingOn: [],
    createdAt: "2019-09-24T08:00:00.000Z",
    updatedAt: "2026-03-01T10:00:00.000Z",
    metrics: {
      views: 1120,
      likes: 160,
      comments: 9,
      shares: 44,
      saves: 68,
      reach: 2240,
      engagementRate: 0.125,
      sentiment: 0.93,
    },
  },
  {
    id: "cnt-arsip-es-fgd-desa-wisata-halal-2019",
    title: "[Arsip es.uinsgd.ac.id] Desa Wisata Halal: Kajian Focus Group Discussion (FGD) dari Berbagai Aspek",
    slug: "desa-wisata-halal-kajian-fgd-dari-berbagai-aspek",
    rubric: "kajian",
    status: "published",
    divisionId: "div-humas-eksyar",
    authorId: "mbr-evi",
    body: `*Artikel ini merupakan arsip resmi dari situs lama Program Studi Ekonomi Syariah (\`es.uinsgd.ac.id\`, 10 Oktober 2019) yang telah dipulihkan dan disanitasi penuh.*

Program Studi Ekonomi Syariah UIN Sunan Gunung Djati Bandung menggelar *Focus Group Discussion* (FGD) bertajuk "Desa Wisata Halal: Kajian dari Berbagai Aspek" yang mempertemukan tim peneliti dosen Ekonomi Syariah, aparat Pemerintah Kabupaten Bandung, pengelola desa wisata, serta praktisi industri halal.

## Rumusan Akademik FGD
Diskusi membedah empat aspek utama pengembangan desa wisata halal:
1. **Aspek Syariah & Fatwa DSN-MUI**: Implementasi Fatwa DSN-MUI Nomor 108/DSN-MUI/X/2016 tentang Pedoman Penyelenggaraan Pariwisata Berdasarkan Prinsip Syariah pada skala desa wisata.
2. **Aspek Kelembagaan & BUMDes Syariah**: Peran BUMDes dan kelompok sadar wisata (Pokdarwis) dalam tata kelola destinasi yang transparan dan partisipatif.
3. **Aspek Rantai Pasok Kuliner Halal**: Pendampingan sertifikasi halal bagi produk makanan-minuman UMKM lokal.
4. **Aspek Pemasaran Digital & Kearifan Lokal**: Sinergi budaya Sunda yang religius (*Someah Hade ka Semah*) dengan standar layanan wisata halal modern.`,
    caption:
      "[Arsip es.uinsgd.ac.id] Kajian komprehensif Focus Group Discussion (FGD) Desa Wisata Halal oleh tim dosen dan peneliti Prodi Ekonomi Syariah UIN SGD.",
    hashtags: "#ArsipEksyar #DesaWisataHalal #RisetEksyar #FEBIUINSGD",
    channels: ["linktree", "internal"],
    mediaIds: [],
    scheduledFor: "2019-10-10T09:00:00.000Z",
    publishedAt: "2019-10-10T10:00:00.000Z",
    approvers: ["mbr-ridwan"],
    waitingOn: [],
    createdAt: "2019-10-10T09:00:00.000Z",
    updatedAt: "2026-03-01T10:00:00.000Z",
    metrics: {
      views: 1340,
      likes: 192,
      comments: 14,
      shares: 58,
      saves: 94,
      reach: 2680,
      engagementRate: 0.133,
      sentiment: 0.91,
    },
  },
  {
    id: "cnt-arsip-es-studium-generale-2020",
    title: "[Arsip es.uinsgd.ac.id] Studium Generale Ekonomi Syariah: Ketahanan Ekonomi dan Keuangan Islam di Era New Normal",
    slug: "studium-generale-ketahanan-ekonomi-keuangan-islam-era-new-normal",
    rubric: "eksyar_talks",
    status: "published",
    divisionId: "div-humas-eksyar",
    authorId: "mbr-anisa-ilmia",
    body: `*Artikel ini merupakan arsip resmi dari situs lama Program Studi Ekonomi Syariah (\`es.uinsgd.ac.id\`, Oktober 2020) yang telah dipulihkan dan disanitasi penuh.*

Seiring dengan resminya transformasi kelembagaan ke Fakultas Ekonomi dan Bisnis Islam (FEBI) berdasarkan PMA RI Nomor 27 Tahun 2020, Program Studi Ekonomi Syariah UIN Sunan Gunung Djati Bandung menyelenggarakan *Studium Generale* secara daring yang diikuti ratusan mahasiswa dan dosen.

Forum ilmiah ini mengulas bagaimana instrumen keuangan sosial Islam—khususnya zakat produktif, wakaf uang, dan pembiayaan bagi hasil pada lembaga keuangan mikro syariah—berperan sebagai jaring pengaman sosial sekaligus penggerak pemulihan UMKM.`,
    caption:
      "[Arsip es.uinsgd.ac.id] Studium Generale Prodi Ekonomi Syariah membahas peran ZISWAF dan keuangan mikro syariah dalam pemulihan ekonomi umat.",
    hashtags: "#ArsipEksyar #StudiumGenerale #ZISWAF #FEBIUINSGD",
    channels: ["linktree", "internal"],
    mediaIds: [],
    scheduledFor: "2020-10-15T08:00:00.000Z",
    publishedAt: "2020-10-15T09:30:00.000Z",
    approvers: ["mbr-ridwan"],
    waitingOn: [],
    createdAt: "2020-10-15T08:00:00.000Z",
    updatedAt: "2026-03-01T10:00:00.000Z",
    metrics: {
      views: 1090,
      likes: 148,
      comments: 8,
      shares: 35,
      saves: 61,
      reach: 2180,
      engagementRate: 0.115,
      sentiment: 0.9,
    },
  },
];

export const captionTemplates: CaptionTemplate[] = [
  {
    id: "tpl-liputan-akademik",
    rubric: "eksyar_talks",
    style: "profesional",
    example:
      "Bandung — Program Studi Ekonomi Syariah FEBI UIN Sunan Gunung Djati Bandung menyelenggarakan Kuliah Praktisi Perbankan Syariah di Auditorium FEBI.",
    hashtags: HASHTAG_BLOCK,
  },
  {
    id: "tpl-pengumuman-prodi",
    rubric: "pengumuman",
    style: "formal_organisasi",
    example:
      "PENGUMUMAN AKADEMIK PRODI EKONOMI SYARIAH — Diberitahukan kepada mahasiswa S1 Ekonomi Syariah FEBI UIN SGD mengenai jadwal pendaftaran Seminar Proposal, Komprehensif, dan Munaqosyah.",
    hashtags: HASHTAG_BLOCK,
  },
];
