import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-[length:var(--font-h2)] font-semibold leading-[1.1] tracking-tight text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[15px] leading-relaxed text-foreground/65 text-pretty">
          {description}
        </p>
      )}
    </div>
  );
}
