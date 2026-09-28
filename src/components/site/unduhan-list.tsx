"use client";

import { useMemo, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Link2,
  Search,
} from "lucide-react";
import type { Unduhan } from "@/lib/site/schema";
import { cn } from "@/lib/utils";

function kindOf(url: string) {
  const path = url.split("?")[0].toLowerCase();
  if (path.endsWith(".pdf")) return { label: "PDF", Icon: FileText };
  if (path.endsWith(".docx") || path.endsWith(".doc"))
    return { label: "DOCX", Icon: FileText };
  if (path.endsWith(".xlsx") || path.endsWith(".xls"))
    return { label: "XLSX", Icon: FileSpreadsheet };
  return { label: "Tautan", Icon: Link2 };
}

/** Daftar dokumen dengan pencarian & filter kategori. */
export function UnduhanList({ items }: { items: Unduhan[] }) {
  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  );
  const [cat, setCat] = useState("Semua");
  const [q, setQ] = useState("");

  const visible = items.filter(
    (i) =>
      (cat === "Semua" || i.category === cat) &&
      (!q.trim() ||
        `${i.title} ${i.description ?? ""}`
          .toLowerCase()
          .includes(q.trim().toLowerCase())),
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={cn(
                "rounded-full px-4 py-2 text-[14px] font-semibold transition-colors",
                cat === c
                  ? "bg-accent text-white"
                  : "bg-mist text-label-2 hover:text-label",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 rounded-full border border-hairline bg-canvas px-4 py-2.5 sm:w-72">
          <Search className="size-4 text-label-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari dokumen…"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-label-3"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 rounded-[24px] bg-mist p-10 text-center text-[16px] text-label-2">
          Belum ada dokumen di kategori ini.
        </p>
      ) : (
        <ul className="mt-8 grid gap-3">
          {visible.map((d, i) => {
            const { label, Icon } = kindOf(d.url);
            return (
              <li key={`${d.url}-${i}`}>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-[20px] border border-hairline bg-canvas p-4 transition duration-300 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_20px_40px_-24px_rgba(22,58,69,0.4)] sm:p-5"
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
                    <Icon className="size-6" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-bold leading-snug text-label">
                      {d.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[14px] text-label-2">
                      {d.category} · {label}
                      {d.description ? ` · ${d.description}` : ""}
                    </span>
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mist text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    <Download className="size-4" />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
