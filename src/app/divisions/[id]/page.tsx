import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getDivision,
  listMembers,
  listContents,
  listEvents,
  getMember,
} from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/common/avatar";
import { Pill } from "@/components/common/pill";
import { SectionHeader } from "@/components/common/section-header";
import { ContentCard } from "@/components/content/content-card";
import { findMember } from "@/lib/fixtures/members";
import { findMedia } from "@/lib/fixtures/media";
import Link from "next/link";
import { Users, FileText, Calendar as CalIcon } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const div = await getDivision(id);
  if (!div) return {};
  return { title: div.name, description: div.description };
}

export default async function DivisionDetail({ params }: PageProps) {
  const { id } = await params;
  const div = await getDivision(id);
  if (!div) notFound();

  const [members, contents, events, lead] = await Promise.all([
    listMembers({ divisionId: div.id }),
    listContents({ divisionId: div.id }),
    listEvents({ divisionId: div.id }),
    getMember(div.leadId),
  ]);

  const published = contents.filter((c) => c.status === "published");
  const tint = `color-mix(in oklab, ${div.color} 22%, transparent)`;

  return (
    <AppShell width="wide">
      <GlassCard
        variant="thick"
        className="relative overflow-hidden p-7"
        style={{ background: `linear-gradient(135deg, ${tint}, transparent 60%)` }}
      >
        <p
          className="text-[11px] font-medium uppercase tracking-[0.18em]"
          style={{ color: div.color }}
        >
          Divisi
        </p>
        <h1 className="mt-1 font-display text-[clamp(1.6rem,1.2rem+1.5vw,2.4rem)] font-semibold leading-tight tracking-tight">
          {div.name}
        </h1>
        <p className="mt-2 max-w-prose text-[14px] text-foreground/75">
          {div.description}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-5 text-[13px]">
          <div className="inline-flex items-center gap-2">
            <Users className="size-4" strokeWidth={1.75} />
            <span>{members.length} anggota</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <FileText className="size-4" strokeWidth={1.75} />
            <span>{published.length} konten publish</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <CalIcon className="size-4" strokeWidth={1.75} />
            <span>{events.length} kegiatan</span>
          </div>
        </div>
      </GlassCard>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_2fr]">
        <aside className="space-y-4">
          {lead && (
            <GlassCard className="p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
                Ketua Divisi
              </p>
              <Link
                href={`/members/${lead.id}`}
                className="mt-3 flex items-center gap-3"
              >
                <Avatar member={lead} size={48} />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold">
                    {lead.name}
                  </p>
                  <p className="truncate text-[12px] text-foreground/65">
                    {lead.position}
                  </p>
                </div>
              </Link>
            </GlassCard>
          )}

          <GlassCard className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
              Anggota lain ({members.length - 1})
            </p>
            <ul className="mt-3 space-y-2">
              {members
                .filter((m) => m.id !== lead?.id)
                .slice(0, 8)
                .map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/members/${m.id}`}
                      className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-foreground/[0.04] dark:hover:bg-white/5"
                    >
                      <Avatar member={m} size={32} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium">{m.name}</p>
                        <p className="truncate text-[11px] text-foreground/55">
                          {m.position}
                        </p>
                      </div>
                      <Pill>{m.role.replace("_", " ")}</Pill>
                    </Link>
                  </li>
                ))}
            </ul>
            <Link
              href={`/members?division=${div.id}`}
              className="mt-3 inline-block text-[12px] font-medium text-brand-700 dark:text-brand-300"
            >
              Lihat semua anggota →
            </Link>
          </GlassCard>
        </aside>

        <section className="space-y-6">
          <div>
            <SectionHeader
              title="Konten divisi"
              description="Semua post yang ditulis tim ini."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {contents.slice(0, 6).map((c) => {
                const author = findMember(c.authorId);
                const cover = c.mediaIds[0] ? findMedia(c.mediaIds[0]) : null;
                if (!author) return null;
                return (
                  <ContentCard
                    key={c.id}
                    content={c}
                    division={div}
                    author={author}
                    cover={cover}
                  />
                );
              })}
              {contents.length === 0 && (
                <p className="col-span-2 rounded-xl border border-dashed border-foreground/15 p-6 text-center text-[12px] text-foreground/55">
                  Belum ada konten.
                </p>
              )}
            </div>
          </div>

          <div>
            <SectionHeader
              title="Kegiatan mendatang"
              description="Acara yang dikelola divisi ini."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {events.slice(0, 4).map((e) => (
                <GlassCard key={e.id} className="p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-foreground/55">
                    {e.category}
                  </p>
                  <h3 className="mt-1 font-display text-[15px] font-semibold leading-tight tracking-tight">
                    <Link href={`/events/${e.id}`} className="hover:text-brand-700 dark:hover:text-brand-300">
                      {e.title}
                    </Link>
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[12px] text-foreground/65">
                    {e.description}
                  </p>
                </GlassCard>
              ))}
              {events.length === 0 && (
                <p className="col-span-2 rounded-xl border border-dashed border-foreground/15 p-6 text-center text-[12px] text-foreground/55">
                  Belum ada kegiatan terjadwal.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
