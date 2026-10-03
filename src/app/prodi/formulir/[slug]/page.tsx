import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { findActiveForm } from "@/lib/site/forms";
import { resolveOptions } from "@/lib/site/form-options";
import { FormRenderer } from "@/components/site/form-renderer";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const def = findActiveForm((await params).slug);
  return def
    ? { title: def.title, description: def.description }
    : { title: "Formulir tidak ditemukan" };
}

export default async function FormulirPage({ params }: Props) {
  const def = findActiveForm((await params).slug);
  if (!def || def.embedded) notFound();
  const options = await resolveOptions(def);
  return (
    <section className="px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
      <div className="mx-auto max-w-[720px]">
        <Link
          href="/prodi/layanan#formulir"
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent hover:underline"
        >
          <ArrowLeft className="size-4" /> Layanan & formulir
        </Link>
        <p className="mt-8 text-[14px] font-semibold uppercase tracking-[0.08em] text-accent">
          {def.group}
        </p>
        <h1 className="mt-2 text-[clamp(2rem,1.5rem+2vw,3rem)] font-extrabold tracking-[-0.03em] text-label">
          {def.title}
        </h1>
        <p className="mt-3 text-[17px] leading-[1.5] text-label-2">
          {def.description}
        </p>
        <div className="mt-10 rounded-[28px] border border-hairline bg-canvas p-6 sm:p-8">
          <FormRenderer def={def} options={options} />
        </div>
        <p className="mt-4 text-[13px] text-label-3">
          Data Anda hanya digunakan oleh pengelola Program Studi Ekonomi Syariah
          untuk keperluan formulir ini.
        </p>
      </div>
    </section>
  );
}
