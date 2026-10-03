import type { Metadata } from "next";
import { listMembers } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { MembersDirectory } from "@/components/members/members-directory";

export const metadata: Metadata = {
  title: "Anggota",
  description: "Direktori anggota Humas Eksyar.",
};

export default async function MembersPage() {
  const members = await listMembers();
  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="Tim"
        title="Anggota"
        description={`${members.length} anggota aktif.`}
      />
      <MembersDirectory members={members} />
    </AppShell>
  );
}
