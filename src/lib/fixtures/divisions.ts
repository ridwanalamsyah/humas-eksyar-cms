import type { Division } from "@/lib/data/types";

/**
 * Divisions reflect a typical UIN SGD HMJ Ekonomi Syariah structure.
 * `color` aligned to brand teal family + complementary hues.
 */
export const divisions: Division[] = [
  {
    id: "div-humas",
    slug: "humas",
    name: "Humas & Media",
    shortName: "Humas",
    description:
      "Pusat narasi organisasi: Instagram, Twitter, dokumentasi, AI caption, branding.",
    color: "#0D9488",
    hue: 175,
    leadId: "mbr-aulia",
    memberCount: 12,
  },
  {
    id: "div-akademik",
    slug: "akademik",
    name: "Pengembangan Akademik",
    shortName: "Akademik",
    description:
      "Kajian rutin, kuliah umum, riset ekonomi syariah, pelatihan, sertifikasi.",
    color: "#0EA5A1",
    hue: 178,
    leadId: "mbr-fadhil",
    memberCount: 14,
  },
  {
    id: "div-kewirausahaan",
    slug: "kewirausahaan",
    name: "Kewirausahaan",
    shortName: "Wirausaha",
    description:
      "Inkubasi UMKM mahasiswa, halal value chain, business camp, kemitraan industri syariah.",
    color: "#E89422",
    hue: 36,
    leadId: "mbr-rahma",
    memberCount: 9,
  },
  {
    id: "div-kaderisasi",
    slug: "kaderisasi",
    name: "Kaderisasi & Sumber Daya",
    shortName: "Kaderisasi",
    description:
      "Recruitment, mentoring angkatan baru, leadership track, character building.",
    color: "#7C9F3F",
    hue: 80,
    leadId: "mbr-zaki",
    memberCount: 11,
  },
  {
    id: "div-sekretariat",
    slug: "sekretariat",
    name: "Sekretariat",
    shortName: "Sekretariat",
    description:
      "Administrasi, surat-menyurat, dokumentasi resmi, kearsipan, ERP coordinator.",
    color: "#5B7CB5",
    hue: 215,
    leadId: "mbr-hilda",
    memberCount: 6,
  },
  {
    id: "div-bendahara",
    slug: "bendahara",
    name: "Bendahara",
    shortName: "Keuangan",
    description:
      "Anggaran organisasi, fundraising syariah, laporan keuangan, audit internal.",
    color: "#A6608A",
    hue: 320,
    leadId: "mbr-naufal",
    memberCount: 5,
  },
];

export const findDivision = (id: string) =>
  divisions.find((d) => d.id === id) ?? divisions[0];
