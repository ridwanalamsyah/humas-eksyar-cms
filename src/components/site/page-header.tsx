import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Header halaman dalam (Profil, Akademik, dst.) dengan breadcrumb. */
export function PageHeader({ title, description, crumb }: { title: string; description?: string; crumb: string }) {
  return (
    <section className="site-pattern relative overflow-hidden bg-pine-800">
      <div className="bg-gradient-to-r from-pine-900 via-pine-900/90 to-pine-800/70">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-pine-100/70">
            <Link href="/prodi" className="hover:text-paper">
              Beranda
            </Link>
            <ChevronRight className="size-3.5" aria-hidden />
            <span className="text-saffron-300">{crumb}</span>
          </nav>
          <h1 className="mt-4 max-w-3xl font-serif text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] font-semibold leading-tight text-paper text-balance">
            {title}
          </h1>
          {description && <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-pine-100/80">{description}</p>}
        </div>
      </div>
    </section>
  );
}
