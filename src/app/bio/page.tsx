import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ArrowUpRight, CalendarDays, Moon, Newspaper, Flag } from "lucide-react";
import {
  getBioConfig,
  listContents,
  listEvents,
  listHolidays,
} from "@/lib/data/provider";
import type { Holiday } from "@/lib/fixtures/holidays";
import { formatLongDate } from "@/lib/format/dates";

export const metadata: Metadata = {
  title: "eksyar.bio — Humas Eksyar",
  description:
    "Pusat link resmi Humas Ekonomi Syariah UIN SGD: Instagram, TikTok, kegiatan terkini, dan agenda.",
};

// Cache for 5 minutes — public page, no auth context needed.
export const revalidate = 300;

export default async function BioPage() {
  const config = await getBioConfig();
  const [allContents, allEvents, holidays] = await Promise.all([
    config.showLatestContent
      ? listContents({ status: ["published"] })
      : Promise.resolve([]),
    config.showEvents ? listEvents() : Promise.resolve([]),
    config.showHolidays
      ? listHolidays({ from: new Date(), kind: ["nasional", "hijriah"] })
      : Promise.resolve([]),
  ]);

  const latestContent = allContents.slice(0, 3);
  const upcomingEvents = allEvents
    .filter((e) => new Date(e.startsAt) > new Date())
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, 3);
  const upcomingHolidays = holidays.slice(0, 4);

  const isAvatarUrl = /^https?:\/\//.test(config.avatar);

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center px-5 py-12 sm:py-16">
      {/* ─── Hero ─────────────────────────────────────────── */}
      <header className="flex flex-col items-center text-center">
        <div
          className="grid size-24 place-items-center rounded-full text-4xl shadow-[0_24px_60px_-12px_rgba(13,148,136,0.45)]"
          style={{
            background:
              config.accent ??
              "linear-gradient(135deg, rgba(13,148,136,0.85), rgba(13,148,136,0.45))",
          }}
        >
          {isAvatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={config.avatar} alt={config.name} className="size-full rounded-full object-cover" />
          ) : (
            <span aria-hidden>{config.avatar}</span>
          )}
        </div>

        <h1 className="mt-5 font-display text-[clamp(1.6rem,1.2rem+1.5vw,2rem)] font-semibold tracking-tight">
          {config.name}
        </h1>
        <p className="mt-1 text-sm font-medium text-foreground/75">
          {config.tagline}
        </p>
        <p className="mt-4 max-w-xs text-pretty text-[14px] leading-relaxed text-foreground/65">
          {config.intro}
        </p>
      </header>

      {/* ─── Link buttons ─────────────────────────────────── */}
      <section aria-label="Tautan" className="mt-10 flex w-full flex-col gap-3">
        {config.links.map((link) => (
          <BioLinkButton key={link.id} link={link} />
        ))}
      </section>

      {/* ─── Latest content ──────────────────────────────── */}
      {latestContent.length > 0 && (
        <section aria-labelledby="bio-latest" className="mt-10 w-full">
          <BioSectionTitle id="bio-latest" icon={<Newspaper className="size-3.5" strokeWidth={1.75} />}>
            Konten Terbaru
          </BioSectionTitle>
          <ul className="mt-3 flex flex-col gap-2">
            {latestContent.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/content/${c.id}`}
                  className="group block rounded-2xl border border-foreground/8 bg-background/40 px-4 py-3 transition hover:border-brand-500/40 hover:bg-background/60 dark:border-white/8"
                >
                  <p className="text-[13px] font-medium text-foreground/85 line-clamp-2">
                    {c.title}
                  </p>
                  <p className="mt-1 text-[11px] text-foreground/55">
                    {formatLongDate(c.publishedAt ?? c.createdAt)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ─── Upcoming events ─────────────────────────────── */}
      {upcomingEvents.length > 0 && (
        <section aria-labelledby="bio-events" className="mt-8 w-full">
          <BioSectionTitle id="bio-events" icon={<CalendarDays className="size-3.5" strokeWidth={1.75} />}>
            Agenda Mendatang
          </BioSectionTitle>
          <ul className="mt-3 flex flex-col gap-2">
            {upcomingEvents.map((e) => (
              <li
                key={e.id}
                className="rounded-2xl border border-foreground/8 bg-background/40 px-4 py-3 dark:border-white/8"
              >
                <p className="text-[13px] font-medium text-foreground/85">{e.title}</p>
                <p className="mt-1 text-[11px] text-foreground/55">
                  {formatLongDate(e.startsAt)} · {e.location}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ─── Upcoming holidays / Hijriah dates ───────────── */}
      {upcomingHolidays.length > 0 && (
        <section aria-labelledby="bio-holidays" className="mt-8 w-full">
          <BioSectionTitle id="bio-holidays" icon={<Moon className="size-3.5" strokeWidth={1.75} />}>
            Tanggal Penting
          </BioSectionTitle>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {upcomingHolidays.map((h) => (
              <HolidayCard key={h.id} holiday={h} />
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-12 mb-4 text-center text-[11px] text-foreground/45">
        © {new Date().getFullYear()} {config.name} ·{" "}
        <Link href="/" className="hover:text-foreground/75">
          Dashboard
        </Link>
      </footer>
    </main>
  );
}

function BioLinkButton({ link }: { link: { id: string; label: string; href: string; icon?: string; hint?: string; featured?: boolean } }) {
  const external = /^https?:\/\//.test(link.href);
  return (
    <a
      href={link.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition ${
        link.featured
          ? "border border-brand-500/40 bg-brand-500/10 hover:border-brand-500/70 hover:bg-brand-500/15"
          : "border border-foreground/10 bg-background/60 hover:border-foreground/25 hover:bg-background/80 dark:border-white/10"
      }`}
    >
      {link.icon && (
        <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-xl bg-foreground/5 text-[18px]">
          {link.icon}
        </span>
      )}
      <span className="flex-1">
        <span className="block text-[14px] font-semibold text-foreground/90">
          {link.label}
        </span>
        {link.hint && (
          <span className="mt-0.5 block text-[11.5px] text-foreground/55">
            {link.hint}
          </span>
        )}
      </span>
      {external ? (
        <ExternalLink className="size-4 text-foreground/40 transition group-hover:text-foreground/70" strokeWidth={1.75} />
      ) : (
        <ArrowUpRight className="size-4 text-foreground/40 transition group-hover:text-foreground/70" strokeWidth={1.75} />
      )}
    </a>
  );
}

