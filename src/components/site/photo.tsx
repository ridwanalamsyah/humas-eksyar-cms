import { cn } from "@/lib/utils";

/**
 * Foto potret/lanskap dengan placeholder siluet netral saat foto belum
 * diunggah dari CMS. Bentuk persegi panjang membulat — bukan lingkaran.
 */
export function Photo({
  src,
  alt,
  ratio = "portrait",
  className,
}: {
  src?: string | null;
  alt: string;
  ratio?: "portrait" | "landscape";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#e9f2f3]",
        ratio === "portrait" ? "aspect-[4/5]" : "aspect-[16/10]",
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <svg
          viewBox="0 0 200 250"
          preserveAspectRatio="xMidYMax meet"
          className="absolute inset-x-0 bottom-0 h-[82%] w-full text-[#cfe2e5] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          aria-hidden
        >
          <circle cx="100" cy="92" r="44" fill="currentColor" />
          <path
            d="M18 250c0-50 36.7-86 82-86s82 36 82 86z"
            fill="currentColor"
          />
        </svg>
      )}
    </div>
  );
}
