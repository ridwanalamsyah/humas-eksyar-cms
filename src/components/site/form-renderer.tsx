"use client";

import { CheckCircle2, Loader2, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FormDef } from "@/lib/site/forms";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-[14px] border border-hairline bg-canvas px-4 py-3 text-[15.5px] text-label outline-none placeholder:text-label-3 focus:border-accent focus:ring-4 focus:ring-accent/10";

/** Formulir publik generik dari definisi `FormDef`. */
export function FormRenderer({
  def,
  options = {},
  refId,
  compact = false,
}: {
  def: FormDef;
  options?: Record<string, string[]>;
  refId?: string;
  compact?: boolean;
}) {
  const started = useRef(0);
  useEffect(() => {
    started.current = Date.now();
  }, []);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [hp, setHp] = useState("");

  const set = (k: string, v: unknown) => setValues((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    for (const f of def.fields)
      if (
        f.required &&
        (values[f.name] === undefined || values[f.name] === "")
      ) {
        setError(`${f.label} wajib diisi.`);
        return;
      }
    setState("sending");
    const res = await fetch(`/api/formulir/${def.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: values,
        refId,
        _consent: consent,
        _hp: hp,
        _t: started.current,
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error ?? "Gagal mengirim. Coba lagi.");
      setState("idle");
      return;
    }
    setState("done");
  }

  if (state === "done")
    return (
      <div className="flex items-start gap-3 rounded-[20px] bg-accent-soft p-6 text-label">
        <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-accent" />
        <div>
          <p className="text-[16px] font-semibold">{def.success}</p>
          <button
            type="button"
            onClick={() => {
              setValues({});
              setConsent(false);
              setState("idle");
              started.current = Date.now();
            }}
            className="mt-2 text-[14px] font-semibold text-accent hover:underline"
          >
            Kirim isian lain
          </button>
        </div>
      </div>
    );

  return (
    <form
      onSubmit={submit}
      className={cn("grid gap-5", !compact && "sm:grid-cols-2")}
      noValidate
    >
      {/* Kolom jebakan untuk bot — tidak terlihat oleh pengguna. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="hidden"
        aria-hidden
        name="website_url"
      />
      {def.fields.map((f) => {
        const opts =
          f.options ??
          (f.optionsFrom ? options[f.optionsFrom] : undefined) ??
          [];
        const wide =
          compact || ["textarea", "rating", "checkbox"].includes(f.type);
        const id = `${def.slug}-${f.name}`;
        const label = (
          <span className="mb-1.5 block text-[14px] font-semibold text-label">
            {f.label}
            {f.required && <span className="text-accent"> *</span>}
          </span>
        );
        let control: React.ReactNode;
        if (f.type === "textarea")
          control = (
            <textarea
              id={id}
              rows={compact ? 3 : 5}
              maxLength={f.max}
              value={String(values[f.name] ?? "")}
              onChange={(e) => set(f.name, e.target.value)}
              className={cn(inputCls, "resize-y")}
            />
          );
        else if (f.type === "select")
          control = (
            <select
              id={id}
              value={String(values[f.name] ?? "")}
              onChange={(e) => set(f.name, e.target.value)}
              className={inputCls}
            >
              <option value="">
                {opts.length ? "Pilih…" : "Belum ada pilihan"}
              </option>
              {opts.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          );
        else if (f.type === "rating") {
          const scale = f.scale ?? 5;
          const v = Number(values[f.name] ?? 0);
          control = (
            <div
              className="flex gap-1.5"
              role="radiogroup"
              aria-label={f.label}
            >
              {Array.from({ length: scale }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={v === n}
                  aria-label={`${n} dari ${scale}`}
                  onClick={() => set(f.name, n)}
                  className={cn(
                    "grid size-11 place-items-center rounded-full border transition-colors",
                    n <= v
                      ? "border-accent bg-accent text-white"
                      : "border-hairline bg-canvas text-label-3 hover:border-accent/50",
                  )}
                >
                  <Star className={cn("size-5", n <= v && "fill-current")} />
                </button>
              ))}
            </div>
          );
        } else if (f.type === "checkbox")
          return (
            <label
              key={f.name}
              className={cn(
                "flex items-start gap-3 text-[15px] text-label",
                !compact && "sm:col-span-2",
              )}
            >
              <input
                type="checkbox"
                checked={Boolean(values[f.name])}
                onChange={(e) => set(f.name, e.target.checked)}
                className="mt-1 size-4 accent-[var(--color-accent,#237a74)]"
              />
              {f.label}
            </label>
          );
        else
          control = (
            <input
              id={id}
              type={f.type === "number" ? "number" : f.type}
              maxLength={f.max}
              placeholder={f.placeholder}
              value={String(values[f.name] ?? "")}
              onChange={(e) =>
                set(
                  f.name,
                  f.type === "number"
                    ? e.target.value === ""
                      ? ""
                      : Number(e.target.value)
                    : e.target.value,
                )
              }
              className={inputCls}
            />
          );
        return (
          <div key={f.name} className={cn(wide && !compact && "sm:col-span-2")}>
            <label htmlFor={id}>{label}</label>
            {control}
            {f.hint && (
              <p className="mt-1 text-[13px] text-label-3">{f.hint}</p>
            )}
          </div>
        );
      })}

      {def.consent && (
        <label
          className={cn(
            "flex items-start gap-3 rounded-[14px] bg-mist p-4 text-[14.5px] text-label",
            !compact && "sm:col-span-2",
          )}
        >
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 size-4"
          />
          {def.consent}
        </label>
      )}

      {error && (
        <p
          className={cn(
            "text-[14px] font-medium text-red-600",
            !compact && "sm:col-span-2",
          )}
        >
          {error}
        </p>
      )}

      <div className={cn(!compact && "sm:col-span-2")}>
        <button
          type="submit"
          disabled={state === "sending" || (!!def.consent && !consent)}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-[15.5px] font-semibold text-white transition hover:bg-accent-strong disabled:opacity-50"
        >
          {state === "sending" && <Loader2 className="size-4 animate-spin" />}
          Kirim
        </button>
      </div>
    </form>
  );
}
