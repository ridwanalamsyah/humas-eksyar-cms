import { cn } from "@/lib/utils";

/** Judul section bergaya editorial: nomor/eyebrow emas + judul serif. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p
        className={cn(
          "flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.22em]",
          align === "center" && "justify-center",
          dark ? "text-saffron-300" : "text-saffron-600",
        )}
      >
        <span className={cn("h-px w-8", dark ? "bg-saffron-300" : "bg-saffron-500")} aria-hidden />
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-4 font-serif text-[clamp(1.75rem,1.3rem+1.6vw,2.6rem)] font-semibold leading-[1.15] text-balance",
          dark ? "text-paper" : "text-pine-800",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-[16px] leading-relaxed text-pretty", dark ? "text-pine-100/75" : "text-ink/65")}>
          {description}
        </p>
      )}
    </div>
  );
}
