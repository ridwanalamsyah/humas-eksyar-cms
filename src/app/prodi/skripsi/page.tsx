import type { Metadata } from "next";
import { ArrowUpRight, Search } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { prodi } from "@/lib/site/prodi";
import { getSkripsi, searchSkripsi } from "@/lib/site/skripsi";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cek Judul Skripsi",
  description: `Periksa kemiripan judul skripsi dengan direktori skripsi ${prodi.fullName} sebelum mengajukan proposal.`,
};

type Props = { searchParams: Promise<{ q?: string }> };

function level(score: number) {
  if (score >= 0.6) return { label: "Sangat mirip", cls: "bg-red-50 text-red-700" };
  if (score >= 0.35) return { label: "Mirip", cls: "bg-sand text-label" };
  return { label: "Terkait", cls: "bg-mist text-label-2" };
}

export default async function SkripsiPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.slice(0, 300);
  const list = await getSkripsi();
  const results = searchSkripsi(list, query);
  const latest = list.slice(0, 12);

  return (
    <>
      <PageHeader
        crumb="Cek judul skripsi"
        title="Pastikan judulmu orisinal."
        description="Ketik rencana judul skripsi — sistem menampilkan judul terdahulu yang paling mirip."
      />

      <section className="px-4 pb-24 sm:px-6 sm:pb-32">
        <div className="mx-auto max-w-[820px]">
          <form action="/prodi/skripsi" className="flex items-center gap-2 rounded-full border border-hairline bg-canvas p-2 pl-5 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10">
            <Search className="size-5 shrink-0 text-label-3" />
            <input
              name="q"
              defaultValue={query}
              maxLength={300}
              placeholder="Mis. pengaruh literasi keuangan syariah terhadap minat menabung"
              className="min-w-0 flex-1 bg-transparent py-2 text-[16px] text-label outline-none placeholder:text-label-3"
            />
            <button type="submit" className="shrink-0 rounded-full bg-accent px-6 py-2.5 text-[15px] font-semibold text-white hover:bg-accent-strong">
              Cek
            </button>
          </form>
          <p className="mt-3 text-center text-[13px] text-label-3">
            {list.length.toLocaleString("id-ID")} judul di direktori prodi · hasil bersifat indikatif, konsultasikan dengan dosen pembimbing.
          </p>

          {query && (
            <div className="mt-10">
              <h2 className="text-[19px] font-bold text-label">
                {results.length ? `${results.length} judul serupa` : "Tidak ada judul yang mirip di direktori prodi."}
              </h2>
              <ul className="mt-4 grid gap-3">
                {results.map(({ item, score }, i) => {
                  const lv = level(score);
                  return (
                    <li key={i} className="rounded-[20px] border border-hairline bg-canvas p-5">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-[16px] font-semibold leading-snug text-label">{item.judul}</p>
                        <span className={cn("shrink-0 rounded-full px-3 py-1 text-[12px] font-bold", lv.cls)}>
                          {Math.round(score * 100)}% · {lv.label}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[14px] text-label-2">
                        {item.tahun}
                        {item.nama ? ` · ${item.nama}` : ""}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <a
            href={`https://digilib.uinsgd.ac.id/cgi/search/simple?q=${encodeURIComponent(query || "ekonomi syariah")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 flex items-center justify-between gap-4 rounded-[20px] bg-mist p-5 transition-colors hover:bg-accent hover:text-white"
          >
            <span>
              <span className="block text-[16px] font-bold text-label group-hover:text-white">Cari juga di Digital Library UIN SGD</span>
              <span className="block text-[14px] text-label-2 group-hover:text-white/80">Repositori skripsi seluruh prodi dan fakultas.</span>
            </span>
            <ArrowUpRight className="size-5 shrink-0 text-accent group-hover:text-white" />
          </a>

          {!query && latest.length > 0 && (
            <div className="mt-12">
              <h2 className="text-[19px] font-bold text-label">Judul terbaru di direktori</h2>
              <ul className="mt-4 divide-y divide-hairline rounded-[20px] border border-hairline bg-canvas px-5">
                {latest.map((s, i) => (
                  <li key={i} className="flex gap-4 py-4">
                    <span className="w-12 shrink-0 font-mono text-[13px] text-label-3">{s.tahun}</span>
                    <span className="text-[15px] leading-snug text-label">{s.judul}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
