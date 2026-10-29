"use client";

import { useEffect, useState } from "react";
import { MotionConfig } from "motion/react";

/**
 * Pembungkus website: mendukung pengalihan tema terang/gelap manual
 * (disimpan di localStorage `eksyar-prodi-theme`) maupun mengikuti sistem.
 */
export function SiteShell({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<string>("system");

  useEffect(() => {
    const saved = window.localStorage.getItem("eksyar-prodi-theme");
    if (saved === "dark" || saved === "light") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(saved);
    }
    const onThemeChange = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === "dark" || detail === "light" || detail === "system") {
        setTheme(detail);
      }
    };
    window.addEventListener("eksyar-prodi-theme", onThemeChange);
    return () => window.removeEventListener("eksyar-prodi-theme", onThemeChange);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={className}
        data-site-theme={theme}
        style={{
          colorScheme:
            theme === "dark" ? "dark" : theme === "light" ? "light" : "light dark",
        }}
      >
        {children}
      </div>
    </MotionConfig>
  );
}
