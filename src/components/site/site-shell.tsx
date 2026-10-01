"use client";

import { MotionConfig } from "motion/react";
import { createContext, useContext, useEffect, useState } from "react";

export type SitePrefs = {
  theme: "light" | "dark" | "system";
  text: "normal" | "lg";
  contrast: "normal" | "high";
  hemat: boolean;
};
const DEFAULT: SitePrefs = {
  theme: "light",
  text: "normal",
  contrast: "normal",
  hemat: false,
};
const KEY = "eksyar-prefs";

const Ctx = createContext<{
  prefs: SitePrefs;
  set: (p: Partial<SitePrefs>) => void;
}>({ prefs: DEFAULT, set: () => {} });
export const useSitePrefs = () => useContext(Ctx);

/**
 * Pembungkus website: menerapkan preferensi tampilan pengunjung (mode gelap,
 * teks besar, kontras tinggi, hemat data) yang disimpan di perangkatnya.
 */
export function SiteShell({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const [prefs, setPrefs] = useState<SitePrefs>(DEFAULT);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    let saved: Partial<SitePrefs> = {};
    try {
      saved = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    } catch {
      /* abaikan */
    }
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefs({ ...DEFAULT, hemat: !!nav.connection?.saveData, ...saved });
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const on = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const set = (p: Partial<SitePrefs>) =>
    setPrefs((cur) => {
      const next = { ...cur, ...p };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* abaikan */
      }
      return next;
    });

  const dark =
    prefs.theme === "dark" || (prefs.theme === "system" && systemDark);
  return (
    <Ctx.Provider value={{ prefs, set }}>
      <MotionConfig reducedMotion={prefs.hemat ? "always" : "user"}>
        <div
          className={className}
          data-site-theme={dark ? "dark" : "light"}
          data-site-text={prefs.text}
          data-site-contrast={prefs.contrast}
          data-site-hemat={prefs.hemat ? "1" : "0"}
          style={{ colorScheme: dark ? "dark" : "light" }}
        >
          {children}
        </div>
      </MotionConfig>
    </Ctx.Provider>
  );
}
