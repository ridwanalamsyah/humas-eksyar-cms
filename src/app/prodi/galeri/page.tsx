import type { Metadata } from "next";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";
import { latestYoutube } from "@/lib/site/youtube-feed";
import { GaleriGrid } from "@/components/site/galeri-grid";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { VideoEmbed } from "@/components/site/video-embed";

export const metadata: Metadata = {
  title: "Galeri",
  description: `Foto dan video kegiatan ${prodi.fullName} ${prodi.university}.`,
};

export default async function GaleriPage() {
  const { galeri, video, kontak, medsos } = await getSite();
  const rssVideos = medsos.youtubeChannelId
    ? await latestYoutube(medsos.youtubeChannelId, 4)
    : [];
  const seenUrls = new Set(video.map((v) => v.url));
  const allVideos = [
    ...video,
    ...rssVideos
      .filter((rv) => !seenUrls.has(rv.url))
      .map((rv) => ({ ...rv, kategori: "Terbaru dari YouTube" })),
  ];
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

      {allVideos.length > 0 && (
        <section className="bg-mist px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-[1024px]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="YouTube"
                title="Video kegiatan, profil & kajian"
              />
              {medsos.youtubeChannelId && (
                <a
                  href={`https://www.youtube.com/channel/${medsos.youtubeChannelId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] font-semibold text-accent hover:underline"
                >
                  Buka kanal YouTube ↗
                </a>
              )}
            </div>
            {[...new Set(allVideos.map((v) => v.kategori || "Kegiatan"))].map(
              (k) => (
                <div key={k} className="mt-8">
                  <h3 className="text-[15px] font-semibold uppercase tracking-[0.08em] text-accent">
                    {k}
                  </h3>
                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    {allVideos
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
