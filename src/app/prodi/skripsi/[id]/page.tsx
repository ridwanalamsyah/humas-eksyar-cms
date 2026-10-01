import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, FileText, Lock } from "lucide-react";
import {
  getSkripsi,
  getSkripsiDetailBucket,
  searchSkripsi,
} from "@/lib/site/skripsi";
import { prodi } from "@/lib/site/prodi";

export const revalidate = 300;

type Props = { params: Promise<{ id: string }> };

async function load(id: string) {
  const list = await getSkripsi();
  const item = list.find((s) => s.id === id);
  if (!item) return null;
  const detail = (await getSkripsiDetailBucket(item.tahun))[id] ?? {};
  return { list, item, detail };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load((await params).id);
  if (!data) return { title: "Skripsi tidak ditemukan" };
  return {
    title: data.item.judul.slice(0, 90),
    description: (
      data.detail.abstrak ??
      `Skripsi ${data.item.nama} (${data.item.tahun}), ${prodi.fullName}.`
    ).slice(0, 200),
  };
}

export default async function SkripsiDetailPage({ params }: Props) {
  const data = await load((await params).id);
  if (!data) notFound();
  const { list, item, detail } = data;
  const keywords = (detail.kataKunci ?? "")
    .split(/[;,]/)
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 10);
  const similar = searchSkripsi(list, item.judul, 6)
    .filter((r) => r.item.id !== item.id)
    .slice(0, 5);
  const apa = `${item.nama || "Anonim"}. (${item.tahun}). ${item.judul} [Skripsi, UIN Sunan Gunung Djati Bandung].${item.url ? ` ${item.url}` : ""}`;

  return (
    <article className="px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
      <div className="mx-auto max-w-[760px]">
        <Link
          href="/prodi/skripsi"
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent hover:underline"
        >
          <ArrowLeft className="size-4" /> Direktori skripsi
        </Link>

        <p className="mt-8 text-[14px] font-semibold uppercase tracking-[0.08em] text-accent">
          Skripsi · {item.tahun}
        </p>
        <h1 className="mt-3 text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)] font-bold leading-[1.2] tracking-[-0.02em] text-label">
          {item.judul}
        </h1>

        <dl className="mt-8 grid gap-4 rounded-[24px] bg-mist p-6 text-[15px] sm:grid-cols-2">
          <div>
            <dt className="text-[13px] text-label-3">Penulis</dt>
            <dd className="mt-0.5 font-semibold text-label">
              {item.nama || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[13px] text-label-3">Tahun</dt>
            <dd className="mt-0.5 font-semibold text-label">{item.tahun}</dd>
          </div>
          {item.pembimbing?.length ? (
            <div className="sm:col-span-2">
              <dt className="text-[13px] text-label-3">Dosen pembimbing</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {item.pembimbing.map((p) => (
                  <Link
                    key={p}
                    href={`/prodi/skripsi?pembimbing=${encodeURIComponent(p)}`}
                    className="rounded-full bg-canvas px-3 py-1 text-[14px] font-semibold text-label hover:text-accent"
                  >
                    {p}
                  </Link>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>

        {keywords.length > 0 && (
          <div className="mt-8">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-label-3">
              Kata kunci
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {keywords.map((k) => (
                <Link
                  key={k}
                  href={`/prodi/skripsi?q=${encodeURIComponent(k)}`}
                  className="rounded-full border border-hairline px-3 py-1.5 text-[14px] text-label-2 hover:border-accent/40 hover:text-accent"
                >
                  {k}
                </Link>
              ))}
            </div>
          </div>
        )}

        {detail.abstrak && (
          <section className="mt-10">
            <h2 className="text-[22px] font-bold tracking-[-0.01em] text-label">
              Abstrak
            </h2>
            <p className="mt-4 whitespace-pre-line text-[17px] leading-[1.7] text-label">
              {detail.abstrak}
            </p>
          </section>
        )}

        {(detail.dokumen?.length || item.url) && (
          <section className="mt-10">
            <h2 className="text-[22px] font-bold tracking-[-0.01em] text-label">
              Berkas
            </h2>
            <p className="mt-1 text-[14px] text-label-2">
              Berkas disimpan di Digital Library UIN SGD. Berkas bertanda gembok
              hanya bisa dibuka dengan akun kampus.
            </p>
            <ul className="mt-4 divide-y divide-hairline overflow-hidden rounded-[20px] border border-hairline">
              {(detail.dokumen ?? []).map((d) => (
                <li key={d.url}>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 px-5 py-3.5 hover:bg-mist/60"
                  >
                    {d.terbatas ? (
                      <Lock className="size-4 text-label-3" />
                    ) : (
                      <FileText className="size-4 text-accent" />
                    )}
                    <span className="flex-1 text-[15px] font-medium text-label group-hover:text-accent">
                      {d.label}
                    </span>
                    <ArrowUpRight className="size-4 text-label-3" />
                  </a>
                </li>
              ))}
              {item.url && (
                <li>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 bg-accent px-5 py-3.5 text-white hover:bg-accent-strong"
                  >
                    <span className="flex-1 text-[15px] font-semibold">
                      Buka halaman lengkap di Digilib
                    </span>
                    <ArrowUpRight className="size-4" />
                  </a>
                </li>
              )}
            </ul>
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-label-3">
            Sitasi (APA)
          </h2>
          <p className="mt-2 select-all rounded-[16px] bg-mist p-4 font-mono text-[13px] leading-relaxed text-label-2">
            {apa}
          </p>
        </section>

        {similar.length > 0 && (
          <section className="mt-14">
            <h2 className="text-[22px] font-bold tracking-[-0.01em] text-label">
              Skripsi dengan topik serupa
            </h2>
            <ul className="mt-4 divide-y divide-hairline overflow-hidden rounded-[20px] border border-hairline">
              {similar.map(({ item: s }, i) => (
                <li key={`${s.id ?? s.judul}-${i}`}>
                  <Link
                    href={
                      s.id
                        ? `/prodi/skripsi/${s.id}`
                        : `/prodi/skripsi?q=${encodeURIComponent(s.judul)}`
                    }
                    className="group flex gap-4 px-5 py-4 hover:bg-mist/60"
                  >
                    <span className="w-12 shrink-0 font-mono text-[13px] text-label-3">
                      {s.tahun}
                    </span>
                    <span className="text-[15px] font-medium leading-snug text-label group-hover:text-accent">
                      {s.judul}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
