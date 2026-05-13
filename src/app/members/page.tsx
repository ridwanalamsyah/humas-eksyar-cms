import type { Metadata } from "next";
import { listMembers, listDivisions, listLeaderboard } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { MembersDirectory } from "@/components/members/members-directory";

export const metadata: Metadata = {
  title: "Anggota Eksyar",
  description: "Direktori anggota, pengurus, dan ketua divisi Humas Eksyar.",
};

export default async function MembersPage() {
  const [members, divisions, leaderboard] = await Promise.all([
    listMembers(),
    listDivisions(),
    listLeaderboard(),
  ]);
  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="Komunitas"
        title="Direktori Anggota"
        description={`${members.length} anggota aktif dari ${divisions.length} divisi.`}
        cta={{ label: "Lihat leaderboard", href: "/leaderboard" }}
      />
      <MembersDirectory
        members={members}
        divisions={divisions}
        topXP={leaderboard.slice(0, 3).map((m) => m.id)}
      />
    </AppShell>
  );
}
