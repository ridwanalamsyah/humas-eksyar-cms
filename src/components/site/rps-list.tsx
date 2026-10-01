"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { EmptyResult, SearchInput, matches } from "./filter-chips";

type Rps = { mk: string; semester: string; url: string; referensi: string[] };

/** RPS & referensi per mata kuliah, bisa dicari. */
export function RpsList({ items }: { items: Rps[] }) {
  const [q, setQ] = useState("");
  const shown = items.filter((r) =>
    matches(`${r.mk} ${r.semester} ${r.referensi.join(" ")}`, q),
  );
  return (
    <div>
      <div className="flex justify-end">
        <SearchInput
          value={q}
          onChange={setQ}
          placeholder="Cari mata kuliah atau buku"
        />
      </div>
      {shown.length ? (
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {shown.map((r) => (
            <li
              key={r.mk}
              className="rounded-[20px] border border-hairline bg-canvas p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[16px] font-bold text-label">{r.mk}</p>
                  {r.semester && (
                    <p className="text-[13px] text-label-3">
                      Semester {r.semester}
                    </p>
                  )}
                </div>
                {r.url && (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 rounded-full bg-mist px-3 py-1.5 text-[13px] font-semibold text-accent hover:bg-accent hover:text-white"
                  >
                    RPS <ArrowUpRight className="size-3.5" />
                  </a>
                )}
              </div>
              {r.referensi.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-[14px] leading-snug text-label-2">
                  {r.referensi.map((ref) => (
                    <li key={ref}>{ref}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <EmptyResult>Mata kuliah tidak ditemukan.</EmptyResult>
        </div>
      )}
    </div>
  );
}
