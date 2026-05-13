"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type GlassCardProps = HTMLMotionProps<"div"> & {
  variant?: "regular" | "thick" | "thin";
  specular?: boolean;
  hover?: boolean;
};

export function GlassCard({
  children,
  className,
  variant = "regular",
  specular = true,
  hover = false,
  ...props
}: GlassCardProps) {
  const variantClass =
    variant === "thick" ? "glass-thick" : variant === "thin" ? "glass-thin" : "glass-regular";

  return (
    <motion.div
      className={cn(
        variantClass,
        specular && "specular-edge",
        "rounded-2xl",
        hover && "transition-shadow",
        className,
      )}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
