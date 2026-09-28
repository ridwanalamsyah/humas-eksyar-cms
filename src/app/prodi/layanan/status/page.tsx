import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { StatusChecker } from "@/components/site/status-checker";

export const metadata: Metadata = {
  title: "Cek Status Layanan",
  description: "Cek status pengajuan layanan akademik Program Studi Ekonomi Syariah dengan kode tiket dan NIM.",
  robots: { index: false },
};

type Props = { searchParams: Promise<{ kode?: string }> };

export default async function StatusPage({ searchParams }: Props) {
  const { kode } = await searchParams;
  const initial = /^ES-[A-Z0-9]{6}$/i.test(kode ?? "") ? kode!.toUpperCase() : "";

  return (
    <>
      <PageHeader crumb="Cek status" title="Lacak pengajuanmu." description="Masukkan kode tiket dan NIM yang kamu pakai saat mengajukan." />
      <section className="px-4 pb-24 sm:px-6 sm:pb-32">
        <div className="mx-auto max-w-[820px]">
          <StatusChecker initialCode={initial} />
          <p className="mt-8 text-center text-[15px] text-label-2">
            Belum mengajukan?{" "}
            <Link href="/prodi/layanan#ajukan" className="font-semibold text-accent hover:underline">
              Ajukan layanan ›
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
