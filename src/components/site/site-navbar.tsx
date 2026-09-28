"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { EksyarLogo } from "@/components/brand/eksyar-logo";
import { cn } from "@/lib/utils";
import { navLinks, prodi, kontak } from "@/lib/site/prodi";

export function SiteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav
        aria-label="Navigasi utama"
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-3 py-2 transition-all duration-300 sm:px-4",
          scrolled || open ? "glass-thick" : "border border-transparent",
        )}
      >
        <Link href="/prodi" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <EksyarLogo size={36} alt="Logo Ekonomi Syariah" />
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-semibold tracking-tight">
              {prodi.name}
            </span>
            <span className="block text-[11px] text-foreground/55">{prodi.university}</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="rounded-xl px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={kontak.pmbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-10 items-center gap-1.5 rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(13,148,136,0.6)] transition hover:brightness-110 sm:inline-flex"
          >
            Daftar Sekarang
            <ArrowUpRight className="size-4" />
          </a>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl text-foreground/80 hover:bg-foreground/5 lg:hidden"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="glass-thick mx-auto mt-2 max-w-6xl rounded-2xl p-3 lg:hidden"
          >
            <ul className="flex flex-col">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-[15px] font-medium hover:bg-foreground/5"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={kontak.pmbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 text-sm font-semibold text-white"
            >
              Daftar Sekarang
              <ArrowUpRight className="size-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
