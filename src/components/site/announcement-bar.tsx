"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

/** Pita pengumuman di atas website; bisa ditutup (diingat per pengumuman). */
export function AnnouncementBar({
  text,
  href,
}: {
  text: string;
  href?: string;
}) {
  const key = `eksyar-banner:${text}`;
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHidden(localStorage.getItem(key) === "1");
    } catch {
      setHidden(false);
    }
  }, [key]);
  if (hidden) return null;

  const external = href && /^https?:\/\//.test(href);
  const label = (
    <>
      <span className="mr-2 rounded-full bg-sand px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-navy">
        Info
      </span>
      {text}
      {href && (
        <span className="ml-1.5 font-bold underline-offset-2 group-hover:underline">
          Selengkapnya ›
        </span>
      )}
    </>
  );
  return (
    <div data-print-hide className="relative bg-navy text-white">
      <div className="mx-auto flex max-w-[1024px] items-center justify-center px-10 py-2 text-center text-[13px] font-medium">
        {href ? (
          external ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              {label}
            </a>
          ) : (
            <Link href={href} className="group">
              {label}
            </Link>
          )
        ) : (
          <span>{label}</span>
        )}
      </div>
      <button
        type="button"
        aria-label="Tutup pengumuman"
        onClick={() => {
          setHidden(true);
          try {
            localStorage.setItem(key, "1");
          } catch {
            /* abaikan */
          }
        }}
        className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
