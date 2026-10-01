import type { Metadata } from "next";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";
import { GaleriGrid } from "@/components/site/galeri-grid";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { VideoEmbed } from "@/components/site/video-embed";

export const metadata: Metadata = {
  title: "Galeri",
  description: `Foto dan video kegiatan ${prodi.fullName} ${prodi.university}.`,
};

export default async function GaleriPage() {
  const { galeri, video, kontak } = await getSite();
  const photos = [...galeri].sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  );

  return (
    <>
      <PageHeader
        crumb="Galeri"
        title="Galeri kegiatan"
        description="Dokumentasi perkuliahan, pengabdian, dan kegiatan mahasiswa."
      />

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-[1024px]">
          {photos.length ? (
            <GaleriGrid items={photos} />
          ) : (
            <p className="rounded-[24px] bg-mist p-10 text-center text-[17px] text-label-2">
              Dokumentasi terbaru ada di Instagram{" "}
              <a
                href={kontak.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-accent hover:underline"
              >
                {kontak.instagramHandle}
              </a>
              .
            </p>
          )}
        </div>
      </section>

      {video.length > 0 && (
        <section className="bg-mist px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <SectionHeading
              align="left"
              eyebrow="Video"
              title="Video kegiatan & kajian"
            />
            {[...new Set(video.map((v) => v.kategori || "Kegiatan"))].map(
              (k) => (
                <div key={k} className="mt-8">
                  <h3 className="text-[15px] font-semibold uppercase tracking-[0.08em] text-accent">
                    {k}
                  </h3>
                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    {video
                      .filter((v) => (v.kategori || "Kegiatan") === k)
                      .map((v) => (
                        <VideoEmbed key={v.url} url={v.url} title={v.title} />
                      ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      )}
    </>
  );
}
