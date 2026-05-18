import type { Badge, Quest } from "@/lib/data/types";

/**
 * Generic system badges. These reward generic actions (posting, AI usage,
 * mentoring) so they keep working without depending on specific programs.
 * Program-specific badges should be added later via UI/API once the tim
 * defines its own rubrics.
 *
 * `unlockedCount` starts at 0 since the CMS launches with no historical data.
 */
export const badges: Badge[] = [
  {
    id: "bdg-first-post",
    slug: "first-post",
    name: "Pena Pertama",
    description: "Publish konten pertamamu di Humas Eksyar.",
    tier: "bronze",
    icon: "feather",
    xpReward: 50,
    unlockedCount: 0,
    totalMembers: 10,
  },
  {
    id: "bdg-streak-7",
    slug: "streak-7",
    name: "Istiqomah 7 Hari",
    description: "Posting atau kontribusi tujuh hari berturut-turut.",
    tier: "bronze",
    icon: "flame",
    xpReward: 80,
    unlockedCount: 0,
    totalMembers: 10,
  },
  {
    id: "bdg-streak-30",
    slug: "streak-30",
    name: "Istiqomah 30 Hari",
    description: "Streak tiga puluh hari penuh.",
    tier: "silver",
    icon: "flame",
    xpReward: 250,
    unlockedCount: 0,
    totalMembers: 10,
  },
  {
    id: "bdg-streak-100",
    slug: "streak-100",
    name: "Istiqomah 100 Hari",
    description: "Streak seratus hari — pencapaian langka.",
    tier: "gold",
    icon: "flame",
    xpReward: 800,
    unlockedCount: 0,
    totalMembers: 10,
  },
  {
    id: "bdg-ai-pioneer",
    slug: "ai-pioneer",
    name: "AI Pioneer",
    description: "Generate caption AI 25× dengan rating ≥ 4★.",
    tier: "silver",
    icon: "sparkles",
    xpReward: 200,
    unlockedCount: 0,
    totalMembers: 10,
  },
  {
    id: "bdg-mentor",
    slug: "mentor",
    name: "Mentor Sejati",
    description: "Bantu tiga anggota lain menyelesaikan quest mingguan.",
    tier: "silver",
    icon: "users",
    xpReward: 180,
    unlockedCount: 0,
    totalMembers: 10,
  },
  {
    id: "bdg-leader",
    slug: "leader",
    name: "Pemimpin Inspiratif",
    description: "Approval rapi tiga puluh hari tanpa penolakan.",
    tier: "gold",
    icon: "crown",
    xpReward: 400,
    unlockedCount: 0,
    totalMembers: 10,
  },
  {
    id: "bdg-engagement",
    slug: "engagement-king",
    name: "Engagement Champion",
    description: "Konten dengan engagement rate ≥ 8%.",
    tier: "platinum",
    icon: "trending-up",
    xpReward: 500,
    unlockedCount: 0,
    totalMembers: 10,
  },
];

export const findBadge = (id: string) => badges.find((b) => b.id === id) ?? null;

/**
 * Generic quests. The team can replace these or add their own once they
 * define program-specific cadences.
 */
export const quests: Quest[] = [
  {
    id: "qst-weekly-3-posts",
    slug: "weekly-3-posts",
    title: "Tiga Konten Mingguan",
    description: "Publish minimal tiga konten dalam tujuh hari.",
    xpReward: 150,
    difficulty: "easy",
    duration: "weekly",
    progress: 0,
    target: 3,
    current: 0,
    deadline: "",
  },
  {
    id: "qst-weekly-1-ai",
    slug: "weekly-1-ai",
    title: "Asisten AI Sigap",
    description: "Coba AI Caption Generator minimal sekali minggu ini.",
    xpReward: 60,
    difficulty: "easy",
    duration: "weekly",
    progress: 0,
    target: 1,
    current: 0,
    deadline: "",
  },
];
