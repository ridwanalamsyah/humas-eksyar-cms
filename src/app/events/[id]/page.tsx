import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getEvent,
  getDivision,
  getMember,
  getMedia,
  getCurrentMember,
} from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/common/avatar";
import { Pill } from "@/components/common/pill";
import { Button } from "@/components/ui/button";
import { QRCheckIn } from "@/components/events/qr-check-in";
import { RSVPToggle } from "@/components/events/rsvp-toggle";
import {
  formatLongDate,
  durationLabel,
  formatHijri,
} from "@/lib/format/dates";
import { findMember } from "@/lib/fixtures/members";
import { MapPin, Users, Globe, CalendarDays } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) return {};
  return { title: event.title, description: event.description };
}

export default async function EventDetail({ params }: PageProps) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  const [division, coordinator, cover, me] = await Promise.all([
    getDivision(event.divisionId),
    getMember(event.coordinatorId),
    event.coverMediaId ? getMedia(event.coverMediaId) : Promise.resolve(null),
    getCurrentMember(),
  ]);

  const rsvpMembers = event.rsvpIds
    .map((id) => findMember(id))
    .filter((m): m is NonNullable<ReturnType<typeof findMember>> => Boolean(m));
  const userRsvp = event.rsvpIds.includes(me.id);

  return (
    <AppShell width="wide">
      <GlassCard variant="thick" className="overflow-hidden p-0">
        {cover && (
          <div
            className="relative aspect-[2.2/1] w-full"
            style={{ backgroundColor: cover.averageColor }}
          >
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}
        <div className="p-7">
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground/55">
            {division && <Pill tone="brand">{division.shortName}</Pill>}
            <Pill>{event.category.replace("_", " ")}</Pill>
            {event.isOnline && <Pill tone="info">Online</Pill>}
          </div>
          <h1 className="mt-3 font-display text-[clamp(1.7rem,1.2rem+1.6vw,2.4rem)] font-semibold leading-tight tracking-tight">
            {event.title}
          </h1>
          <p className="mt-3 max-w-prose text-[14px] leading-relaxed text-foreground/75">
            {event.description}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoStat
              icon={<CalendarDays className="size-4" strokeWidth={1.75} />}
              label="Tanggal"
              value={formatLongDate(event.startsAt)}
              hint={formatHijri(event.startsAt)}
            />
            <InfoStat
              icon={<CalendarDays className="size-4" strokeWidth={1.75} />}
              label="Waktu"
              value={durationLabel(event.startsAt, event.endsAt)}
            />
            <InfoStat
              icon={
                event.isOnline ? (
                  <Globe className="size-4" strokeWidth={1.75} />
                ) : (
                  <MapPin className="size-4" strokeWidth={1.75} />
                )
              }
              label={event.isOnline ? "Link" : "Lokasi"}
              value={event.location}
            />
            <InfoStat
              icon={<Users className="size-4" strokeWidth={1.75} />}
              label="RSVP"
              value={`${event.rsvpIds.length}${event.capacity ? `/${event.capacity}` : ""}`}
              hint={`${event.checkedInIds.length} check-in`}
            />
          </div>
        </div>
      </GlassCard>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-4">
          <GlassCard className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
              Peserta RSVP ({rsvpMembers.length})
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {rsvpMembers.slice(0, 12).map((m) => (
                <Link
                  key={m.id}
                  href={`/members/${m.id}`}
                  className="flex items-center gap-2 rounded-xl border border-foreground/10 bg-foreground/[0.04] px-2 py-1.5 text-[12px] hover:bg-foreground/[0.07] dark:border-white/10 dark:bg-white/5"
                >
                  <Avatar member={m} size={28} ring={false} />
                  <span className="truncate font-medium">
                    {m.name.split(" ").slice(0, 2).join(" ")}
                  </span>
                </Link>
              ))}
              {rsvpMembers.length > 12 && (
                <span className="flex items-center justify-center rounded-xl border border-dashed border-foreground/15 px-2 py-1.5 text-[11px] text-foreground/55">
                  +{rsvpMembers.length - 12} lainnya
                </span>
              )}
            </div>
          </GlassCard>

          {coordinator && (
            <GlassCard className="p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
                Koordinator
              </p>
              <Link
                href={`/members/${coordinator.id}`}
                className="mt-2 flex items-center gap-3"
              >
                <Avatar member={coordinator} size={48} />
                <div>
                  <p className="text-[14px] font-semibold">{coordinator.name}</p>
                  <p className="text-[12px] text-foreground/65">
                    {coordinator.position}
                  </p>
                </div>
              </Link>
            </GlassCard>
          )}
        </section>

        <aside className="space-y-4">
          <GlassCard variant="thick" className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
              RSVP &amp; Check-in
            </p>
            <RSVPToggle initial={userRsvp} />
            <div className="mt-4 border-t border-foreground/10 pt-4 dark:border-white/10">
              <QRCheckIn eventId={event.id} eventTitle={event.title} />
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
              Tools cepat
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/captions/playground">Generate caption acara</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/content/new">Tulis post promosi</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/calendar">Kembali ke kalender</Link>
              </Button>
            </div>
          </GlassCard>
        </aside>
      </div>
    </AppShell>
  );
}

function InfoStat({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-3 dark:border-white/10 dark:bg-white/[0.03]">
      <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-foreground/55">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-[13px] font-semibold">{value}</p>
      {hint && <p className="text-[10px] text-foreground/50">{hint}</p>}
    </div>
  );
}
