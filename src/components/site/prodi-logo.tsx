import Image from "next/image";
import { prodi } from "@/lib/site/prodi";
import { cn } from "@/lib/utils";

/** Logo resmi Program Studi Ekonomi Syariah (lingkaran dengan tepi tipis). */
export function ProdiLogo({
  size = 40,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-black/10",
        className,
      )}
    >
      <Image
        src={prodi.logo}
        alt={`Logo ${prodi.fullName} ${prodi.university}`}
        width={size}
        height={size}
        sizes={`${size}px`}
        priority={priority}
        className="size-full object-contain"
      />
    </span>
  );
}
