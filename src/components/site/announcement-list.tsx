import Link from "next/link";
import type { ContentItem } from "@/lib/data/types";
import { formatLongDate } from "@/lib/format/dates";

/** Daftar pengumuman teks (tanpa gambar), terbaru di atas. */
export function AnnouncementList({ items, empty = "Belum ada pengumuman." }: { items: ContentItem[]; empty?: string }) {
  if (items.length === 0) {
    return <p className="py-6 text-[15px] text-label-2">{empty}</p>;
  }
  return (
    <ul className="divide-y divide-hairline">
      {items.map((a) => {
        const date = a.publishedAt ?? a.updatedAt;
        return (
          <li key={a.id}>
            <Link href={`/prodi/berita/${a.slug}`} className="group block py-4">
              <time dateTime={date} className="text-[13px] text-label-3">
                {formatLongDate(date)}
              </time>
              <p className="mt-1 text-[16px] font-semibold leading-snug text-label group-hover:text-accent">{a.title}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
