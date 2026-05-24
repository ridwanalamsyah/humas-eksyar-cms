import type { Member } from "@/lib/data/types";

/**
 * Roster Humas Eksyar periode 2025-2026 sesuai SK Dekan FEBI UIN SGD
 * Nomor B-1623/Un.05/III.9/PP.00.9/11/2025 tanggal 10 November 2025.
 *
 * 2 Penanggung Jawab (dosen) → role "monitoring" (view-only, tidak ikut
 *                              approval/submit — hanya mengawasi)
 * 1 Koordinator              → role "ketua_divisi"
 * 7 Anggota                  → role "anggota"
 *
 * Untuk dosen: `angkatan` = tahun mulai PNS dari NIP; `nimSuffix` = 4 digit
 *              terakhir NIP.
 * Untuk mahasiswa: `angkatan` = tahun masuk (2022-2024); `nimSuffix` = 4
 *                  digit terakhir NIM.
 */
export const members: Member[] = [
  // --- DOSEN PEMBINA (Penanggung Jawab) ---
  {
    id: "mbr-evi",
    name: "Dr. Evi Sopiah, M.Ag.",
    initials: "ES",
    email: "evi.sopiah@uinsgd.ac.id",
    role: "monitoring",
    divisionId: "div-humas-eksyar",
    position: "Dosen Pembina",
    joinedAt: "2025-11-10",
    bio: "Penanggung jawab Humas Eksyar — Jurusan Ekonomi Syariah FEBI UIN SGD.",
    xp: 0,
    streak: 0,
    badges: [],
    angkatan: 2007,
    nimSuffix: "2020",
    avatarEmoji: "📜",
    accentHue: 175,
  },
  {
    id: "mbr-anisa-ilmia",
    name: "Anisa Ilmia, M.E.",
    initials: "AI",
    email: "anisa.ilmia@uinsgd.ac.id",
    role: "monitoring",
    divisionId: "div-humas-eksyar",
    position: "Dosen Pembina",
    joinedAt: "2025-11-10",
    bio: "Penanggung jawab Humas Eksyar — pendamping akademik & strategi.",
    xp: 0,
    streak: 0,
    badges: [],
    angkatan: 2018,
    nimSuffix: "2001",
    avatarEmoji: "📖",
    accentHue: 200,
  },

  // --- KOORDINATOR ---
  {
    id: "mbr-aditya",
    name: "Aditya Novrizal Ramdhani",
    initials: "AN",
    email: "1229220005@student.uinsgd.ac.id",
    role: "ketua_divisi",
    divisionId: "div-humas-eksyar",
    position: "Koordinator Humas",
    joinedAt: "2025-11-10",
    bio: "Koordinator Humas Eksyar 2025-2026.",
    xp: 0,
    streak: 0,
    badges: [],
    angkatan: 2022,
    nimSuffix: "0005",
    avatarEmoji: "🌿",
    accentHue: 170,
  },

  // --- ANGGOTA ---
  {
    id: "mbr-ridwan",
    name: "Ridwan Alamsyah",
    initials: "RA",
    email: "1239220061@student.uinsgd.ac.id",
    role: "anggota",
    divisionId: "div-humas-eksyar",
    position: "Anggota Humas",
    joinedAt: "2025-11-10",
    bio: "",
    xp: 0,
    streak: 0,
    badges: [],
    angkatan: 2023,
    nimSuffix: "0061",
    avatarEmoji: "🌱",
    accentHue: 180,
  },
  {
    id: "mbr-alya",
    name: "Alya Azhana Maulidha",
    initials: "AA",
    email: "1239220048@student.uinsgd.ac.id",
    role: "anggota",
    divisionId: "div-humas-eksyar",
    position: "Anggota Humas",
    joinedAt: "2025-11-10",
    bio: "",
    xp: 0,
    streak: 0,
    badges: [],
    angkatan: 2023,
    nimSuffix: "0048",
    avatarEmoji: "🌸",
    accentHue: 320,
  },
  {
    id: "mbr-husen",
    name: "Muhamad Husen Ihsanudin",
    initials: "MH",
    email: "1239220043@student.uinsgd.ac.id",
    role: "anggota",
    divisionId: "div-humas-eksyar",
    position: "Anggota Humas",
    joinedAt: "2025-11-10",
    bio: "",
    xp: 0,
    streak: 0,
    badges: [],
    angkatan: 2023,
    nimSuffix: "0043",
    avatarEmoji: "🌳",
    accentHue: 95,
  },
  {
    id: "mbr-arisman",
    name: "Muhammad Arisman",
    initials: "MA",
    email: "1239220031@student.uinsgd.ac.id",
    role: "anggota",
    divisionId: "div-humas-eksyar",
    position: "Anggota Humas",
    joinedAt: "2025-11-10",
    bio: "",
    xp: 0,
    streak: 0,
    badges: [],
    angkatan: 2023,
    nimSuffix: "0031",
    avatarEmoji: "🌾",
    accentHue: 45,
  },
  {
    id: "mbr-adnan",
    name: "Adnan Nur Afif",
    initials: "AN",
    email: "1249220114@student.uinsgd.ac.id",
    role: "anggota",
    divisionId: "div-humas-eksyar",
    position: "Anggota Humas",
    joinedAt: "2025-11-10",
    bio: "",
    xp: 0,
    streak: 0,
    badges: [],
    angkatan: 2024,
    nimSuffix: "0114",
    avatarEmoji: "🌊",
    accentHue: 210,
  },
  {
    id: "mbr-rizwan",
    name: "Rizwan Ardiansyah",
    initials: "RA",
    email: "1229220101@student.uinsgd.ac.id",
    role: "anggota",
    divisionId: "div-humas-eksyar",
    position: "Anggota Humas",
    joinedAt: "2025-11-10",
    bio: "",
    xp: 0,
    streak: 0,
    badges: [],
    angkatan: 2022,
    nimSuffix: "0101",
    avatarEmoji: "🌟",
    accentHue: 50,
  },
  {
    id: "mbr-zahra",
    name: "Zahra Zahlia Putri",
    initials: "ZP",
    email: "1249220101@student.uinsgd.ac.id",
    role: "anggota",
    divisionId: "div-humas-eksyar",
    position: "Anggota Humas",
    joinedAt: "2025-11-10",
    bio: "",
    xp: 0,
    streak: 0,
    badges: [],
    angkatan: 2024,
    nimSuffix: "0101",
    avatarEmoji: "🌷",
    accentHue: 340,
  },
];

/**
 * Default "current member" returned by `getCurrentMember()` in mock mode.
 * Real auth wires this to the signed-in user via `session.user.id`; the
 * fallback (preview without DB) shows the koordinator's perspective.
 */
export const currentMember: Member =
  members.find((m) => m.id === "mbr-aditya") ?? members[0];

export const findMember = (id: string) =>
  members.find((m) => m.id === id) ?? currentMember;

