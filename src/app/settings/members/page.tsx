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
        <p className="text-[12.5px] text-foreground/50">
          Anggota
        </p>
        <h1 className="mt-1 text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px]">
          Anggota &amp; role
        </h1>
        <p className="mt-2 max-w-prose text-[13px] text-foreground/65">
          Tambah, hapus, dan atur role anggota. Role <code>admin</code> bisa
          mengatur semua; <code>monitoring</code> hanya bisa melihat (cocok
          untuk pembina).
        </p>
      </header>
      <MembersRoleEditor
        initial={members}
        currentMemberId={member.id}
      />
    </AppShell>
  );
}
