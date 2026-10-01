import type { Metadata } from "next";
import Link from "next/link";
import { listSubmissions } from "@/lib/data/provider";
import { findForm } from "@/lib/site/forms";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";
import { FaqList } from "@/components/site/faq-list";
import { FormRenderer } from "@/components/site/form-renderer";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Tanya Jawab",
  description: `Tanya jawab seputar perkuliahan, administrasi, dan ekonomi syariah bersama ${prodi.fullName}.`,
};

export const revalidate = 300;

export default async function ForumPage() {
  const [{ faq }, tanya, konsultasi] = await Promise.all([
    getSite(),
    listSubmissions({ type: "tanya", published: true, limit: 200 }),
    listSubmissions({ type: "konsultasi", published: true, limit: 200 }),
  ]);
  const answered = [...tanya, ...konsultasi]
    .filter((s) => s.note.trim())
    .map((s) => ({
      q: String(s.data.pertanyaan ?? ""),
      a: s.note,
      kategori:
        s.type === "konsultasi"
          ? String(s.data.kategori ?? "Ekonomi syariah")
          : "Perkuliahan & layanan",
      at: s.updatedAt,
    }));
  const kategori = [...new Set(answered.map((x) => x.kategori))];

  return (
    <>
      <PageHeader
        crumb="Tanya jawab"
        title="Tanya jawab"
        description="Pertanyaan dari mahasiswa dan masyarakat beserta jawaban dari prodi. Belum ada jawabannya? Kirim pertanyaan Anda."
      />
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-[1024px] gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            {kategori.map((k) => (
              <div key={k} className="mb-10">
                <h2 className="text-[15px] font-semibold uppercase tracking-[0.08em] text-accent">
                  {k}
                </h2>
                <div className="mt-4">
                  <FaqList
                    items={answered
                      .filter((x) => x.kategori === k)
                      .map(({ q, a }) => ({ q, a }))}
                  />
                </div>
              </div>
            ))}
            {faq.length > 0 && (
              <div>
                <h2 className="text-[15px] font-semibold uppercase tracking-[0.08em] text-accent">
                  Pertanyaan umum
                </h2>
                <div className="mt-4">
                  <FaqList items={faq} />
                </div>
              </div>
            )}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[24px] border border-hairline bg-canvas p-6">
              <h2 className="text-[19px] font-bold text-label">
                Ajukan pertanyaan
              </h2>
              <p className="mt-1 text-[14px] text-label-2">
                Pertanyaan tampil di halaman ini setelah dijawab.
              </p>
              <div className="mt-5">
                <FormRenderer def={findForm("tanya")!} compact />
              </div>
            </div>
            <p className="mt-4 text-[14px] text-label-2">
              Pertanyaan seputar zakat, wakaf, atau usaha halal?{" "}
              <Link
                href="/prodi/formulir/konsultasi"
                className="font-semibold text-accent hover:underline"
              >
                Konsultasi ekonomi syariah ›
              </Link>
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
