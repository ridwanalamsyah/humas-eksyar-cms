/**
 * Cron endpoint: send H-1 reminders.
 *
 * For each holiday/event scheduled for **tomorrow**, send:
 *   - In-app notification to all non-monitoring members
 *   - Email (via Resend) to all non-monitoring members
 *
 * The aim is a soft "heads-up — besok adalah Maulid Nabi, draft ucapan?"
 * Triggered by Vercel cron daily; protected with `CRON_SECRET`.
 *
 *   GET  /api/cron/reminders   (cron)
 *   POST /api/cron/reminders   (manual trigger by admin)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  listHolidays,
  listEvents,
  listMembers,
  findMemberByEmail,
} from "@/lib/data/provider";
import { sendEmail, htmlEmail } from "@/lib/email/send";

async function isAuthorized(req: NextRequest): Promise<boolean> {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const header = req.headers.get("authorization") ?? "";
    if (header === `Bearer ${cronSecret}`) return true;
  }
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
  today.setUTCHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);

  const [holidays, events, members] = await Promise.all([
    listHolidays({ from: tomorrow, to: tomorrow }),
    listEvents({
      fromDate: tomorrow.toISOString().slice(0, 10),
      toDate: tomorrow.toISOString().slice(0, 10),
    }),
    listMembers(),
  ]);

  if (holidays.length === 0 && events.length === 0) {
    return NextResponse.json({ sent: 0, items: 0 });
  }

  const recipients = members.filter(
    (m) => m.role !== "monitoring" && m.email,
  );
  if (recipients.length === 0) {
    return NextResponse.json({ sent: 0, items: 0 });
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "https://humas-eksyar-cms.vercel.app";
  const base = appUrl.replace(/\/$/, "");

  type Reminder = { kind: "holiday" | "event"; title: string; href: string };
  const reminders: Reminder[] = [
    ...holidays.map<Reminder>((h) => ({
      kind: "holiday",
      title: `${h.emoji ?? "📌"} ${h.name}`,
      href: `${base}/calendar`,
    })),
    ...events.map<Reminder>((e) => ({
      kind: "event",
      title: e.title,
      href: `${base}/events/${e.id}`,
    })),
  ];

  const bodyLines = reminders
    .map(
      (r) =>
        `• ${r.title} (${r.kind === "holiday" ? "hari besar" : "event"})`,
    )
    .join("\n");
  const htmlBody = `<p>Besok ada:</p><ul>${reminders
    .map(
      (r) =>
        `<li><a href="${r.href}">${escapeHtml(r.title)}</a></li>`,
    )
    .join("")}</ul><p>Pertimbangkan bikin draft ucapan / pengumuman dari sekarang.</p>`;

  let sent = 0;
  await Promise.allSettled(
    recipients.map(async (m) => {
      const ok = await sendEmail({
        to: m.email,
        subject: `[Humas Eksyar] Pengingat: H-1 ${reminders[0]?.title ?? ""}`,
        text: `Halo ${m.name}, besok:\n\n${bodyLines}\n\nBuka: ${base}/calendar`,
        html: htmlEmail({
          preheader: `Besok ${reminders.map((r) => r.title).join(", ")}`,
          heading: "Pengingat H-1",
          body: htmlBody,
          ctaLabel: "Buka kalender",
          ctaHref: `${base}/calendar`,
          footer: "Email otomatis · Humas Program Studi Ekonomi Syariah",
        }),
      });
      if (ok) sent++;
    }),
  );

  return NextResponse.json({
    items: reminders.length,
    recipients: recipients.length,
    sent,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
