import type { Metadata } from "next";
import Link from "next/link";
import {
  listContents,
  getCurrentMember,
} from "@/lib/data/provider";
import { AppShell } from "@/components/layout/app-shell";
import { SectionHeader } from "@/components/common/section-header";
import { GlassCard } from "@/components/ui/glass-card";
import { ApprovalChain } from "@/components/content/approval-chain";
import { StatusPill } from "@/components/common/pill";
import { Avatar } from "@/components/common/avatar";
import { findMember } from "@/lib/fixtures/members";
import { formatLongDate } from "@/lib/format/dates";
import { ApprovalActions } from "@/components/content/approval-actions";
import { Inbox } from "lucide-react";

export const metadata: Metadata = {
  title: "Approval Queue",
  description: "Konten yang menunggu review koordinator atau admin.",
};

export default async function ApprovalPage() {
  const [pending, me] = await Promise.all([
    listContents({ status: ["review_divisi", "review_sekjen"] }),
    getCurrentMember(),
  ]);

  const inMyQueue = pending.filter((c) => c.waitingOn.includes(me.id));
  const others = pending.filter((c) => !c.waitingOn.includes(me.id));

  return (
    <AppShell width="wide">
      <SectionHeader
        eyebrow="Workflow"
        title="Approval Queue"
        description={`${pending.length} konten menunggu review. ${inMyQueue.length} menunggu kamu.`}
      />

      <div className="mt-2 space-y-8">
        <Section title="Menunggu kamu" count={inMyQueue.length} highlighted>
          {inMyQueue.length === 0 ? (
            <EmptyQueue text="Tidak ada konten yang menunggu reviewmu. Mantap." />
          ) : (
            inMyQueue.map((c) => {
              const author = findMember(c.authorId);
              if (!author) return null;
              return (
                <GlassCard variant="thick" key={c.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-foreground/55">
                        <StatusPill status={c.status} />
                        <span>{formatLongDate(c.updatedAt)}</span>
                      </div>
                      <h3 className="mt-2 font-display text-lg font-semibold leading-tight tracking-tight">
                        <Link
                          href={`/content/${c.id}`}
                          className="hover:text-brand-700 dark:hover:text-brand-300"
                        >
                          {c.title}
                        </Link>
                      </h3>
                      <p className="mt-2 line-clamp-2 text-[13px] text-foreground/70">
                        {c.caption.split("\n\n")[0]}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <Avatar member={author} size={28} />
                        <span className="text-[12px] text-foreground/65">
                          oleh {author.name}
                        </span>
                      </div>
                    </div>
                    <ApprovalActions contentId={c.id} />
                  </div>
                  <div className="mt-4 border-t border-foreground/10 pt-4 dark:border-white/10">
                    <ApprovalChain content={c} />
                  </div>
                </GlassCard>
              );
            })
          )}
        </Section>

        <Section title="Konten lain dalam review" count={others.length}>
          {others.length === 0 ? (
            <EmptyQueue text="Tidak ada konten yang sedang direview tim lain." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {others.map((c) => {
                const author = findMember(c.authorId);
                if (!author) return null;
                return (
                  <Link key={c.id} href={`/content/${c.id}`}>
                    <GlassCard className="p-4">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-foreground/55">
                        <StatusPill status={c.status} />
                      </div>
                      <h4 className="mt-2 font-display text-[14px] font-semibold leading-tight tracking-tight">
                        {c.title}
                      </h4>
                      <div className="mt-3 flex items-center gap-2">
                        <Avatar member={author} size={24} ring={false} />
                        <span className="text-[11px] text-foreground/55">
                          {author.name}
                        </span>
                      </div>
                    </GlassCard>
                  </Link>
                );
              })}
            </div>
          )}
        </Section>
      </div>
    </AppShell>
  );
}

function Section({
  title,
  count,
  children,
  highlighted = false,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          {title}
        </h2>
        <span
          className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold ${
            highlighted
              ? "bg-gold-400 text-ink-900"
              : "bg-foreground/10 text-foreground/65 dark:bg-white/10"
          }`}
        >
          {count}
        </span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function EmptyQueue({ text }: { text: string }) {
  return (
    <GlassCard variant="thin" className="p-6 text-center">
      <Inbox className="mx-auto size-6 text-foreground/45" strokeWidth={1.75} />
      <p className="mt-2 text-[13px] text-foreground/65">{text}</p>
    </GlassCard>
  );
}
