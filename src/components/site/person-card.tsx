import Link from "next/link";
import { Photo } from "./photo";

/** Kartu dosen/pimpinan: foto potret, nama, jabatan, bidang keahlian. */
export function PersonCard({
  name,
  role,
  photo,
  tags,
  href,
}: {
  name: string;
  role: string;
  photo?: string | null;
  tags?: string[];
  href?: string;
}) {
  return (
    <article className="group relative flex h-full flex-col">
      <Photo src={photo} alt={name} className="rounded-[20px]" />
      <div className="flex min-w-0 flex-1 flex-col pt-4">
        <p className="text-[14px] font-semibold text-accent">
          {role}
        </p>
        <h3 className="mt-1.5 break-words text-[16px] font-bold leading-snug tracking-[-0.01em] text-label">
          {href ? (
            <Link
              href={href}
              className="after:absolute after:inset-0 hover:text-accent"
            >
              {name}
            </Link>
          ) : (
            name
          )}
        </h3>
        {tags && tags.length > 0 && (
          <p className="mt-1.5 line-clamp-2 text-[14px] text-label-2">{tags.join(" · ")}</p>
        )}
      </div>
    </article>
  );
}
