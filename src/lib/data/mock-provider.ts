/**
 * Static in-memory data provider backed by `src/lib/fixtures/*`.
 *
 * Used when `DATABASE_URL` is not set — gives the UI deterministic seed
 * data so previews and local dev don't require Neon provisioning.
 */

import { divisions, findDivision } from "@/lib/fixtures/divisions";
import {
  members,
  currentMember,
  findMember,
} from "@/lib/fixtures/members";
import {
  contents,
  findContent,
  captionTemplates,
} from "@/lib/fixtures/contents";
import { media, findMedia } from "@/lib/fixtures/media";
import { events, findEvent } from "@/lib/fixtures/events";
import { badges, findBadge, quests } from "@/lib/fixtures/badges";
import {
  notifications,
  weeklyDigest,
  xpLogs,
} from "@/lib/fixtures/notifications";
import type {
  ContentItem,
  ContentStatus,
  Division,
  Event,
  Member,
  MediaAsset,
  NotificationItem,
  Quest,
  Badge,
  WeeklyDigest,
  XPLog,
  CaptionTemplate,
  ID,
} from "./types";

export async function listDivisions(): Promise<Division[]> {
  return divisions;
}

export async function getDivision(id: ID): Promise<Division | null> {
  return findDivision(id);
}

export async function listMembers(opts?: {
  divisionId?: ID;
  role?: Member["role"];
  search?: string;
}): Promise<Member[]> {
  let result = members.slice();
  if (opts?.divisionId) {
    result = result.filter((m) => m.divisionId === opts.divisionId);
  }
  if (opts?.role) {
    result = result.filter((m) => m.role === opts.role);
  }
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.position.toLowerCase().includes(q),
    );
  }
  return result;
}

export async function getMember(id: ID): Promise<Member | null> {
  return findMember(id);
}

export async function getCurrentMember(): Promise<Member> {
  return currentMember;
}

export async function listContents(opts?: {
  status?: ContentStatus | ContentStatus[];
  divisionId?: ID;
  authorId?: ID;
  rubric?: string;
  search?: string;
}): Promise<ContentItem[]> {
  let result = contents.slice();
  if (opts?.status) {
    const set = Array.isArray(opts.status) ? opts.status : [opts.status];
    result = result.filter((c) => set.includes(c.status));
  }
  if (opts?.divisionId) {
    result = result.filter((c) => c.divisionId === opts.divisionId);
  }
  if (opts?.authorId) {
    result = result.filter((c) => c.authorId === opts.authorId);
  }
  if (opts?.rubric) {
    result = result.filter((c) => c.rubric === opts.rubric);
  }
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.caption.toLowerCase().includes(q),
    );
  }
  return result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getContent(id: ID): Promise<ContentItem | null> {
  return findContent(id);
}

export async function listMedia(opts?: {
  tag?: string;
  search?: string;
  aspect?: MediaAsset["aspect"];
}): Promise<MediaAsset[]> {
  let result = media.slice();
  if (opts?.tag) {
    result = result.filter((m) => m.tags.includes(opts.tag!));
  }
  if (opts?.aspect) {
    result = result.filter((m) => m.aspect === opts.aspect);
  }
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    result = result.filter(
      (m) =>
        m.alt.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  return result.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export async function getMedia(id: ID): Promise<MediaAsset | null> {
  return findMedia(id);
}

export async function listEvents(opts?: {
  divisionId?: ID;
  fromDate?: string;
  toDate?: string;
  category?: Event["category"];
}): Promise<Event[]> {
  let result = events.slice();
  if (opts?.divisionId) {
    result = result.filter((e) => e.divisionId === opts.divisionId);
  }
  if (opts?.fromDate) {
    result = result.filter((e) => e.startsAt >= opts.fromDate!);
  }
  if (opts?.toDate) {
    result = result.filter((e) => e.startsAt <= opts.toDate!);
  }
  if (opts?.category) {
    result = result.filter((e) => e.category === opts.category);
  }
  return result.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export async function getEvent(id: ID): Promise<Event | null> {
  return findEvent(id);
}

export async function listBadges(): Promise<Badge[]> {
  return badges.slice().sort((a, b) => {
    const order: Badge["tier"][] = [
      "legendary",
      "platinum",
      "gold",
      "silver",
      "bronze",
    ];
    return order.indexOf(a.tier) - order.indexOf(b.tier);
  });
}

export async function getBadge(id: ID): Promise<Badge | null> {
  return findBadge(id);
}

export async function listQuests(): Promise<Quest[]> {
  return quests.slice();
}

export async function listNotifications(
  memberId: ID,
): Promise<NotificationItem[]> {
  return notifications.filter((n) => n.memberId === memberId);
}

export async function getWeeklyDigest(): Promise<WeeklyDigest> {
  return weeklyDigest;
}

export async function listXPLogs(memberId: ID): Promise<XPLog[]> {
  return xpLogs
    .filter((x) => x.memberId === memberId)
    .sort((a, b) => b.at.localeCompare(a.at));
}

export async function listCaptionTemplates(): Promise<CaptionTemplate[]> {
  return captionTemplates;
}

export async function listLeaderboard(): Promise<Member[]> {
  return members.slice().sort((a, b) => b.xp - a.xp);
}

export async function listDivisionLeaderboard(): Promise<
  Array<{
    division: Division;
    totalXP: number;
    postCount: number;
    engagementRate: number;
  }>
> {
  const map = new Map<
    ID,
    { totalXP: number; postCount: number; eng: number; engN: number }
  >();
  for (const m of members) {
    const cur =
      map.get(m.divisionId) ??
      { totalXP: 0, postCount: 0, eng: 0, engN: 0 };
    cur.totalXP += m.xp;
    map.set(m.divisionId, cur);
  }
  for (const c of contents) {
    if (c.status !== "published") continue;
    const cur = map.get(c.divisionId);
    if (!cur) continue;
    cur.postCount += 1;
    if (c.metrics) {
      cur.eng += c.metrics.engagementRate;
      cur.engN += 1;
    }
  }
  const result = divisions.map((d) => {
    const v =
      map.get(d.id) ?? { totalXP: 0, postCount: 0, eng: 0, engN: 0 };
    return {
      division: d,
      totalXP: v.totalXP,
      postCount: v.postCount,
      engagementRate: v.engN > 0 ? v.eng / v.engN : 0,
    };
  });
  return result.sort((a, b) => b.totalXP - a.totalXP);
}
