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
  CaptionVersion,
  CaptionVersionSource,
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

/* ------------------------------------------------------------------ */
/* Caption versions (in-memory mock store)                              */
/* ------------------------------------------------------------------ */

const captionVersionsStore: CaptionVersion[] = [];

export async function listCaptionVersions(
  contentId: ID,
): Promise<CaptionVersion[]> {
  return captionVersionsStore
    .filter((v) => v.contentId === contentId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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
  const v: CaptionVersion = {
    id,
    contentId: input.contentId,
    caption: input.caption,
    hashtags: input.hashtags ?? "",
    captionStyle: (input.captionStyle ?? null) as CaptionVersion["captionStyle"],
    source: input.source ?? "manual",
    note: input.note ?? "",
    authorId: input.authorId ?? null,
    createdAt: new Date().toISOString(),
  };
  captionVersionsStore.push(v);
  return v;
}

export async function restoreCaptionVersion(
  versionId: ID,
): Promise<{ content: ContentItem; version: CaptionVersion } | null> {
  const ver = captionVersionsStore.find((v) => v.id === versionId);
  if (!ver) return null;
  const content = findContent(ver.contentId);
  if (!content) return null;
  // Mutate the in-memory fixture (mock-only behavior; resets on reload).
  content.caption = ver.caption;
  content.hashtags = ver.hashtags;
  content.captionStyle = ver.captionStyle ?? content.captionStyle;
  content.updatedAt = new Date().toISOString();
  await createCaptionVersion({
    contentId: ver.contentId,
    caption: ver.caption,
    hashtags: ver.hashtags,
    captionStyle: ver.captionStyle,
    source: "restore",
    note: `Restored from version ${versionId}`,
    authorId: ver.authorId,
  });
  return { content, version: ver };
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

/* ------------------------------------------------------------------ */
/* Mutations (in-memory; reset on server restart)                      */
/* ------------------------------------------------------------------ */

const contentsStore: ContentItem[] = [...contents];
const membersStore: Member[] = [...members];

function slugifyMock(s: string): string {
  return s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

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

export async function createContent(input: ContentInput): Promise<ContentItem> {
  const now = new Date().toISOString();
  const id = `cnt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const item: ContentItem = {
    id,
    title: input.title,
    slug: slugifyMock(input.title) || id,
    rubric: input.rubric,
    status: input.status ?? "draft",
    divisionId: input.divisionId,
    authorId: input.authorId,
    body: input.body ?? "",
    caption: input.caption ?? "",
    hashtags: input.hashtags ?? "",
    channels: input.channels ?? ["instagram"],
    mediaIds: input.mediaIds ?? [],
    scheduledFor: input.scheduledFor ?? undefined,
    publishedAt: undefined,
    approvers: [],
    waitingOn: [],
    metrics: undefined,
    captionStyle: input.captionStyle ?? undefined,
    createdAt: now,
    updatedAt: now,
  };
  contentsStore.unshift(item);
  return item;
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

export async function updateContent(id: ID, patch: ContentUpdate): Promise<ContentItem | null> {
  const idx = contentsStore.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const cur = contentsStore[idx];
  const next: ContentItem = {
    ...cur,
    ...patch,
    slug: patch.title !== undefined ? slugifyMock(patch.title) || cur.slug : cur.slug,
    scheduledFor: patch.scheduledFor ?? cur.scheduledFor,
    publishedAt: patch.publishedAt ?? cur.publishedAt,
    captionStyle: patch.captionStyle ?? cur.captionStyle,
    updatedAt: new Date().toISOString(),
  };
  contentsStore[idx] = next;
  return next;
}

export async function deleteContent(id: ID): Promise<boolean> {
  const idx = contentsStore.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  contentsStore.splice(idx, 1);
  return true;
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
  const id = `mbr-${slugifyMock(input.name) || Date.now().toString(36)}`;
  const initials = input.name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
  const m: Member = {
    id,
    name: input.name,
    initials,
    email: input.email,
    role: input.role ?? "anggota",
    divisionId: input.divisionId,
    position: input.position ?? "Anggota",
    joinedAt: new Date().toISOString(),
    bio: input.bio,
    xp: 0,
    streak: 0,
    badges: [],
    angkatan: input.angkatan,
    nimSuffix: input.nimSuffix,
    avatarEmoji: input.avatarEmoji ?? "👤",
    accentHue: input.accentHue ?? 180,
  };
  membersStore.push(m);
  return m;
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

export async function updateMember(id: ID, patch: MemberUpdate): Promise<Member | null> {
  const idx = membersStore.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  const cur = membersStore[idx];
  const next: Member = {
    ...cur,
    ...patch,
    initials: patch.name !== undefined
      ? patch.name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("")
      : cur.initials,
    bio: patch.bio !== undefined ? (patch.bio ?? undefined) : cur.bio,
  };
  membersStore[idx] = next;
  return next;
}

export async function deleteMember(id: ID): Promise<boolean> {
  const idx = membersStore.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  membersStore.splice(idx, 1);
  return true;
}

export async function findMemberByEmail(email: string): Promise<Member | null> {
  return membersStore.find((m) => m.email.toLowerCase() === email.toLowerCase()) ?? null;
}

/* ------------------------------------------------------------------ */
/* Holidays / calendar dates                                           */
/* ------------------------------------------------------------------ */

import { holidays as holidaysFixture, type Holiday } from "@/lib/fixtures/holidays";

export async function listHolidays(opts?: {
  from?: Date;
  to?: Date;
  kind?: Holiday["kind"][];
}): Promise<Holiday[]> {
  let list: Holiday[] = [...holidaysFixture];
  if (opts?.from) {
    const fromISO = opts.from.toISOString().slice(0, 10);
    list = list.filter((h) => h.date >= fromISO);
  }
  if (opts?.to) {
    const toISO = opts.to.toISOString().slice(0, 10);
    list = list.filter((h) => h.date <= toISO);
  }
  if (opts?.kind && opts.kind.length > 0) {
    list = list.filter((h) => opts.kind!.includes(h.kind));
  }
  return list.sort((a, b) => a.date.localeCompare(b.date));
}

/* ------------------------------------------------------------------ */
/* Site settings / bio config                                          */
/* ------------------------------------------------------------------ */

import { type BioConfig, defaultBioConfig } from "@/lib/fixtures/bio";

let bioConfigStore: BioConfig = { ...defaultBioConfig };

export async function getBioConfig(): Promise<BioConfig> {
  return bioConfigStore;
}

export async function setBioConfig(value: BioConfig): Promise<BioConfig> {
  bioConfigStore = value;
  return value;
}

/* ------------------------------------------------------------------ */
/* Branding config                                                     */
/* ------------------------------------------------------------------ */

import { defaultBrandingConfig, type BrandingConfig, type Rubric } from "./types";

let brandingStore: BrandingConfig = { ...defaultBrandingConfig };

export async function getBrandingConfig(): Promise<BrandingConfig> {
  return brandingStore;
}

export async function setBrandingConfig(value: BrandingConfig): Promise<BrandingConfig> {
  brandingStore = value;
  return value;
}

/* ------------------------------------------------------------------ */
/* Rubrics (in-memory)                                                  */
/* ------------------------------------------------------------------ */

const nowIso = new Date().toISOString();
const rubricsStore: Rubric[] = [
  { id: "rub-refleksi-harian", slug: "refleksi_harian", label: "Refleksi harian", description: "Kutipan / refleksi pagi singkat.", emoji: "\u{1F305}", isActive: true, sortOrder: 1, createdAt: nowIso, updatedAt: nowIso },
  { id: "rub-pengumuman", slug: "pengumuman", label: "Pengumuman resmi", description: "Announcement resmi prodi.", emoji: "\u{1F4E3}", isActive: true, sortOrder: 2, createdAt: nowIso, updatedAt: nowIso },
  { id: "rub-kajian", slug: "kajian", label: "Kajian akademik", description: "Tema diskusi / kajian / seminar.", emoji: "\u{1F4D6}", isActive: true, sortOrder: 3, createdAt: nowIso, updatedAt: nowIso },
  { id: "rub-ucapan", slug: "selamat_sukses", label: "Ucapan & Hari Besar", description: "Ucapan selamat / hari besar / kondolensi.", emoji: "\u{1F337}", isActive: true, sortOrder: 4, createdAt: nowIso, updatedAt: nowIso },
  { id: "rub-dokumentasi", slug: "dokumentasi", label: "Dokumentasi kegiatan", description: "Recap kegiatan yang sudah berlangsung.", emoji: "\u{1F4F8}", isActive: true, sortOrder: 5, createdAt: nowIso, updatedAt: nowIso },
  { id: "rub-campaign", slug: "campaign", label: "Campaign / mobilisasi", description: "Ajakan, gerakan, atau open call.", emoji: "\u{1F4E2}", isActive: true, sortOrder: 6, createdAt: nowIso, updatedAt: nowIso },
];

export async function listRubrics(opts: { includeInactive?: boolean } = {}): Promise<Rubric[]> {
  const items = opts.includeInactive ? rubricsStore : rubricsStore.filter((r) => r.isActive);
  return items.slice().sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getRubric(idOrSlug: ID): Promise<Rubric | null> {
  return rubricsStore.find((r) => r.id === idOrSlug || r.slug === idOrSlug) ?? null;
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
  const rubric: Rubric = {
    id,
    slug: input.slug,
    label: input.label,
    description: input.description ?? "",
    emoji: input.emoji ?? null,
    isActive: input.isActive ?? true,
    sortOrder: input.sortOrder ?? 99,
    createdAt: now,
    updatedAt: now,
  };
  rubricsStore.push(rubric);
  return rubric;
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
  const idx = rubricsStore.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const next = { ...rubricsStore[idx], ...patch, updatedAt: new Date().toISOString() } as Rubric;
  rubricsStore[idx] = next;
  return next;
}

export async function deleteRubric(id: ID): Promise<boolean> {
  const idx = rubricsStore.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  rubricsStore.splice(idx, 1);
  return true;
}

/* ------------------------------------------------------------------ */
/* Content comments + drafts (Tier 2) — in-memory                     */
/* ------------------------------------------------------------------ */

import type { ContentComment, ContentDraft } from "./types";

const commentsStore: ContentComment[] = [];
const draftsStore = new Map<string, ContentDraft>();

export async function listContentComments(contentId: ID): Promise<ContentComment[]> {
  return commentsStore
    .filter((c) => c.contentId === contentId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function createContentComment(input: {
  contentId: ID;
  authorId: ID;
  body: string;
}): Promise<ContentComment> {
  const now = new Date().toISOString();
  const c: ContentComment = {
    id: `cmt-${Math.random().toString(36).slice(2, 10)}`,
    contentId: input.contentId,
    authorId: input.authorId,
    body: input.body,
    resolvedAt: null,
    createdAt: now,
  };
  commentsStore.push(c);
  return c;
}

export async function updateContentComment(
  id: ID,
  patch: Partial<Pick<ContentComment, "body" | "resolvedAt">>,
): Promise<ContentComment | null> {
  const c = commentsStore.find((x) => x.id === id);
  if (!c) return null;
  if (patch.body !== undefined) c.body = patch.body;
  if (patch.resolvedAt !== undefined) c.resolvedAt = patch.resolvedAt;
  return c;
}

export async function deleteContentComment(id: ID): Promise<boolean> {
  const idx = commentsStore.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  commentsStore.splice(idx, 1);
  return true;
}

export async function getContentDraft(contentId: ID): Promise<ContentDraft | null> {
  return draftsStore.get(contentId) ?? null;
}

export async function saveContentDraft(input: {
  contentId: ID;
  body: string;
  caption: string;
  hashtags: string;
  authorId: ID | null;
}): Promise<ContentDraft> {
  const d: ContentDraft = {
    contentId: input.contentId,
    body: input.body,
    caption: input.caption,
    hashtags: input.hashtags,
    authorId: input.authorId,
    savedAt: new Date().toISOString(),
  };
  draftsStore.set(input.contentId, d);
  return d;
}

export async function clearContentDraft(contentId: ID): Promise<boolean> {
  return draftsStore.delete(contentId);
}

/* ------------------------------------------------------------------ */
/* Personal tasks (mock store)                                          */
/* ------------------------------------------------------------------ */

import type { MemberTask, TaskStatus } from "./types";

const tasksStore: MemberTask[] = [];

export async function listMemberTasks(opts: {
  memberId: ID;
  status?: TaskStatus[];
}): Promise<MemberTask[]> {
  return tasksStore
    .filter((t) => t.memberId === opts.memberId)
    .filter((t) => !opts.status || opts.status.includes(t.status))
    .sort((a, b) => {
      const ad = a.dueDate ?? "9999-99-99";
      const bd = b.dueDate ?? "9999-99-99";
      if (ad !== bd) return ad.localeCompare(bd);
      return b.createdAt.localeCompare(a.createdAt);
    });
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
  const t: MemberTask = {
    id: `tsk-${Math.random().toString(36).slice(2, 10)}`,
    memberId: input.memberId,
    title: input.title,
    description: input.description ?? "",
    contentId: input.contentId ?? null,
    eventId: input.eventId ?? null,
    holidayId: input.holidayId ?? null,
    dueDate: input.dueDate ?? null,
    status: "pending",
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  tasksStore.push(t);
  return t;
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
  const t = tasksStore.find((x) => x.id === id);
  if (!t) return null;
  if (patch.title !== undefined) t.title = patch.title;
  if (patch.description !== undefined) t.description = patch.description;
  if (patch.dueDate !== undefined) t.dueDate = patch.dueDate;
  if (patch.status !== undefined) {
    t.status = patch.status;
    t.completedAt = patch.status === "done" ? new Date().toISOString() : null;
  }
  return t;
}

export async function deleteMemberTask(id: ID): Promise<boolean> {
  const i = tasksStore.findIndex((x) => x.id === id);
  if (i === -1) return false;
  tasksStore.splice(i, 1);
  return true;
}

export async function getMemberTask(id: ID): Promise<MemberTask | null> {
  return tasksStore.find((x) => x.id === id) ?? null;
}
