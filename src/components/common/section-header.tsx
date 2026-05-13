import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  /** Slot rendered to the right (filters, etc) */
  right?: ReactNode;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  cta,
  right,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-4 flex flex-wrap items-end justify-between gap-3", className)}>
      <div>
        {eyebrow && (
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/55">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 font-display text-xl font-semibold tracking-tight sm:text-[1.4rem]">
          {title}
        </h2>
        {description && (
          <p className="mt-1 max-w-prose text-sm text-foreground/65">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {right}
        {cta && (
          <Link
            href={cta.href}
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
          >
            {cta.label}
            <ArrowUpRight className="size-4" strokeWidth={1.75} />
          </Link>
        )}
      </div>
    </div>
  );
}
