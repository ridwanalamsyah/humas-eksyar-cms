/**
 * Export & laporan center — admin / koordinator-only.
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { auth } from "@/auth";
import { findMemberByEmail } from "@/lib/data/provider";

export const metadata = {
  title: "Export & Laporan",
};

const EXPORTS: Array<{ entity: string; label: string; description: string }> = [
  { entity: "members", label: "Anggota", description: "Roster lengkap + role + XP." },
  { entity: "contents", label: "Konten", description: "Semua konten + status + author." },
  { entity: "events", label: "Event", description: "Daftar event + RSVP + check-in." },
  { entity: "holidays", label: "Hari besar", description: "Kalender Hijriah + libur nasional." },
  { entity: "tasks", label: "Task pribadi", description: "Task pribadi Anda." },
];

export default async function ExportSettingsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const me = await findMemberByEmail(session.user.email);
  if (
    !me ||
    (me.role !== "admin" && me.role !== "ketua_divisi" && me.role !== "sekjen")
  ) {
    redirect("/settings");
  }

  const now = new Date();
  const thisMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const thisYear = now.getUTCFullYear();

  return (
    <AppShell>
      <Link
        href="/settings"
        className="inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Settings
      </Link>

      <header className="mt-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-foreground/55">
          Settings
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
          Export &amp; Laporan
        </h1>
        <p className="mt-2 text-[14px] text-foreground/65">
          Download CSV semua data, atau buka laporan periode untuk di-save sebagai PDF.
        </p>
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        {EXPORTS.map((x) => (
          <GlassCard key={x.entity} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{x.label}</p>
                <p className="mt-1 text-[12px] text-foreground/65">
                  {x.description}
                </p>
              </div>
              <a
                href={`/api/export/${x.entity}.csv`}
                className="inline-flex items-center gap-1 rounded-full border border-foreground/15 bg-background px-3 py-1.5 text-[12px] hover:bg-foreground/[0.05]"
                download
              >
                <Download className="size-3" strokeWidth={1.75} />
                CSV
              </a>
            </div>
          </GlassCard>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Laporan periode
        </h2>
        <p className="mt-1 text-[13px] text-foreground/65">
          Buka di tab baru, lalu pakai &quot;Save as PDF&quot; dari browser untuk arsip.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <GlassCard className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <FileText
                  className="size-4 text-foreground/55"
                  strokeWidth={1.75}
                />
                <p className="mt-2 font-medium">
                  Laporan bulanan ({thisMonth})
                </p>
                <p className="mt-1 text-[12px] text-foreground/65">
                  Rangkuman konten + event + top kontributor bulan ini.
                </p>
              </div>
              <a
                href={`/report?month=${thisMonth}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-foreground/15 bg-background px-3 py-1.5 text-[12px] hover:bg-foreground/[0.05]"
              >
                <ExternalLink className="size-3" strokeWidth={1.75} />
                Buka
              </a>
            </div>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <FileText
                  className="size-4 text-foreground/55"
                  strokeWidth={1.75}
                />
                <p className="mt-2 font-medium">
                  Laporan tahunan ({thisYear})
                </p>
                <p className="mt-1 text-[12px] text-foreground/65">
                  Untuk LPJ akhir periode kepengurusan.
                </p>
              </div>
              <a
                href={`/report?year=${thisYear}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-foreground/15 bg-background px-3 py-1.5 text-[12px] hover:bg-foreground/[0.05]"
              >
                <ExternalLink className="size-3" strokeWidth={1.75} />
                Buka
              </a>
            </div>
          </GlassCard>
        </div>
      </section>
    </AppShell>
  );
}
