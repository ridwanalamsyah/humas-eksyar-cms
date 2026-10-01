/**
 * GET /prodi/kalender.ics — kalender akademik + agenda publik prodi dalam
 * format iCalendar, untuk dilanggan di Google Calendar / kalender HP.
 */
import { listEvents } from "@/lib/data/provider";
import { PUBLIC_EVENT_CATEGORIES } from "@/lib/site/content";
import { getSite } from "@/lib/site/get-site";

export const revalidate = 3600;

const esc = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/[,;]/g, (m) => `\\${m}`)
    .replace(/\n/g, "\\n");
const day = (d: string) => d.replace(/-/g, "");
const nextDay = (d: string) => {
  const x = new Date(`${d}T00:00:00Z`);
  x.setUTCDate(x.getUTCDate() + 1);
  return x.toISOString().slice(0, 10).replace(/-/g, "");
};
const stamp = (iso: string) =>
  new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

export async function GET() {
  const [site, events] = await Promise.all([
    getSite(),
    listEvents({ fromDate: new Date(Date.now() - 90 * 864e5).toISOString() }),
  ]);
  const now = stamp(new Date().toISOString());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Prodi Ekonomi Syariah UIN SGD//Kalender//ID",
    "CALSCALE:GREGORIAN",
    "X-WR-CALNAME:Ekonomi Syariah UIN SGD",
    "X-WR-TIMEZONE:Asia/Jakarta",
  ];
  site.kalender.forEach((k, i) => {
    lines.push(
      "BEGIN:VEVENT",
      `UID:kalender-${k.mulai}-${i}@eksyar`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${day(k.mulai)}`,
      `DTEND;VALUE=DATE:${nextDay(k.selesai || k.mulai)}`,
      `SUMMARY:${esc(k.kegiatan)}`,
      `CATEGORIES:${esc(k.kategori)}`,
      ...(k.sumber ? [`URL:${k.sumber}`] : []),
      "END:VEVENT",
    );
  });
  events
    .filter((e) =>
      (PUBLIC_EVENT_CATEGORIES as readonly string[]).includes(e.category),
    )
    .forEach((e) => {
      lines.push(
        "BEGIN:VEVENT",
        `UID:${e.id}@eksyar`,
        `DTSTAMP:${now}`,
        `DTSTART:${stamp(e.startsAt)}`,
        `DTEND:${stamp(e.endsAt || e.startsAt)}`,
        `SUMMARY:${esc(e.title)}`,
        `DESCRIPTION:${esc(e.description.slice(0, 500))}`,
        `LOCATION:${esc(e.isOnline ? "Daring" : e.location)}`,
        "END:VEVENT",
      );
    });
  lines.push("END:VCALENDAR");
  return new Response(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="eksyar.ics"',
    },
  });
}
