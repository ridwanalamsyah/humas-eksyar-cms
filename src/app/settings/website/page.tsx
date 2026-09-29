import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { WebsiteEditor } from "@/components/settings/website-editor";
import { getCurrentMember } from "@/lib/data/provider";
import { defaultWebsiteConfig } from "@/lib/site/defaults";
import { getSite } from "@/lib/site/get-site";
import { getAkademik } from "@/lib/site/akademik";
import { AkademikSyncCard } from "@/components/settings/akademik-sync-card";

export const metadata = { title: "Website Prodi · Settings" };

// Selalu ambil konten terbaru dari database (bukan hasil build).
export const dynamic = "force-dynamic";

export default async function WebsiteSettingsPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  if (member.role !== "admin") redirect("/settings");

  const [website, akademik] = await Promise.all([getSite(), getAkademik()]);

  return (
    <AppShell>
      <Link href="/settings" className="inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-foreground">
        <ArrowLeft className="size-4" strokeWidth={1.75} /> Settings
      </Link>
      <header className="mt-3">
        <p className="text-[12.5px] text-foreground/50">Website Prodi</p>
        <h1 className="mt-1 text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px]">
          Konten website publik
        </h1>
        <p className="mt-2 max-w-prose text-[13px] text-foreground/65">
          Atur isi website Program Studi Ekonomi Syariah (domain utama). Berita,
          pengumuman, dan agenda diambil otomatis dari Konten (status <em>published</em>) dan Kegiatan. Perubahan di
          sini langsung tayang setelah disimpan.
        </p>
      </header>
      <AkademikSyncCard
        info={
          akademik
            ? { at: akademik.at, mataKuliah: akademik.mataKuliah.length, dosen: akademik.dosen.length, errors: akademik.errors }
            : null
        }
      />
      <WebsiteEditor initial={website} defaults={defaultWebsiteConfig} />
    </AppShell>
  );
}
