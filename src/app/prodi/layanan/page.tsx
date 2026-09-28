import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileSearch, Send } from "lucide-react";
import { FaqList } from "@/components/site/faq-list";
import { LayananForm } from "@/components/site/layanan-form";
import { LocalNav } from "@/components/site/local-nav";
import { PageHeader } from "@/components/site/page-header";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { getSite } from "@/lib/site/get-site";
import { layananAkademik, prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Layanan",
  description: `Ajukan surat & layanan akademik secara online, cek status, dan akses sistem akademik ${prodi.fullName}.`,
};

export default async function LayananPage() {
  const { faq, kontak, layananAdministrasi, layananFormUrl } = await getSite();

  return (
    <>
      <PageHeader
        crumb="Layanan"
        title="Urus surat tanpa antre."
        description="Ajukan layanan akademik secara online, lalu pantau statusnya kapan saja dengan kode tiket."
      />

      <LocalNav
        items={[
          { id: "ajukan", label: "Ajukan layanan" },
          { id: "status", label: "Cek status" },
          { id: "digital", label: "Layanan digital" },
          { id: "faq", label: "FAQ" },
        ]}
      />

      {/* Alur */}
      <section className="px-4 pt-20 sm:px-6">
        <ol className="mx-auto grid max-w-[1024px] gap-4 sm:grid-cols-3">
          {[
            { n: "1", t: "Isi formulir", d: "Pilih jenis layanan dan lengkapi data diri." },
            { n: "2", t: "Simpan kode tiket", d: "Kode dikirim ke email kamu setelah pengajuan." },
            { n: "3", t: "Pantau & unduh", d: "Cek status dengan kode + NIM, unduh dokumen jika sudah selesai." },
          ].map((s) => (
            <li key={s.n} className="flex gap-4 rounded-[24px] bg-mist p-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-[16px] font-bold text-white">{s.n}</span>
              <span>
                <span className="block text-[17px] font-bold text-label">{s.t}</span>
                <span className="mt-1 block text-[15px] leading-snug text-label-2">{s.d}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Ajukan */}
      <section id="ajukan" className="scroll-mt-28 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-[1024px]">
          <Reveal>
            <SectionHeading align="left" eyebrow="Ajukan layanan" title="Formulir pengajuan." />
          </Reveal>
          <Reveal className="mt-10">
            <LayananForm jenis={layananAdministrasi} />
          </Reveal>
          {layananFormUrl && (
            <p className="mt-4 text-[14px] text-label-2">
              Butuh formulir lain?{" "}
              <a href={layananFormUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
                Buka formulir tambahan ↗
              </a>
            </p>
          )}
        </div>
      </section>

      {/* Cek status */}
      <section id="status" className="scroll-mt-28 bg-mist px-4 py-20 sm:px-6">
        <Reveal className="mx-auto flex max-w-[1024px] flex-col items-start justify-between gap-6 rounded-[28px] bg-canvas p-8 sm:flex-row sm:items-center sm:p-10">
          <div className="flex items-center gap-5">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
              <FileSearch className="size-7" strokeWidth={1.75} />
            </span>
            <div>
              <h2 className="text-[24px] font-extrabold tracking-[-0.02em] text-label">Sudah mengajukan?</h2>
              <p className="mt-1 text-[16px] text-label-2">Cek status pengajuan dengan kode tiket dan NIM.</p>
            </div>
          </div>
          <Link
            href="/prodi/layanan/status"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-7 py-3 text-[16px] font-semibold text-white hover:bg-accent-strong"
          >
            <Send className="size-4" /> Cek status
          </Link>
        </Reveal>
      </section>

      {/* Layanan digital */}
      <section id="digital" className="scroll-mt-28 px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading eyebrow="Layanan digital" title="Sistem akademik kampus." />
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-[1024px] gap-4 sm:grid-cols-2">
          {layananAkademik.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start justify-between gap-6 rounded-[24px] border border-hairline bg-canvas p-7 transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_24px_48px_-24px_rgba(22,58,69,0.35)]"
            >
              <span>
                <span className="block text-[19px] font-bold tracking-[-0.01em] text-label">{l.title}</span>
                <span className="mt-1 block text-[15px] text-label-2">{l.description}</span>
              </span>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                <ArrowUpRight className="size-4" />
              </span>
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-[15px] text-label-2">
          Butuh bantuan langsung? Email{" "}
          <a href={`mailto:${kontak.email}`} className="font-semibold text-accent hover:underline">
            {kontak.email}
          </a>{" "}
          · {kontak.hours}
        </p>
      </section>

      <section id="faq" className="scroll-mt-28 bg-mist px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading title="Pertanyaan umum." />
        </Reveal>
        <Reveal className="mt-10">
          <FaqList items={faq} />
        </Reveal>
      </section>
    </>
  );
}
