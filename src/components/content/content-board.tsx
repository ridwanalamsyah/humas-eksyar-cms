"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Search, LayoutGrid, KanbanSquare, List as ListIcon, Filter, Plus, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/common/avatar";
import { ContentCard } from "@/components/content/content-card";
import { SegmentedTabs } from "@/components/common/tabs";
import { STATUS_ORDER, statusLabel, StatusPill } from "@/components/common/pill";
import { findDivision, divisions } from "@/lib/fixtures/divisions";
import { findMember } from "@/lib/fixtures/members";
import { findMedia } from "@/lib/fixtures/media";
import { cn } from "@/lib/utils";
import type { ContentItem, ContentStatus, DivisionSlug } from "@/lib/data/types";
import { relativeFromNow } from "@/lib/format/dates";

type View = "grid" | "kanban" | "list";

interface Props {
  contents: ContentItem[];
}

export function ContentBoard({ contents }: Props) {
  const [view, setView] = useState<View>("kanban");
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState<DivisionSlug | "all">("all");

  const filtered = useMemo(() => {
    return contents.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !c.title.toLowerCase().includes(q) &&
          !c.caption.toLowerCase().includes(q) &&
          !c.body.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (divisionFilter !== "all") {
        const d = findDivision(c.divisionId);
        if (d.slug !== divisionFilter) return false;
      }
      return true;
    });
  }, [contents, search, divisionFilter]);

  return (
    <div>
      <GlassCard variant="thin" className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-3 dark:border-white/10 dark:bg-white/5">
          <Search className="size-4 text-foreground/55" strokeWidth={1.75} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul, caption, atau body…"
            className="h-9 w-full bg-transparent text-[13px] outline-none placeholder:text-foreground/45"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/5 px-2 py-1 text-[12px] dark:border-white/10 dark:bg-white/5">
            <Filter className="size-3.5 text-foreground/55" strokeWidth={1.75} />
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value as DivisionSlug | "all")}
              className="bg-transparent pr-1 text-[12px] outline-none"
            >
              <option value="all">Semua divisi</option>
              {divisions.map((d) => (
                <option key={d.slug} value={d.slug}>{d.shortName}</option>
              ))}
            </select>
          </div>
          <SegmentedTabs
            value={view}
            onChange={setView}
            size="sm"
            options={[
              { value: "kanban", label: "Kanban", icon: <KanbanSquare className="size-3.5" strokeWidth={1.75} /> },
              { value: "grid", label: "Grid", icon: <LayoutGrid className="size-3.5" strokeWidth={1.75} /> },
              { value: "list", label: "List", icon: <ListIcon className="size-3.5" strokeWidth={1.75} /> },
            ]}
          />
          <Button asChild size="sm">
            <Link href="/content/new">
              <Plus className="size-4" strokeWidth={1.75} /> Konten Baru
            </Link>
          </Button>
        </div>
      </GlassCard>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="mt-5"
        >
          {view === "grid" && <GridView contents={filtered} />}
          {view === "kanban" && <KanbanView contents={filtered} />}
          {view === "list" && <ListView contents={filtered} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function GridView({ contents }: { contents: ContentItem[] }) {
  if (contents.length === 0) return <Empty />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {contents.map((c) => {
        const author = findMember(c.authorId);
        const division = findDivision(c.divisionId);
        const cover = c.mediaIds[0] ? findMedia(c.mediaIds[0]) : null;
        if (!author) return null;
        return <ContentCard key={c.id} content={c} division={division} author={author} cover={cover} />;
      })}
    </div>
  );
}

function KanbanView({ contents }: { contents: ContentItem[] }) {
  const cols = STATUS_ORDER.filter((s) => s !== "archived").map((status) => ({
    status,
    items: contents.filter((c) => c.status === status),
  }));
  return (
    <div className="-mx-2 flex snap-x snap-mandatory gap-3 overflow-x-auto px-2 pb-3 sm:mx-0 sm:px-0">
      {cols.map((col) => (
        <KanbanColumn key={col.status} status={col.status} items={col.items} />
      ))}
    </div>
  );
}

