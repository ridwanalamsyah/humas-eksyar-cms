import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMember, listContents } from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/common/avatar";
import { Pill } from "@/components/common/pill";
import { ContentCard } from "@/components/content/content-card";
import { Mail, Calendar as CalIcon } from "lucide-react";
import { findMember } from "@/lib/fixtures/members";
import { findMedia } from "@/lib/fixtures/media";
import { formatLongDate } from "@/lib/format/dates";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) return {};
  return {
    title: member.name,
    description: `${member.position} · ${member.bio ?? "Anggota Humas Eksyar."}`,
  };
}

export default async function MemberDetailPage({ params }: PageProps) {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) notFound();

  const allContents = await listContents({ authorId: id });

  return (
    <AppShell width="wide">
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <aside className="space-y-4">
          <GlassCard variant="thick" className="p-6 text-center">
            <div className="mx-auto inline-block">
              <Avatar member={member} size={96} />
            </div>
            <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
              {member.name}
            </h1>
            <p className="mt-1 text-[13px] text-foreground/65">
              {member.position}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              <Pill>Angkatan {member.angkatan}</Pill>
            </div>
            {member.bio && (
              <p className="mt-4 text-[13px] leading-relaxed text-foreground/75">
                {member.bio}
              </p>
            )}
            <div className="mt-5 space-y-1.5 text-left text-[12px] text-foreground/65">
              <p className="flex items-center gap-2">
                <Mail className="size-3.5" strokeWidth={1.75} />
                {member.email}
              </p>
              <p className="flex items-center gap-2">
                <CalIcon className="size-3.5" strokeWidth={1.75} />
                Bergabung {formatLongDate(member.joinedAt)}
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-5 text-center">
            <p className="text-[12px] text-foreground/55">Konten terbit</p>
            <p className="mt-1 text-[22px] font-semibold tabular-nums">
              {allContents.filter((c) => c.status === "published").length}
            </p>
          </GlassCard>
        </aside>

        <section className="space-y-6">

          <div>
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Konten kontribusi
            </h2>
            <p className="mt-1 text-[12px] text-foreground/65">
              Semua konten yang ditulis atau dijadwalkan anggota ini.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {allContents.slice(0, 6).map((c) => {
                const author = findMember(c.authorId);
                const cover = c.mediaIds[0] ? findMedia(c.mediaIds[0]) : null;
                if (!author) return null;
                return (
                  <ContentCard
                    key={c.id}
                    content={c}
                    author={author}
                    cover={cover}
                  />
                );
              })}
              {allContents.length === 0 && (
                <p className="col-span-2 rounded-xl border border-dashed border-foreground/15 p-6 text-center text-[12px] text-foreground/55">
                  Belum ada konten dari anggota ini.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
