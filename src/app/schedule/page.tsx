import Link from "next/link";
import { auth } from "@/auth";
import { findMemberByEmail, listContents, listEvents, listHolidays } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { ScheduleClient } from "@/components/schedule/schedule-client";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const session = await auth();
  const me = session?.user?.email
    ? await findMemberByEmail(session.user.email)
    : null;

  const today = new Date();
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + 60);

  const [contents, events, holidays] = await Promise.all([
    listContents(),
    listEvents({ fromDate: today.toISOString().slice(0, 10) }),
    listHolidays({ from: today, to: horizon }),
  ]);

  // Keep items whose schedule lands in a reasonable window:
  // - everything not yet published (draft/review/scheduled) regardless of date
  // - last 30 days of published
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffIso = cutoff.toISOString();

  const visibleContents = contents.filter((c) => {
    if (c.status !== "published" && c.status !== "archived") return true;
    return (c.publishedAt ?? c.scheduledFor ?? c.createdAt) >= cutoffIso;
  });

  return (
    <AppShell width="wide">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[clamp(1.6rem,1.2rem+1.5vw,2.2rem)] font-semibold tracking-tight">
            Schedule
          </h1>
          <p className="mt-1 text-sm text-foreground/65">
            Semua draft, terjadwal, dan published dalam satu timeline. Filter berdasar status, channel, atau rubrik.
          </p>
        </div>
        {me && (
          <Link
            href="/content/new"
            className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
          >
            + Konten baru
          </Link>
        )}
      </header>

      <ScheduleClient
        contents={visibleContents}
        events={events.slice(0, 50)}
        holidays={holidays}
      />
    </AppShell>
  );
}
