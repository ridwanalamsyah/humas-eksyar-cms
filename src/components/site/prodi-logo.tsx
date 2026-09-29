import Image from "next/image";
import { prodi } from "@/lib/site/prodi";
import { cn } from "@/lib/utils";

/** Logo resmi Program Studi Ekonomi Syariah (bukan logo Humas/CMS). */
export function ProdiLogo({
  size = 40,
  className,
  priority,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={prodi.logo}
      alt={`Logo ${prodi.fullName}`}
      width={size}
      height={size}
      priority={priority}
      className={cn("rounded-full", className)}
    />
  );
}
