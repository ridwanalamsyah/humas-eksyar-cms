/**
 * Cron endpoint: auto-draft caption for upcoming holidays.
 *
 * Scans holidays in the next N days (default 3) and, for each one that
 * doesn't yet have a draft content row, creates one with an AI-generated
 * caption. Status = "draft" so the editorial team can review + publish.
 *
 * Triggered by Vercel cron (configured in vercel.json). Protected by
 * `CRON_SECRET` header to prevent abuse.
 *
 *   GET /api/cron/auto-draft         (cron / scheduled)
 *   POST /api/cron/auto-draft        (manual trigger by admin)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  listHolidays,
  listContents,
  createContent,
  createCaptionVersion,
  findMemberByEmail,
  listMembers,
} from "@/lib/data/provider";
import { generateCaption } from "@/lib/ai/captions";
import type { Holiday } from "@/lib/fixtures/holidays";

const DAYS_AHEAD = 3;

async function isAuthorized(req: NextRequest): Promise<boolean> {
  // Vercel cron sends `Authorization: Bearer <CRON_SECRET>`.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const header = req.headers.get("authorization") ?? "";
    if (header === `Bearer ${cronSecret}`) return true;
  }
  // Admin user can also trigger manually.
  const session = await auth();
  if (session?.user?.email) {
    const member = await findMemberByEmail(session.user.email);
    if (member?.role === "admin") return true;
  }
  return false;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return handle(req);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return handle(req);
}

async function handle(req: NextRequest): Promise<NextResponse> {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + DAYS_AHEAD);

  const holidays = await listHolidays({ from: today, to: horizon });
  if (holidays.length === 0) {
    return NextResponse.json({ created: 0, skipped: 0, holidays: [] });
  }

  // Pick a default author. Prefer admin → ketua_divisi → any member.
  const members = await listMembers();
  const defaultAuthor =
    members.find((m) => m.role === "admin") ??
    members.find((m) => m.role === "ketua_divisi") ??
    members[0];
  if (!defaultAuthor) {
    return NextResponse.json(
      { error: "No member to assign auto-draft" },
      { status: 500 },
    );
  }

  // Look up existing drafts so we don't duplicate.
  const existing = await listContents();
  const existingTitles = new Set(
    existing.map((c) => c.title.toLowerCase().trim()),
  );

  const created: string[] = [];
  const skipped: string[] = [];

  for (const h of holidays) {
    const title = `Ucapan ${h.name}`;
    if (existingTitles.has(title.toLowerCase().trim())) {
      skipped.push(h.slug);
      continue;
    }

    const result = await generateCaption({
      title,
      details: buildDetails(h),
      divisionName: "Humas Program Studi Ekonomi Syariah",
      rubric: "selamat_sukses",
      style: "formal_organisasi",
      variants: 1,
    });

    const scheduledFor = `${h.date}T07:00:00.000Z`;
    const content = await createContent({
      title,
      rubric: "selamat_sukses",
      status: "draft",
      divisionId: defaultAuthor.divisionId,
      authorId: defaultAuthor.id,
      body: `Auto-draft untuk ${h.name} (${h.date}). Tinggal review + jadwalkan.`,
      caption: result.caption,
      hashtags: result.hashtags,
      channels: ["instagram"],
      mediaIds: [],
      scheduledFor,
      captionStyle: "formal_organisasi",
    });

    await createCaptionVersion({
      contentId: content.id,
      caption: result.caption,
      hashtags: result.hashtags,
      captionStyle: "formal_organisasi",
      source: "ai",
      note: `Auto-draft H-${DAYS_AHEAD} ${h.name}`,
      authorId: defaultAuthor.id,
    });

    created.push(h.slug);
  }

  return NextResponse.json({
    created: created.length,
    skipped: skipped.length,
    created_slugs: created,
    skipped_slugs: skipped,
  });
}

function buildDetails(h: Holiday): string {
  const parts: string[] = [];
  parts.push(`Acara: ${h.name}`);
  parts.push(`Tanggal: ${h.date}`);
  if (h.hijriahLabel) parts.push(`Hijriah: ${h.hijriahLabel}`);
  if (h.description) parts.push(`Catatan: ${h.description}`);
  parts.push(
    "Tone: ucapan resmi atas nama Program Studi Ekonomi Syariah, hangat dan singkat.",
  );
  return parts.join("\n");
}
