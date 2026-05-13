import type { Metadata } from "next";
import { listEvents, listDivisions } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { CalendarView } from "@/components/calendar/calendar-view";

export const metadata: Metadata = {
  title: "Kalender",
  description:
    "Kalender Hijriah & Masehi — semua kegiatan Humas Eksyar dalam satu tampilan.",
};

export default async function CalendarPage() {
  const [events, divisions] = await Promise.all([listEvents(), listDivisions()]);
  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="Agenda Organisasi"
        title="Kalender Hijriah &amp; Masehi"
        description="Pantau kegiatan per divisi. Klik tanggal untuk lihat agenda harinya."
      />
      <CalendarView events={events} divisions={divisions} />
    </AppShell>
  );
}
