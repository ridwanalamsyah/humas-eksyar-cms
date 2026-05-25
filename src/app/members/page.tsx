import type { Metadata } from "next";
import { listMembers, listLeaderboard } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { MembersDirectory } from "@/components/members/members-directory";

export const metadata: Metadata = {
  title: "Anggota",
  description: "Direktori anggota Humas Eksyar.",
};

export default async function MembersPage() {
  const [members, leaderboard] = await Promise.all([
    listMembers(),
    listLeaderboard(),
  ]);
  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="Komunitas"
        title="Direktori Anggota"
        description={`${members.length} anggota aktif.`}
        cta={{ label: "Lihat leaderboard", href: "/leaderboard" }}
      />
      <MembersDirectory
        members={members}
        topXP={leaderboard.slice(0, 3).map((m) => m.id)}
      />
    </AppShell>
  );
}
