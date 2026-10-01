import type { Metadata } from "next";
import { getSite } from "@/lib/site/get-site";
import { PageHeader } from "@/components/site/page-header";
import { ZakatCalculator } from "@/components/site/alat/zakat-calculator";

export const metadata: Metadata = {
  title: "Kalkulator Zakat",
  description:
    "Hitung zakat penghasilan, harta (maal), dan perdagangan dengan nisab resmi BAZNAS 2026.",
};

export default async function ZakatPage() {
  const { zakat } = await getSite();
  return (
    <>
      <PageHeader
        crumb="Kalkulator zakat"
        title="Kalkulator zakat"
        description="Kadar zakat 2,5% berlaku bila harta atau pendapatan mencapai nisab."
      />
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-[1024px]">
          <ZakatCalculator cfg={zakat} />
        </div>
      </section>
    </>
  );
}
