import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { listPublishedNews } from "@/lib/site/content";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = {
  title: "Ruang Media",
  description: `Rilis pers, profil singkat, logo resmi, dan kontak media ${prodi.fullName}.`,
};

export const revalidate = 300;

export default async function MediaPage() {
  const [{ pressKit, kontak }, news] = await Promise.all([
    getSite(),
    listPublishedNews(),
  ]);
  const rilis = news
    .filter((n) => (n.rubric as string) === "rilis_pers")
    .slice(0, 20);
  return (
    <>
      <PageHeader
        crumb="Media"
        title="Ruang media"
        description="Untuk jurnalis, panitia acara, dan mitra yang membutuhkan informasi resmi prodi."
      />
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-[1024px] gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[28px] bg-mist p-7">
            <h2 className="text-[19px] font-bold text-label">Profil singkat</h2>
            <p className="mt-3 text-[16px] leading-[1.6] text-label">
              {pressKit.profilSingkat}
            </p>
            <p className="mt-5 text-[14px] text-label-2">
              Kontak media:{" "}
              <a
                href={`mailto:${pressKit.kontakMedia || kontak.email}`}
                className="font-semibold text-accent hover:underline"
              >
                {pressKit.kontakMedia || kontak.email}
              </a>
            </p>
          </div>
          <div className="rounded-[28px] border border-hairline bg-canvas p-7">
            <h2 className="text-[19px] font-bold text-label">Logo resmi</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={prodi.logo}
              alt={`Logo ${prodi.fullName}`}
              className="mt-4 size-28"
            />
            <a
              href={prodi.logo}
              download
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-accent-strong"
            >
              <Download className="size-4" /> Unduh PNG
            </a>
            <p className="mt-3 text-[13px] text-label-3">
              Gunakan tanpa mengubah warna dan proporsi.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-[1024px]">
          <SectionHeading
            align="left"
            eyebrow="Pernyataan resmi"
            title="Rilis pers"
          />
          {rilis.length ? (
            <ul className="mt-8 divide-y divide-hairline rounded-[20px] border border-hairline">
              {rilis.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/prodi/berita/${r.slug}`}
                    className="block px-5 py-4 hover:bg-mist/60"
                  >
                    <span className="text-[13px] text-label-3">
                      {new Date(
                        r.publishedAt ?? r.updatedAt,
                      ).toLocaleDateString("id-ID", { dateStyle: "long" })}
                    </span>
                    <span className="mt-1 block text-[16px] font-semibold text-label">
                      {r.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 text-[15px] text-label-2">
              Belum ada rilis pers. Lihat{" "}
              <Link
                href="/prodi/berita"
                className="font-semibold text-accent hover:underline"
              >
                berita terbaru
              </Link>
              .
            </p>
          )}
          <p className="mt-8 text-[15px] text-label-2">
            Ingin mengundang narasumber atau meliput kegiatan?{" "}
            <Link
              href="/prodi/formulir/kerjasama"
              className="font-semibold text-accent hover:underline"
            >
              Hubungi kami ›
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
