"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { EksyarLogo } from "@/components/brand/eksyar-logo";
import { cn } from "@/lib/utils";
import { kontak, navLinks, prodi, utilityLinks } from "@/lib/site/prodi";

function isActive(pathname: string, href: string) {
  return href === "/prodi" ? pathname === "/prodi" : pathname.startsWith(href);
}

export function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tutup menu mobile saat pindah halaman.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden bg-pine-900 text-[12px] text-pine-100 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
          <p>
            {prodi.faculty} · {prodi.university}
          </p>
          <ul className="flex items-center gap-5">
            {utilityLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-saffron-300">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={cn(
          "border-b border-pine-800/10 bg-paper/95 backdrop-blur-sm transition-shadow",
          scrolled && "shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(7,39,32,0.25)]",
        )}
      >
        <nav aria-label="Navigasi utama" className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
          <Link href="/prodi" className="flex items-center gap-3">
            <EksyarLogo size={44} alt="Logo Program Studi Ekonomi Syariah" />
            <span className="leading-tight">
              <span className="block font-serif text-[17px] font-semibold text-pine-800">
                <span className="sm:hidden">{prodi.name}</span>
                <span className="hidden sm:inline">{prodi.fullName}</span>
              </span>
              <span className="block text-[11.5px] uppercase tracking-[0.12em] text-ink/55">
                {prodi.facultyShort} · {prodi.universityShort}
              </span>
            </span>
          </Link>

          <ul className="hidden items-center lg:flex">
            {navLinks.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative px-3.5 py-2 text-[14px] font-medium transition-colors",
                      active ? "text-pine-700" : "text-ink/70 hover:text-pine-700",
                    )}
                  >
                    {l.label}
                    {active && <span className="absolute inset-x-3.5 -bottom-[13px] h-[3px] bg-saffron-500" aria-hidden />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={kontak.pmbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center rounded-sm bg-pine-700 px-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-pine-800 sm:inline-flex"
            >
              Daftar PMB
            </a>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-sm text-pine-800 hover:bg-pine-50 lg:hidden"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div id="menu-mobile" className="border-t border-pine-800/10 bg-paper lg:hidden">
            <ul className="mx-auto max-w-7xl px-4 py-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      "block border-b border-pine-800/5 py-3 text-[15px] font-medium",
                      isActive(pathname, l.href) ? "text-pine-700" : "text-ink/80",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mx-auto max-w-7xl px-4 pb-4">
              <a
                href={kontak.pmbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 items-center justify-center rounded-sm bg-pine-700 text-sm font-semibold uppercase tracking-[0.08em] text-paper"
              >
                Daftar PMB
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
