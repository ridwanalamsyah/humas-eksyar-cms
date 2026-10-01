import type { Testimoni } from "@/lib/site/schema";

/** Kartu kutipan alumni/mahasiswa. */
export function TestimoniCard({ item }: { item: Testimoni }) {
  return (
    <figure className="flex h-full flex-col rounded-[28px] bg-canvas p-7 sm:p-8">
      <span
        aria-hidden
        className="text-[56px] font-extrabold leading-[0.6] text-accent/25"
      >
        “
      </span>
      <blockquote className="mt-2 flex-1 text-[17px] leading-[1.55] text-label">
        {item.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {item.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.photo}
            alt=""
            className="size-11 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-[15px] font-bold text-accent">
            {item.name
              .split(/\s+/)
              .slice(0, 2)
              .map((w) => w[0])
              .join("")}
          </span>
        )}
        <span>
          <span className="block text-[15px] font-bold text-label">
            {item.name}
          </span>
          <span className="block text-[13px] text-label-2">{item.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
