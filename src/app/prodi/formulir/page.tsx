import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FORMS } from "@/lib/site/forms";
import { prodi } from "@/lib/site/prodi";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Formulir",
  description: `Formulir layanan online ${prodi.fullName}: kritik & saran, survei, lapor prestasi, kabar alumni, kerja sama, dan lainnya.`,
};

export default function FormulirIndexPage() {
  const groups = [
    ...new Set(FORMS.filter((f) => !f.embedded).map((f) => f.group)),
  ];
  return (
    <>
      <PageHeader
        crumb="Formulir"
        title="Formulir online"
        description="Sampaikan masukan, laporan, atau permohonan tanpa perlu datang ke ruang prodi."
      />
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-[1024px] gap-10">
          {groups.map((g) => (
            <div key={g}>
              <h2 className="text-[15px] font-semibold uppercase tracking-[0.08em] text-accent">
                {g}
              </h2>
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {FORMS.filter((f) => f.group === g && !f.embedded).map((f) => (
                  <li key={f.slug}>
                    <Link
                      href={`/prodi/formulir/${f.slug}`}
                      className="group flex h-full items-start justify-between gap-4 rounded-[20px] border border-hairline bg-canvas p-5 transition duration-300 hover:-translate-y-0.5 hover:border-accent/40"
                    >
                      <span>
                        <span className="block text-[17px] font-bold text-label group-hover:text-accent">
                          {f.title}
                        </span>
                        <span className="mt-1 block text-[14.5px] leading-[1.5] text-label-2">
                          {f.description}
                        </span>
                      </span>
                      <ChevronRight className="mt-1 size-5 shrink-0 text-label-3 group-hover:text-accent" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-[15px] text-label-2">
            Punya pertanyaan umum?{" "}
            <Link
              href="/prodi/forum"
              className="font-semibold text-accent hover:underline"
            >
              Lihat tanya jawab ›
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
