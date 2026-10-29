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
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-[24px] border border-hairline bg-canvas transition duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_20px_40px_-20px_rgba(22,58,69,0.28)]">
      <Photo src={photo} alt={name} />
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-accent">
          {role}
        </p>
        <h3 className="mt-1.5 break-words text-[17px] font-bold leading-snug tracking-[-0.01em] text-label">
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
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
            {tags.map((t) => (
              <li
                key={t}
                className="max-w-full truncate rounded-full border border-hairline bg-mist px-2.5 py-1 text-[12px] font-medium text-label-2"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
