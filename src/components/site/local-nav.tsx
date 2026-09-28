/** Sub-navigasi lokal ala Apple (strip tipis di bawah header halaman). */
export function LocalNav({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  return (
    <nav
      aria-label="Isi halaman"
      className="sticky top-14 z-40 border-b border-hairline bg-canvas/90 backdrop-blur-xl"
    >
      <ul className="mx-auto flex max-w-[1024px] gap-6 overflow-x-auto px-4 text-[13px] font-medium text-label-2 sm:justify-center sm:px-6 [&::-webkit-scrollbar]:hidden">
        {items.map((i) => (
          <li key={i.id} className="shrink-0">
            <a href={`#${i.id}`} className="block py-3 hover:text-accent">
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
