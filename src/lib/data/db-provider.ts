/**
 * Neon Postgres data provider via Drizzle.
 *
 * Used when `DATABASE_URL` is set and the schema has been pushed +
 * seeded (`pnpm db:push && pnpm db:seed`). Function signatures must
 * stay aligned with `mock-provider.ts` so the dispatcher in
 * `provider.ts` can swap them seamlessly.
 */

import { and, asc, desc, eq, ilike, inArray, or, sql as drizzleSql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import * as fixtures from "./mock-provider";
import type {
  Badge,
  CaptionTemplate,
  CaptionVersion,
  CaptionVersionSource,
  ContentItem,
  ContentStatus,
  Division,
  Event,
  ID,
  MediaAsset,
  Member,
  NotificationItem,
  Quest,
  WeeklyDigest,
  XPLog,
} from "./types";

function client() {
  if (!db) throw new Error("DATABASE_URL not configured");
  return db;
}

// Cast helper: Drizzle row → domain type. The schema columns map 1-to-1 to
// the TS interfaces, so a structural cast is safe.
function row<T>(x: unknown): T {
  return x as T;
}

/* ------------------------------------------------------------------ */
/* Divisions                                                           */
/* ------------------------------------------------------------------ */

export async function listDivisions(): Promise<Division[]> {
  const rows = await client().select().from(schema.divisions);
  return rows.map((r) => row<Division>(r));
}

export async function getDivision(id: ID): Promise<Division | null> {
  const rows = await client()
    .select()
    .from(schema.divisions)
    .where(eq(schema.divisions.id, id))
    .limit(1);
  return rows[0] ? row<Division>(rows[0]) : null;
}

/* ------------------------------------------------------------------ */
/* Members                                                             */
/* ------------------------------------------------------------------ */

export async function listMembers(opts?: {
  divisionId?: ID;
  role?: Member["role"];
  search?: string;
}): Promise<Member[]> {
  const filters = [];
  if (opts?.divisionId) {
    filters.push(eq(schema.members.divisionId, opts.divisionId));
  }
  if (opts?.role) {
    filters.push(eq(schema.members.role, opts.role));
  }
  if (opts?.search) {
    const q = `%${opts.search}%`;
    filters.push(
      or(
        ilike(schema.members.name, q),
        ilike(schema.members.email, q),
        ilike(schema.members.position, q),
      )!,
    );
  }
  const query = client().select().from(schema.members);
  const rows = await (filters.length
    ? query.where(and(...filters))
    : query);
  return rows.map((r) => row<Member>(r));
}

export async function getMember(id: ID): Promise<Member | null> {
  const rows = await client()
    .select()
    .from(schema.members)
    .where(eq(schema.members.id, id))
    .limit(1);
  return rows[0] ? row<Member>(rows[0]) : null;
}

export async function getCurrentMember(): Promise<Member> {
  // Resolve the signed-in Google user → matching member record by email.
  // Falls back to the seed lead so unauthenticated pages still have a "self".
  // Imported dynamically to avoid Auth.js bootstrapping during build-time
  // type checks of this module.
  try {
    const { auth } = await import("@/auth");
    const session = await auth();
    const email = session?.user?.email;
    if (email) {
      const rows = await client()
        .select()
        .from(schema.members)
        .where(eq(schema.members.email, email))
        .limit(1);
      if (rows[0]) return row<Member>(rows[0]);
    }
  } catch {
    // Auth not configured or called outside a request scope — fall through.
  }
  const rows = await client()
    .select()
    .from(schema.members)
    .where(eq(schema.members.id, "mbr-aditya"))
    .limit(1);
  if (rows[0]) return row<Member>(rows[0]);
  return fixtures.getCurrentMember();
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

export async function listContents(opts?: {
  status?: ContentStatus | ContentStatus[];
  divisionId?: ID;
  authorId?: ID;
  rubric?: string;
  search?: string;
}): Promise<ContentItem[]> {
  const filters = [];
  if (opts?.status) {
    const set = Array.isArray(opts.status) ? opts.status : [opts.status];
    filters.push(inArray(schema.contents.status, set));
  }
  if (opts?.divisionId) {
    filters.push(eq(schema.contents.divisionId, opts.divisionId));
  }
  if (opts?.authorId) {
    filters.push(eq(schema.contents.authorId, opts.authorId));
  }
  if (opts?.rubric) {
    filters.push(eq(schema.contents.rubric, opts.rubric));
  }
  if (opts?.search) {
    const q = `%${opts.search}%`;
    filters.push(
      or(ilike(schema.contents.title, q), ilike(schema.contents.caption, q))!,
    );
  }
  const query = client()
    .select()
    .from(schema.contents)
    .orderBy(desc(schema.contents.updatedAt));
  const rows = await (filters.length
    ? query.where(and(...filters))
    : query);
  return rows.map((r) => row<ContentItem>(r));
}

export async function getContent(id: ID): Promise<ContentItem | null> {
  const rows = await client()
    .select()
    .from(schema.contents)
    .where(eq(schema.contents.id, id))
    .limit(1);
  return rows[0] ? row<ContentItem>(rows[0]) : null;
}

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */

export async function listMedia(opts?: {
  tag?: string;
  search?: string;
  aspect?: MediaAsset["aspect"];
}): Promise<MediaAsset[]> {
  const filters = [];
  if (opts?.tag) {
    filters.push(drizzleSql`${schema.media.tags} ? ${opts.tag}`);
  }
  if (opts?.aspect) {
    filters.push(eq(schema.media.aspect, opts.aspect));
  }
  if (opts?.search) {
    filters.push(ilike(schema.media.alt, `%${opts.search}%`));
  }
  const query = client()
    .select()
    .from(schema.media)
    .orderBy(desc(schema.media.uploadedAt));
  const rows = await (filters.length
    ? query.where(and(...filters))
    : query);
  return rows.map((r) => row<MediaAsset>(r));
}

export async function getMedia(id: ID): Promise<MediaAsset | null> {
  const rows = await client()
    .select()
    .from(schema.media)
    .where(eq(schema.media.id, id))
    .limit(1);
  return rows[0] ? row<MediaAsset>(rows[0]) : null;
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

export async function listEvents(opts?: {
  divisionId?: ID;
  fromDate?: string;
  toDate?: string;
  category?: Event["category"];
}): Promise<Event[]> {
  const filters = [];
  if (opts?.divisionId) {
    filters.push(eq(schema.events.divisionId, opts.divisionId));
  }
  if (opts?.fromDate) {
    filters.push(drizzleSql`${schema.events.startsAt} >= ${opts.fromDate}`);
  }
  if (opts?.toDate) {
    filters.push(drizzleSql`${schema.events.startsAt} <= ${opts.toDate}`);
  }
  if (opts?.category) {
    filters.push(eq(schema.events.category, opts.category));
  }
  const query = client()
    .select()
    .from(schema.events)
    .orderBy(asc(schema.events.startsAt));
  const rows = await (filters.length
    ? query.where(and(...filters))
    : query);
  return rows.map((r) => row<Event>(r));
}

export async function getEvent(id: ID): Promise<Event | null> {
  const rows = await client()
    .select()
    .from(schema.events)
    .where(eq(schema.events.id, id))
    .limit(1);
  return rows[0] ? row<Event>(rows[0]) : null;
}

/* ------------------------------------------------------------------ */
/* Badges + Quests                                                     */
/* ------------------------------------------------------------------ */

export async function listBadges(): Promise<Badge[]> {
  const tierOrder = drizzleSql`CASE ${schema.badges.tier}
    WHEN 'legendary' THEN 0
    WHEN 'platinum' THEN 1
    WHEN 'gold' THEN 2
    WHEN 'silver' THEN 3
    WHEN 'bronze' THEN 4
    ELSE 5 END`;
  const rows = await client()
    .select()
    .from(schema.badges)
    .orderBy(tierOrder);
  return rows.map((r) => row<Badge>(r));
}

export async function getBadge(id: ID): Promise<Badge | null> {
  const rows = await client()
    .select()
    .from(schema.badges)
    .where(eq(schema.badges.id, id))
    .limit(1);
  return rows[0] ? row<Badge>(rows[0]) : null;
}

export async function listQuests(): Promise<Quest[]> {
  const rows = await client().select().from(schema.quests);
  return rows.map((r) => row<Quest>(r));
}

/* ------------------------------------------------------------------ */
/* Notifications + XP                                                  */
/* ------------------------------------------------------------------ */

export async function listNotifications(
  memberId: ID,
): Promise<NotificationItem[]> {
  const rows = await client()
    .select()
    .from(schema.notifications)
    .where(eq(schema.notifications.memberId, memberId))
    .orderBy(desc(schema.notifications.at));
  return rows.map((r) => row<NotificationItem>(r));
}

export async function getWeeklyDigest(): Promise<WeeklyDigest> {
  const rows = await client()
    .select()
    .from(schema.weeklyDigests)
    .orderBy(desc(schema.weeklyDigests.generatedAt))
    .limit(1);
  if (rows[0]) return row<WeeklyDigest>(rows[0]);
  return fixtures.getWeeklyDigest();
}

export async function listXPLogs(memberId: ID): Promise<XPLog[]> {
  const rows = await client()
    .select()
    .from(schema.xpLogs)
    .where(eq(schema.xpLogs.memberId, memberId))
    .orderBy(desc(schema.xpLogs.at));
  return rows.map((r) => row<XPLog>(r));
}

/* ------------------------------------------------------------------ */
/* Caption templates + Leaderboards                                    */
/* ------------------------------------------------------------------ */

export async function listCaptionTemplates(): Promise<CaptionTemplate[]> {
  const rows = await client().select().from(schema.captionTemplates);
  return rows.map((r) => row<CaptionTemplate>(r));
}

export async function listLeaderboard(): Promise<Member[]> {
  const rows = await client()
    .select()
    .from(schema.members)
    .orderBy(desc(schema.members.xp));
  return rows.map((r) => row<Member>(r));
}

export async function listDivisionLeaderboard(): Promise<
  Array<{
    division: Division;
    totalXP: number;
    postCount: number;
    engagementRate: number;
  }>
> {
  const [divs, mbrs, posts] = await Promise.all([
    listDivisions(),
    listMembers(),
    listContents({ status: "published" }),
  ]);
  const map = new Map<
    ID,
    { totalXP: number; postCount: number; eng: number; engN: number }
  >();
  for (const m of mbrs) {
    const cur =
      map.get(m.divisionId) ??
      { totalXP: 0, postCount: 0, eng: 0, engN: 0 };
    cur.totalXP += m.xp;
    map.set(m.divisionId, cur);
  }
  for (const c of posts) {
    const cur = map.get(c.divisionId);
    if (!cur) continue;
    cur.postCount += 1;
    if (c.metrics) {
      cur.eng += c.metrics.engagementRate;
      cur.engN += 1;
    }
  }
  return divs
    .map((d) => {
      const v = map.get(d.id) ?? { totalXP: 0, postCount: 0, eng: 0, engN: 0 };
      return {
        division: d,
        totalXP: v.totalXP,
        postCount: v.postCount,
        engagementRate: v.engN > 0 ? v.eng / v.engN : 0,
      };
    })
    .sort((a, b) => b.totalXP - a.totalXP);
}

/* ------------------------------------------------------------------ */
/* Caption versions                                                    */
/* ------------------------------------------------------------------ */

export async function listCaptionVersions(
  contentId: ID,
): Promise<CaptionVersion[]> {
  const rows = await client()
    .select()
    .from(schema.captionVersions)
    .where(eq(schema.captionVersions.contentId, contentId))
    .orderBy(desc(schema.captionVersions.createdAt));
  return rows.map((r) => row<CaptionVersion>(r));
}

export async function createCaptionVersion(input: {
  contentId: ID;
  caption: string;
  hashtags?: string;
  captionStyle?: string | null;
  source?: CaptionVersionSource;
  note?: string;
  authorId?: ID | null;
}): Promise<CaptionVersion> {
  const id = `cvr-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  const insertRow = {
    id,
    contentId: input.contentId,
    caption: input.caption,
    hashtags: input.hashtags ?? "",
    captionStyle: input.captionStyle ?? null,
    source: input.source ?? "manual",
    note: input.note ?? "",
    authorId: input.authorId ?? null,
    createdAt,
  };
  await client().insert(schema.captionVersions).values(insertRow);
  return row<CaptionVersion>(insertRow);
}

export async function restoreCaptionVersion(versionId: ID): Promise<{
  content: ContentItem;
  version: CaptionVersion;
} | null> {
  const verRows = await client()
    .select()
    .from(schema.captionVersions)
    .where(eq(schema.captionVersions.id, versionId))
    .limit(1);
  const ver = verRows[0];
  if (!ver) return null;

  const updatedAt = new Date().toISOString();
  await client()
    .update(schema.contents)
    .set({
      caption: ver.caption,
      hashtags: ver.hashtags,
      captionStyle: ver.captionStyle ?? null,
      updatedAt,
    })
    .where(eq(schema.contents.id, ver.contentId));

  const updated = await client()
    .select()
    .from(schema.contents)
    .where(eq(schema.contents.id, ver.contentId))
    .limit(1);
  if (!updated[0]) return null;

  await createCaptionVersion({
    contentId: ver.contentId,
    caption: ver.caption,
    hashtags: ver.hashtags,
    captionStyle: ver.captionStyle,
    source: "restore",
    note: `Restored from version ${versionId}`,
    authorId: ver.authorId,
  });

  return {
    content: row<ContentItem>(updated[0]),
    version: row<CaptionVersion>(ver),
  };
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

export interface ContentInput {
  title: string;
  rubric: ContentItem["rubric"];
  status?: ContentStatus;
  divisionId: ID;
  authorId: ID;
  body?: string;
  caption?: string;
  hashtags?: string;
  channels?: ContentItem["channels"];
  mediaIds?: ID[];
  scheduledFor?: string | null;
  captionStyle?: ContentItem["captionStyle"] | null;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function createContent(input: ContentInput): Promise<ContentItem> {
  const now = new Date().toISOString();
  const id = `cnt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const slug = slugify(input.title) || id;
  const inserted = await client()
    .insert(schema.contents)
    .values({
      id,
      title: input.title,
      slug,
      rubric: input.rubric,
      status: input.status ?? "draft",
      divisionId: input.divisionId,
      authorId: input.authorId,
      body: input.body ?? "",
      caption: input.caption ?? "",
      hashtags: input.hashtags ?? "",
      channels: input.channels ?? ["instagram"],
      mediaIds: input.mediaIds ?? [],
      scheduledFor: input.scheduledFor ?? null,
      publishedAt: null,
      approvers: [],
      waitingOn: [],
      metrics: null,
      captionStyle: input.captionStyle ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return row<ContentItem>(inserted[0]);
}

export interface ContentUpdate {
  title?: string;
  rubric?: ContentItem["rubric"];
  status?: ContentStatus;
  body?: string;
  caption?: string;
  hashtags?: string;
  channels?: ContentItem["channels"];
  mediaIds?: ID[];
  scheduledFor?: string | null;
  publishedAt?: string | null;
  captionStyle?: ContentItem["captionStyle"] | null;
}

export async function updateContent(
  id: ID,
  patch: ContentUpdate,
): Promise<ContentItem | null> {
  const set: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) set[k] = v;
  }
  if (patch.title !== undefined) set.slug = slugify(patch.title) || id;
  const updated = await client()
    .update(schema.contents)
    .set(set)
    .where(eq(schema.contents.id, id))
    .returning();
  return updated[0] ? row<ContentItem>(updated[0]) : null;
}

export async function deleteContent(id: ID): Promise<boolean> {
  const deleted = await client()
    .delete(schema.contents)
    .where(eq(schema.contents.id, id))
    .returning({ id: schema.contents.id });
  return deleted.length > 0;
}

export interface MemberInput {
  name: string;
  email: string;
  role?: Member["role"];
  divisionId: ID;
  position?: string;
  bio?: string;
  angkatan: number;
  nimSuffix: string;
  avatarEmoji?: string;
  accentHue?: number;
}

export async function createMember(input: MemberInput): Promise<Member> {
  const id = `mbr-${slugify(input.name) || Date.now().toString(36)}`;
  const initials = input.name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  const inserted = await client()
    .insert(schema.members)
    .values({
      id,
      name: input.name,
      initials,
      email: input.email,
      role: input.role ?? "anggota",
      divisionId: input.divisionId,
      position: input.position ?? "Anggota",
      joinedAt: new Date().toISOString(),
      bio: input.bio ?? null,
      xp: 0,
      streak: 0,
      badges: [],
      angkatan: input.angkatan,
      nimSuffix: input.nimSuffix,
      avatarEmoji: input.avatarEmoji ?? "👤",
      accentHue: input.accentHue ?? 180,
    })
    .returning();
  return row<Member>(inserted[0]);
}

export interface MemberUpdate {
  name?: string;
  email?: string;
  role?: Member["role"];
  divisionId?: ID;
  position?: string;
  bio?: string | null;
  angkatan?: number;
  nimSuffix?: string;
  avatarEmoji?: string;
  accentHue?: number;
  xp?: number;
  streak?: number;
  userId?: string | null;
}

export async function updateMember(
  id: ID,
  patch: MemberUpdate,
): Promise<Member | null> {
  const set: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) set[k] = v;
  }
  if (patch.name !== undefined) {
    set.initials = patch.name
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");
  }
  const updated = await client()
    .update(schema.members)
    .set(set)
    .where(eq(schema.members.id, id))
    .returning();
  return updated[0] ? row<Member>(updated[0]) : null;
}

export async function deleteMember(id: ID): Promise<boolean> {
  const deleted = await client()
    .delete(schema.members)
    .where(eq(schema.members.id, id))
    .returning({ id: schema.members.id });
  return deleted.length > 0;
}

export async function findMemberByEmail(email: string): Promise<Member | null> {
  const rows = await client()
    .select()
    .from(schema.members)
    .where(eq(schema.members.email, email))
    .limit(1);
  return rows[0] ? row<Member>(rows[0]) : null;
}

/* ------------------------------------------------------------------ */
/* Holidays / calendar dates                                           */
/* ------------------------------------------------------------------ */

import type { Holiday } from "@/lib/fixtures/holidays";

export async function listHolidays(opts?: {
  from?: Date;
  to?: Date;
  kind?: Holiday["kind"][];
}): Promise<Holiday[]> {
  const conditions = [];
  if (opts?.from) {
    conditions.push(
      drizzleSql`${schema.holidays.date} >= ${opts.from.toISOString().slice(0, 10)}`,
    );
  }
  if (opts?.to) {
    conditions.push(
      drizzleSql`${schema.holidays.date} <= ${opts.to.toISOString().slice(0, 10)}`,
    );
  }
  if (opts?.kind && opts.kind.length > 0) {
    conditions.push(inArray(schema.holidays.kind, opts.kind));
  }

  const rows = await client()
    .select()
    .from(schema.holidays)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(schema.holidays.date));

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    date: r.date,
    kind: r.kind as Holiday["kind"],
    description: r.description,
    hijriahLabel: r.hijriahLabel ?? undefined,
    emoji: r.emoji ?? undefined,
  }));
}

/* ------------------------------------------------------------------ */
/* Site settings / bio config                                          */
/* ------------------------------------------------------------------ */

import { type BioConfig, defaultBioConfig } from "@/lib/fixtures/bio";

export async function getBioConfig(): Promise<BioConfig> {
  const rows = await client()
    .select()
    .from(schema.siteSettings)
    .where(eq(schema.siteSettings.key, "bio"))
    .limit(1);
  if (!rows[0]) return defaultBioConfig;
  return rows[0].value as BioConfig;
}

export async function setBioConfig(value: BioConfig): Promise<BioConfig> {
  const now = new Date().toISOString();
  await client()
    .insert(schema.siteSettings)
    .values({ key: "bio", value, updatedAt: now })
    .onConflictDoUpdate({
      target: schema.siteSettings.key,
      set: { value, updatedAt: now },
    });
  return value;
}
