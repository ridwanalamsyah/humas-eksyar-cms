import type { Metadata } from "next";
import Link from "next/link";
import { UserCog } from "lucide-react";
import { listMembers } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { MembersDirectory } from "@/components/members/members-directory";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Anggota",
  description: "Direktori anggota Humas Eksyar.",
};

export default async function MembersPage() {
  const members = await listMembers();
  return (
    <AppShell width="wide">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <SectionHeader
          eyebrow="Tim"
          title="Anggota"
          description={`${members.length} anggota aktif.`}
        />
        <Button asChild size="sm" variant="secondary" className="gap-2">
          <Link href="/settings/members">
            <UserCog className="size-4" /> Kelola Peran &amp; Akses
          </Link>
        </Button>
      </div>
      <MembersDirectory members={members} />
    </AppShell>
  );
}
