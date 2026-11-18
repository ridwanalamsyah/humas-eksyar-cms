import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentMember, listMembers, listPendingMembers } from "@/lib/data/provider";
import { MembersRoleEditor } from "@/components/settings/members-role-editor";

export const metadata = { title: "Anggota & Peran" };
export const dynamic = "force-dynamic";

export default async function MembersSettingsPage() {
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

  const isAdmin = member.role === "admin" || isSuperAdminEmail;

  const [members, pendingMembers] = await Promise.all([
    listMembers().catch(() => []),
    listPendingMembers().catch(() => []),
  ]);

  return (
    <AppShell>
      <Link
        href="/settings"
        className="inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} /> Pengaturan
      </Link>
      <header className="mt-3">
        <p className="text-[12.5px] text-foreground/50">
          Roster Organisasi &amp; Hak Akses
        </p>
        <h1 className="mt-1 text-[24px] font-semibold leading-tight tracking-tight sm:text-[28px]">
          Anggota &amp; Peran
        </h1>
        <p className="mt-2 max-w-prose text-[13px] text-foreground/65">
          {isAdmin
            ? "Kelola pendaftar baru, konfirmasi hak akses anggota, dan atur peran pengurus Humas Jurusan Ekonomi Syariah."
            : "Daftar susunan pengurus dan kontributor Humas Jurusan Ekonomi Syariah FEBI UIN SGD."}
        </p>
      </header>
      <MembersRoleEditor
        initial={members}
        initialPending={isAdmin ? pendingMembers : []}
        currentMemberId={member.id}
        isAdmin={isAdmin}
      />
    </AppShell>
  );
}
