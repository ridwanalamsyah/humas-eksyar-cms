"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown, Search } from "lucide-react";
import { ProdiLogo } from "./prodi-logo";
import { ProdiCommandPalette } from "./prodi-command-palette";
import { cn } from "@/lib/utils";
import { navGroups, prodi, type NavGroup } from "@/lib/site/prodi";

function cleanPath(href: string) {
  return href.split(/[?#]/)[0] || "/";
}

function isHomeActive(pathname: string) {
  return pathname === "/" || pathname === "/prodi";
}

function groupActive(pathname: string, g: NavGroup) {
  const hrefs = [g.href, ...(g.items ?? []).map((i) => i.href)].map(cleanPath);
  return hrefs.some(
    (h) => h !== "/" && h !== "/prodi" && (pathname === h || pathname.startsWith(h + "/")),
  );
}

function itemActive(pathname: string, href: string) {
  const h = cleanPath(href);
  return pathname === h || (h !== "/prodi" && pathname.startsWith(h + "/"));
}

/**
 * Navbar website prodi: mega menu bersih di desktop, akordeon layar penuh di ponsel,
 * dengan indikator halaman aktif yang jelas dan Command Palette (⌘K / Ctrl+K).
 */
export function SiteNavbar({ hidden = [] }: { hidden?: string[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [cmdOpen, setCmdOpen] = useState(false);
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
    setCmdOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setCmdOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setMenu(null);
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMenu = (label: string | null) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(label);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 130);
  };

  const homeCurrent = isHomeActive(pathname);
  const layananCurrent =
    pathname === "/prodi/layanan" || pathname.startsWith("/prodi/formulir");

  return (
    <>
      <header className="sticky top-0 z-50" onMouseLeave={scheduleClose}>
        <div
          className={cn(
            "relative z-10 border-b border-hairline backdrop-blur-xl backdrop-saturate-150 transition-colors",
            open || menu ? "bg-canvas" : "bg-canvas/90",
          )}
        >
          <nav
            aria-label="Navigasi utama"
            className="mx-auto flex h-16 max-w-[1080px] items-center justify-between gap-3 px-4 sm:px-6"
          >
            <Link
              href="/prodi"
              className="group flex shrink-0 items-center gap-2.5 rounded-full py-1 pr-2 transition-opacity hover:opacity-95"
              aria-label={`${prodi.fullName}, beranda`}
            >
              <ProdiLogo
                size={38}
                priority
                className="transition-transform duration-300 group-hover:scale-[1.04]"
              />
              <span className="leading-none">
                <span className="block text-[15px] font-bold tracking-[-0.015em] text-label">
                  {prodi.name}
                </span>
                <span className="mt-1 block text-[11px] font-medium text-label-2">
                  FEBI · {prodi.universityShort}
                </span>
              </span>
            </Link>

            <ul className="hidden items-center gap-1 lg:flex">
              <li onMouseEnter={() => openMenu(null)}>
                <Link
                  href="/prodi"
                  aria-current={homeCurrent ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13.5px] transition-all",
                    homeCurrent
                      ? "bg-accent font-semibold text-white shadow-xs"
                      : "font-medium text-label/80 hover:bg-mist hover:text-label",
                  )}
                >
                  Beranda
                </Link>
              </li>
              {groups.map((g) => {
                const isActive = groupActive(pathname, g);
                const isOpen = menu === g.label;
                const cls = cn(
                  "relative flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[13.5px] transition-all",
                  isActive
                    ? "bg-accent font-semibold text-white shadow-xs"
                    : isOpen
                      ? "bg-mist font-semibold text-label"
                      : "font-medium text-label/80 hover:bg-mist hover:text-label",
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
                        aria-expanded={isOpen}
                        aria-controls="mega-menu"
                        onClick={() => openMenu(isOpen ? null : g.label)}
                        onFocus={() => openMenu(g.label)}
                      >
                        {g.label}
                        <ChevronDown
                          className={cn(
                            "size-3.5 transition-transform duration-200",
                            isOpen && "rotate-180",
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

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setCmdOpen(true)}
                aria-label="Cari cepat di website (⌘K)"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-hairline bg-mist/70 px-3 text-[12.5px] font-medium text-label-2 transition-colors hover:border-accent/40 hover:bg-mist hover:text-label"
              >
                <Search className="size-3.5 text-label-2" />
                <span className="hidden sm:inline">Cari</span>
                <kbd className="hidden rounded border border-hairline bg-canvas/80 px-1.5 py-0.5 font-mono text-[10px] text-label-3 md:inline">
                  ⌘K
                </kbd>
              </button>
              <Link
                href="/prodi/layanan"
                aria-current={layananCurrent ? "page" : undefined}
                className={cn(
                  "hidden h-9 items-center gap-1 rounded-full px-3.5 text-[12.5px] font-semibold shadow-xs transition-colors md:inline-flex",
                  layananCurrent
                    ? "bg-navy text-white ring-2 ring-accent/35"
                    : "bg-accent text-white hover:bg-accent-strong",
                )}
              >
                Layanan
                <ArrowUpRight className="size-3.5" />
              </Link>
              <button
                type="button"
                className="relative -mr-1 grid size-10 place-items-center rounded-full hover:bg-mist lg:hidden"
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
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="hidden overflow-hidden border-t border-hairline lg:block"
                onMouseEnter={() => openMenu(active.label)}
              >
                <motion.div
                  key={active.label}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.03 }}
                  className="mx-auto grid max-w-[1080px] grid-cols-[220px_1fr] gap-10 px-6 pb-8 pt-6"
                >
                  <div className="flex flex-col justify-between rounded-2xl bg-mist/70 p-5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-accent">
                        Menu {active.label}
                      </p>
                      <Link
                        href={active.href}
                        className="mt-2 block text-[20px] font-bold leading-snug tracking-[-0.02em] text-label hover:text-accent"
                      >
                        Halaman Utama {active.label} ›
                      </Link>
                    </div>
                    <p className="mt-4 text-[12px] leading-relaxed text-label-2">
                      {prodi.fullName} · FEBI {prodi.university}
                    </p>
                  </div>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 self-start">
                    {active.items.map((i) => {
                      const subActive =
                        !i.href.includes("#") && itemActive(pathname, i.href);
                      return (
                        <li key={i.href}>
                          <Link
                            href={i.href}
                            aria-current={subActive ? "page" : undefined}
                            className={cn(
                              "group block rounded-xl border px-3.5 py-2.5 transition-colors",
                              subActive
                                ? "border-accent/35 bg-accent-soft/75"
                                : "border-transparent hover:border-hairline hover:bg-mist/70",
                            )}
                          >
                            <span
                              className={cn(
                                "flex items-center gap-2 text-[14.5px] font-semibold group-hover:text-accent",
                                subActive ? "text-accent" : "text-label",
                              )}
                            >
                              {subActive && (
                                <span
                                  aria-hidden
                                  className="size-1.5 rounded-full bg-accent"
                                />
                              )}
                              {i.label}
                            </span>
                            {i.description && (
                              <span className="mt-0.5 block text-[12.5px] leading-snug text-label-2">
                                {i.description}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
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
              className="fixed inset-0 top-16 hidden bg-navy/15 backdrop-blur-xs lg:block"
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
              className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-canvas lg:hidden"
            >
              <ul className="divide-y divide-hairline px-6 pb-6 pt-3">
                <motion.li
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Link
                    href="/prodi"
                    aria-current={homeCurrent ? "page" : undefined}
                    className={cn(
                      "block py-3 text-[21px] font-semibold tracking-[-0.02em]",
                      homeCurrent ? "text-accent" : "text-label",
                    )}
                  >
                    Beranda
                  </Link>
                </motion.li>
                {groups.map((g, idx) => {
                  const isActive = groupActive(pathname, g);
                  return (
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
                              setExpanded(
                                expanded === g.label ? null : g.label,
                              )
                            }
                            className={cn(
                              "flex w-full items-center justify-between py-3 text-left text-[21px] font-semibold tracking-[-0.02em]",
                              isActive ? "text-accent" : "text-label",
                            )}
                          >
                            {g.label}
                            <ChevronDown
                              className={cn(
                                "size-5 text-label-3 transition-transform",
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
                                className="overflow-hidden pb-3"
                              >
                                {g.items.map((i) => {
                                  const subActive =
                                    !i.href.includes("#") &&
                                    itemActive(pathname, i.href);
                                  return (
                                    <li key={i.href}>
                                      <Link
                                        href={i.href}
                                        className={cn(
                                          "block rounded-xl py-2 pl-3 text-[16px] font-medium hover:text-accent",
                                          subActive
                                            ? "bg-accent-soft/75 font-semibold text-accent"
                                            : "text-label-2",
                                        )}
                                      >
                                        {i.label}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={g.href}
                          className={cn(
                            "block py-3 text-[21px] font-semibold tracking-[-0.02em]",
                            isActive ? "text-accent" : "text-label",
                          )}
                        >
                          {g.label}
                        </Link>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
              <div className="flex flex-wrap gap-3 px-6 pb-10">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setCmdOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-hairline bg-mist px-5 py-2.5 text-[14px] font-semibold text-label"
                >
                  <Search className="size-4" /> Cari Cepat
                </button>
                <Link
                  href="/prodi/layanan"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-white"
                >
                  Layanan & Akademik <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <ProdiCommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
}
