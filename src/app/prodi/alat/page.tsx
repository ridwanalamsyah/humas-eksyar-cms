import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, GraduationCap, HandCoins, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Alat Ekonomi Syariah",
  description:
    "Kalkulator zakat, simulasi akad murabahah & mudharabah, kuis minat, dan kalkulator kelulusan.",
};

const TOOLS = [
  {
    href: "/prodi/alat/zakat",
    t: "Kalkulator zakat",
    d: "Hitung zakat penghasilan, harta, dan perdagangan dengan nisab resmi BAZNAS.",
    Icon: HandCoins,
  },
  {
    href: "/prodi/alat/akad",
    t: "Simulasi akad",
    d: "Bandingkan murabahah dengan kredit berbunga, dan hitung bagi hasil mudharabah.",
    Icon: Calculator,
  },
  {
    href: "/prodi/alat/kuis",
    t: "Kuis: cocok di bidang apa?",
    d: "8 pertanyaan untuk calon mahasiswa: bidang kajian yang paling sesuai minatmu.",
    Icon: Sparkles,
  },
  {
    href: "/prodi/alat/kelulusan",
    t: "Kalkulator kelulusan",
    d: "Perkirakan sisa SKS dan semester lulusmu.",
    Icon: GraduationCap,
  },
];

export default function AlatPage() {
  return (
    <>
      <PageHeader
        crumb="Alat"
        title="Alat ekonomi syariah"
        description="Alat bantu interaktif untuk belajar, berzakat, dan merencanakan studi."
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
