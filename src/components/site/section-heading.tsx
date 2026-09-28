import { cn } from "@/lib/utils";

/** Judul section gaya Apple: eyebrow kecil, headline besar rapat, deskripsi abu. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl", className)}>
      {eyebrow && <p className="font-script text-[clamp(1.75rem,1.4rem+1vw,2.4rem)] leading-none text-accent">{eyebrow}</p>}
      <h2 className="mt-2 text-[clamp(2rem,1.4rem+2.4vw,3.4rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-label text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[clamp(1.05rem,1rem+0.3vw,1.3rem)] leading-[1.45] text-label-2 text-pretty">{description}</p>
      )}
    </div>
  );
}
