import Image from "next/image";
import { prodi } from "@/lib/site/prodi";
import { cn } from "@/lib/utils";

/** Logo resmi Program Studi Ekonomi Syariah (transparan adaptif tanpa kotak putih). */
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
        "relative inline-flex shrink-0 items-center justify-center bg-transparent",
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
