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
  BrandingConfig,
  CaptionTemplate,
  CaptionVersion,
  CaptionVersionSource,
  ContentComment,
  ContentDraft,
  ContentItem,
  ContentStatus,
  Division,
  Event,
  ID,
  MediaAsset,
  Member,
  MemberTask,
  NotificationItem,
  Quest,
  Rubric,
  TaskStatus,
  WeeklyDigest,
  XPLog,
} from "./types";
import { defaultBrandingConfig } from "./types";

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

/**
 * Resolve the currently signed-in Google user into a roster `Member` row.
 *
 * Lookup order:
 *   1. By `members.userId` (fastest — set once the link is established).
 *   2. By `members.email` (matches when a roster entry was seeded with the
 *      same address the person uses to log in).
 *   3. By case-insensitive `members.name` (one-shot reconciliation step:
 *      when a person logs in for the first time with a personal Gmail that
 *      differs from the institutional address we seeded, we use the name
 *      from the OAuth profile to find the existing roster entry, then link
 *      `userId` + overwrite `email` so subsequent requests use the fast
 *      path).
 *
 * If nothing matches we **do not** fall back to a hard-coded seed member —
 * that's how Ridwan briefly appeared as Aditya. Instead we synthesise a
 * non-persistent ghost member from the OAuth claims so headers/profile
 * surfaces still render the right name and avatar; the admin can promote
 * the ghost to a real roster entry through the members UI.
 */
export async function getCurrentMember(): Promise<Member> {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();
    if (!session?.user) return fixtures.getCurrentMember();

    const userId = (session.user as { id?: string }).id ?? undefined;
    const email = session.user.email ?? undefined;
    const name = session.user.name ?? undefined;
    const image = session.user.image ?? undefined;

    // 1. userId match — fast path, no writes needed.
    if (userId) {
      const rows = await client()
        .select()
        .from(schema.members)
        .where(eq(schema.members.userId, userId))
        .limit(1);
      if (rows[0]) return row<Member>(rows[0]);
    }

    // 2. email match — link userId on the way out so step 1 catches it next
    //    request.
    if (email) {
      const rows = await client()
        .select()
        .from(schema.members)
        .where(eq(schema.members.email, email))
        .limit(1);
      if (rows[0]) {
        if (userId && !rows[0].userId) {
          await client()
            .update(schema.members)
            .set({ userId })
            .where(eq(schema.members.id, rows[0].id));
          return row<Member>({ ...rows[0], userId });
        }
        return row<Member>(rows[0]);
      }
    }

    // 3. Name match — reconcile institutional roster with personal Gmail.
    //    Only takes effect when the roster row is unclaimed (`userId` null);
    //    that guard means we never overwrite a link that already points at
    //    a different user.
    if (name) {
      const rows = await client()
        .select()
        .from(schema.members)
        .where(
          and(
            drizzleSql`LOWER(${schema.members.name}) = LOWER(${name})`,
            drizzleSql`${schema.members.userId} IS NULL`,
          ),
        )
        .limit(1);
      if (rows[0]) {
        const updates: { userId?: string; email?: string } = {};
        if (userId) updates.userId = userId;
        if (email && email !== rows[0].email) updates.email = email;
        if (Object.keys(updates).length > 0) {
          await client()
            .update(schema.members)
            .set(updates)
            .where(eq(schema.members.id, rows[0].id));
        }
        return row<Member>({ ...rows[0], ...updates });
      }
    }

    // Nothing matched — return a non-persistent ghost so the UI still
    // renders the signed-in identity. The ghost intentionally lacks a
    // division so admins notice and assign one through the members UI.
    return {
      id: userId ?? `ghost-${email ?? "anon"}`,
      userId: userId ?? null,
      name: name ?? email ?? "Belum bergabung",
      initials: initialsFromName(name ?? email ?? "?"),
      email: email ?? "",
      role: "anggota",
      divisionId: "",
      position: "Belum bergabung",
      joinedAt: new Date().toISOString().slice(0, 10),
      bio: null,
      xp: 0,
      streak: 0,
      badges: [],
      angkatan: new Date().getFullYear(),
      nimSuffix: "",
      avatarEmoji: image ? "" : "👤",
      accentHue: 180,
    } as unknown as Member;
  } catch {
    // Auth not configured or called outside a request scope.
    return fixtures.getCurrentMember();
  }
}

