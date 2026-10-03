import { CalendarPlus, MapPin, Video } from "lucide-react";
import { listEvents } from "@/lib/data/provider";
import { formatTime } from "@/lib/format/dates";
import { PUBLIC_EVENT_CATEGORIES, googleCalendarUrl } from "@/lib/site/content";
import { getSite } from "@/lib/site/get-site";
import { findActiveForm } from "@/lib/site/forms";
import { FormRenderer } from "./form-renderer";
import { Reveal } from "./reveal";

const acaraForm = findActiveForm("acara")!;

const CATEGORY_LABEL: Record<string, string> = {
  kajian: "Kajian",
  kegiatan_publik: "Kegiatan publik",
  kompetisi: "Kompetisi",
  pelatihan: "Pelatihan",
  perayaan: "Perayaan",
};

/** Daftar agenda kegiatan terbuka yang akan datang, dikelompokkan per bulan. */
export async function AgendaList() {
  const [events, site] = await Promise.all([
    listEvents({ fromDate: new Date().toISOString() }),
    getSite(),
  ]);
  const upcoming = events
    .filter((e) =>
      (PUBLIC_EVENT_CATEGORIES as readonly string[]).includes(e.category),
    )
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  const months = new Map<string, typeof upcoming>();
  for (const e of upcoming) {
    const key = new Date(e.startsAt).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    });
    months.set(key, [...(months.get(key) ?? []), e]);
  }

  return (
    <>
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
                        <details className="group mt-4 rounded-[16px] border border-hairline open:bg-mist/40">
                          <summary className="cursor-pointer list-none px-4 py-2.5 text-[14px] font-semibold text-accent [&::-webkit-details-marker]:hidden">
                            Daftar ikut acara ›
                          </summary>
                          <div className="px-4 pb-4">
                            <FormRenderer
                              def={acaraForm}
                              refId={e.id}
                              compact
                            />
                          </div>
                        </details>
                      </div>
                    </li>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </>
  );
}
