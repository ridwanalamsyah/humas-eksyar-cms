import { ChevronDown } from "lucide-react";

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mx-auto max-w-3xl">
      {items.map((f) => (
        <details key={f.q} className="group border-b border-hairline">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[19px] font-semibold tracking-[-0.01em] text-label [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronDown className="size-5 shrink-0 text-label-2 transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <p className="-mt-2 pb-6 pr-10 text-[17px] leading-[1.5] text-label-2">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
