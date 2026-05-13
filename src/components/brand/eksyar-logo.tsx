import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: number;
  monochrome?: boolean;
};

/**
 * Eksyar monogram logo placeholder (ES). Replace with official SVG when received.
 * Inspired by Islamic geometric pattern + initial letters.
 */
export function EksyarLogo({ className, size = 40, monochrome = false }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-label="Eksyar"
    >
      <defs>
        <linearGradient id="eks-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--brand-400)" />
          <stop offset="1" stopColor="var(--brand-700)" />
        </linearGradient>
        <linearGradient id="eks-shine" x1="0" y1="0" x2="64" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="white" stopOpacity="0.4" />
          <stop offset="0.4" stopColor="white" stopOpacity="0.05" />
          <stop offset="1" stopColor="white" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* outer rounded squircle */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="18"
        fill={monochrome ? "currentColor" : "url(#eks-grad)"}
      />
      {/* inner geometric octagon */}
      <path
        d="M32 12 L46 18 L52 32 L46 46 L32 52 L18 46 L12 32 L18 18 Z"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
      />
      {/* monogram E */}
      <path
        d="M22 22 L34 22 M22 22 L22 42 M22 32 L31 32 M22 42 L34 42"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* monogram S overlay */}
      <path
        d="M40 24 Q44 22 44 26 Q44 30 38 30 Q34 30 34 34 Q34 38 38 38 Q44 38 44 36"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* specular shine */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="18"
        fill="url(#eks-shine)"
        opacity="0.6"
      />
    </svg>
  );
}
