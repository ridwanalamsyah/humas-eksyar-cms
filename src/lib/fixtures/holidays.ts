/**
 * Indonesia national + Hijriah + selected international calendar dates.
 *
 * Sources:
 * - Indonesia public holidays 2026: SKB 3 Menteri (Menag, Menaker, Menpan-RB)
 *   Nomor 1497/2025, 2/2025, 5/2025 — 17 hari libur nasional, 8 cuti bersama.
 * - Hijriah dates: pemerintah / Kemenag RI Almanak Hijriah. Dates may shift
 *   ±1 day vs other countries due to rukyatul hilal differences — kept as
 *   the official Indonesian date.
 *
 * Coverage: 2026 + selected 2027 dates. Re-seed annually.
 */

export interface Holiday {
  id: string;
  slug: string;
  name: string;
  /** ISO Gregorian date (yyyy-mm-dd) */
  date: string;
  kind: "nasional" | "hijriah" | "internasional" | "cuti_bersama";
  description: string;
  /** Optional Hijriah label, e.g. "1 Muharram 1448 H" */
  hijriahLabel?: string;
  /** Optional emoji for quick visual scanning */
  emoji?: string;
}

export const holidays: Holiday[] = [
  // ─── 2026 — Libur nasional resmi (per SKB 3 Menteri) ──────────────────
  {
    id: "hl-2026-01-01-tahun-baru",
    slug: "tahun-baru-2026",
    name: "Tahun Baru 2026 Masehi",
    date: "2026-01-01",
    kind: "nasional",
    description: "Hari pertama tahun 2026 Masehi.",
    emoji: "🎆",
  },
  {
    id: "hl-2026-01-16-isra-miraj",
    slug: "isra-miraj-1447",
    name: "Isra Mi'raj Nabi Muhammad SAW",
    date: "2026-01-16",
    kind: "hijriah",
    description:
      "Peringatan Isra Mi'raj — perjalanan malam Rasulullah dari Masjidil Haram ke Sidratul Muntaha.",
    hijriahLabel: "27 Rajab 1447 H",
    emoji: "🌙",
  },
  {
    id: "hl-2026-02-17-imlek",
    slug: "imlek-2577",
    name: "Tahun Baru Imlek 2577 Kongzili",
    date: "2026-02-17",
    kind: "nasional",
    description: "Tahun Baru Imlek 2577.",
    emoji: "🧧",
  },
  {
    id: "hl-2026-03-19-nyepi",
    slug: "nyepi-1948",
    name: "Hari Suci Nyepi (Tahun Baru Saka 1948)",
    date: "2026-03-19",
    kind: "nasional",
    description: "Tahun Baru Saka 1948.",
    emoji: "🕉️",
  },
  {
    id: "hl-2026-03-21-idul-fitri-1",
    slug: "idul-fitri-1447-h1",
    name: "Idul Fitri 1447 H (Hari Pertama)",
    date: "2026-03-21",
    kind: "hijriah",
    description: "Hari Raya Idul Fitri 1 Syawal 1447 H.",
    hijriahLabel: "1 Syawal 1447 H",
    emoji: "🌙",
  },
  {
    id: "hl-2026-03-22-idul-fitri-2",
    slug: "idul-fitri-1447-h2",
    name: "Idul Fitri 1447 H (Hari Kedua)",
    date: "2026-03-22",
    kind: "hijriah",
    description: "Hari Raya Idul Fitri 2 Syawal 1447 H.",
    hijriahLabel: "2 Syawal 1447 H",
    emoji: "🌙",
  },
  {
    id: "hl-2026-04-03-jumat-agung",
    slug: "wafat-yesus-2026",
    name: "Wafat Yesus Kristus (Jumat Agung)",
    date: "2026-04-03",
    kind: "nasional",
    description: "Peringatan wafat Yesus Kristus.",
    emoji: "✝️",
  },
  {
    id: "hl-2026-04-05-paskah",
    slug: "paskah-2026",
    name: "Hari Paskah",
    date: "2026-04-05",
    kind: "nasional",
    description: "Hari Kebangkitan Yesus Kristus.",
    emoji: "✝️",
  },
  {
    id: "hl-2026-05-01-buruh",
    slug: "hari-buruh-2026",
    name: "Hari Buruh Internasional",
    date: "2026-05-01",
    kind: "nasional",
    description: "May Day — solidaritas pekerja sedunia.",
    emoji: "🛠️",
  },
  {
    id: "hl-2026-05-14-kenaikan",
    slug: "kenaikan-yesus-2026",
    name: "Kenaikan Yesus Kristus",
    date: "2026-05-14",
    kind: "nasional",
    description: "Peringatan Kenaikan Yesus Kristus.",
    emoji: "✝️",
  },
  {
    id: "hl-2026-05-27-idul-adha",
    slug: "idul-adha-1447",
    name: "Idul Adha 1447 H",
    date: "2026-05-27",
    kind: "hijriah",
    description: "Hari Raya Kurban — 10 Dzulhijjah 1447 H.",
    hijriahLabel: "10 Dzulhijjah 1447 H",
    emoji: "🐑",
  },
  {
    id: "hl-2026-05-31-waisak",
    slug: "waisak-2570",
    name: "Hari Raya Waisak 2570 BE",
    date: "2026-05-31",
    kind: "nasional",
    description: "Peringatan Trisuci Waisak 2570 Buddhist Era.",
    emoji: "☸️",
  },
  {
    id: "hl-2026-06-01-pancasila",
    slug: "hari-lahir-pancasila-2026",
    name: "Hari Lahir Pancasila",
    date: "2026-06-01",
    kind: "nasional",
    description: "Peringatan lahirnya Pancasila — pidato Bung Karno 1 Juni 1945.",
    emoji: "🇮🇩",
  },
  {
    id: "hl-2026-06-16-tahun-baru-1448",
    slug: "tahun-baru-islam-1448",
    name: "Tahun Baru Islam 1448 H",
    date: "2026-06-16",
    kind: "hijriah",
    description: "1 Muharram 1448 H — Tahun Baru Hijriah.",
    hijriahLabel: "1 Muharram 1448 H",
    emoji: "🌙",
  },
  {
    id: "hl-2026-08-17-kemerdekaan",
    slug: "kemerdekaan-2026",
    name: "Hari Kemerdekaan RI ke-81",
    date: "2026-08-17",
    kind: "nasional",
    description: "Peringatan Proklamasi Kemerdekaan Republik Indonesia.",
    emoji: "🇮🇩",
  },
  {
    id: "hl-2026-08-25-maulid",
    slug: "maulid-nabi-1448",
    name: "Maulid Nabi Muhammad SAW",
    date: "2026-08-25",
    kind: "hijriah",
    description: "Peringatan kelahiran Rasulullah SAW.",
    hijriahLabel: "12 Rabiul Awal 1448 H",
    emoji: "🌙",
  },
  {
    id: "hl-2026-12-25-natal",
    slug: "natal-2026",
    name: "Hari Raya Natal",
    date: "2026-12-25",
    kind: "nasional",
    description: "Peringatan kelahiran Yesus Kristus.",
    emoji: "🎄",
  },

  // ─── 2026 — Cuti bersama ──────────────────────────────────────────────
  {
    id: "hl-2026-02-16-cb-imlek",
    slug: "cb-imlek-2026",
    name: "Cuti Bersama Imlek 2577",
    date: "2026-02-16",
    kind: "cuti_bersama",
    description: "Cuti bersama menyambut Tahun Baru Imlek.",
    emoji: "🧧",
  },
  {
    id: "hl-2026-03-18-cb-nyepi",
    slug: "cb-nyepi-2026",
    name: "Cuti Bersama Nyepi",
    date: "2026-03-18",
    kind: "cuti_bersama",
    description: "Cuti bersama menyambut Hari Raya Nyepi.",
    emoji: "🕉️",
  },
  {
    id: "hl-2026-03-20-cb-idfitri",
    slug: "cb-idfitri-2026-h1",
    name: "Cuti Bersama Idul Fitri (Jumat)",
    date: "2026-03-20",
    kind: "cuti_bersama",
    description: "Cuti bersama Idul Fitri 1447 H.",
    emoji: "🌙",
  },
  {
    id: "hl-2026-03-23-cb-idfitri",
    slug: "cb-idfitri-2026-h2",
    name: "Cuti Bersama Idul Fitri (Senin)",
    date: "2026-03-23",
    kind: "cuti_bersama",
    description: "Cuti bersama Idul Fitri 1447 H.",
    emoji: "🌙",
  },
  {
    id: "hl-2026-03-24-cb-idfitri",
    slug: "cb-idfitri-2026-h3",
    name: "Cuti Bersama Idul Fitri (Selasa)",
    date: "2026-03-24",
    kind: "cuti_bersama",
    description: "Cuti bersama Idul Fitri 1447 H.",
    emoji: "🌙",
  },
  {
    id: "hl-2026-05-15-cb-kenaikan",
    slug: "cb-kenaikan-2026",
    name: "Cuti Bersama Kenaikan Yesus Kristus",
    date: "2026-05-15",
    kind: "cuti_bersama",
    description: "Cuti bersama Kenaikan Yesus Kristus.",
    emoji: "✝️",
  },
  {
    id: "hl-2026-05-28-cb-iduladha",
    slug: "cb-iduladha-2026",
    name: "Cuti Bersama Idul Adha",
    date: "2026-05-28",
    kind: "cuti_bersama",
    description: "Cuti bersama Idul Adha 1447 H.",
    emoji: "🐑",
  },
  {
    id: "hl-2026-12-24-cb-natal",
    slug: "cb-natal-2026",
    name: "Cuti Bersama Natal",
    date: "2026-12-24",
    kind: "cuti_bersama",
    description: "Cuti bersama menyambut Natal.",
    emoji: "🎄",
  },

  // ─── Islamic awareness dates (non-libur but content-worthy) ────────
  {
    id: "hl-2026-02-18-ramadhan",
    slug: "ramadhan-1447",
    name: "Awal Ramadhan 1447 H",
    date: "2026-02-18",
    kind: "hijriah",
    description: "Hari pertama puasa Ramadhan 1447 H.",
    hijriahLabel: "1 Ramadhan 1447 H",
    emoji: "🌙",
  },
  {
    id: "hl-2026-03-10-lailatul-qadr",
    slug: "lailatul-qadr-1447",
    name: "Sepuluh Malam Terakhir Ramadhan",
    date: "2026-03-10",
    kind: "hijriah",
    description: "Sepuluh hari terakhir Ramadhan — i'tikaf dan qiyamul lail.",
    hijriahLabel: "21 Ramadhan 1447 H",
    emoji: "🌙",
  },

  // ─── 2026 — Internasional (content-worthy, non-libur) ────────────────
  {
    id: "hl-2026-02-21-bahasa",
    slug: "hari-bahasa-ibu-2026",
    name: "Hari Bahasa Ibu Internasional",
    date: "2026-02-21",
    kind: "internasional",
    description: "International Mother Language Day — UNESCO.",
    emoji: "🗣️",
  },
  {
    id: "hl-2026-03-08-perempuan",
    slug: "hari-perempuan-2026",
    name: "Hari Perempuan Internasional",
    date: "2026-03-08",
    kind: "internasional",
    description: "International Women's Day.",
    emoji: "🌹",
  },
  {
    id: "hl-2026-04-22-bumi",
    slug: "hari-bumi-2026",
    name: "Hari Bumi",
    date: "2026-04-22",
    kind: "internasional",
    description: "Earth Day — kampanye kelestarian lingkungan.",
    emoji: "🌍",
  },

  // ─── 2027 — Indonesia national (snapshot, re-seed nanti) ─────────────
  {
    id: "hl-2027-01-01-tahun-baru",
    slug: "tahun-baru-2027",
    name: "Tahun Baru 2027 Masehi",
    date: "2027-01-01",
    kind: "nasional",
    description: "Hari pertama tahun 2027 Masehi.",
    emoji: "🎆",
  },
  {
    id: "hl-2027-01-06-isra-miraj",
    slug: "isra-miraj-1448",
    name: "Isra Mi'raj Nabi Muhammad SAW",
    date: "2027-01-06",
    kind: "hijriah",
    description: "Peringatan Isra Mi'raj 27 Rajab 1448 H (perkiraan).",
    hijriahLabel: "27 Rajab 1448 H",
    emoji: "🌙",
  },
  {
    id: "hl-2027-03-10-idul-fitri",
    slug: "idul-fitri-1448",
    name: "Idul Fitri 1448 H (perkiraan)",
    date: "2027-03-10",
    kind: "hijriah",
    description: "1 Syawal 1448 H — perkiraan, akan dikonfirmasi pemerintah.",
    hijriahLabel: "1 Syawal 1448 H",
    emoji: "🌙",
  },
  {
    id: "hl-2027-05-17-idul-adha",
    slug: "idul-adha-1448",
    name: "Idul Adha 1448 H (perkiraan)",
    date: "2027-05-17",
    kind: "hijriah",
    description: "10 Dzulhijjah 1448 H — perkiraan.",
    hijriahLabel: "10 Dzulhijjah 1448 H",
    emoji: "🐑",
  },
  {
    id: "hl-2027-08-17-kemerdekaan",
    slug: "kemerdekaan-2027",
    name: "Hari Kemerdekaan RI ke-82",
    date: "2027-08-17",
    kind: "nasional",
    description: "Peringatan Proklamasi Kemerdekaan Republik Indonesia.",
    emoji: "🇮🇩",
  },
  {
    id: "hl-2027-12-25-natal",
    slug: "natal-2027",
    name: "Hari Raya Natal",
    date: "2027-12-25",
    kind: "nasional",
    description: "Peringatan kelahiran Yesus Kristus.",
    emoji: "🎄",
  },
];

export function findHoliday(id: string): Holiday | null {
  return holidays.find((h) => h.id === id) ?? null;
}

/** All holidays in chronological order, optionally filtered. */
export function upcomingHolidays(
  opts: { from?: Date; limit?: number; kind?: Holiday["kind"][] } = {},
): Holiday[] {
  const from = opts.from ?? new Date();
  const fromISO = from.toISOString().slice(0, 10);
  return holidays
    .filter((h) => h.date >= fromISO)
    .filter((h) => !opts.kind || opts.kind.includes(h.kind))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, opts.limit ?? holidays.length);
}
