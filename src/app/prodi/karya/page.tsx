import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getSite } from "@/lib/site/get-site";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Karya Mahasiswa",
  description:
    "Business plan, esai, riset, dan produk UMKM binaan mahasiswa Ekonomi Syariah.",
};

export default async function KaryaPage() {
  const { karya } = await getSite();
  return (
    <>
      <PageHeader
        crumb="Karya"
        title="Karya mahasiswa"
        description="Business plan, esai, riset, dan produk UMKM binaan mahasiswa Ekonomi Syariah."
      />
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-[1024px]">
          {karya.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {karya.map((k) => (
                <article
                  key={k.judul}
                  className="flex h-full flex-col overflow-hidden rounded-[24px] border border-hairline bg-canvas"
                >
                  {k.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={k.image}
                      alt=""
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[12.5px] font-semibold text-accent">
                      {k.jenis}
                    </p>
                    <h2 className="mt-1 text-[17px] font-bold leading-snug text-label">
                      {k.judul}
                    </h2>
                    <p className="mt-1 text-[13.5px] text-label-3">
                      {k.pembuat}
                    </p>
                    <p className="mt-2 text-[14.5px] leading-[1.5] text-label-2">
                      {k.deskripsi}
                    </p>
                    {k.url && (
                      <a
                        href={k.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center gap-1 pt-4 text-[14px] font-semibold text-accent hover:underline"
                      >
                        Lihat karya <ArrowUpRight className="size-4" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-[24px] bg-mist p-10 text-center text-[17px] text-label-2">
              Etalase karya mahasiswa sedang disiapkan.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
