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
          "text-white bg-brand-600 hover:bg-brand-700",
          "dark:bg-brand-500 dark:hover:bg-brand-400 dark:text-ink-deep",
        ].join(" "),
        secondary: [
          "border border-foreground/10 bg-background text-foreground",
          "hover:bg-foreground/[0.04] dark:border-white/10",
        ].join(" "),
        ghost: [
          "text-foreground bg-transparent",
          "hover:bg-foreground/[0.05]",
        ].join(" "),
        gold: [
          "text-ink-soft",
          "bg-gold-400 hover:bg-gold-500",
        ].join(" "),
      },
      size: {
        sm: "h-8 px-3 text-[13px] rounded-lg",
        md: "h-10 px-4 text-sm rounded-xl",
        lg: "h-12 px-6 text-base rounded-xl",
        icon: "size-9 rounded-xl",
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
