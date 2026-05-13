"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Hydration: avoid theme mismatch flicker on first paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "system", icon: Monitor, label: "System" },
    { value: "dark", icon: Moon, label: "Dark" },
  ] as const;

  return (
    <div
      className={cn(
        "glass-thin specular-edge inline-flex items-center gap-1 rounded-full p-1",
        "border border-[var(--glass-border)]",
      )}
      role="radiogroup"
      aria-label="Theme"
    >
      {options.map(({ value, icon: Icon, label }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            onClick={() => setTheme(value)}
            className={cn(
              "relative flex size-8 items-center justify-center rounded-full text-foreground/70 transition-colors",
              "hover:text-foreground",
              active && "text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="theme-toggle-active"
                className="absolute inset-0 rounded-full bg-[color-mix(in_oklab,var(--brand-500)_18%,transparent)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="relative z-10 size-4" strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
  );
}
