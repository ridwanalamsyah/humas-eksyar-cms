import type { Metadata } from "next";
import { listEvents, listHolidays } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { CalendarView } from "@/components/calendar/calendar-view";
import { UpcomingHolidays } from "@/components/dashboard/upcoming-holidays";

export const metadata: Metadata = {
  title: "Kalender",
  description:
    "Kalender Hijriah & Masehi — semua kegiatan & pengingat hari besar dalam satu tampilan.",
};

export default async function CalendarPage() {
  const [events, holidays] = await Promise.all([
    listEvents(),
    listHolidays({
      from: new Date(),
      kind: ["hijriah", "nasional", "internasional", "cuti_bersama"],
    }),
  ]);
  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="Agenda Organisasi"
        title="Kalender Hijriah &amp; Masehi"
        description="Jadwal kegiatan bulanan + pengingat hari besar untuk konten ucapan."
      />
      <div className="mt-2 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <CalendarView events={events} />
        <UpcomingHolidays holidays={holidays.slice(0, 10)} />
      </div>
    </AppShell>
  );
}
