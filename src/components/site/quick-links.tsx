import { BookOpen, GraduationCap, Library, MonitorPlay } from "lucide-react";
import { kontak, layananAkademik } from "@/lib/site/prodi";

const ICONS = [GraduationCap, MonitorPlay, Library, BookOpen];

/** Baris tautan cepat ke sistem kampus (seperti quicklink di web fakultas). */
export function QuickLinks() {
  const links = [
    ...layananAkademik.slice(0, 3).map((l) => ({ href: l.href, label: l.title.replace("Portal Akademik ", "") })),
    { href: kontak.pmbUrl, label: "PMB UIN SGD" },
  ];
  return (
    <ul className="mx-auto grid max-w-[1024px] grid-cols-2 gap-3 md:grid-cols-4">
      {links.map((l, i) => {
        const Icon = ICONS[i];
        return (
          <li key={l.href}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-[18px] border border-hairline bg-canvas px-5 py-4 transition-colors hover:border-accent/40"
            >
              <Icon className="size-5 shrink-0 text-accent" strokeWidth={1.75} />
              <span className="text-[15px] font-semibold text-label">{l.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
