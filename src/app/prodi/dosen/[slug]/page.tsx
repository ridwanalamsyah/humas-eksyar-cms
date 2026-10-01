import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarClock } from "lucide-react";
import { getAkademik } from "@/lib/site/akademik";
import { buildDosenIndex } from "@/lib/site/dosen-index";
import { getSite } from "@/lib/site/get-site";
import { dosenSlug, normName } from "@/lib/site/names";
import { getSkripsi } from "@/lib/site/skripsi";
import { Photo } from "@/components/site/photo";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const [site, akademik, skripsi] = await Promise.all([
    getSite(),
    getAkademik(),
    getSkripsi(),
  ]);
  const people = [...site.pimpinan, ...site.dosen, ...site.tendik];
  const entry = buildDosenIndex(
    [...site.pimpinan, ...site.dosen],
    akademik,
    skripsi,
  ).find((d) => dosenSlug(d.nama) === slug);
  if (!entry) return null;
  const key = normName(entry.nama);
  const person = people.find((p) => normName(p.name) === key);
  const words = key.split(" ");
  const publikasi = site.publikasi.filter((p) =>
    words.every((w) => p.authors.toLowerCase().includes(w)),
  );
  const bimbingan = skripsi
    .filter((s) => (s.pembimbing ?? []).some((p) => normName(p) === key))
    .slice(0, 10);
  return { entry, person, publikasi, bimbingan };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await load((await params).slug);
  if (!data) return { title: "Dosen tidak ditemukan" };
  return {
    title: data.entry.nama,
    description: `${data.entry.jabatan ?? "Dosen"} Program Studi Ekonomi Syariah UIN SGD.`,
  };
}

export default async function DosenProfilPage({ params }: Props) {
  const data = await load((await params).slug);
  if (!data) notFound();
  const { entry, person, publikasi, bimbingan } = data;
  const keahlian = person?.expertise?.length
    ? person.expertise
    : entry.keahlian;

  return (
    <section className="px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
      <div className="mx-auto max-w-[1024px]">
        <Link
          href="/prodi/dosen"
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent hover:underline"
        >
          <ArrowLeft className="size-4" /> Dosen
        </Link>
        <div className="mt-8 grid gap-10 md:grid-cols-[280px_1fr]">
          <div>
            <Photo
              src={person?.photo}
              alt={entry.nama}
              className="rounded-[28px]"
            />
            {(person?.sinta || person?.scholar) && (
              <div className="mt-4 grid gap-2">
                {person?.sinta && (
                  <a
                    href={person.sinta}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-[14px] bg-mist px-4 py-3 text-[14px] font-semibold text-label hover:text-accent"
                  >
                    Profil SINTA <ArrowUpRight className="size-4" />
                  </a>
                )}
                {person?.scholar && (
                  <a
                    href={person.scholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-[14px] bg-mist px-4 py-3 text-[14px] font-semibold text-label hover:text-accent"
                  >
                    Google Scholar <ArrowUpRight className="size-4" />
                  </a>
                )}
              </div>
            )}
          </div>
          <div>
            <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-accent">
              {entry.jabatan ?? "Dosen"}
            </p>
            <h1 className="mt-2 text-[clamp(2rem,1.5rem+2vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-label">
              {entry.nama}
            </h1>
            {keahlian.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {keahlian.map((k) => (
                  <span
                    key={k}
                    className="rounded-full bg-accent-soft px-3 py-1 text-[13px] font-semibold text-accent"
                  >
                    {k}
                  </span>
                ))}
              </div>
            )}
            {person?.konsultasi && (
              <div className="mt-6 flex items-start gap-3 rounded-[18px] border border-hairline p-4">
                <CalendarClock className="mt-0.5 size-5 shrink-0 text-accent" />
                <div className="text-[14.5px]">
                  <p className="font-semibold text-label">Jadwal konsultasi</p>
                  <p className="text-label-2">{person.konsultasi}</p>
                  <Link
                    href="/prodi/formulir/bimbingan"
                    className="mt-1 inline-block font-semibold text-accent hover:underline"
                  >
                    Ajukan janji ›
                  </Link>
                </div>
              </div>
            )}
            {person?.pendidikan && (
              <div className="mt-8">
                <h2 className="text-[19px] font-bold text-label">Pendidikan</h2>
                <p className="mt-2 whitespace-pre-line text-[15.5px] leading-relaxed text-label-2">
                  {person.pendidikan}
                </p>
              </div>
            )}
            {entry.mataKuliah.length > 0 && (
              <div className="mt-8">
                <h2 className="text-[19px] font-bold text-label">
                  Mata kuliah yang diampu
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {entry.mataKuliah.map((m) => (
                    <li
                      key={m}
                      className="rounded-full border border-hairline px-3 py-1.5 text-[14px] text-label"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {publikasi.length > 0 && (
              <div className="mt-8">
                <h2 className="text-[19px] font-bold text-label">Publikasi</h2>
                <ul className="mt-3 grid gap-2">
                  {publikasi.map((p) => (
                    <li
                      key={p.title}
                      className="rounded-[16px] bg-mist p-4 text-[14.5px]"
                    >
                      <p className="font-semibold text-label">{p.title}</p>
                      <p className="mt-0.5 text-label-2">
                        {[p.venue, p.year].filter(Boolean).join(" · ")}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {bimbingan.length > 0 && entry.namaPembimbing && (
              <div className="mt-8">
                <h2 className="text-[19px] font-bold text-label">
                  Skripsi bimbingan terbaru
                </h2>
                <ul className="mt-3 divide-y divide-hairline rounded-[16px] border border-hairline">
                  {bimbingan.map((s, i) => (
                    <li key={`${s.judul}-${i}`}>
                      <Link
                        href={
                          s.id ? `/prodi/skripsi/${s.id}` : "/prodi/skripsi"
                        }
                        className="flex gap-3 px-4 py-3 text-[14.5px] hover:bg-mist/60"
                      >
                        <span className="w-10 shrink-0 font-mono text-label-3">
                          {s.tahun}
                        </span>
                        <span className="text-label">{s.judul}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/prodi/skripsi?pembimbing=${encodeURIComponent(entry.namaPembimbing)}`}
                  className="mt-3 inline-block text-[14.5px] font-semibold text-accent hover:underline"
                >
                  Semua {entry.bimbingan} skripsi bimbingan ›
                </Link>
              </div>
            )}
            <p className="mt-10 text-[13.5px] text-label-3">
              Bapak/Ibu dosen dapat memperbarui profil ini lewat{" "}
              <Link
                href="/prodi/formulir/profil-dosen"
                className="font-semibold text-accent hover:underline"
              >
                formulir pembaruan profil
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
