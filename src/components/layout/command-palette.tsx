"use client";

import { Command } from "cmdk";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Sparkles,
  PenLine,
  CalendarDays,
  Users,
  Trophy,
  ImageIcon,
  ShieldCheck,
  Zap,
  Moon,
  Sun,
  Hash,
} from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export function CommandPaletteTrigger({ open, setOpen }: Props) {
  // Global keyboard shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-10 items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] pl-3 pr-2 text-sm text-foreground/55 transition-colors hover:bg-foreground/[0.07] dark:border-white/10 dark:bg-white/[0.04] sm:flex"
      >
        <Search className="size-4" strokeWidth={1.75} />
        <span className="pr-3">Cari konten, anggota, kegiatan…</span>
        <kbd className="rounded-md border border-foreground/15 bg-foreground/5 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-foreground/65 dark:border-white/10 dark:bg-white/5">
          ⌘K
        </kbd>
      </button>

      <CommandPalette open={open} setOpen={setOpen} />
    </>
  );
}

function CommandPalette({ open, setOpen }: Props) {
  const router = useRouter();
  const { setTheme } = useTheme();

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 pt-[14vh] backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "w-full max-w-xl overflow-hidden rounded-3xl",
              "glass-thick specular-edge ring-1 ring-foreground/10 dark:ring-white/10",
              "shadow-[0_40px_120px_-30px_rgba(13,148,136,0.45)]",
            )}
          >
            <Command label="Command Palette" className="text-foreground">
              <div className="flex items-center gap-2 border-b border-foreground/10 px-4 dark:border-white/10">
                <Search className="size-4 text-foreground/55" strokeWidth={1.75} />
                <Command.Input
                  autoFocus
                  placeholder="Cari atau ketik perintah…"
                  className="h-12 w-full bg-transparent text-[15px] outline-none placeholder:text-foreground/45"
                />
                <kbd className="rounded-md border border-foreground/10 bg-foreground/5 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-foreground/55 dark:border-white/10 dark:bg-white/5">
                  esc
                </kbd>
              </div>
              <Command.List className="max-h-[55vh] overflow-y-auto p-2">
                <Command.Empty className="px-4 py-12 text-center text-sm text-foreground/55">
                  Tidak ditemukan. Coba kata lain.
                </Command.Empty>

                <Command.Group heading="Aksi cepat" className="cmd-group">
                  <CmdItem onSelect={() => go("/captions/playground")} icon={<Sparkles className="size-4 text-gold-500" />} label="AI Caption Generator" hint="Generate caption baru" />
                  <CmdItem onSelect={() => go("/content/new")} icon={<PenLine className="size-4 text-brand-500" />} label="Konten Baru" hint="Tulis postingan baru" />
                  <CmdItem onSelect={() => go("/calendar")} icon={<CalendarDays className="size-4 text-sky-500" />} label="Lihat Kalender" />
                  <CmdItem onSelect={() => go("/media")} icon={<ImageIcon className="size-4 text-violet-500" />} label="Buka Media Library" />
                </Command.Group>

                <Command.Group heading="Navigasi" className="cmd-group">
                  <CmdItem onSelect={() => go("/")} icon={<Zap className="size-4" />} label="Dashboard" />
                  <CmdItem onSelect={() => go("/content")} icon={<PenLine className="size-4" />} label="Konten" />
                  <CmdItem onSelect={() => go("/calendar")} icon={<CalendarDays className="size-4" />} label="Kalender" />
                  <CmdItem onSelect={() => go("/members")} icon={<Users className="size-4" />} label="Anggota" />
                  <CmdItem onSelect={() => go("/divisions")} icon={<Hash className="size-4" />} label="Divisi" />
                  <CmdItem onSelect={() => go("/badges")} icon={<Trophy className="size-4" />} label="Badge & Quest" />
                  <CmdItem onSelect={() => go("/leaderboard")} icon={<Trophy className="size-4" />} label="Leaderboard" />
                  <CmdItem onSelect={() => go("/approval")} icon={<ShieldCheck className="size-4" />} label="Approval Queue" />
                  <CmdItem onSelect={() => go("/analytics")} icon={<Zap className="size-4" />} label="Insight" />
                  <CmdItem onSelect={() => go("/profile")} icon={<Users className="size-4" />} label="Profil saya" />
                  <CmdItem onSelect={() => go("/settings")} icon={<Hash className="size-4" />} label="Settings" />
                </Command.Group>

                <Command.Group heading="Tampilan" className="cmd-group">
                  <CmdItem onSelect={() => { setTheme("light"); setOpen(false); }} icon={<Sun className="size-4" />} label="Mode terang" />
                  <CmdItem onSelect={() => { setTheme("dark"); setOpen(false); }} icon={<Moon className="size-4" />} label="Mode gelap" />
                  <CmdItem onSelect={() => { setTheme("system"); setOpen(false); }} icon={<Zap className="size-4" />} label="Ikuti sistem" />
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CmdItem({
  onSelect,
  icon,
  label,
  hint,
}: {
  onSelect: () => void;
  icon?: React.ReactNode;
  label: string;
  hint?: string;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-foreground/85 outline-none aria-selected:bg-foreground/[0.06] dark:aria-selected:bg-white/[0.06]"
    >
      <span className="grid size-7 place-items-center rounded-lg bg-foreground/[0.05] text-foreground/85 dark:bg-white/[0.05]">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {hint && <span className="text-[11px] text-foreground/55">{hint}</span>}
    </Command.Item>
  );
}
