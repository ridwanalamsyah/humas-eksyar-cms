import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentMember, listMembers } from "@/lib/data/provider";
import { MembersRoleEditor } from "@/components/settings/members-role-editor";

export const metadata = { title: "Anggota & role · Settings" };

export default async function MembersSettingsPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/login");
  if (member.role !== "admin") redirect("/settings");
  const members = await listMembers();
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
          Anggota
        </p>
        <h1 className="mt-1 font-display text-[clamp(1.6rem,1.3rem+1.2vw,2.1rem)] font-semibold leading-tight tracking-tight">
          Role &amp; akses
        </h1>
        <p className="mt-2 max-w-prose text-[13px] text-foreground/65">
          Promote / demote role per anggota. Role <code>admin</code> bisa atur
          semua; <code>monitoring</code> hanya bisa view (cocok untuk pembina).
        </p>
      </header>
      <MembersRoleEditor
        initial={members}
        currentMemberId={member.id}
      />
    </AppShell>
  );
}
