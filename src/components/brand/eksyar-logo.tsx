import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: number;
  /**
   * Optional alt label. Defaults to "Humas Eksyar".
   */
  alt?: string;
};

/**
 * Eksyar brand logo. Uses the official PNG asset from `public/eksyar-logo.png`.
 * The asset is a 512×512 padded transparent PNG; downstream consumers control
 * the rendered box via the `size` prop. The image preserves its aspect ratio
 * inside the box via `object-contain`.
 */
export function EksyarLogo({ className, size = 40, alt = "Humas Eksyar" }: LogoProps) {
  return (
    <Image
      src="/eksyar-logo.png"
      alt={alt}
      width={size}
      height={size}
      priority={size >= 48}
      className={cn("object-contain", className)}
    />
  );
}
