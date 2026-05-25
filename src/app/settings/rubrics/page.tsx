import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentMember, listRubrics } from "@/lib/data/provider";
import { RubricsEditor } from "@/components/settings/rubrics-editor";

export const metadata = { title: "Rubrik · Settings" };

export default async function RubricsSettingsPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  if (member.role !== "admin") redirect("/settings");
  const rubrics = await listRubrics({ includeInactive: true });
  return (
    <AppShell>
      <Link
        href="/settings"
        className="inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-foreground"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} /> Settings
      </Link>
      <header className="mt-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
          Rubrik
        </p>
        <h1 className="mt-1 font-display text-[clamp(1.6rem,1.3rem+1.2vw,2.1rem)] font-semibold leading-tight tracking-tight">
          Editor rubrik editorial
        </h1>
        <p className="mt-2 max-w-prose text-[13px] text-foreground/65">
          Kategori rubrik yang muncul di dropdown ketika tim bikin konten.
          Tambah / edit / non-aktifkan tanpa perlu deploy.
        </p>
      </header>
      <RubricsEditor initial={rubrics} />
    </AppShell>
  );
}