function KanbanColumn({ status, items }: { status: ContentStatus; items: ContentItem[] }) {
  return (
    <GlassCard
      variant="thin"
      className="flex w-72 shrink-0 snap-start flex-col gap-3 p-3 sm:w-80"
    >
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <StatusPill status={status} size="xs" />
          <span className="text-[11px] text-foreground/55">{items.length}</span>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {items.length === 0 && (
          <li className="rounded-xl border border-dashed border-foreground/15 px-3 py-6 text-center text-[12px] text-foreground/45 dark:border-white/15">
            Tidak ada konten di status ini.
          </li>
        )}
        {items.map((c) => {
          const author = findMember(c.authorId);
          const division = findDivision(c.divisionId);
          if (!author) return null;
          return (
            <li key={c.id}>
              <Link
                href={`/content/${c.id}`}
                className="group block rounded-2xl bg-background/55 p-3 ring-1 ring-foreground/5 transition-shadow hover:bg-background/75 hover:ring-foreground/15 dark:bg-foreground/5 dark:ring-white/5 dark:hover:bg-foreground/10"
              >
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span
                    className="rounded-full px-1.5 py-0.5 font-semibold"
                    style={{ background: `${division.color}26`, color: division.color }}
                  >
                    {division.shortName}
                  </span>
                  {c.captionStyle && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-gold-400/40 bg-gold-400/10 px-1.5 py-0.5 font-semibold text-gold-700 dark:text-gold-200">
                      <Sparkles className="size-2.5" strokeWidth={2} />
                      AI
                    </span>
                  )}
                </div>
                <p className="mt-1.5 line-clamp-2 text-[13px] font-medium leading-snug transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-300">
                  {c.title}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <Avatar member={author} size={20} ring={false} />
                  <span className="text-[10px] text-foreground/55">{relativeFromNow(c.updatedAt)}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}

function ListView({ contents }: { contents: ContentItem[] }) {
  if (contents.length === 0) return <Empty />;
  return (
    <GlassCard variant="thin" className="overflow-hidden p-0">
      <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-foreground/55 sm:grid-cols-[2fr_1fr_1fr_auto]">
        <span>Konten</span>
        <span className="hidden sm:inline">Author</span>
        <span className="hidden sm:inline">Status</span>
        <span className="text-right">Update</span>
      </div>
      <ul>
        {contents.map((c, i) => {
          const author = findMember(c.authorId);
          const division = findDivision(c.divisionId);
          if (!author) return null;
          return (
            <li
              key={c.id}
              className={cn(
                "border-t border-foreground/5 transition-colors hover:bg-foreground/5 dark:border-white/5 dark:hover:bg-white/5",
                i === 0 && "border-t-0",
              )}
            >
              <Link
                href={`/content/${c.id}`}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 px-4 py-3 sm:grid-cols-[2fr_1fr_1fr_auto]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-flex shrink-0 size-2 rounded-full"
                      style={{ background: division.color }}
                      aria-hidden
                    />
                    <p className="truncate text-[14px] font-medium">{c.title}</p>
                  </div>
                  <p className="ml-3.5 truncate text-[11px] text-foreground/55">
                    {division.shortName} · {c.channels.join(", ")}
                  </p>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <Avatar member={author} size={22} ring={false} />
                  <span className="text-[12px] text-foreground/70">{author.name.split(" ")[0]}</span>
                </div>
                <div className="hidden sm:block">
                  <StatusPill status={c.status} size="xs" />
                </div>
                <span className="text-right font-mono text-[11px] text-foreground/55">
                  {relativeFromNow(c.updatedAt)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}

function Empty() {
  return (
    <GlassCard variant="thin" className="flex flex-col items-center gap-3 p-12 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-foreground/5 dark:bg-white/5">
        <Search className="size-5 text-foreground/55" strokeWidth={1.75} />
      </div>
      <p className="font-display text-base font-semibold tracking-tight">Tidak ada konten</p>
      <p className="max-w-sm text-sm text-foreground/55">
        Belum ada konten yang cocok dengan filter ini. Coba reset pencarian atau buat konten baru.
      </p>
      <Button asChild size="sm">
        <Link href="/content/new">
          <Plus className="size-4" strokeWidth={1.75} /> Konten Baru
        </Link>
      </Button>
    </GlassCard>
  );
}

// Re-export label helper for re-use
export { statusLabel };
