"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Mengirim satu hitungan kunjungan per perpindahan halaman. */
export function ViewBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    const body = JSON.stringify({ path: pathname });
    if (navigator.sendBeacon)
      navigator.sendBeacon(
        "/api/views",
        new Blob([body], { type: "application/json" }),
      );
    else
      fetch("/api/views", {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(() => {});
  }, [pathname]);
  return null;
}
