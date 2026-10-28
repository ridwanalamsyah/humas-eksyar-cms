import type { Event } from "@/lib/data/types";

/**
 * Agenda akademik, seminar, dan kegiatan kemahasiswaan Program Studi Ekonomi Syariah
 * FEBI UIN Sunan Gunung Djati Bandung.
 */
export const events: Event[] = [
  {
    id: "evt-sempro-gelombang-1",
    title: "Seminar Usulan Penelitian (SUP / Sempro) Skripsi Ekonomi Syariah Gelombang Reguler",
    slug: "seminar-usulan-penelitian-skripsi-ekonomi-syariah",
    description:
      "Pelaksanaan Seminar Usulan Penelitian (SUP) bagi mahasiswa S1 Ekonomi Syariah angkatan 2022–2023 di Ruang Sidang Prodi Ekonomi Syariah Gedung FEBI Lantai 2.",
    divisionId: "div-humas-eksyar",
    location: "Ruang Sidang FEBI Lt. 2, Kampus 1 UIN SGD Cibiru",
    isOnline: false,
    startsAt: "2026-11-05T08:00:00.000Z",
    endsAt: "2026-11-05T15:30:00.000Z",
    category: "kegiatan_publik",
    capacity: 60,
    rsvpIds: ["mbr-ridwan", "mbr-alya", "mbr-husen"],
    checkedInIds: ["mbr-ridwan"],
    coordinatorId: "mbr-evi",
    contentIds: ["cnt-pengumuman-ukt-sempro-2026"],
  },
  {
    id: "evt-studium-generale-ganjil",
    title: "Studium Generale FEBI: Inovasi Wakaf Produktif & Green Sukuk untuk Pembangunan Berkelanjutan",
    slug: "studium-generale-inovasi-wakaf-produktif-green-sukuk",
    description:
      "Kuliah umum pembuka bersama pakar ekonomi syariah nasional, Komite Nasional Ekonomi dan Keuangan Syariah (KNEKS), dan Badan Wakaf Indonesia (BWI).",
    divisionId: "div-humas-eksyar",
    location: "Auditorium FEBI UIN Sunan Gunung Djati Bandung",
    isOnline: false,
    startsAt: "2026-11-12T08:30:00.000Z",
    endsAt: "2026-11-12T12:00:00.000Z",
    category: "kajian",
    capacity: 250,
    rsvpIds: ["mbr-ridwan", "mbr-alya", "mbr-arisman", "mbr-adnan", "mbr-zahra"],
    checkedInIds: [],
    coordinatorId: "mbr-anisa-ilmia",
    contentIds: [],
  },
  {
    id: "evt-klinik-metodologi-likuid",
    title: "Klinik Metodologi Riset & Penulisan Artikel Jurnal LIKUID (Ekonometrika & ANP/DEA)",
    slug: "klinik-metodologi-riset-penulisan-jurnal-likuid",
    description:
      "Pendampingan intensif pengolahan data skripsi (SmartPLS, EViews, STATA, dan Analytic Network Process) serta klinik publikasi ilmiah menuju jurnal terakreditasi SINTA.",
    divisionId: "div-humas-eksyar",
    location: "Lab Komputer & Mini Bank Syariah FEBI Lt. 3",
    isOnline: false,
    startsAt: "2026-11-19T09:00:00.000Z",
    endsAt: "2026-11-19T14:00:00.000Z",
    category: "pelatihan",
    capacity: 45,
    rsvpIds: ["mbr-ridwan", "mbr-husen"],
    checkedInIds: [],
    coordinatorId: "mbr-anisa-ilmia",
    contentIds: [],
  },
  {
    id: "evt-spms-gis-febi",
    title: "Sekolah Pasar Modal Syariah (SPMS) & Praktik SOTS bersama Galeri Investasi Syariah FEBI",
    slug: "sekolah-pasar-modal-syariah-spms-gis-febi",
    description:
      "Edukasi pasar modal syariah, analisis fundamental saham penghuni ISSI/JII70, dan pembukaan rekening efek syariah bagi mahasiswa Ekonomi Syariah.",
    divisionId: "div-humas-eksyar",
    location: "Galeri Investasi Syariah FEBI UIN SGD & Zoom Meeting",
    isOnline: true,
    startsAt: "2026-11-26T08:30:00.000Z",
    endsAt: "2026-11-26T12:00:00.000Z",
    category: "pelatihan",
    capacity: 120,
    rsvpIds: ["mbr-ridwan", "mbr-alya", "mbr-zahra"],
    checkedInIds: [],
    coordinatorId: "mbr-ridwan",
    contentIds: ["cnt-spms-2026"],
  },
  {
    id: "evt-munaqosyah-tahap-akhir",
    title: "Sidang Munaqosyah & Ujian Komprehensif Sarjana Ekonomi (S.E.) Periode November",
    slug: "sidang-munaqosyah-ujian-komprehensif-sarjana-ekonomi",
    description:
      "Sidang ujian skripsi (Munaqosyah) dan Ujian Komprehensif mahasiswa tingkat akhir Program Studi Ekonomi Syariah FEBI UIN Sunan Gunung Djati Bandung.",
    divisionId: "div-humas-eksyar",
    location: "Ruang Sidang Utama Gedung FEBI UIN SGD",
    isOnline: false,
    startsAt: "2026-12-03T08:00:00.000Z",
    endsAt: "2026-12-03T16:00:00.000Z",
    category: "kegiatan_publik",
    capacity: 50,
    rsvpIds: ["mbr-evi", "mbr-anisa-ilmia", "mbr-ridwan"],
    checkedInIds: [],
    coordinatorId: "mbr-evi",
    contentIds: ["cnt-pengumuman-ukt-sempro-2026"],
  },
];

export const findEvent = (id: string) =>
  events.find((e) => e.id === id) ?? null;
