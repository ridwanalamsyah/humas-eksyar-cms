"use client";

import Link from "next/link";
import { useState } from "react";
import { MoneyInput, ResultCard, Tabs, rupiah } from "./ui";

type Cfg = {
  nisabPenghasilanTahun: number;
  hargaEmas: number;
  nisabGram: number;
  sumber: string;
};

/** Kalkulator zakat penghasilan, harta (maal), dan perdagangan — kadar 2,5%. */
export function ZakatCalculator({ cfg }: { cfg: Cfg }) {
  const [tab, setTab] = useState<"penghasilan" | "maal" | "dagang">(
    "penghasilan",
  );
  const [periode, setPeriode] = useState<"bulan" | "tahun">("bulan");
  const [gaji, setGaji] = useState(0);
  const [lain, setLain] = useState(0);
  const [harga, setHarga] = useState(cfg.hargaEmas);
  const [tabungan, setTabungan] = useState(0);
  const [emas, setEmas] = useState(0);
  const [investasi, setInvestasi] = useState(0);
  const [piutang, setPiutang] = useState(0);
  const [utang, setUtang] = useState(0);
  const [modal, setModal] = useState(0);
  const [laba, setLaba] = useState(0);

  const nisabMaal = harga * cfg.nisabGram;
  let total = 0;
  let nisab = 0;
  let nisabNote = "";
  if (tab === "penghasilan") {
    total = gaji + lain;
    nisab =
      periode === "bulan"
        ? cfg.nisabPenghasilanTahun / 12
        : cfg.nisabPenghasilanTahun;
    nisabNote = `Nisab ${periode === "bulan" ? "per bulan" : "per tahun"}: ${rupiah(nisab)} (${cfg.sumber}).`;
  } else {
    total =
      tab === "maal"
        ? tabungan + emas + investasi + piutang - utang
        : modal + laba + piutang - utang;
    nisab = nisabMaal;
    nisabNote = harga
      ? `Nisab ${cfg.nisabGram} gram emas × ${rupiah(harga)} = ${rupiah(nisab)}. Harta harus sudah dimiliki satu tahun (haul).`
      : "Isi harga emas per gram terlebih dulu untuk menghitung nisab.";
  }
  const wajib = nisab > 0 && total >= nisab;
  const zakat = wajib ? total * 0.025 : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="grid gap-5">
        <Tabs
          value={tab}
          onChange={setTab}
          options={[
            ["penghasilan", "Penghasilan"],
            ["maal", "Harta (maal)"],
            ["dagang", "Perdagangan"],
          ]}
        />
        {tab === "penghasilan" ? (
          <>
            <Tabs
              value={periode}
              onChange={setPeriode}
              options={[
                ["bulan", "Per bulan"],
                ["tahun", "Per tahun"],
              ]}
            />
            <MoneyInput
              label={`Gaji/pendapatan ${periode === "bulan" ? "per bulan" : "per tahun"}`}
              value={gaji}
              onChange={setGaji}
            />
            <MoneyInput
              label="Pendapatan lain (bonus, honor, dll.)"
              value={lain}
              onChange={setLain}
            />
          </>
        ) : (
          <>
            <MoneyInput
              label="Harga emas per gram"
              value={harga}
              onChange={setHarga}
              hint="Gunakan harga emas hari ini dari sumber tepercaya (mis. situs Antam/Pegadaian)."
            />
            {tab === "maal" ? (
              <>
                <MoneyInput
                  label="Tabungan & deposito"
                  value={tabungan}
                  onChange={setTabungan}
                />
                <MoneyInput
                  label="Emas/perak simpanan (nilai rupiah)"
                  value={emas}
                  onChange={setEmas}
                />
                <MoneyInput
                  label="Saham, reksa dana, dan investasi lain"
                  value={investasi}
                  onChange={setInvestasi}
                />
              </>
            ) : (
              <>
                <MoneyInput
                  label="Modal/stok barang dagangan"
                  value={modal}
                  onChange={setModal}
                />
                <MoneyInput
                  label="Kas & laba yang tersedia"
                  value={laba}
                  onChange={setLaba}
                />
              </>
            )}
            <MoneyInput
              label="Piutang yang dapat ditagih"
              value={piutang}
              onChange={setPiutang}
            />
            <MoneyInput
              label="Utang jatuh tempo"
              value={utang}
              onChange={setUtang}
            />
          </>
        )}
      </div>
      <div className="grid content-start gap-4 lg:sticky lg:top-24">
        <ResultCard
          title={wajib ? "Zakat yang dikeluarkan (2,5%)" : "Belum wajib zakat"}
          value={rupiah(zakat)}
          note={`Total harta/pendapatan: ${rupiah(Math.max(0, total))}. ${wajib ? "Sudah mencapai nisab." : "Belum mencapai nisab; tetap dianjurkan berinfak dan bersedekah."}`}
        />
        <ResultCard
          tone="mist"
          title="Nisab"
          value={rupiah(nisab)}
          note={nisabNote}
        />
        <p className="text-[13px] leading-[1.55] text-label-3">
          Perhitungan ini bersifat edukatif. Untuk kepastian, konsultasikan
          dengan BAZNAS atau lembaga amil zakat resmi, atau gunakan{" "}
          <Link
            href="/prodi/layanan#faq"
            className="font-semibold text-accent hover:underline"
          >
            kirim pertanyaan ke prodi
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
