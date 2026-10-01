"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Bidang = { title: string; description: string };

/** Kuis singkat: bidang kajian Ekonomi Syariah yang paling cocok. Skor ke 4 bidang (urutan bidang kajian di CMS). */
const QUESTIONS: { q: string; a: [string, number][] }[] = [
  {
    q: "Kegiatan mana yang paling kamu nikmati?",
    a: [
      ["Menganalisis angka dan laporan keuangan", 0],
      ["Membantu orang yang membutuhkan", 1],
      ["Membuat dan menjual produk", 2],
      ["Membaca berita ekonomi dan kebijakan", 3],
    ],
  },
  {
    q: "Tempat kerja impianmu…",
    a: [
      ["Bank atau perusahaan investasi", 0],
      ["Lembaga zakat, wakaf, atau sosial", 1],
      ["Usaha sendiri atau industri halal", 2],
      ["Pemerintahan, riset, atau kampus", 3],
    ],
  },
  {
    q: "Topik yang paling bikin penasaran:",
    a: [
      ["Bagaimana bank syariah mencari untung tanpa bunga", 0],
      ["Bagaimana zakat bisa mengurangi kemiskinan", 1],
      ["Bagaimana produk mendapat sertifikat halal", 2],
      ["Bagaimana kebijakan memengaruhi ekonomi umat", 3],
    ],
  },
  {
    q: "Saat kerja kelompok, kamu biasanya…",
    a: [
      ["Mengurus anggaran dan perhitungan", 0],
      ["Menjaga semua anggota tetap terlibat", 1],
      ["Mencari ide kreatif dan peluang", 2],
      ["Menyusun argumen dan laporan", 3],
    ],
  },
  {
    q: "Kalau punya dana Rp10 juta, kamu akan…",
    a: [
      ["Investasi di saham atau reksa dana syariah", 0],
      ["Menyalurkan sebagian untuk wakaf produktif", 1],
      ["Modal usaha kecil", 2],
      ["Membiayai riset atau pelatihan", 3],
    ],
  },
  {
    q: "Mata pelajaran favorit di sekolah:",
    a: [
      ["Matematika/akuntansi", 0],
      ["Agama/sosiologi", 1],
      ["Prakarya/kewirausahaan", 2],
      ["Ekonomi/sejarah", 3],
    ],
  },
  {
    q: "Kemampuan yang ingin kamu kuasai:",
    a: [
      ["Analisis keuangan dan risiko", 0],
      ["Manajemen program sosial", 1],
      ["Pemasaran dan rantai pasok", 2],
      ["Analisis data dan penulisan ilmiah", 3],
    ],
  },
  {
    q: "Isu yang ingin kamu ubah:",
    a: [
      ["Masih banyak orang terjerat pinjol dan riba", 0],
      ["Kesenjangan dan kemiskinan", 1],
      ["UMKM sulit naik kelas", 2],
      ["Kebijakan ekonomi yang belum berpihak", 3],
    ],
  },
];

export function KuisMinat({
  bidang,
  karier,
}: {
  bidang: Bidang[];
  karier: string[];
}) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState([0, 0, 0, 0]);
  const done = step >= QUESTIONS.length;
  const best = score.indexOf(Math.max(...score));
  const total = score.reduce((a, b) => a + b, 0) || 1;

  if (done) {
    const b = bidang[best] ?? bidang[0];
    return (
      <div className="grid gap-6">
        <div className="rounded-[28px] bg-accent p-8 text-white">
          <p className="text-[14px] font-semibold text-sand">
            Bidang yang paling cocok untukmu
          </p>
          <p className="mt-2 text-[clamp(1.8rem,1.3rem+2vw,2.8rem)] font-extrabold tracking-[-0.03em]">
            {b?.title}
          </p>
          <p className="mt-3 max-w-2xl text-[16px] text-white/85">
            {b?.description}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {bidang.map((x, i) => (
            <div
              key={x.title}
              className="rounded-[18px] border border-hairline bg-canvas p-4"
            >
              <div className="flex items-center justify-between text-[14px]">
                <span className="font-semibold text-label">{x.title}</span>
                <span className="tabular-nums text-label-2">
                  {Math.round(((score[i] ?? 0) / total) * 100)}%
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-mist">
                <div
                  className="h-2 rounded-full bg-accent"
                  style={{ width: `${((score[i] ?? 0) / total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {karier.length > 0 && (
          <p className="text-[15px] text-label-2">
            Contoh arah karier lulusan: {karier.slice(0, 6).join(", ")}.
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/prodi/mahasiswa-baru"
            className="rounded-full bg-accent px-6 py-3 text-[15px] font-semibold text-white hover:bg-accent-strong"
          >
            Info pendaftaran
          </Link>
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setScore([0, 0, 0, 0]);
            }}
            className="rounded-full bg-mist px-6 py-3 text-[15px] font-semibold text-label"
          >
            Ulangi kuis
          </button>
        </div>
      </div>
    );
  }

  const cur = QUESTIONS[step];
  return (
    <div>
      <div className="h-1.5 rounded-full bg-mist">
        <div
          className="h-1.5 rounded-full bg-accent transition-all"
          style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
        />
      </div>
      <p className="mt-6 text-[14px] font-semibold text-accent">
        Pertanyaan {step + 1} dari {QUESTIONS.length}
      </p>
      <h2 className="mt-2 text-[clamp(1.4rem,1.1rem+1.2vw,2rem)] font-bold tracking-[-0.02em] text-label">
        {cur.q}
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {cur.a.map(([label, idx]) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              setScore((s) => s.map((v, i) => (i === idx ? v + 1 : v)));
              setStep((n) => n + 1);
            }}
            className={cn(
              "rounded-[20px] border border-hairline bg-canvas p-5 text-left text-[16px] font-medium text-label transition hover:-translate-y-0.5 hover:border-accent hover:bg-accent-soft",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
