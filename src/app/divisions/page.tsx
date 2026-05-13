import type { Metadata } from "next";
import Link from "next/link";
import { listDivisions, listMembers } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { SectionHeader } from "@/components/common/section-header";
import { Avatar } from "@/components/common/avatar";
import { findMember } from "@/lib/fixtures/members";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Divisi",
  description: "6 divisi yang membentuk Humas Eksyar.",
};

export default async function DivisionsPage() {
  const [divisions, members] = await Promise.all([listDivisions(), listMembers()]);
  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="Struktur Organisasi"
        title="Divisi"
        description={`${divisions.length} divisi, ${members.length} anggota.`}
      />
      <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {divisions.map((d) => {
          const lead = findMember(d.leadId);
          const tint = `color-mix(in oklab, ${d.color} 18%, transparent)`;
          const divMembers = members.filter((m) => m.divisionId === d.id);
          return (
            <Link key={d.id} href={`/divisions/${d.id}`}>
              <GlassCard
                hover
                className="relative h-full overflow-hidden p-5"
                style={{
                  background: `linear-gradient(135deg, ${tint}, transparent 70%)`,
                }}
              >
                <p
                  className="text-[11px] font-medium uppercase tracking-[0.18em]"
                  style={{ color: d.color }}
                >
                  {d.shortName}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold leading-tight tracking-tight">
                  {d.name}
                </h3>
                <p className="mt-2 line-clamp-3 text-[13px] text-foreground/70">
                  {d.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-foreground/10 pt-3 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    {lead && <Avatar member={lead} size={26} />}
                    <span className="text-[12px] text-foreground/65">
                      {divMembers.length} anggota
                    </span>
                  </div>
                  <ArrowUpRight
                    className="size-4 text-foreground/55 group-hover:text-foreground/85"
                    strokeWidth={1.75}
                  />
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
