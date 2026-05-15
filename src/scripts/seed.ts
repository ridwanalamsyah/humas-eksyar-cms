/**
 * Seed Neon DB with the fixture data from src/lib/fixtures/*.
 *
 * Idempotent: every insert uses ON CONFLICT DO NOTHING so re-running the
 * script will not duplicate rows. Run after `pnpm db:push` so the schema
 * already exists.
 *
 * Usage:
 *   pnpm db:seed
 */

import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/db/schema";
import { divisions } from "../lib/fixtures/divisions";
import { members } from "../lib/fixtures/members";
import { contents, captionTemplates } from "../lib/fixtures/contents";
import { media } from "../lib/fixtures/media";
import { events } from "../lib/fixtures/events";
import { badges, quests } from "../lib/fixtures/badges";
import {
  notifications,
  weeklyDigest,
  xpLogs,
} from "../lib/fixtures/notifications";
import { holidays } from "../lib/fixtures/holidays";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL not set — aborting seed.");
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql, { schema });

  // When --reset is passed, wipe domain tables so stale fixture IDs are removed.
  // Auth tables (users, accounts, sessions, verificationTokens) are untouched.
  if (process.argv.includes("--reset")) {
    console.log("seed: --reset flag detected, truncating domain tables…");
    await sql`TRUNCATE "holidays", "notifications", "xpLogs", "weeklyDigests", "quests", "badges", "events", "media", "captionTemplates", "captionVersions", "contents", "members", "divisions" CASCADE`;
  }

  console.log("seed: divisions");
  await db.insert(schema.divisions).values(divisions).onConflictDoNothing();

  console.log("seed: members");
  await db.insert(schema.members).values(members).onConflictDoNothing();

  console.log("seed: contents");
  await db.insert(schema.contents).values(contents).onConflictDoNothing();

  console.log("seed: captionTemplates");
  await db
    .insert(schema.captionTemplates)
    .values(captionTemplates)
    .onConflictDoNothing();

  console.log("seed: media");
  await db.insert(schema.media).values(media).onConflictDoNothing();

  console.log("seed: events");
  await db.insert(schema.events).values(events).onConflictDoNothing();

  console.log("seed: badges");
  await db.insert(schema.badges).values(badges).onConflictDoNothing();

  console.log("seed: quests");
  await db.insert(schema.quests).values(quests).onConflictDoNothing();

  console.log("seed: xpLogs");
  await db.insert(schema.xpLogs).values(xpLogs).onConflictDoNothing();

  console.log("seed: notifications");
  await db
    .insert(schema.notifications)
    .values(notifications)
    .onConflictDoNothing();

  console.log("seed: weeklyDigests");
  await db
    .insert(schema.weeklyDigests)
    .values([weeklyDigest])
    .onConflictDoNothing();

  console.log("seed: holidays");
  await db.insert(schema.holidays).values(holidays).onConflictDoNothing();

  const counts = {
    divisions: (await db.select().from(schema.divisions)).length,
    members: (await db.select().from(schema.members)).length,
    contents: (await db.select().from(schema.contents)).length,
    media: (await db.select().from(schema.media)).length,
    events: (await db.select().from(schema.events)).length,
    badges: (await db.select().from(schema.badges)).length,
    quests: (await db.select().from(schema.quests)).length,
    xpLogs: (await db.select().from(schema.xpLogs)).length,
    notifications: (await db.select().from(schema.notifications)).length,
    holidays: (await db.select().from(schema.holidays)).length,
  };
  console.log("\nseed complete:", counts);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
