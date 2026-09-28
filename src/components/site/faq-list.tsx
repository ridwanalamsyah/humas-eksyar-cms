import { Plus } from "lucide-react";

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="border-t border-pine-800/15">
      {items.map((f) => (
        <details key={f.q} className="group border-b border-pine-800/15">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-[18px] font-semibold text-pine-800 [&::-webkit-details-marker]:hidden">
            {f.q}
            <Plus className="size-5 shrink-0 text-saffron-600 transition-transform group-open:rotate-45" />
          </summary>
          <p className="-mt-1 pb-6 pr-10 text-[15.5px] leading-relaxed text-ink/70">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
