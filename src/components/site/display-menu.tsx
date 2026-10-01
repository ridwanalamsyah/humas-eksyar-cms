"use client";

import { Type } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useSitePrefs, type SitePrefs } from "./site-shell";

/** Menu "Tampilan": ukuran teks, kontras, mode gelap, hemat data. */
export function DisplayMenu() {
  const { prefs, set } = useSitePrefs();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) =>
      !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Pengaturan tampilan"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid size-9 place-items-center rounded-full text-label/70 transition-colors hover:bg-mist hover:text-label"
      >
        <Type className="size-[18px]" />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-72 rounded-[20px] border border-hairline bg-canvas p-4 shadow-[0_24px_48px_-16px_rgba(22,58,69,0.35)]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-label-3">
            Tema
          </p>
          <div className="mt-2">
            <Seg
              prefs={prefs}
              set={set}
              k="theme"
              options={[
                ["light", "Terang"],
                ["dark", "Gelap"],
                ["system", "Otomatis"],
              ]}
            />
          </div>
          <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.06em] text-label-3">
            Ukuran teks
          </p>
          <div className="mt-2">
            <Seg
              prefs={prefs}
              set={set}
              k="text"
              options={[
                ["normal", "Normal"],
                ["lg", "Besar"],
              ]}
            />
          </div>
          <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.06em] text-label-3">
            Kontras
          </p>
          <div className="mt-2">
            <Seg
              prefs={prefs}
              set={set}
              k="contrast"
              options={[
                ["normal", "Normal"],
                ["high", "Tinggi"],
              ]}
            />
          </div>
          <label className="mt-4 flex items-center justify-between gap-3 text-[14px] text-label">
            Hemat data & kurangi animasi
            <input
              type="checkbox"
              checked={prefs.hemat}
              onChange={(e) => set({ hemat: e.target.checked })}
              className="size-4"
            />
          </label>
        </div>
      )}
    </div>
  );
}

function Seg<K extends keyof SitePrefs>({
  prefs,
  set,
  k,
  options,
}: {
  prefs: SitePrefs;
  set: (p: Partial<SitePrefs>) => void;
  k: K;
  options: [SitePrefs[K], string][];
}) {
  return (
    <div className="flex rounded-full bg-mist p-1">
      {options.map(([v, l]) => (
        <button
          key={String(v)}
          type="button"
          aria-pressed={prefs[k] === v}
          onClick={() => set({ [k]: v } as Partial<SitePrefs>)}
          className={cn(
            "flex-1 rounded-full px-3 py-1.5 text-[13px] font-semibold",
            prefs[k] === v ? "bg-canvas text-label shadow-sm" : "text-label-2",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
