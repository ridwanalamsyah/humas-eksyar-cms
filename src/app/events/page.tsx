import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentMember, listEvents } from "@/lib/data/provider";
import { EventForm } from "@/components/events/event-form";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Pill } from "@/components/common/pill";
import { formatLongDate, formatTime } from "@/lib/format/dates";
import { MapPin, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Jadwal",
};

export default async function EventsListPage() {
  const [events, me] = await Promise.all([listEvents(), getCurrentMember()]);
  const canEdit = !["anggota", "monitoring", "pending"].includes(me.role);
  const upcoming = events
    .filter((e) => new Date(e.startsAt) >= new Date())
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const past = events
    .filter((e) => new Date(e.startsAt) < new Date())
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));

  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="Agenda"
        title="Jadwal kegiatan"
        description={`${upcoming.length} akan datang · ${past.length} sudah selesai.`}
        cta={{ label: "Buka kalender", href: "/calendar" }}
      />
      {canEdit && (
        <details className="group mb-8 rounded-2xl border border-foreground/10 bg-white p-4 sm:p-5" open={upcoming.length === 0}>
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[15px] font-semibold">
            Tambah jadwal
            <span aria-hidden className="text-[22px] leading-none text-brand-600 transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="mt-4">
            <EventForm />
          </div>
        </details>
      )}
      <div className="mt-2 space-y-8">
        <Section title="Akan datang" events={upcoming} />
        <Section title="Sudah berlalu" events={past} dim />
      </div>
    </AppShell>
  );
}

function Section({
  title,
  events,
  dim = false,
}: {
  title: string;
  events: Awaited<ReturnType<typeof listEvents>>;
  dim?: boolean;
}) {
  return (
    <div>
      <h2 className="mb-3 font-display text-lg font-semibold tracking-tight">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => {
          return (
            <Link key={e.id} href={`/events/${e.id}`}>
              <GlassCard
                hover
                className={`p-5 ${dim ? "opacity-75" : ""}`}
              >
                <div className="flex flex-wrap items-center gap-1.5 text-[13px] uppercase tracking-[0.16em] text-foreground/60">
                  <Pill tone="brand">{e.category.replace("_", " ")}</Pill>
                </div>
                <h3 className="mt-2 font-display text-[15px] font-semibold leading-tight tracking-tight">
                  {e.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[13px] text-foreground/65">
                  {e.description}
                </p>
                <div className="mt-3 flex flex-col gap-1 border-t border-foreground/10 pt-3 text-[13px] text-foreground/65 dark:border-white/10">
                  <span>
                    {formatLongDate(e.startsAt)} · {formatTime(e.startsAt)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3" strokeWidth={1.75} />
                    {e.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3" strokeWidth={1.75} />
                    {e.rsvpIds.length} RSVP
                  </span>
                </div>
              </GlassCard>
            </Link>
          );
        })}
        {events.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-foreground/15 p-6 text-center text-[13px] text-foreground/60">
            Tidak ada kegiatan.
          </p>
        )}
      </div>
    </div>
  );
}
