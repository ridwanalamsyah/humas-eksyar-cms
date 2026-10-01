"use client";

import { useEffect, useState } from "react";

/** Hitung mundur ke tanggal (akhir hari WIB). */
export function Countdown({ to }: { to: string }) {
  const target = new Date(`${to}T23:59:59+07:00`).getTime();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return <div className="h-[72px]" />;
  const diff = Math.max(0, target - now);
  const parts = [
    [Math.floor(diff / 864e5), "hari"],
    [Math.floor((diff / 36e5) % 24), "jam"],
    [Math.floor((diff / 6e4) % 60), "menit"],
    [Math.floor((diff / 1e3) % 60), "detik"],
  ] as const;
  if (!diff)
    return (
      <p className="text-[16px] font-semibold">Pendaftaran telah ditutup.</p>
    );
  return (
    <div
      className="flex justify-center gap-3"
      role="timer"
      aria-label={`${parts[0][0]} hari lagi`}
    >
      {parts.map(([n, l]) => (
        <div
          key={l}
          className="min-w-[68px] rounded-[18px] bg-white/12 px-3 py-3 text-center"
        >
          <p className="text-[28px] font-extrabold tabular-nums leading-none">
            {String(n).padStart(2, "0")}
          </p>
          <p className="mt-1 text-[12px] text-white/75">{l}</p>
        </div>
      ))}
    </div>
  );
}
