"use client";

import { cn } from "@/lib/utils";

/** Deretan chip filter kategori (satu pilihan aktif). */
export function FilterChips({
  options,
  value,
  onChange,
  counts,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  counts?: Record<string, number>;
}) {
  return (
    <div
      role="group"
      aria-label="Filter"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
    >
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors",
              active
                ? "border-accent bg-accent text-white"
                : "border-hairline bg-canvas text-label-2 hover:border-accent/40 hover:text-accent",
            )}
          >
            {o}
            {counts?.[o] != null && (
              <span
                className={cn(
                  "ml-1.5 tabular-nums",
                  active ? "text-white/70" : "text-label-3",
                )}
              >
                {counts[o]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Kolom pencarian bergaya pil. */
export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="relative block w-full sm:max-w-xs">
      <span className="sr-only">{placeholder}</span>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-label-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-hairline bg-canvas py-2.5 pl-10 pr-4 text-[15px] text-label outline-none placeholder:text-label-3 focus:border-accent focus:ring-4 focus:ring-accent/10"
      />
    </label>
  );
}

export function EmptyResult({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-[20px] border border-dashed border-hairline p-10 text-center text-[16px] text-label-2">
      {children}
    </p>
  );
}

export const ALL = "Semua";

/** Pencocokan teks longgar: semua kata di kueri harus muncul. */
export function matches(haystack: string, query: string) {
  const h = haystack.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => h.includes(w));
}
