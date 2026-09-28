import { BookOpen, GraduationCap, Library, MonitorPlay } from "lucide-react";
import { layananAkademik } from "@/lib/site/prodi";

const ICONS = [GraduationCap, MonitorPlay, Library, BookOpen];

/** Baris tautan cepat ke sistem kampus (seperti quicklink di web fakultas). */
export function QuickLinks({ pmbUrl }: { pmbUrl: string }) {
  const links = [
    ...layananAkademik.slice(0, 3).map((l) => ({ href: l.href, label: l.title.replace("Portal Akademik ", "") })),
    { href: pmbUrl, label: "PMB UIN SGD" },
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
              className="group flex items-center gap-3 rounded-[18px] border border-hairline bg-canvas px-5 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_16px_32px_-20px_rgba(22,58,69,0.4)]"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                <Icon className="size-[18px]" strokeWidth={1.75} />
              </span>
              <span className="text-[15px] font-semibold text-label">{l.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
