"use client";

import Link from "next/link";
import { ChevronRight, Search, Bell, LogOut } from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { EksyarLogo } from "@/components/brand/eksyar-logo";
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
    <header className="flex items-center justify-between gap-3 lg:justify-end">
      <Link
        href="/dashboard"
        className="group flex items-center gap-2.5 lg:hidden"
        aria-label="Beranda"
      >
        <EksyarLogo size={34} />
        <div className="leading-tight">
          <p className="text-[15px] font-semibold tracking-tight">
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
          className="grid size-9 place-items-center rounded-lg text-foreground/60 transition-colors hover:bg-foreground/[0.05] hover:text-foreground sm:hidden"
        >
          <Search className="size-4" strokeWidth={1.75} />
        </button>
        <Link
          href="/notifications"
          className="relative grid size-9 place-items-center rounded-lg text-foreground/60 transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
          aria-label={`Notifikasi${unread > 0 ? ` (${unread} baru)` : ""}`}
        >
          <Bell className="size-4" strokeWidth={1.75} />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-gold-500 px-1 text-[9px] font-semibold leading-none text-ink-900 ring-2 ring-background">
              {unread}
            </span>
          )}
        </Link>
        {member ? (
          <div className="ml-1 flex items-center gap-1">
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-lg py-1 pr-2 pl-1 text-foreground/85 transition-colors hover:bg-foreground/[0.05] lg:hidden"
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
                className="grid size-9 place-items-center rounded-lg text-foreground/60 transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
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
    </header>
  );
}
