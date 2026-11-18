"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = { card: string; body: string; num: string };

/**
 * Bidang kajian yang bisa disentuh: di desktop kartu yang disorot melebar dan
 * menampilkan penjelasannya; di ponsel kartu dibuka-tutup seperti akordeon.
 * Keadaan diam (tanpa JavaScript) tetap terbaca: kartu pertama terbuka.
 */
export function BidangKajian({
  items,
  tones,
}: {
  items: { title: string; description: string }[];
  tones: Tone[];
}) {
  const [active, setActive] = useState(0);
  const list = items.slice(0, 4);

  return (
    <>
      {/* Desktop: kartu melebar saat disorot atau diklik */}
      <div className="hidden h-[380px] gap-3 lg:flex">
        {list.map((b, i) => {
          const tone = tones[i % tones.length];
          const on = active === i;
          return (
            <button
              key={b.title}
              type="button"
              aria-expanded={on}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className={cn(
                "relative flex min-w-0 flex-col overflow-hidden rounded-3xl p-7 text-left transition-[flex-grow] duration-500 ease-out motion-reduce:transition-none",
                tone.card,
                on ? "grow-[2.6]" : "grow",
              )}
              style={{ flexBasis: 0 }}
            >
              <span className={cn("text-[14px] font-bold tabular-nums", tone.num)}>0{i + 1}</span>
              <h3
                className={cn(
                  "mt-auto font-bold leading-tight tracking-[-0.02em] transition-[font-size] duration-500 motion-reduce:transition-none",
                  on ? "text-[24px]" : "text-[18px]",
                )}
              >
                {b.title}
              </h3>
              <div
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-500 motion-reduce:transition-none",
                  on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className={cn("mt-3 max-w-[46ch] text-[16px] leading-relaxed", tone.body)}>
                    {b.description}
                  </p>
                  <Link
                    href="/prodi/akademik"
                    tabIndex={on ? 0 : -1}
                    className="mt-5 inline-flex items-center gap-1.5 text-[16px] font-semibold underline-offset-4 hover:underline"
                  >
                    Lihat mata kuliahnya <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Ponsel dan tablet: akordeon */}
      <div className="grid grid-cols-1 gap-3 lg:hidden">
        {list.map((b, i) => {
          const tone = tones[i % tones.length];
          const on = active === i;
          return (
            <div key={b.title} className={cn("rounded-3xl", tone.card)}>
              <button
                type="button"
                aria-expanded={on}
                onClick={() => setActive(on ? -1 : i)}
                className="flex min-h-16 w-full items-center gap-4 p-5 text-left"
              >
                <span className={cn("text-[14px] font-bold tabular-nums", tone.num)}>0{i + 1}</span>
                <span className="min-w-0 flex-1 text-[18px] font-bold leading-snug">{b.title}</span>
                <Plus
                  className={cn(
                    "size-5 shrink-0 transition-transform duration-300 motion-reduce:transition-none",
                    on && "rotate-45",
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none",
                  on ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p className={cn("px-5 text-[16px] leading-relaxed", tone.body)}>{b.description}</p>
                  <Link
                    href="/prodi/akademik"
                    tabIndex={on ? 0 : -1}
                    className="mx-5 mb-5 mt-3 inline-flex min-h-11 items-center gap-1.5 text-[16px] font-semibold"
                  >
                    Lihat mata kuliahnya <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
