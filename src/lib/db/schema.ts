/**
 * Drizzle schema for Humas Eksyar CMS (Neon Postgres).
 *
 * Layout:
 *   - Auth.js tables (users, accounts, sessions, verificationTokens) match
 *     the canonical Drizzle adapter schema. Do not rename columns.
 *   - Domain tables mirror src/lib/data/types.ts; we keep camelCase column
 *     names so Drizzle row shape maps 1-to-1 to the TS interfaces.
 *   - String IDs are used everywhere to stay interchangeable with the seed
 *     fixtures (e.g. "mbr-aulia", "div-humas").
 */

import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  real,
  primaryKey,
  jsonb,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

/* ------------------------------------------------------------------ */
/* Auth.js core tables                                                 */
/* ------------------------------------------------------------------ */

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (a) => [primaryKey({ columns: [a.provider, a.providerAccountId] })],
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (v) => [primaryKey({ columns: [v.identifier, v.token] })],
);

/* ------------------------------------------------------------------ */
/* Domain tables                                                       */
/* ------------------------------------------------------------------ */

export const divisions = pgTable("divisions", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  shortName: text("shortName").notNull(),
  description: text("description").notNull().default(""),
  color: text("color").notNull(),
  hue: integer("hue").notNull(),
  leadId: text("leadId"),
  memberCount: integer("memberCount").notNull().default(0),
});

export const members = pgTable("members", {
  id: text("id").primaryKey(),
  /** Optional link to Auth.js user (set when person logs in via Google) */
  userId: text("userId").references(() => users.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  initials: text("initials").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("anggota"),
  divisionId: text("divisionId")
    .notNull()
    .references(() => divisions.id),
  position: text("position").notNull().default("Anggota"),
  joinedAt: text("joinedAt").notNull(),
  bio: text("bio"),
  xp: integer("xp").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  badges: jsonb("badges").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  angkatan: integer("angkatan").notNull(),
  nimSuffix: text("nimSuffix").notNull(),
  avatarEmoji: text("avatarEmoji").notNull().default("👤"),
  accentHue: integer("accentHue").notNull().default(180),
});

export const contents = pgTable("contents", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  rubric: text("rubric").notNull(),
  status: text("status").notNull().default("draft"),
  divisionId: text("divisionId")
    .notNull()
    .references(() => divisions.id),
  authorId: text("authorId")
    .notNull()
    .references(() => members.id),
  body: text("body").notNull().default(""),
  caption: text("caption").notNull().default(""),
  hashtags: text("hashtags").notNull().default(""),
  channels: jsonb("channels").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  mediaIds: jsonb("mediaIds").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  scheduledFor: text("scheduledFor"),
  publishedAt: text("publishedAt"),
  approvers: jsonb("approvers").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  waitingOn: jsonb("waitingOn").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  metrics: jsonb("metrics"),
  captionStyle: text("captionStyle"),
  createdAt: text("createdAt").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const media = pgTable("media", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  type: text("type").notNull().default("image"),
  alt: text("alt").notNull().default(""),
  tags: jsonb("tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  usedIn: jsonb("usedIn").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  uploaderId: text("uploaderId").notNull(),
  uploadedAt: text("uploadedAt").notNull(),
  aspect: text("aspect").notNull(),
  averageColor: text("averageColor").notNull(),
});

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull().default(""),
  divisionId: text("divisionId").notNull(),
  location: text("location").notNull(),
  isOnline: boolean("isOnline").notNull().default(false),
  startsAt: text("startsAt").notNull(),
  endsAt: text("endsAt").notNull(),
  category: text("category").notNull(),
  capacity: integer("capacity"),
  rsvpIds: jsonb("rsvpIds").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  checkedInIds: jsonb("checkedInIds").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  coverMediaId: text("coverMediaId"),
  coordinatorId: text("coordinatorId").notNull(),
  contentIds: jsonb("contentIds").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
});

export const badges = pgTable("badges", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  tier: text("tier").notNull(),
  icon: text("icon").notNull(),
  xpReward: integer("xpReward").notNull().default(0),
  unlockedCount: integer("unlockedCount").notNull().default(0),
  totalMembers: integer("totalMembers").notNull().default(0),
});

export const quests = pgTable("quests", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  xpReward: integer("xpReward").notNull().default(0),
  difficulty: text("difficulty").notNull().default("easy"),
  duration: text("duration").notNull().default("weekly"),
  progress: real("progress").notNull().default(0),
  target: integer("target").notNull().default(1),
  current: integer("current").notNull().default(0),
  deadline: text("deadline"),
  completed: boolean("completed").notNull().default(false),
});

export const xpLogs = pgTable("xpLogs", {
  id: text("id").primaryKey(),
  memberId: text("memberId")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(),
  source: text("source").notNull(),
  refId: text("refId"),
  at: text("at").notNull(),
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  memberId: text("memberId")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  kind: text("kind").notNull(),
  href: text("href"),
  read: boolean("read").notNull().default(false),
  at: text("at").notNull(),
});

export const captionVersions = pgTable("captionVersions", {
  id: text("id").primaryKey(),
  contentId: text("contentId")
    .notNull()
    .references(() => contents.id, { onDelete: "cascade" }),
  caption: text("caption").notNull(),
  hashtags: text("hashtags").notNull().default(""),
  captionStyle: text("captionStyle"),
  source: text("source").notNull().default("manual"),
  note: text("note").notNull().default(""),
  authorId: text("authorId").references(() => members.id, {
    onDelete: "set null",
  }),
  createdAt: text("createdAt").notNull(),
});

/**
 * Annual calendar dates that aren't org events — Indonesia national holidays
 * (kind="nasional"), Islamic / Hijriah dates (kind="hijriah"), and notable
 * international observances (kind="internasional"). Used by `/calendar` and
 * `eksyar.bio` to surface upcoming dates and by the AI weekly planner to
 * pre-fill caption ideas (e.g. Tausiyah Senin tied to nearest Islamic date).
 */
/**
 * Singleton key/value store for editable site-wide settings: bio link list,
 * primary CTA, tagline, social handles. Keyed by short scope strings so
 * different "pages" can share the table (e.g. "bio", "footer").
 */
export const siteSettings = pgTable("siteSettings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: text("updatedAt").notNull(),
});

export const holidays = pgTable("holidays", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  /** ISO date (yyyy-mm-dd) — Gregorian even for Hijriah events */
  date: text("date").notNull(),
  kind: text("kind").notNull(),
  description: text("description").notNull().default(""),
  /** Optional Hijriah label, e.g. "1 Muharram 1447 H" */
  hijriahLabel: text("hijriahLabel"),
  /** Optional emoji for quick visual scanning */
  emoji: text("emoji"),
});

export const captionTemplates = pgTable("captionTemplates", {
  id: text("id").primaryKey(),
  rubric: text("rubric").notNull(),
  style: text("style").notNull(),
  example: text("example").notNull(),
  hashtags: text("hashtags").notNull().default(""),
});

export const weeklyDigests = pgTable("weeklyDigests", {
  id: text("id").primaryKey(),
  isoWeek: text("isoWeek").notNull().unique(),
  generatedAt: text("generatedAt").notNull(),
  highlights: jsonb("highlights").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  recommendations: jsonb("recommendations")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  totalReach: integer("totalReach").notNull().default(0),
  topContentId: text("topContentId"),
});
