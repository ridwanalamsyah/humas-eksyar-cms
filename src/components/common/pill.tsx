import { cn } from "@/lib/utils";
import type { ContentStatus } from "@/lib/data/types";
import {
  Lightbulb,
  PencilLine,
  Eye,
  ShieldCheck,
  Clock4,
  Sparkles,
  Archive,
} from "lucide-react";

const STATUS_META: Record<
  ContentStatus,
  { label: string; classes: string; Icon: typeof Lightbulb }
> = {
  idea: {
    label: "Ide",
    classes:
      "border-foreground/15 bg-foreground/5 text-foreground/70 dark:border-white/10 dark:bg-white/5",
    Icon: Lightbulb,
  },
  draft: {
    label: "Draft",
    classes:
      "border-foreground/15 bg-foreground/5 text-foreground/80 dark:border-white/10 dark:bg-white/5",
    Icon: PencilLine,
  },
  review_divisi: {
    label: "Review Koordinator",
    classes:
      "border-amber-400/40 bg-amber-400/15 text-amber-700 dark:text-amber-300",
    Icon: Eye,
  },
  review_sekjen: {
    label: "Review Admin",
    classes:
      "border-violet-400/40 bg-violet-400/15 text-violet-700 dark:text-violet-300",
    Icon: ShieldCheck,
  },
  scheduled: {
    label: "Scheduled",
    classes:
      "border-sky-400/40 bg-sky-400/15 text-sky-700 dark:text-sky-300",
    Icon: Clock4,
  },
  published: {
    label: "Published",
    classes:
      "border-brand-500/40 bg-brand-500/15 text-brand-700 dark:text-brand-300",
    Icon: Sparkles,
  },
  archived: {
    label: "Arsip",
    classes:
      "border-foreground/15 bg-foreground/5 text-foreground/55 dark:border-white/10 dark:bg-white/5",
    Icon: Archive,
  },
};

export const STATUS_ORDER: ContentStatus[] = [
  "idea",
  "draft",
  "review_divisi",
  "review_sekjen",
  "scheduled",
  "published",
  "archived",
];

export function StatusPill({
  status,
  size = "sm",
  className,
}: {
  status: ContentStatus;
  size?: "sm" | "xs";
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "xs"
          ? "px-1.5 py-0.5 text-[10px]"
          : "px-2 py-0.5 text-[11px]",
        meta.classes,
        className,
      )}
    >
      <meta.Icon className={size === "xs" ? "size-2.5" : "size-3"} strokeWidth={2} />
      {meta.label}
    </span>
  );
}

export function statusLabel(s: ContentStatus): string {
  return STATUS_META[s].label;
}

interface PillProps {
  children: React.ReactNode;
  tone?: "neutral" | "brand" | "gold" | "danger" | "success" | "info";
  className?: string;
}

export function Pill({ children, tone = "neutral", className }: PillProps) {
  const map: Record<NonNullable<PillProps["tone"]>, string> = {
    neutral:
      "border-foreground/15 bg-foreground/5 text-foreground/70 dark:border-white/10 dark:bg-white/5",
    brand:
      "border-brand-500/40 bg-brand-500/12 text-brand-700 dark:text-brand-300",
    gold:
      "border-gold-400/40 bg-gold-400/15 text-gold-600 dark:text-gold-300",
    danger:
      "border-rose-400/40 bg-rose-400/15 text-rose-700 dark:text-rose-300",
    success:
      "border-emerald-400/40 bg-emerald-400/15 text-emerald-700 dark:text-emerald-300",
    info:
      "border-sky-400/40 bg-sky-400/15 text-sky-700 dark:text-sky-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        map[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
