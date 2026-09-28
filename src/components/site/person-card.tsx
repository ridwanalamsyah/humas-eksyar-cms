/** Kartu orang (dosen/pimpinan): inisial dalam lingkaran, nama, peran. */
export function PersonCard({
  name,
  initials,
  role,
  tags,
}: {
  name: string;
  initials: string;
  role: string;
  tags?: string[];
}) {
  return (
    <div className="flex h-full flex-col items-center rounded-[24px] border border-hairline bg-canvas p-7 text-center">
      <span className="grid size-24 place-items-center rounded-full bg-accent-soft text-[28px] font-bold tracking-[-0.02em] text-accent">
        {initials}
      </span>
      <p className="mt-5 text-[18px] font-bold leading-snug tracking-[-0.01em] text-label">{name}</p>
      <p className="mt-1 text-[14px] text-label-2">{role}</p>
      {tags && tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap justify-center gap-1.5">
          {tags.map((t) => (
            <li key={t} className="rounded-full bg-mist px-3 py-1 text-[12px] font-medium text-label-2">
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
