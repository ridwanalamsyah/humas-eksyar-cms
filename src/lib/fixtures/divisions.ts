import type { Division } from "@/lib/data/types";

/**
 * Single source-of-truth division per SK Dekan FEBI UIN SGD
 * No. B-1623/Un.05/III.9/PP.00.9/11/2025 (periode 2025-2026).
 *
 * Humas Eksyar adalah satu tim flat — 2 dosen pembina, 1 koordinator,
 * 7 anggota. Tidak ada sub-divisi internal. Konten apapun yang dikerjakan
 * (akademik, kewirausahaan, kaderisasi, dst.) tetap diproduksi oleh tim
 * yang sama; pengelompokan topik pakai `rubrik` di entitas Content.
 */
export const divisions: Division[] = [
  {
    id: "div-humas-eksyar",
    slug: "humas-eksyar",
    name: "Humas Eksyar",
    shortName: "Humas",
    description:
      "Dewan Humas Jurusan Ekonomi Syariah FEBI UIN SGD Bandung — periode 2025-2026.",
    color: "#0D9488",
    hue: 175,
    leadId: "mbr-aditya",
    memberCount: 10,
  },
];

export const findDivision = (id: string) =>
  divisions.find((d) => d.id === id) ?? divisions[0];
