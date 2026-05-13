"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SegmentedTabsProps<T extends string> {
  value: T;
  onChange: (next: T) => void;
  options: ReadonlyArray<{ value: T; label: React.ReactNode; icon?: React.ReactNode }>;
  size?: "sm" | "md";
  className?: string;
}

export function SegmentedTabs<T extends string>({
  value,
  onChange,
  options,
  size = "md",
  className,
}: SegmentedTabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/5 p-1 dark:border-white/10 dark:bg-white/5",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative inline-flex items-center gap-1.5 rounded-full px-3 font-medium transition-colors",
              size === "sm" ? "h-7 text-[12px]" : "h-9 text-[13px]",
              active ? "text-foreground" : "text-foreground/60 hover:text-foreground/85",
            )}
          >
            {active && (
              <motion.span
                layoutId={`tabs-${value}-bg`}
                className="absolute inset-0 rounded-full bg-background shadow-[0_2px_8px_-3px_rgba(0,0,0,0.18),inset_0_0_0_1px_var(--glass-border)] dark:bg-foreground/15"
                transition={{ type: "spring", stiffness: 360, damping: 32 }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {opt.icon}
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
