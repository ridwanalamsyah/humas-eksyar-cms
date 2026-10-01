import type { Metadata } from "next";
import { getSite } from "@/lib/site/get-site";
import { PageHeader } from "@/components/site/page-header";
import { KalkulatorKelulusan } from "@/components/site/alat/kalkulator-kelulusan";

export const metadata: Metadata = {
  title: "Kalkulator Kelulusan",
  description:
    "Perkirakan sisa SKS dan semester lulus mahasiswa Ekonomi Syariah.",
};

export default async function KelulusanPage() {
  const { identity } = await getSite();
  return (
    <>
      <PageHeader
        crumb="Kalkulator kelulusan"
        title="Kalkulator kelulusan"
        description={`Beban studi ${identity.totalCredits} SKS, masa studi maksimal ${identity.maxSemesters} semester.`}
      />
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-[1024px]">
          <KalkulatorKelulusan
            totalSks={identity.totalCredits}
            maxSemester={identity.maxSemesters}
          />
        </div>
      </section>
    </>
  );
}
