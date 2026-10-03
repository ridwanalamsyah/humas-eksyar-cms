import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, HandCoins } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Alat & Kamus",
  description: "Kalkulator zakat dan kamus istilah ekonomi syariah.",
};

const TOOLS = [
  {
    href: "/prodi/alat/zakat",
    t: "Kalkulator zakat",
    d: "Hitung zakat penghasilan, harta, dan perdagangan dengan nisab resmi BAZNAS.",
    Icon: HandCoins,
  },
  {
    href: "/prodi/kamus",
    t: "Kamus istilah",
    d: "Istilah ekonomi dan keuangan syariah beserta penjelasannya.",
    Icon: BookOpen,
  },
];

export default function AlatPage() {
  return (
    <>
      <PageHeader
        crumb="Alat & kamus"
        title="Alat & kamus"
        description="Alat bantu belajar ekonomi syariah."
      />
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-[1024px] gap-4 md:grid-cols-2">
          {TOOLS.map(({ href, t, d, Icon }, i) => (
            <Link
              key={href}
              href={href}
              className={
                i === 0
                  ? "group flex h-full flex-col rounded-[28px] bg-accent p-8 text-white transition duration-300 hover:scale-[1.01]"
                  : "group flex h-full flex-col rounded-[28px] bg-mist p-8 transition duration-300 hover:scale-[1.01]"
              }
            >
              <Icon
                className={i === 0 ? "size-9 text-sand" : "size-9 text-accent"}
                strokeWidth={1.5}
              />
              <span
                className={
                  i === 0
                    ? "mt-8 text-[24px] font-bold tracking-[-0.02em]"
                    : "mt-8 text-[24px] font-bold tracking-[-0.02em] text-label"
                }
              >
                {t}
              </span>
              <span
                className={
                  i === 0
                    ? "mt-2 text-[15.5px] text-white/80"
                    : "mt-2 text-[15.5px] text-label-2"
                }
              >
                {d}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