function initialsFromName(name: string): string {
  const parts = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "");
  const out = parts.join("");
  return out || name.slice(0, 2).toUpperCase();
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
  avatarUrl?: string | null;
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

export async function getBrandingConfig(): Promise<BrandingConfig> {
  const rows = await client()
    .select()
    .from(schema.siteSettings)
    .where(eq(schema.siteSettings.key, "branding"))
    .limit(1);
  if (!rows[0]) return defaultBrandingConfig;
  return { ...defaultBrandingConfig, ...(rows[0].value as Partial<BrandingConfig>) };
}

export async function setBrandingConfig(value: BrandingConfig): Promise<BrandingConfig> {
  const now = new Date().toISOString();
  await client()
    .insert(schema.siteSettings)
    .values({ key: "branding", value, updatedAt: now })
    .onConflictDoUpdate({
      target: schema.siteSettings.key,
      set: { value, updatedAt: now },
    });
  return value;
}

/* ------------------------------------------------------------------ */
/* Rubrics                                                             */
/* ------------------------------------------------------------------ */

function toRubric(r: typeof schema.rubrics.$inferSelect): Rubric {
  return {
    id: r.id,
    slug: r.slug,
    label: r.label,
    description: r.description,
    emoji: r.emoji,
    isActive: r.isActive,
    sortOrder: r.sortOrder,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export async function listRubrics({
  includeInactive = false,
}: { includeInactive?: boolean } = {}): Promise<Rubric[]> {
  const rows = includeInactive
    ? await client().select().from(schema.rubrics).orderBy(asc(schema.rubrics.sortOrder))
    : await client()
        .select()
        .from(schema.rubrics)
        .where(eq(schema.rubrics.isActive, true))
        .orderBy(asc(schema.rubrics.sortOrder));
  return rows.map(toRubric);
}

export async function getRubric(idOrSlug: ID): Promise<Rubric | null> {
  const rows = await client()
    .select()
    .from(schema.rubrics)
    .where(or(eq(schema.rubrics.id, idOrSlug), eq(schema.rubrics.slug, idOrSlug)))
    .limit(1);
  return rows[0] ? toRubric(rows[0]) : null;
}

export interface RubricInput {
  slug: string;
  label: string;
  description?: string;
  emoji?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export async function createRubric(input: RubricInput): Promise<Rubric> {
  const now = new Date().toISOString();
  const id = `rub-${input.slug.replace(/[^a-z0-9-]+/gi, "-").toLowerCase()}-${Date.now().toString(36)}`;
  const inserted = await client()
    .insert(schema.rubrics)
    .values({
      id,
      slug: input.slug,
      label: input.label,
      description: input.description ?? "",
      emoji: input.emoji ?? null,
      sortOrder: input.sortOrder ?? 99,
      isActive: input.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return toRubric(inserted[0]);
}

export interface RubricUpdate {
  slug?: string;
  label?: string;
  description?: string;
  emoji?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export async function updateRubric(id: ID, patch: RubricUpdate): Promise<Rubric | null> {
  const set: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) set[k] = v;
  }
  const updated = await client()
    .update(schema.rubrics)
    .set(set)
    .where(eq(schema.rubrics.id, id))
    .returning();
  return updated[0] ? toRubric(updated[0]) : null;
}

export async function deleteRubric(id: ID): Promise<boolean> {
  const deleted = await client()
    .delete(schema.rubrics)
    .where(eq(schema.rubrics.id, id))
    .returning({ id: schema.rubrics.id });
  return deleted.length > 0;
}

/* ------------------------------------------------------------------ */
/* Content comments (Tier 2)                                          */
/* ------------------------------------------------------------------ */

export async function listContentComments(
  contentId: ID,
): Promise<ContentComment[]> {
  const rows = await client()
    .select()
    .from(schema.contentComments)
    .where(eq(schema.contentComments.contentId, contentId))
    .orderBy(asc(schema.contentComments.createdAt));
  return rows.map((r) => row<ContentComment>(r));
}

export async function createContentComment(input: {
  contentId: ID;
  authorId: ID;
  body: string;
}): Promise<ContentComment> {
  const now = new Date().toISOString();
  const newRow = {
    id: `cmt-${crypto.randomUUID().slice(0, 8)}`,
    contentId: input.contentId,
    authorId: input.authorId,
    body: input.body,
    resolvedAt: null,
    createdAt: now,
  };
  const inserted = await client()
    .insert(schema.contentComments)
    .values(newRow)
    .returning();
  return row<ContentComment>(inserted[0]);
}

export async function updateContentComment(
  id: ID,
  patch: Partial<Pick<ContentComment, "body" | "resolvedAt">>,
): Promise<ContentComment | null> {
  const set: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) set[k] = v;
  }
  if (Object.keys(set).length === 0) {
    const rows = await client()
      .select()
      .from(schema.contentComments)
      .where(eq(schema.contentComments.id, id))
      .limit(1);
    return rows[0] ? row<ContentComment>(rows[0]) : null;
  }
  const updated = await client()
    .update(schema.contentComments)
    .set(set)
    .where(eq(schema.contentComments.id, id))
    .returning();
  return updated[0] ? row<ContentComment>(updated[0]) : null;
}

export async function deleteContentComment(id: ID): Promise<boolean> {
  const deleted = await client()
    .delete(schema.contentComments)
    .where(eq(schema.contentComments.id, id))
    .returning({ id: schema.contentComments.id });
  return deleted.length > 0;
}

/* ------------------------------------------------------------------ */
/* Content autosave drafts (Tier 2)                                   */
/* ------------------------------------------------------------------ */

export async function getContentDraft(
  contentId: ID,
): Promise<ContentDraft | null> {
  const rows = await client()
    .select()
    .from(schema.contentDrafts)
    .where(eq(schema.contentDrafts.contentId, contentId))
    .limit(1);
  return rows[0] ? row<ContentDraft>(rows[0]) : null;
}

export async function saveContentDraft(input: {
  contentId: ID;
  body: string;
  caption: string;
  hashtags: string;
  authorId: ID | null;
}): Promise<ContentDraft> {
  const now = new Date().toISOString();
  const values = {
    contentId: input.contentId,
    body: input.body,
    caption: input.caption,
    hashtags: input.hashtags,
    authorId: input.authorId,
    savedAt: now,
  };
  const inserted = await client()
    .insert(schema.contentDrafts)
    .values(values)
    .onConflictDoUpdate({
      target: schema.contentDrafts.contentId,
      set: {
        body: values.body,
        caption: values.caption,
        hashtags: values.hashtags,
        authorId: values.authorId,
        savedAt: values.savedAt,
      },
    })
    .returning();
  return row<ContentDraft>(inserted[0]);
}

export async function clearContentDraft(contentId: ID): Promise<boolean> {
  const deleted = await client()
    .delete(schema.contentDrafts)
    .where(eq(schema.contentDrafts.contentId, contentId))
    .returning({ contentId: schema.contentDrafts.contentId });
  return deleted.length > 0;
}

/* ------------------------------------------------------------------ */
/* Personal tasks                                                      */
/* ------------------------------------------------------------------ */

export async function listMemberTasks(opts: {
  memberId: ID;
  status?: TaskStatus[];
}): Promise<MemberTask[]> {
  const conds = [eq(schema.memberTasks.memberId, opts.memberId)];
  if (opts.status && opts.status.length > 0) {
    conds.push(inArray(schema.memberTasks.status, opts.status));
  }
  const rows = await client()
    .select()
    .from(schema.memberTasks)
    .where(and(...conds))
    .orderBy(asc(schema.memberTasks.dueDate), desc(schema.memberTasks.createdAt));
  return rows.map((r) => row<MemberTask>(r));
}

export async function createMemberTask(input: {
  memberId: ID;
  title: string;
  description?: string;
  contentId?: ID | null;
  eventId?: ID | null;
  holidayId?: ID | null;
  dueDate?: string | null;
}): Promise<MemberTask> {
  const now = new Date().toISOString();
  const id = `tsk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const inserted = await client()
    .insert(schema.memberTasks)
    .values({
      id,
      memberId: input.memberId,
      title: input.title,
      description: input.description ?? "",
      contentId: input.contentId ?? null,
      eventId: input.eventId ?? null,
      holidayId: input.holidayId ?? null,
      dueDate: input.dueDate ?? null,
      status: "pending",
      createdAt: now,
      completedAt: null,
    })
    .returning();
  return row<MemberTask>(inserted[0]);
}

export async function updateMemberTask(
  id: ID,
  patch: {
    title?: string;
    description?: string;
    dueDate?: string | null;
    status?: TaskStatus;
  },
): Promise<MemberTask | null> {
  const set: Record<string, unknown> = {};
  if (patch.title !== undefined) set.title = patch.title;
  if (patch.description !== undefined) set.description = patch.description;
  if (patch.dueDate !== undefined) set.dueDate = patch.dueDate;
  if (patch.status !== undefined) {
    set.status = patch.status;
    set.completedAt =
      patch.status === "done" ? new Date().toISOString() : null;
  }
  if (Object.keys(set).length === 0) return null;
  const updated = await client()
    .update(schema.memberTasks)
    .set(set)
    .where(eq(schema.memberTasks.id, id))
    .returning();
  return updated[0] ? row<MemberTask>(updated[0]) : null;
}

export async function deleteMemberTask(id: ID): Promise<boolean> {
  const deleted = await client()
    .delete(schema.memberTasks)
    .where(eq(schema.memberTasks.id, id))
    .returning({ id: schema.memberTasks.id });
  return deleted.length > 0;
}

export async function getMemberTask(id: ID): Promise<MemberTask | null> {
  const rows = await client()
    .select()
    .from(schema.memberTasks)
    .where(eq(schema.memberTasks.id, id))
    .limit(1);
  return rows[0] ? row<MemberTask>(rows[0]) : null;
}

/* ------------------------------------------------------------------ */
/* Media — writes                                                      */
/* ------------------------------------------------------------------ */

export async function createMedia(input: {
  url: string;
  width: number;
  height: number;
  type?: MediaAsset["type"];
  alt?: string;
  tags?: string[];
  uploaderId: ID;
}): Promise<MediaAsset> {
  const aspect: MediaAsset["aspect"] = (() => {
    const ratio = input.width / Math.max(input.height, 1);
    if (ratio > 1.7) return "wide";
    if (ratio > 1.15) return "landscape";
    if (ratio < 0.85) return "portrait";
    return "square";
  })();
  const id = `med-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const inserted = await client()
    .insert(schema.media)
    .values({
      id,
      url: input.url,
      width: input.width,
      height: input.height,
      type: input.type ?? "image",
      alt: input.alt ?? "",
      tags: input.tags ?? [],
      usedIn: [],
      uploaderId: input.uploaderId,
      uploadedAt: new Date().toISOString(),
      aspect,
      averageColor: "#888888",
    })
    .returning();
  return row<MediaAsset>(inserted[0]);
}

export async function updateMedia(
  id: ID,
  patch: { alt?: string; tags?: string[] },
): Promise<MediaAsset | null> {
  const set: Record<string, unknown> = {};
  if (patch.alt !== undefined) set.alt = patch.alt;
  if (patch.tags !== undefined) set.tags = patch.tags;
  if (Object.keys(set).length === 0) return null;
  const updated = await client()
    .update(schema.media)
    .set(set)
    .where(eq(schema.media.id, id))
    .returning();
  return updated[0] ? row<MediaAsset>(updated[0]) : null;
}

export async function deleteMedia(id: ID): Promise<boolean> {
  const deleted = await client()
    .delete(schema.media)
    .where(eq(schema.media.id, id))
    .returning({ id: schema.media.id });
  return deleted.length > 0;
}
