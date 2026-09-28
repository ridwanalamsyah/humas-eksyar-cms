import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { WebsiteEditor } from "@/components/settings/website-editor";
import { getCurrentMember } from "@/lib/data/provider";
import { defaultWebsiteConfig } from "@/lib/site/defaults";
import { getSite } from "@/lib/site/get-site";

export const metadata = { title: "Website Prodi · Settings" };

// Selalu ambil konten terbaru dari database (bukan hasil build).
export const dynamic = "force-dynamic";

export default async function WebsiteSettingsPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  if (member.role !== "admin") redirect("/settings");

  const website = await getSite();

  return (
    <AppShell>
      <Link href="/settings" className="inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-foreground">
        <ArrowLeft className="size-4" strokeWidth={1.75} /> Settings
      </Link>
      <header className="mt-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">Website Prodi</p>
        <h1 className="mt-1 font-display text-[clamp(1.6rem,1.3rem+1.2vw,2.1rem)] font-semibold leading-tight tracking-tight">
          Konten website publik
        </h1>
        <p className="mt-2 max-w-prose text-[13px] text-foreground/65">
          Atur isi website Program Studi Ekonomi Syariah di <span className="font-medium">/prodi</span>. Berita,
          pengumuman, dan agenda diambil otomatis dari Konten (status <em>published</em>) dan Kegiatan. Perubahan di
          sini langsung tayang setelah disimpan.
        </p>
      </header>
      <WebsiteEditor initial={website} defaults={defaultWebsiteConfig} />
    </AppShell>
  );
}
