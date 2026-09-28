import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { SkripsiEditor } from "@/components/settings/skripsi-editor";
import { getCurrentMember } from "@/lib/data/provider";
import { getSkripsi } from "@/lib/site/skripsi";

export const metadata = { title: "Direktori Skripsi · Settings" };
export const dynamic = "force-dynamic";

export default async function SkripsiSettingsPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  if (member.role !== "admin") redirect("/settings");
  const items = await getSkripsi();

  return (
    <AppShell>
      <Link href="/settings" className="inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-foreground">
        <ArrowLeft className="size-4" strokeWidth={1.75} /> Settings
      </Link>
      <header className="mt-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">Website Prodi</p>
        <h1 className="mt-1 font-display text-[clamp(1.6rem,1.3rem+1.2vw,2.1rem)] font-semibold leading-tight tracking-tight">
          Direktori judul skripsi
        </h1>
        <p className="mt-2 max-w-prose text-[13px] text-foreground/65">
          Dipakai fitur <span className="font-medium">Cek Judul</span> di /prodi/skripsi agar mahasiswa bisa memeriksa kemiripan
          judul sebelum mengajukan proposal.
        </p>
      </header>
      <SkripsiEditor initial={items} />
    </AppShell>
  );
}
