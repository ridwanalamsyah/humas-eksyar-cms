"use client";

import { useState } from "react";
import { NumberInput, ResultCard } from "./ui";

/** Perkiraan sisa SKS dan semester lulus. */
export function KalkulatorKelulusan({
  totalSks,
  maxSemester,
}: {
  totalSks: number;
  maxSemester: number;
}) {
  const [lulus, setLulus] = useState(0);
  const [semester, setSemester] = useState(1);
  const [rencana, setRencana] = useState(20);
  const sisa = Math.max(0, totalSks - lulus);
  const perSem = Math.min(24, Math.max(1, rencana));
  const butuh = Math.ceil(sisa / perSem);
  const lulusDi = semester + butuh - (sisa === 0 ? 1 : 0);
  const lewat = lulusDi > maxSemester;
  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberInput
          label="SKS yang sudah lulus"
          value={lulus}
          onChange={(n) => setLulus(Math.min(totalSks, n))}
          suffix="SKS"
          hint="Lihat transkrip di SALAM."
        />
        <NumberInput
          label="Semester yang akan ditempuh"
          value={semester}
          onChange={(n) => setSemester(Math.max(1, n))}
        />
        <NumberInput
          label="Rencana SKS per semester"
          value={rencana}
          onChange={setRencana}
          suffix="SKS"
          hint="Maksimal 24 SKS, sesuai IP semester sebelumnya."
        />
      </div>
      <div className="grid content-start gap-4">
        <ResultCard
          title="Perkiraan lulus"
          value={sisa === 0 ? "Siap lulus" : `Semester ${lulusDi}`}
          note={
            sisa === 0
              ? "Seluruh SKS sudah terpenuhi."
              : `Sisa ${sisa} SKS dari ${totalSks} SKS, butuh sekitar ${butuh} semester lagi dengan ${perSem} SKS per semester.`
          }
        />
        <ResultCard
          tone="mist"
          title="Batas masa studi"
          value={`${maxSemester} semester`}
          note={
            lewat
              ? "Perkiraanmu melewati batas masa studi. Segera konsultasikan dengan dosen pembimbing akademik."
              : "Perkiraanmu masih dalam batas masa studi."
          }
        />
        <p className="text-[13px] text-label-3">
          Perkiraan kasar; skripsi, KKN, dan mata kuliah prasyarat dapat
          memengaruhi jadwal kelulusan.
        </p>
      </div>
    </div>
  );
}