function BioSectionTitle({
  id,
  icon,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55"
    >
      {icon}
      {children}
    </h2>
  );
}

function HolidayCard({ holiday }: { holiday: Holiday }) {
  const tone =
    holiday.kind === "hijriah"
      ? "border-emerald-500/30 bg-emerald-500/5"
      : holiday.kind === "nasional"
        ? "border-rose-500/30 bg-rose-500/5"
        : "border-sky-500/30 bg-sky-500/5";
  return (
    <li
      className={`rounded-2xl border px-3 py-2.5 text-left ${tone}`}
      aria-label={`${holiday.name} pada ${holiday.date}`}
    >
      <p className="flex items-center gap-1 text-[11px] font-medium text-foreground/55">
        {holiday.emoji && <span aria-hidden>{holiday.emoji}</span>}
        {holiday.kind === "hijriah" ? (
          <>Hijriah</>
        ) : holiday.kind === "nasional" ? (
          <span className="inline-flex items-center gap-1">
            <Flag className="size-3" strokeWidth={1.75} /> Libur
          </span>
        ) : (
          "Internasional"
        )}
      </p>
      <p className="mt-1 text-[12.5px] font-semibold leading-snug text-foreground/85 line-clamp-2">
        {holiday.name}
      </p>
      <p className="mt-1 text-[11px] text-foreground/55">
        {formatLongDate(holiday.date)}
      </p>
      {holiday.hijriahLabel && (
        <p className="mt-0.5 font-mono text-[10px] text-emerald-700 dark:text-emerald-300">
          {holiday.hijriahLabel}
        </p>
      )}
    </li>
  );
}
