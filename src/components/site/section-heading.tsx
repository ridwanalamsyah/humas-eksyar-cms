import { cn } from "@/lib/utils";

/**
 * Judul section: satu judul yang menyebut bendanya, dan (opsional) satu kalimat
 * pendek di bawahnya. Eyebrow hanya dipakai kalau menambah informasi.
 */
export function SectionHeading({
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
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {/* `eyebrow` sengaja tidak ditampilkan: judul sudah menyebut bendanya. */}
      <h2 className="text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-label text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-3 line-clamp-2 text-[16px] leading-[1.5] text-label-2 text-pretty sm:text-[18px]">
          {description}
        </p>
      )}
    </div>
  );
}
