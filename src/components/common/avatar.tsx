import { cn } from "@/lib/utils";
import type { Member } from "@/lib/data/types";

interface AvatarProps {
  member: Pick<Member, "name" | "initials" | "avatarEmoji" | "accentHue">;
  size?: number;
  ring?: boolean;
  className?: string;
}

export function Avatar({ member, size = 36, ring = true, className }: AvatarProps) {
  const style = {
    width: size,
    height: size,
    background: `conic-gradient(from 220deg at 50% 50%, hsl(${member.accentHue} 70% 70% / 0.85), hsl(${member.accentHue + 30} 80% 60% / 0.85), hsl(${member.accentHue} 70% 70% / 0.85))`,
    fontSize: size * 0.45,
  };
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        ring && "ring-1 ring-inset ring-white/40 dark:ring-white/15",
        className,
      )}
      style={style}
      aria-label={member.name}
    >
      <span className="relative z-[1] select-none drop-shadow-sm">
        {member.avatarEmoji ?? member.initials}
      </span>
      {ring && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-black/20 mix-blend-overlay"
        />
      )}
    </span>
  );
}

export function AvatarStack({
  members,
  max = 4,
  size = 28,
}: {
  members: AvatarProps["member"][];
  max?: number;
  size?: number;
}) {
  const visible = members.slice(0, max);
  const overflow = members.length - visible.length;
  return (
    <div className="flex -space-x-2">
      {visible.map((m, i) => (
        <span key={i} className="rounded-full ring-2 ring-background">
          <Avatar member={m} size={size} ring={false} />
        </span>
      ))}
      {overflow > 0 && (
        <span
          className="inline-flex items-center justify-center rounded-full bg-foreground/10 ring-2 ring-background"
          style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
