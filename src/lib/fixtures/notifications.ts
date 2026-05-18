import type { NotificationItem, WeeklyDigest, XPLog } from "@/lib/data/types";

/**
 * Seeds for notifications, weekly digest, and XP logs are intentionally
 * empty. The CMS starts on a blank slate; these surfaces fill up as the team
 * uses the app (notifications are written by mutations, the digest is
 * regenerated weekly by a job, and XP is awarded by various actions).
 */
export const notifications: NotificationItem[] = [];

export const weeklyDigest: WeeklyDigest = {
  id: "dg-current",
  isoWeek: new Date().toISOString().slice(0, 4) + "-W00",
  generatedAt: new Date().toISOString(),
  highlights: ["Belum ada digest minggu ini."],
  recommendations: [],
  totalReach: 0,
  topContentId: "",
};

export const xpLogs: XPLog[] = [];
