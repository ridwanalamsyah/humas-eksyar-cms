"use client";

import { motion } from "motion/react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "transition-[color,background,box-shadow,transform] duration-200",
    "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "text-white",
          "bg-gradient-to-b from-brand-500 to-brand-600",
          "shadow-[0_8px_24px_-8px_rgba(13,148,136,0.5),inset_0_1px_0_0_rgba(255,255,255,0.4)]",
          "hover:brightness-110 hover:shadow-[0_12px_32px_-10px_rgba(13,148,136,0.6),inset_0_1px_0_0_rgba(255,255,255,0.5)]",
          "active:brightness-95",
          "dark:from-brand-400 dark:to-brand-500",
        ].join(" "),
        secondary: [
          "glass-regular text-foreground specular-edge",
          "hover:bg-[color-mix(in_oklab,white_72%,transparent)]",
          "dark:hover:bg-[color-mix(in_oklab,#14201a_72%,transparent)]",
        ].join(" "),
        ghost: [
          "text-foreground bg-transparent",
          "hover:glass-thin",
        ].join(" "),
        gold: [
          "text-ink-soft",
          "bg-gradient-to-b from-gold-400 to-gold-500",
          "shadow-[0_8px_24px_-8px_rgba(232,148,34,0.5),inset_0_1px_0_0_rgba(255,255,255,0.4)]",
          "hover:brightness-110",
        ].join(" "),
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-xl",
        md: "h-11 px-5 text-sm rounded-2xl",
        lg: "h-13 px-7 text-base rounded-2xl",
        icon: "size-10 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

const MotionSlot = motion.create(Slot);
const MotionButton = motion.create("button");

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <MotionSlot
          ref={ref}
          className={cn(buttonVariants({ variant, size, className }))}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
          {...(props as Record<string, unknown>)}
        />
      );
    }
    return (
      <MotionButton
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        {...(props as Record<string, unknown>)}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
