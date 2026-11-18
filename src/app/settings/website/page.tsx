import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { WebsiteEditor } from "@/components/settings/website-editor";
import { getCurrentMember } from "@/lib/data/provider";
import { defaultWebsiteConfig } from "@/lib/site/defaults";
import { getSite } from "@/lib/site/get-site";
import { getAkademik } from "@/lib/site/akademik";
import { getHistory } from "@/lib/site/history";
import { WebsiteHistory } from "@/components/settings/website-history";
import { AkademikSyncCard } from "@/components/settings/akademik-sync-card";

export const metadata = { title: "Konten Website Publik" };

// Selalu ambil konten terbaru dari database (bukan hasil build).
export const dynamic = "force-dynamic";

export default async function WebsiteSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ bagian?: string }>;
}) {
  const { bagian } = await searchParams;
  const member = await getCurrentMember();
  if (!member || member.id === "guest" || !member.email) {
    redirect("/login");
  }

  const emailLower = (member.email || "").toLowerCase();
  const isSuperAdminEmail =
    emailLower.includes("1239220061") ||
    emailLower === "1239220061@student.uinsgd.ac.id" ||
    emailLower === "humaseksyaruinbdg@gmail.com" ||
    emailLower === "ridwanalamsyah122@gmail.com";

  const canEdit =
    member.role === "admin" ||
    member.role === "sekjen" ||
    member.role === "ketua_divisi" ||
    member.role === "pengurus" ||
    isSuperAdminEmail;

  if (!canEdit) redirect("/settings");

  const [website, akademik, history] = await Promise.all([
    getSite(),
    getAkademik().catch(() => null),
    getHistory().catch(() => []),
  ]);

  return (
    <AppShell width="wide">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[13px] text-label-3 hover:text-label transition-colors"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.75} /> Dashboard
          </Link>
          <h1 className="mt-1 text-[22px] font-semibold leading-tight tracking-tight sm:text-[26px] text-label">
            Konten Website Publik
          </h1>
          <p className="mt-1 max-w-prose text-[13px] text-label-2">
            Pusat kendali profil, visi misi, dosen, kurikulum, dan mitra kerja sama Program Studi Ekonomi Syariah.
          </p>
        </div>

        {/* Alat Teknis & Riwayat (Collapsible Dropdown) */}
        <details className="group relative">
          <summary className="flex cursor-pointer select-none items-center gap-1.5 rounded-xl border border-hairline bg-canvas px-3 py-1.5 text-[12.5px] font-medium text-label-2 hover:bg-mist hover:text-label transition-colors list-none shadow-2xs">
            <SlidersHorizontal className="size-3.5" />
            <span>Alat Sinkron &amp; Riwayat</span>
            <span className="text-[10px] text-label-3 transition-transform group-open:rotate-180">▼</span>
          </summary>
          <div className="absolute right-0 top-full z-40 mt-2 w-[340px] sm:w-[420px] rounded-2xl border border-hairline bg-canvas p-4 shadow-xl">
            <div className="space-y-3">
              <AkademikSyncCard
                info={
                  akademik
                    ? {
                        at: akademik.at,
                        mataKuliah: akademik.mataKuliah.length,
                        dosen: akademik.dosen.length,
                        errors: akademik.errors,
                      }
                    : null
                }
              />
              <WebsiteHistory items={history.map(({ at, by }) => ({ at, by }))} />
            </div>
          </div>
        </details>
      </div>

      <WebsiteEditor initial={website} defaults={defaultWebsiteConfig} initialTab={bagian} />
    </AppShell>
  );
}
