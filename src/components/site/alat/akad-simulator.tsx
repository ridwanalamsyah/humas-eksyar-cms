"use client";

import { useState } from "react";
import { MoneyInput, NumberInput, ResultCard, Tabs, rupiah } from "./ui";

/** Simulasi murabahah vs kredit berbunga, dan bagi hasil mudharabah (edukatif). */
export function AkadSimulator() {
  const [tab, setTab] = useState<"murabahah" | "mudharabah">("murabahah");
  const [harga, setHarga] = useState(20_000_000);
  const [dp, setDp] = useState(2_000_000);
  const [margin, setMargin] = useState(10);
  const [tenor, setTenor] = useState(24);
  const [bunga, setBunga] = useState(10);

  const [modal, setModal] = useState(50_000_000);
  const [untung, setUntung] = useState(10_000_000);
  const [nisbah, setNisbah] = useState(60);

  const pokok = Math.max(0, harga - dp);
  const tahun = tenor / 12;
  const marginRp = pokok * (margin / 100) * tahun;
  const jual = pokok + marginRp;
  const cicilanMurabahah = tenor ? jual / tenor : 0;
  const r = bunga / 100 / 12;
  const cicilanKredit = tenor
    ? r
      ? (pokok * r) / (1 - Math.pow(1 + r, -tenor))
      : pokok / tenor
    : 0;

  return (
    <div className="grid gap-8">
      <Tabs
        value={tab}
        onChange={setTab}
        options={[
          ["murabahah", "Murabahah (jual beli)"],
          ["mudharabah", "Mudharabah (bagi hasil)"],
        ]}
      />
      {tab === "murabahah" ? (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            <MoneyInput
              label="Harga barang"
              value={harga}
              onChange={setHarga}
            />
            <MoneyInput label="Uang muka" value={dp} onChange={setDp} />
            <NumberInput
              label="Margin murabahah"
              value={margin}
              onChange={setMargin}
              suffix="% per tahun"
              step={0.5}
            />
            <NumberInput
              label="Tenor"
              value={tenor}
              onChange={setTenor}
              suffix="bulan"
            />
            <NumberInput
              label="Pembanding: bunga kredit"
              value={bunga}
              onChange={setBunga}
              suffix="% per tahun (efektif)"
              step={0.5}
              hint="Untuk perbandingan dengan kredit konvensional."
            />
          </div>
          <div className="grid content-start gap-4">
            <ResultCard
              title="Angsuran murabahah (tetap)"
              value={rupiah(cicilanMurabahah)}
              note={`Harga jual disepakati di awal: ${rupiah(jual)} (pokok ${rupiah(pokok)} + margin ${rupiah(marginRp)}). Angsuran tidak berubah sampai lunas.`}
            />
            <ResultCard
              tone="mist"
              title="Pembanding kredit berbunga"
              value={rupiah(cicilanKredit)}
              note={`Total bayar ${rupiah(cicilanKredit * tenor)}. Pada kredit, yang diperjualbelikan adalah uang dengan bunga; pada murabahah, bank membeli barang lalu menjualnya kepada nasabah dengan margin yang disepakati.`}
            />
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            <MoneyInput
              label="Modal dari pemilik dana"
              value={modal}
              onChange={setModal}
            />
            <MoneyInput
              label="Keuntungan usaha (periode ini)"
              value={untung}
              onChange={setUntung}
              hint="Isi negatif tidak didukung; lihat catatan kerugian."
            />
            <NumberInput
              label="Nisbah pemilik modal"
              value={nisbah}
              onChange={(n) => setNisbah(Math.min(100, n))}
              suffix="%"
            />
            <div className="rounded-[14px] bg-mist p-4 text-[14px] text-label-2">
              Nisbah pengelola: <b className="text-label">{100 - nisbah}%</b>
            </div>
          </div>
          <div className="grid content-start gap-4">
            <ResultCard
              title="Bagian pemilik modal"
              value={rupiah((untung * nisbah) / 100)}
              note={`Setara ${modal ? (((untung * nisbah) / 100 / modal) * 100).toFixed(2) : 0}% dari modal untuk periode ini.`}
            />
            <ResultCard
              tone="mist"
              title="Bagian pengelola (mudharib)"
              value={rupiah((untung * (100 - nisbah)) / 100)}
              note="Bila usaha merugi bukan karena kelalaian pengelola, kerugian modal ditanggung pemilik modal, sedangkan pengelola kehilangan tenaga dan waktunya."
            />
          </div>
        </div>
      )}
      <p className="text-[13px] text-label-3">
        Simulasi edukatif dengan perhitungan sederhana; ketentuan riil mengikuti
        akad dan kebijakan masing-masing lembaga keuangan syariah.
      </p>
    </div>
  );
}
