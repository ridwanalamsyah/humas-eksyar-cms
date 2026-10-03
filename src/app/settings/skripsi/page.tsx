import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { SkripsiEditor } from "@/components/settings/skripsi-editor";
import { getCurrentMember } from "@/lib/data/provider";
import { getSkripsi, getSkripsiSync } from "@/lib/site/skripsi";

export const metadata = { title: "Direktori Skripsi · Pengaturan" };
export const dynamic = "force-dynamic";

export default async function SkripsiSettingsPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  if (member.role !== "admin") redirect("/settings");
  const [items, sync] = await Promise.all([getSkripsi(), getSkripsiSync()]);

  return (
    <AppShell>
      <Link href="/settings" className="inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-foreground">
        <ArrowLeft className="size-4" strokeWidth={1.75} /> Pengaturan
      </Link>
      <header className="mt-3">
        <p className="text-[12.5px] text-foreground/50">Website Prodi</p>
        <h1 className="mt-1 text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px]">
          Direktori judul skripsi
        </h1>
        <p className="mt-2 max-w-prose text-[13px] text-foreground/65">
          Dipakai halaman <span className="font-medium">/skripsi</span> di website: mahasiswa bisa menelusuri skripsi Eksyar dan
          memeriksa kemiripan judul sebelum mengajukan proposal. Data diperbarui otomatis dari Digilib setiap hari.
        </p>
      </header>
      <SkripsiEditor initial={items} sync={sync} />
    </AppShell>
  );
}
