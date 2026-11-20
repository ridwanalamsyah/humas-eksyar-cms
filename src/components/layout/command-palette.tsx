"use client";

import { Command } from "cmdk";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
}

/** Isi pencarian panel: sama dengan menu sidebar, ditambah beberapa aksi. */
const ITEMS: { href: string; label: string; hint?: string }[] = [
  { href: "/content/new", label: "Tulis konten", hint: "Aksi" },
  { href: "/dashboard", label: "Beranda" },
  { href: "/content", label: "Konten" },
  { href: "/events", label: "Jadwal" },
  { href: "/media", label: "Media" },
  { href: "/settings/website", label: "Isi website" },
  { href: "/content/instagram", label: "Instagram" },
  { href: "/settings/skripsi", label: "Direktori skripsi" },
  { href: "/settings/members", label: "Anggota & peran" },
  { href: "/settings/kinerja", label: "Laporan" },
  { href: "/settings", label: "Pengaturan" },
  { href: "/profile/edit", label: "Profil saya" },
  { href: "/", label: "Lihat website" },
];

export function CommandPaletteTrigger({ open, setOpen }: Props) {
  // Pintasan Ctrl/⌘ + K tetap ada, tanpa ditampilkan di layar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
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
        className="hidden h-9 w-52 items-center gap-2 rounded-full bg-foreground/[0.05] px-3.5 text-[13px] text-foreground/60 transition-colors hover:bg-foreground/[0.08] sm:flex"
      >
        <Search className="size-4" strokeWidth={1.75} />
        Cari menu…
      </button>
      <CommandPalette open={open} setOpen={setOpen} />
    </>
  );
}

function CommandPalette({ open, setOpen }: Props) {
  const router = useRouter();
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
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/25 sm:px-4 sm:pt-[14vh]"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-dvh w-full flex-col overflow-hidden bg-white sm:h-auto sm:max-w-lg sm:rounded-2xl sm:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.25)]"
          >
            <Command label="Cari menu" className="flex min-h-0 flex-1 flex-col text-foreground">
              <div className="flex items-center gap-3 border-b border-foreground/10 px-4">
                <Search className="size-5 shrink-0 text-foreground/45" strokeWidth={1.75} />
                <Command.Input
                  autoFocus
                  placeholder="Cari menu"
                  className="search-input h-12 min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-foreground/45"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="min-h-11 shrink-0 text-[15px] font-semibold text-brand-600 sm:hidden"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Tutup"
                  className="hidden size-8 place-items-center rounded-full text-foreground/45 hover:bg-foreground/[0.05] hover:text-foreground sm:grid"
                >
                  <X className="size-4" />
                </button>
              </div>
              <Command.List className="min-h-0 flex-1 overflow-y-auto px-2 py-2 sm:max-h-[55vh]">
                <Command.Empty className="px-4 py-10 text-center text-[14px] text-foreground/60">
                  Menu tidak ditemukan.
                </Command.Empty>
                {ITEMS.map((it) => (
                  <Command.Item
                    key={it.href}
                    value={it.label}
                    onSelect={() => go(it.href)}
                    className="flex min-h-11 cursor-pointer items-center justify-between rounded-xl px-3 text-[15px] text-foreground/85 outline-none aria-selected:bg-foreground/[0.05] aria-selected:text-foreground"
                  >
                    {it.label}
                    {it.hint && <span className="text-[13px] text-foreground/45">{it.hint}</span>}
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
