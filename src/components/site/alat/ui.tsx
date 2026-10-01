"use client";

import { cn } from "@/lib/utils";

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Math.round(n || 0));

/** Input angka rupiah dengan pemisah ribuan. */
export function MoneyInput({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[14px] font-semibold text-label">
        {label}
      </span>
      <span className="flex items-center rounded-[14px] border border-hairline bg-canvas focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10">
        <span className="pl-4 text-[15px] text-label-3">Rp</span>
        <input
          inputMode="numeric"
          value={value ? value.toLocaleString("id-ID") : ""}
          placeholder="0"
          onChange={(e) =>
            onChange(Number(e.target.value.replace(/\D/g, "")) || 0)
          }
          className="w-full bg-transparent px-3 py-3 text-[16px] tabular-nums text-label outline-none"
        />
      </span>
      {hint && (
        <span className="mt-1 block text-[13px] text-label-3">{hint}</span>
      )}
    </label>
  );
}

export function NumberInput({
  label,
  value,
  onChange,
  suffix,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  step?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[14px] font-semibold text-label">
        {label}
      </span>
      <span className="flex items-center rounded-[14px] border border-hairline bg-canvas focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10">
        <input
          type="number"
          step={step}
          min={0}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent px-4 py-3 text-[16px] tabular-nums text-label outline-none"
        />
        {suffix && (
          <span className="pr-4 text-[14px] text-label-3">{suffix}</span>
        )}
      </span>
      {hint && (
        <span className="mt-1 block text-[13px] text-label-3">{hint}</span>
      )}
    </label>
  );
}

export function Tabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: [T, string][];
}) {
  return (
    <div className="flex w-fit flex-wrap rounded-full bg-mist p-1">
      {options.map(([v, l]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            "rounded-full px-4 py-2 text-[14px] font-semibold",
            value === v ? "bg-canvas text-label shadow-sm" : "text-label-2",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function ResultCard({
  title,
  value,
  note,
  tone = "accent",
}: {
  title: string;
  value: string;
  note?: string;
  tone?: "accent" | "mist";
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] p-6",
        tone === "accent" ? "bg-accent text-white" : "bg-mist text-label",
      )}
    >
      <p
        className={cn(
          "text-[14px] font-semibold",
          tone === "accent" ? "text-sand" : "text-accent",
        )}
      >
        {title}
      </p>
      <p className="mt-2 text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)] font-extrabold tabular-nums tracking-[-0.03em]">
        {value}
      </p>
      {note && (
        <p
          className={cn(
            "mt-2 text-[14px] leading-[1.5]",
            tone === "accent" ? "text-white/80" : "text-label-2",
          )}
        >
          {note}
        </p>
      )}
    </div>
  );
}
