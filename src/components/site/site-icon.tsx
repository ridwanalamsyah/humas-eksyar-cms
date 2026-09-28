import {
  Award,
  BookOpenText,
  Briefcase,
  Building2,
  Cpu,
  Globe2,
  HandHeart,
  Landmark,
  LineChart,
  Scale,
  ShieldCheck,
  Store,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Peta nama ikon (string di `lib/site/prodi.ts`) → komponen Lucide. */
const ICONS: Record<string, LucideIcon> = {
  Award,
  BookOpenText,
  Briefcase,
  Building2,
  Cpu,
  Globe2,
  HandHeart,
  Landmark,
  LineChart,
  Scale,
  ShieldCheck,
  Store,
  TrendingUp,
  Users,
};

export function SiteIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Sparkle;
  return <Icon className={className} strokeWidth={1.75} aria-hidden />;
}

function Sparkle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M12 3v18M3 12h18" />
    </svg>
  );
}
