"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ProdiLogo } from "./prodi-logo";
import { cn } from "@/lib/utils";
import { kontak, navLinks, prodi } from "@/lib/site/prodi";

function isActive(pathname: string, href: string) {
  return href === "/prodi" ? pathname === "/prodi" : pathname.startsWith(href);
}

export function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Tutup menu saat pindah halaman.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  // Kunci scroll saat menu mobile terbuka.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "border-b border-accent/10 backdrop-blur-xl backdrop-saturate-150 transition-colors",
          open ? "bg-canvas" : "bg-canvas/80",
        )}
      >
        <nav aria-label="Navigasi utama" className="mx-auto flex h-14 max-w-[1024px] items-center justify-between px-4 sm:px-6">
          <Link href="/prodi" className="flex items-center gap-2" aria-label={`${prodi.fullName} — beranda`}>
            <ProdiLogo size={30} priority />
            <span className="leading-none">
              <span className="block text-[14px] font-bold tracking-[-0.01em] text-label">Ekonomi Syariah</span>
              <span className="block pt-0.5 text-[10.5px] font-medium text-label-2">UIN SGD Bandung</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-6 lg:flex">
            {navLinks.slice(1).map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(pathname, l.href) ? "page" : undefined}
                  className={cn(
                    "text-[13px] font-medium transition-colors",
                    isActive(pathname, l.href) ? "text-label" : "text-label/70 hover:text-label",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={kontak.pmbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-accent px-4 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-accent-strong sm:inline-block"
            >
              Daftar
            </a>
            <button
              type="button"
              className="relative -mr-2 grid size-10 place-items-center lg:hidden"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className={cn(
                  "absolute h-[1.5px] w-[17px] rounded bg-label transition-transform duration-300",
                  open ? "rotate-45" : "-translate-y-[4px]",
                )}
              />
              <span
                className={cn(
                  "absolute h-[1.5px] w-[17px] rounded bg-label transition-transform duration-300",
                  open ? "-rotate-45" : "translate-y-[4px]",
                )}
              />
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-14 overflow-y-auto bg-canvas lg:hidden"
          >
            <ul className="px-10 pt-6">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.25 }}
                >
                  <Link href={l.href} className="block py-2.5 text-[28px] font-semibold tracking-[-0.02em] text-label">
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="px-10 pt-6">
              <a
                href={kontak.pmbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-white"
              >
                Daftar Mahasiswa Baru
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
