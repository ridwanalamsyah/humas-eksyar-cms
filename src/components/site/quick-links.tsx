import Link from "next/link";
import {
  BookOpen,
  FolderDown,
  GraduationCap,
  Library,
  ScanSearch,
  UserPlus,
} from "lucide-react";

/** Tautan cepat ke alat bantu prodi & sistem kampus. */
export function QuickLinks({ pmbUrl }: { pmbUrl: string }) {
  const links = [
    { href: "/prodi/layanan#unduhan", label: "Unduhan", Icon: FolderDown },
    { href: "/prodi/skripsi", label: "Direktori skripsi", Icon: ScanSearch },
    {
      href: "https://simak.uinsgd.ac.id/beranda/",
      label: "SALAM",
      Icon: GraduationCap,
      external: true,
    },
    { href: "/prodi/beasiswa", label: "Beasiswa", Icon: BookOpen },
    {
      href: "https://digilib.uinsgd.ac.id",
      label: "Digilib",
      Icon: Library,
      external: true,
    },
    { href: pmbUrl, label: "PMB UIN SGD", Icon: UserPlus, external: true },
  ];
  const cls =
    "group flex items-center gap-3 rounded-[18px] border border-hairline bg-canvas px-4 py-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_16px_32px_-20px_rgba(22,58,69,0.4)]";

  return (
    <ul className="mx-auto grid max-w-[1024px] grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {links.map(({ href, label, Icon, external }) => {
        const inner = (
          <>
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
              <Icon className="size-[18px]" strokeWidth={1.75} />
            </span>
            <span className="text-[14px] font-semibold leading-tight text-label">
              {label}
            </span>
          </>
        );
        return (
          <li key={label}>
            {external ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
              >
                {inner}
              </a>
            ) : (
              <Link href={href} className={cls}>
                {inner}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
