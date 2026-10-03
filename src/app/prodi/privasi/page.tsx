import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { getSite } from "@/lib/site/get-site";
import { prodi } from "@/lib/site/prodi";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: `Cara ${prodi.fullName} mengumpulkan, memakai, dan melindungi data pribadi pengunjung website.`,
};

export default async function PrivasiPage() {
  const { kontak } = await getSite();
  const sections: { title: string; body: React.ReactNode }[] = [
    {
      title: "Data yang kami kumpulkan",
      body: (
        <>
          Kami hanya mengumpulkan data yang Anda isi sendiri di formulir
          website, misalnya nama, email, NIM, nomor WhatsApp, dan isi pesan.
          Kolom yang wajib diisi ditandai di setiap formulir.
        </>
      ),
    },
    {
      title: "Untuk apa data dipakai",
      body: (
        <>
          Data dipakai hanya untuk menindaklanjuti kiriman Anda: menjawab
          pertanyaan, memproses permohonan, mendata peserta acara, atau
          menerbitkan sertifikat. Data tidak dijual dan tidak dibagikan ke pihak
          lain di luar keperluan layanan prodi.
        </>
      ),
    },
    {
      title: "Data yang tampil di website",
      body: (
        <>
          Data pribadi tidak ditampilkan di website, kecuali Anda menyetujuinya
          secara tertulis di formulir. Contohnya laporan prestasi, yang bisa
          dimuat setelah diverifikasi admin.
        </>
      ),
    },
    {
      title: "Siapa yang dapat mengakses",
      body: (
        <>
          Kiriman formulir hanya dapat dibuka pengurus website yang ditunjuk
          prodi melalui akun masing-masing.
        </>
      ),
    },
    {
      title: "Statistik kunjungan",
      body: (
        <>
          Kami menghitung jumlah kunjungan per halaman tanpa cookie dan tanpa
          menyimpan identitas pengunjung. Cookie hanya dipakai untuk login
          pengurus.
        </>
      ),
    },
    {
      title: "Hak Anda",
      body: (
        <>
          Sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data
          Pribadi, Anda dapat meminta salinan, perbaikan, atau penghapusan data
          Anda. Kirim permintaan ke{" "}
          <a
            href={`mailto:${kontak.email}`}
            className="font-semibold text-accent hover:underline"
          >
            {kontak.email}
          </a>{" "}
          dengan menyebutkan formulir yang pernah Anda isi.
        </>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        crumb="Privasi"
        title="Kebijakan privasi"
        description={`Cara ${prodi.fullName} mengumpulkan, memakai, dan melindungi data pribadi Anda.`}
      />
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-[720px] gap-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-[19px] font-bold tracking-[-0.01em] text-label">
                {s.title}
              </h2>
              <p className="mt-2 text-[16px] leading-[1.65] text-label-2">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
