"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Search } from "lucide-react";
import { ProdiLogo } from "./prodi-logo";
import { cn } from "@/lib/utils";
import { navGroups, prodi, type NavGroup } from "@/lib/site/prodi";

function groupActive(pathname: string, g: NavGroup) {
  const hrefs = [g.href, ...(g.items ?? []).map((i) => i.href)].map(
    (h) => h.split(/[?#]/)[0],
  );
  return hrefs.some((h) => pathname === h || pathname.startsWith(h + "/"));
}

/**
 * Navbar website prodi: mega menu ala apple.com di desktop (panel penuh
 * yang turun saat grup disorot), akordeon layar penuh di ponsel.
 */
export function SiteNavbar({ hidden = [] }: { hidden?: string[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const groups = navGroups.map((g) => ({
    ...g,
    items: g.items?.filter((i) => !hidden.includes(i.href)),
  }));
  const active = groups.find((g) => g.label === menu);

  // Tutup menu saat pindah halaman.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
    setMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMenu = (label: string | null) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 120);
  };

  return (
    <header className="sticky top-0 z-50" onMouseLeave={scheduleClose}>
      <div
        className={cn(
          "relative z-10 border-b border-accent/10 backdrop-blur-xl backdrop-saturate-150 transition-colors",
          open || menu ? "bg-canvas" : "bg-canvas/80",
        )}
      >
        <nav
          aria-label="Navigasi utama"
          className="mx-auto flex h-14 max-w-[1024px] items-center justify-between px-4 sm:px-6"
        >
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label={`${prodi.fullName}, beranda`}
          >
            <ProdiLogo size={30} priority />
            <span className="leading-none">
              <span className="block text-[14px] font-bold tracking-[-0.01em] text-label">
                Ekonomi Syariah
              </span>
              <span className="block pt-0.5 text-[10.5px] font-medium text-label-2">
                UIN SGD Bandung
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {groups.map((g) => {
              const isActive = groupActive(pathname, g);
              const cls = cn(
                "flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors",
                isActive || menu === g.label
                  ? "text-label"
                  : "text-label/70 hover:text-label",
              );
              return (
                <li
                  key={g.label}
                  onMouseEnter={() =>
                    openMenu(g.items?.length ? g.label : null)
                  }
                >
                  {g.items?.length ? (
                    <button
                      type="button"
                      className={cls}
                      aria-expanded={menu === g.label}
                      aria-controls="mega-menu"
                      onClick={() =>
                        openMenu(menu === g.label ? null : g.label)
                      }
                      onFocus={() => openMenu(g.label)}
                    >
                      {g.label}
                      <ChevronDown
                        className={cn(
                          "size-3.5 transition-transform duration-200",
                          menu === g.label && "rotate-180",
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={g.href}
                      className={cls}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {g.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link
              href="/prodi/cari"
              aria-label="Cari di website"
              className="grid size-9 place-items-center rounded-full text-label/70 transition-colors hover:bg-mist hover:text-label"
            >
              <Search className="size-[18px]" />
            </Link>
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

        {/* Mega menu desktop */}
        <AnimatePresence>
          {active?.items?.length ? (
            <motion.div
              id="mega-menu"
              key="mega"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="hidden overflow-hidden lg:block"
              onMouseEnter={() => openMenu(active.label)}
            >
              <motion.div
                key={active.label}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: 0.04 }}
                className="mx-auto grid max-w-[1024px] grid-cols-[200px_1fr] gap-10 px-6 pb-10 pt-6"
              >
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-label-3">
                    {active.label}
                  </p>
                  <Link
                    href={active.href}
                    className="mt-2 block text-[22px] font-bold tracking-[-0.02em] text-label hover:text-accent"
                  >
                    Lihat {active.label.toLowerCase()} ›
                  </Link>
                </div>
                <ul className="grid grid-cols-2 gap-x-8 gap-y-1">
                  {active.items.map((i) => (
                    <li key={i.href}>
                      <Link
                        href={i.href}
                        className="group block rounded-xl px-3 py-2.5 transition-colors hover:bg-mist"
                      >
                        <span className="block text-[15px] font-semibold text-label group-hover:text-accent">
                          {i.label}
                        </span>
                        {i.description && (
                          <span className="mt-0.5 block text-[13px] text-label-2">
                            {i.description}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Latar redup saat mega menu terbuka */}
      <AnimatePresence>
        {menu && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-14 hidden bg-navy/10 backdrop-blur-sm lg:block"
            onMouseEnter={scheduleClose}
            onClick={() => setMenu(null)}
          />
        )}
      </AnimatePresence>

      {/* Menu ponsel */}
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
            <ul className="px-8 pb-6 pt-4">
              <motion.li
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link
                  href="/"
                  className="block py-2.5 text-[26px] font-semibold tracking-[-0.02em] text-label"
                >
                  Beranda
                </Link>
              </motion.li>
              {groups.map((g, idx) => (
                <motion.li
                  key={g.label}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * (idx + 1), duration: 0.25 }}
                >
                  {g.items?.length ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={expanded === g.label}
                        onClick={() =>
                          setExpanded(expanded === g.label ? null : g.label)
                        }
                        className="flex w-full items-center justify-between py-2.5 text-left text-[26px] font-semibold tracking-[-0.02em] text-label"
                      >
                        {g.label}
                        <ChevronDown
                          className={cn(
                            "size-6 text-label-3 transition-transform",
                            expanded === g.label && "rotate-180",
                          )}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {expanded === g.label && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            {g.items.map((i) => (
                              <li key={i.href}>
                                <Link
                                  href={i.href}
                                  className="block py-2 pl-1 text-[17px] font-medium text-label-2"
                                >
                                  {i.label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={g.href}
                      className="block py-2.5 text-[26px] font-semibold tracking-[-0.02em] text-label"
                    >
                      {g.label}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 px-8 pb-10">
              <Link
                href="/prodi/cari"
                className="inline-block rounded-full bg-mist px-6 py-3 text-[15px] font-medium text-label"
              >
                Cari
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
