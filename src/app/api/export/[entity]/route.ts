/**
 * GET /api/export/[entity].csv
 *
 * Streams CSV download of one of: contents, members, events, holidays,
 * captions, tasks, comments. Admin / koordinator only.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  findMemberByEmail,
  listMembers,
  listContents,
  listEvents,
  listHolidays,
  listMemberTasks,
  getMember,
} from "@/lib/data/provider";

interface Params {
  params: Promise<{ entity: string }>;
}

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes("\"") || s.includes("\n") || s.includes("\r")) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function toCsv(rows: Array<Record<string, unknown>>): string {
  if (rows.length === 0) return "";
  const headers = Array.from(
    rows.reduce<Set<string>>((acc, r) => {
      Object.keys(r).forEach((k) => acc.add(k));
      return acc;
    }, new Set<string>()),
  );
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(headers.map((h) => csvEscape(r[h])).join(","));
  }
  return lines.join("\n");
}

function send(name: string, csv: string): NextResponse {
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    },
  });
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const me = await findMemberByEmail(session.user.email);
  if (!me) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (
    me.role !== "admin" &&
    me.role !== "ketua_divisi" &&
    me.role !== "sekjen"
  ) {
    return NextResponse.json(
      { error: "Hanya admin / koordinator yang boleh export." },
      { status: 403 },
    );
  }

  const { entity } = await params;
  const name = entity.replace(/\.csv$/i, "");

  switch (name) {
    case "members": {
      const data = await listMembers();
      const rows = data.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        role: m.role,
        position: m.position,
        angkatan: m.angkatan,
        nimSuffix: m.nimSuffix,
        joinedAt: m.joinedAt,
        xp: m.xp,
        streak: m.streak,
        badges: m.badges.join("|"),
      }));
      return send("members", toCsv(rows));
    }
    case "contents": {
      const data = await listContents();
      const rows = await Promise.all(
        data.map(async (c) => {
          const author = await getMember(c.authorId);
          return {
            id: c.id,
            title: c.title,
            status: c.status,
            rubric: c.rubric,
            channels: c.channels.join("|"),
            authorId: c.authorId,
            authorName: author?.name ?? "",
            scheduledFor: c.scheduledFor ?? "",
            publishedAt: c.publishedAt ?? "",
            createdAt: c.createdAt,
            captionLen: c.caption.length,
            hashtags: c.hashtags,
            mediaCount: c.mediaIds.length,
            engagementRate: c.metrics?.engagementRate ?? "",
            reach: c.metrics?.reach ?? "",
          };
        }),
      );
      return send("contents", toCsv(rows));
    }
    case "events": {
      const data = await listEvents();
      const rows = data.map((e) => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        startsAt: e.startsAt,
        endsAt: e.endsAt,
        location: e.location,
        isOnline: e.isOnline,
        category: e.category,
        capacity: e.capacity ?? "",
        rsvpCount: e.rsvpIds.length,
        checkedInCount: e.checkedInIds.length,
      }));
      return send("events", toCsv(rows));
    }
    case "holidays": {
      const data = await listHolidays();
      const rows = data.map((h) => ({
        id: h.id,
        date: h.date,
        name: h.name,
        kind: h.kind,
        hijriahLabel: h.hijriahLabel ?? "",
        description: h.description,
      }));
      return send("holidays", toCsv(rows));
    }
    case "tasks": {
      const data = await listMemberTasks({ memberId: me.id });
      const rows = data.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        dueDate: t.dueDate ?? "",
        contentId: t.contentId ?? "",
        eventId: t.eventId ?? "",
        holidayId: t.holidayId ?? "",
        createdAt: t.createdAt,
        completedAt: t.completedAt ?? "",
      }));
      return send(`tasks-${me.id}`, toCsv(rows));
    }
    default:
      return NextResponse.json(
        {
          error:
            "Entity tidak dikenal. Pilih: members, contents, events, holidays, tasks.",
        },
        { status: 400 },
      );
  }
}
