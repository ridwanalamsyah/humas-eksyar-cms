"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight, Search, Bell, LogOut } from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { EksyarLogo } from "@/components/brand/eksyar-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/common/avatar";
import { CommandPaletteTrigger } from "@/components/layout/command-palette";
import type { Member } from "@/lib/data/types";

interface AppHeaderProps {
  /** Pass null on guest pages */
  member?: Member | null;
  /** Bell unread count */
  unread?: number;
}

export function AppHeader({ member, unread = 0 }: AppHeaderProps) {
  const [openSearch, setOpenSearch] = useState(false);
  const { status } = useSession();
  const isAuthed = status === "authenticated";

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="flex items-center justify-between gap-3"
    >
      <Link
        href="/"
        className="group flex items-center gap-3"
        aria-label="Beranda"
      >
        <EksyarLogo size={42} />
        <div className="leading-tight">
          <p className="font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-brand-700 dark:group-hover:text-brand-300">
            Humas Eksyar
          </p>
          <p className="hidden text-[12px] text-foreground/55 sm:block">
            Ekonomi Syariah · UIN SGD
          </p>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <CommandPaletteTrigger open={openSearch} setOpen={setOpenSearch} />
        <button
          type="button"
          aria-label="Cari"
          onClick={() => setOpenSearch(true)}
          className="grid size-10 place-items-center rounded-full border border-foreground/10 bg-foreground/[0.04] text-foreground/65 transition-colors hover:bg-foreground/[0.07] dark:border-white/10 dark:bg-white/[0.04] sm:hidden"
        >
          <Search className="size-4" strokeWidth={1.75} />
        </button>
        <Link
          href="/notifications"
          className="relative grid size-10 place-items-center rounded-full border border-foreground/10 bg-foreground/[0.04] text-foreground/65 transition-colors hover:bg-foreground/[0.07] dark:border-white/10 dark:bg-white/[0.04]"
          aria-label={`Notifikasi${unread > 0 ? ` (${unread} baru)` : ""}`}
        >
          <Bell className="size-4" strokeWidth={1.75} />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-gold-500 px-1 text-[9px] font-semibold leading-none text-ink-900 ring-2 ring-background">
              {unread}
            </span>
          )}
        </Link>
        <ThemeToggle />
        {member ? (
          <div className="ml-1 flex items-center gap-1">
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] py-1 pr-3 pl-1 text-foreground/85 transition-colors hover:bg-foreground/[0.07] dark:border-white/10 dark:bg-white/[0.04]"
            >
              <Avatar member={member} size={30} ring={false} />
              <span className="hidden text-sm font-medium md:block">
                {member.name.split(" ")[0]}
              </span>
            </Link>
            {isAuthed && (
              <button
                type="button"
                onClick={() => signOut({ redirectTo: "/login" })}
                aria-label="Keluar"
                title="Keluar"
                className="grid size-10 place-items-center rounded-full border border-foreground/10 bg-foreground/[0.04] text-foreground/65 transition-colors hover:bg-foreground/[0.07] hover:text-foreground/90 dark:border-white/10 dark:bg-white/[0.04]"
              >
                <LogOut className="size-4" strokeWidth={1.75} />
              </button>
            )}
          </div>
        ) : (
          <Button asChild variant="ghost" size="sm">
            <Link href="/login" aria-label="Masuk">
              Masuk <ChevronRight className="size-4" strokeWidth={1.75} />
            </Link>
          </Button>
        )}
      </div>
    </motion.header>
  );
}
