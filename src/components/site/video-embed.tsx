"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { youtubeId } from "@/lib/site/youtube";

/** Video YouTube yang baru dimuat saat diklik (hemat kuota & lebih cepat). */
export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const [play, setPlay] = useState(false);
  const id = youtubeId(url);
  if (!id) return null;
  return (
    <div className="relative aspect-video overflow-hidden rounded-[24px] bg-navy">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlay(true)}
          className="group absolute inset-0"
          aria-label={`Putar video: ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
          />
          <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-canvas/95 text-accent shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-1 size-7 fill-current" />
          </span>
          <span className="absolute inset-x-0 bottom-0 bg-navy/70 px-5 py-3 text-left text-[15px] font-semibold text-white">
            {title}
          </span>
        </button>
      )}
    </div>
  );
}
