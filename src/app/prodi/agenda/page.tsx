import type { Metadata } from "next";
import { CalendarPlus, MapPin, Video } from "lucide-react";
import { listEvents } from "@/lib/data/provider";
import { formatTime } from "@/lib/format/dates";
import { PUBLIC_EVENT_CATEGORIES, googleCalendarUrl } from "@/lib/site/content";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";
import { HighlightCard } from "@/components/site/highlight-card";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "Agenda",
  description: `Jadwal kegiatan ${prodi.fullName} ${prodi.university}.`,
};

export const revalidate = 300;

const CATEGORY_LABEL: Record<string, string> = {
  kajian: "Kajian",
  kegiatan_publik: "Kegiatan publik",
  kompetisi: "Kompetisi",
  pelatihan: "Pelatihan",
  perayaan: "Perayaan",
};

export default async function AgendaPage() {
  const [events, site] = await Promise.all([
    listEvents({ fromDate: new Date().toISOString() }),
    getSite(),
  ]);
  const upcoming = events
    .filter((e) =>
      (PUBLIC_EVENT_CATEGORIES as readonly string[]).includes(e.category),
    )
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  // Kelompokkan per bulan.
  const months = new Map<string, typeof upcoming>();
  for (const e of upcoming) {
    const key = new Date(e.startsAt).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    });
    months.set(key, [...(months.get(key) ?? []), e]);
  }
  const past = [...site.kegiatan]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  return (
    <>
      <PageHeader
        crumb="Agenda"
        title="Agenda kegiatan"
        description="Seminar, pelatihan, kompetisi, dan kegiatan terbuka program studi."
      />

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-[860px]">
          {months.size === 0 ? (
            <p className="rounded-[24px] bg-mist p-10 text-center text-[17px] text-label-2">
              Belum ada agenda terjadwal. Ikuti Instagram{" "}
              <a
                href={site.kontak.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent hover:underline"
              >
                {site.kontak.instagramHandle}
              </a>{" "}
              untuk kabar terbaru.
            </p>
          ) : (
            [...months].map(([month, list]) => (
              <div key={month} className="mb-12">
                <h2 className="text-[15px] font-semibold uppercase tracking-[0.08em] text-accent">
                  {month}
                </h2>
                <ul className="mt-4 grid gap-3">
                  {list.map((e) => {
                    const d = new Date(e.startsAt);
                    return (
                      <Reveal key={e.id}>
                        <li className="flex gap-5 rounded-[24px] border border-hairline bg-canvas p-5 sm:p-6">
                          <div className="w-16 shrink-0 rounded-2xl bg-accent-soft py-3 text-center text-accent">
                            <p className="text-[12px] font-bold uppercase">
                              {d.toLocaleDateString("id-ID", {
                                weekday: "short",
                                timeZone: "Asia/Jakarta",
                              })}
                            </p>
                            <p className="text-[28px] font-extrabold leading-none tracking-[-0.03em]">
                              {d.toLocaleDateString("id-ID", {
                                day: "numeric",
                                timeZone: "Asia/Jakarta",
                              })}
                            </p>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[12.5px] font-semibold text-label-3">
                              {CATEGORY_LABEL[e.category] ?? "Kegiatan"} ·{" "}
                              {formatTime(e.startsAt)} WIB
                            </p>
                            <h3 className="mt-1 text-[19px] font-bold leading-snug tracking-[-0.01em] text-label">
                              {e.title}
                            </h3>
                            {e.description && (
                              <p className="mt-1.5 line-clamp-2 text-[15px] text-label-2">
                                {e.description}
                              </p>
                            )}
                            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
                              <span className="inline-flex items-center gap-1.5 text-label-2">
                                {e.isOnline ? (
                                  <Video className="size-4" />
                                ) : (
                                  <MapPin className="size-4" />
                                )}
                                {e.isOnline ? "Daring" : e.location}
                              </span>
                              <a
                                href={googleCalendarUrl(e)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline"
                              >
                                <CalendarPlus className="size-4" /> Simpan ke
                                kalender
                              </a>
                            </div>
                          </div>
                        </li>
                      </Reveal>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </section>

      {past.length > 0 && (
        <section className="bg-mist px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <h2 className="text-[28px] font-bold tracking-[-0.02em] text-label">
              Kegiatan yang telah berlangsung
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {past.map((k, i) => (
                <HighlightCard key={`${k.title}-${i}`} item={k} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
