import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { AkadSimulator } from "@/components/site/alat/akad-simulator";

export const metadata: Metadata = {
  title: "Simulasi Akad Syariah",
  description:
    "Simulasi angsuran murabahah dibandingkan kredit berbunga, dan bagi hasil mudharabah.",
};

export default function AkadPage() {
  return (
    <>
      <PageHeader
        crumb="Simulasi akad"
        title="Simulasi akad syariah"
        description="Pahami perbedaan jual beli (murabahah), bagi hasil (mudharabah), dan kredit berbunga lewat angka."
      />
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-[1024px]">
          <AkadSimulator />
        </div>
      </section>
    </>
  );
}
