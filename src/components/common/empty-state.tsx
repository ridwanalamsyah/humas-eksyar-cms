import { GlassCard } from "@/components/ui/glass-card";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <GlassCard variant="thin" className="flex flex-col items-center gap-3 p-10 text-center">
      {icon && (
        <div className="grid place-items-center rounded-2xl bg-foreground/5 p-3 dark:bg-white/5">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="max-w-sm text-pretty text-sm text-foreground/65">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </GlassCard>
  );
}
