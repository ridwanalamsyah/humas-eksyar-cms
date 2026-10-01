import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, ShieldAlert } from "lucide-react";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";
import { PrintButton } from "@/components/site/print-button";
import { QrImage } from "@/components/site/qr-image";

export const metadata: Metadata = {
  title: "Hasil Verifikasi Sertifikat",
  robots: { index: false },
};

type Props = { params: Promise<{ kode: string }> };

export default async function VerifikasiHasilPage({ params }: Props) {
  const kode = decodeURIComponent((await params).kode)
    .trim()
    .toUpperCase()
    .slice(0, 40);
  const { sertifikat } = await getSite();
  const s = sertifikat.find((x) => x.kode === kode);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return (
    <section className="px-4 pb-24 pt-12 sm:px-6 sm:pt-20">
      <div className="mx-auto max-w-[720px]">
        {s ? (
          <div className="rounded-[32px] border-2 border-accent bg-canvas p-8 text-center sm:p-12">
            <BadgeCheck className="mx-auto size-12 text-accent" />
            <p className="mt-3 text-[14px] font-semibold uppercase tracking-[0.08em] text-accent">
              Sertifikat sah
            </p>
            <p className="mt-6 text-[14px] text-label-2">Diberikan kepada</p>
            <h1 className="mt-1 text-[clamp(1.8rem,1.3rem+2vw,2.6rem)] font-extrabold tracking-[-0.03em] text-label">
              {s.nama}
            </h1>
            <p className="mt-3 text-[16px] text-label-2">
              sebagai <b className="text-label">{s.peran}</b> dalam
            </p>
            <p className="mt-1 text-[19px] font-bold text-label">
              {s.kegiatan}
            </p>
            <p className="mt-2 text-[15px] text-label-2">
              {new Date(`${s.tanggal}T00:00:00+07:00`).toLocaleDateString(
                "id-ID",
                { dateStyle: "long", timeZone: "Asia/Jakarta" },
              )}{" "}
              · {prodi.fullName}, {prodi.university}
            </p>
            <div className="mt-8 flex flex-col items-center gap-2">
              <QrImage value={`${base}/verifikasi/${s.kode}`} size={120} />
              <p className="font-mono text-[13px] text-label-3">{s.kode}</p>
            </div>
            <div className="mt-6" data-print-hide>
              <PrintButton />
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] bg-mist p-10 text-center">
            <ShieldAlert className="mx-auto size-12 text-amber-deep" />
            <h1 className="mt-3 text-[24px] font-bold text-label">
              Kode tidak ditemukan
            </h1>
            <p className="mt-2 text-[15.5px] text-label-2">
              Kode <span className="font-mono">{kode}</span> tidak terdaftar.
              Periksa kembali penulisan kode atau hubungi prodi.
            </p>
            <Link
              href="/prodi/verifikasi"
              className="mt-6 inline-block font-semibold text-accent hover:underline"
            >
              Coba kode lain ›
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
