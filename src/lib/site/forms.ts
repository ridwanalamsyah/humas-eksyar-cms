/**
 * Definisi formulir publik website prodi. Satu definisi dipakai untuk:
 * tampilan formulir, validasi server, kotak masuk CMS, dan ekspor CSV.
 */
import { z } from "zod";

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "number"
  | "date"
  | "textarea"
  | "select"
  | "rating"
  | "checkbox";

export type FormField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  /** Pilihan diambil dari data website saat halaman dirender. */
  optionsFrom?: "dosen" | "ruangAlat" | "lowongan" | "prospekKarir" | "acara";
  placeholder?: string;
  hint?: string;
  max?: number;
  /** Skala rating (default 5). */
  scale?: number;
};

export type FormDef = {
  slug: string;
  title: string;
  description: string;
  group: "Layanan" | "Mahasiswa" | "Alumni" | "Masyarakat & mitra" | "Dosen";
  fields: FormField[];
  success: string;
  /** Pernyataan persetujuan yang wajib dicentang. */
  consent?: string;
  /** Tidak ditampilkan di daftar formulir (dipakai tersemat, mis. pendaftaran acara). */
  embedded?: boolean;
  /** Sudah tidak dipakai: tidak menerima kiriman baru, tapi kiriman lama tetap terbaca di kotak masuk. */
  retired?: boolean;
  /** Kolom yang dipakai sebagai judul ringkas di kotak masuk. */
  titleField: string;
};

const nama: FormField = {
  name: "nama",
  label: "Nama lengkap",
  type: "text",
  required: true,
  max: 120,
};
const email: FormField = {
  name: "email",
  label: "Email",
  type: "email",
  required: true,
};
const wa: FormField = {
  name: "wa",
  label: "Nomor WhatsApp",
  type: "tel",
  max: 20,
};
const nim: FormField = { name: "nim", label: "NIM", type: "text", max: 20 };

export const FORMS: FormDef[] = [
  {
    slug: "saran",
    title: "Kritik & saran",
    description:
      "Sampaikan masukan untuk layanan, perkuliahan, fasilitas, atau website prodi. Boleh tanpa nama.",
    group: "Layanan",
    titleField: "topik",
    success:
      "Terima kasih. Masukan Anda sudah kami terima dan akan ditindaklanjuti.",
    fields: [
      { name: "nama", label: "Nama (opsional)", type: "text", max: 120 },
      {
        name: "peran",
        label: "Saya adalah",
        type: "select",
        required: true,
        options: [
          "Mahasiswa",
          "Dosen",
          "Tenaga kependidikan",
          "Alumni",
          "Orang tua/wali",
          "Masyarakat umum",
        ],
      },
      {
        name: "topik",
        label: "Topik",
        type: "select",
        required: true,
        options: [
          "Akademik & perkuliahan",
          "Layanan administrasi",
          "Fasilitas",
          "Website & informasi",
          "Lainnya",
        ],
      },
      {
        name: "pesan",
        label: "Kritik atau saran",
        type: "textarea",
        required: true,
        max: 3000,
      },
      {
        name: "email",
        label: "Email (opsional, jika ingin dibalas)",
        type: "email",
      },
    ],
  },
  {
    slug: "survei",
    title: "Survei kepuasan layanan",
    description:
      "Penilaian singkat atas layanan Program Studi Ekonomi Syariah. Hasilnya dipakai untuk evaluasi mutu.",
    group: "Layanan",
    titleField: "layanan",
    success: "Terima kasih telah mengisi survei kepuasan layanan.",
    fields: [
      {
        name: "peran",
        label: "Saya adalah",
        type: "select",
        required: true,
        options: [
          "Mahasiswa",
          "Dosen",
          "Tenaga kependidikan",
          "Alumni",
          "Mitra",
        ],
      },
      {
        name: "layanan",
        label: "Layanan yang dinilai",
        type: "select",
        required: true,
        options: [
          "Administrasi prodi",
          "Bimbingan akademik",
          "Bimbingan skripsi",
          "Perkuliahan",
          "Informasi & website",
          "Fasilitas",
        ],
      },
      {
        name: "kejelasan",
        label: "Kejelasan informasi",
        type: "rating",
        required: true,
      },
      {
        name: "kecepatan",
        label: "Kecepatan layanan",
        type: "rating",
        required: true,
      },
      {
        name: "keramahan",
        label: "Keramahan petugas",
        type: "rating",
        required: true,
      },
      {
        name: "kepuasan",
        label: "Kepuasan secara keseluruhan",
        type: "rating",
        required: true,
      },
      { name: "saran", label: "Saran perbaikan", type: "textarea", max: 2000 },
    ],
  },
  {
    slug: "prestasi",
    title: "Lapor prestasi",
    description:
      "Mahasiswa atau dosen yang meraih prestasi dapat melapor di sini. Setelah diverifikasi, prestasi ditampilkan di website.",
    group: "Mahasiswa",
    titleField: "prestasi",
    success:
      "Laporan prestasi diterima. Tim akan memverifikasi sebelum ditampilkan.",
    consent:
      "Saya menyetujui nama, foto, dan prestasi ini dipublikasikan di website dan media sosial prodi.",
    fields: [
      nama,
      nim,
      {
        name: "kategori",
        label: "Kategori",
        type: "select",
        required: true,
        options: ["Mahasiswa", "Dosen", "Alumni"],
      },
      {
        name: "prestasi",
        label: "Prestasi (mis. Juara 1 Lomba Esai Ekonomi Syariah Nasional)",
        type: "text",
        required: true,
        max: 200,
      },
      {
        name: "tingkat",
        label: "Tingkat",
        type: "select",
        required: true,
        options: [
          "Kampus",
          "Kota/Kabupaten",
          "Provinsi",
          "Nasional",
          "Internasional",
        ],
      },
      {
        name: "penyelenggara",
        label: "Penyelenggara",
        type: "text",
        required: true,
        max: 160,
      },
      { name: "tanggal", label: "Tanggal", type: "date", required: true },
      {
        name: "bukti",
        label: "Tautan bukti (sertifikat/foto di Google Drive)",
        type: "url",
        required: true,
      },
      email,
      wa,
    ],
  },
  {
    slug: "alumni",
    retired: true,
    title: "Kabar alumni",
    description:
      "Alumni Ekonomi Syariah, bagikan kabar karier Anda. Data dipakai untuk evaluasi kurikulum dan direktori alumni (bila diizinkan).",
    group: "Alumni",
    titleField: "nama",
    success: "Terima kasih, kabar Anda sudah kami terima.",
    fields: [
      nama,
      { name: "lulus", label: "Tahun lulus", type: "number", required: true },
      {
        name: "pekerjaan",
        label: "Pekerjaan / jabatan",
        type: "text",
        required: true,
        max: 160,
      },
      {
        name: "instansi",
        label: "Instansi / usaha",
        type: "text",
        required: true,
        max: 160,
      },
      {
        name: "bidang",
        label: "Bidang kerja",
        type: "select",
        required: true,
        optionsFrom: "prospekKarir",
      },
      { name: "kota", label: "Kota", type: "text", max: 80 },
      { name: "linkedin", label: "LinkedIn (opsional)", type: "url" },
      {
        name: "testimoni",
        label: "Pesan/kesan untuk adik tingkat (opsional)",
        type: "textarea",
        max: 600,
      },
      {
        name: "direktori",
        label:
          "Tampilkan nama, pekerjaan, dan instansi saya di direktori alumni",
        type: "checkbox",
      },
      {
        name: "mentor",
        label: "Saya bersedia menjadi mentor bagi mahasiswa",
        type: "checkbox",
      },
      email,
    ],
  },
  {
    slug: "pengguna-lulusan",
    title: "Survei pengguna lulusan",
    description:
      "Untuk atasan/instansi tempat alumni Ekonomi Syariah bekerja. Penilaian Anda membantu kami menyempurnakan kurikulum.",
    group: "Alumni",
    titleField: "instansi",
    success: "Terima kasih atas penilaian Anda.",
    fields: [
      {
        name: "instansi",
        label: "Nama instansi",
        type: "text",
        required: true,
        max: 160,
      },
      {
        name: "penilai",
        label: "Nama penilai",
        type: "text",
        required: true,
        max: 120,
      },
      { name: "jabatan", label: "Jabatan penilai", type: "text", max: 120 },
      {
        name: "alumni",
        label: "Nama alumni yang dinilai",
        type: "text",
        required: true,
        max: 120,
      },
      {
        name: "etika",
        label: "Etika & integritas",
        type: "rating",
        scale: 4,
        required: true,
      },
      {
        name: "keahlian",
        label: "Keahlian bidang ekonomi syariah",
        type: "rating",
        scale: 4,
        required: true,
      },
      {
        name: "bahasa",
        label: "Kemampuan bahasa asing",
        type: "rating",
        scale: 4,
        required: true,
      },
      {
        name: "ti",
        label: "Penggunaan teknologi informasi",
        type: "rating",
        scale: 4,
        required: true,
      },
      {
        name: "komunikasi",
        label: "Kemampuan komunikasi",
        type: "rating",
        scale: 4,
        required: true,
      },
      {
        name: "kerjasama",
        label: "Kerja sama tim",
        type: "rating",
        scale: 4,
        required: true,
      },
      {
        name: "pengembangan",
        label: "Pengembangan diri",
        type: "rating",
        scale: 4,
        required: true,
      },
      {
        name: "saran",
        label: "Saran untuk prodi",
        type: "textarea",
        max: 2000,
      },
      email,
    ],
  },
  {
    slug: "mentoring",
    retired: true,
    title: "Daftar program mentoring",
    description:
      "Mahasiswa dapat mengajukan diri untuk dibimbing alumni sesuai bidang karier yang diminati.",
    group: "Mahasiswa",
    titleField: "nama",
    success:
      "Pendaftaran diterima. Kami akan mencocokkan Anda dengan alumni yang sesuai.",
    fields: [
      nama,
      nim,
      { name: "angkatan", label: "Angkatan", type: "number", required: true },
      {
        name: "bidang",
        label: "Bidang yang diminati",
        type: "select",
        required: true,
        optionsFrom: "prospekKarir",
      },
      {
        name: "tujuan",
        label: "Apa yang ingin Anda pelajari dari mentor?",
        type: "textarea",
        required: true,
        max: 1000,
      },
      email,
      wa,
    ],
  },
  {
    slug: "rekrutmen",
    title: "Asisten dosen & relawan",
    description:
      "Daftar untuk posisi asisten dosen, asisten laboratorium, atau relawan kegiatan prodi yang sedang dibuka.",
    group: "Mahasiswa",
    titleField: "posisi",
    success:
      "Pendaftaran diterima. Panitia akan menghubungi kandidat terpilih.",
    fields: [
      {
        name: "posisi",
        label: "Posisi",
        type: "select",
        required: true,
        optionsFrom: "lowongan",
      },
      nama,
      nim,
      { name: "semester", label: "Semester", type: "number", required: true },
      {
        name: "motivasi",
        label: "Motivasi & pengalaman",
        type: "textarea",
        required: true,
        max: 2000,
      },
      { name: "cv", label: "Tautan CV/portofolio (opsional)", type: "url" },
      email,
      wa,
    ],
  },
  {
    slug: "bimbingan",
    title: "Janji konsultasi dosen",
    description:
      "Ajukan jadwal konsultasi akademik atau bimbingan dengan dosen. Dosen/prodi akan mengonfirmasi lewat email atau WhatsApp.",
    group: "Layanan",
    titleField: "dosen",
    success: "Permintaan terkirim. Tunggu konfirmasi jadwal dari dosen/prodi.",
    fields: [
      {
        name: "dosen",
        label: "Dosen",
        type: "select",
        required: true,
        optionsFrom: "dosen",
      },
      {
        name: "tanggal",
        label: "Tanggal yang diinginkan",
        type: "date",
        required: true,
      },
      {
        name: "waktu",
        label: "Perkiraan waktu (mis. 10.00–11.00)",
        type: "text",
        max: 40,
      },
      {
        name: "topik",
        label: "Topik konsultasi",
        type: "textarea",
        required: true,
        max: 1000,
      },
      nama,
      nim,
      email,
      wa,
    ],
  },
  {
    slug: "pinjam",
    title: "Peminjaman ruang & alat",
    description:
      "Ajukan peminjaman ruang atau fasilitas prodi. Peminjaman sah setelah dikonfirmasi pengelola.",
    group: "Layanan",
    titleField: "item",
    success: "Pengajuan peminjaman diterima. Tunggu konfirmasi dari pengelola.",
    fields: [
      {
        name: "item",
        label: "Ruang/alat",
        type: "select",
        required: true,
        optionsFrom: "ruangAlat",
      },
      { name: "tanggal", label: "Tanggal", type: "date", required: true },
      {
        name: "waktu",
        label: "Jam (mis. 13.00–15.00)",
        type: "text",
        required: true,
        max: 40,
      },
      {
        name: "keperluan",
        label: "Keperluan",
        type: "textarea",
        required: true,
        max: 1000,
      },
      nama,
      {
        name: "asal",
        label: "NIM / organisasi / instansi",
        type: "text",
        required: true,
        max: 120,
      },
      email,
      wa,
    ],
  },
  {
    slug: "kerjasama",
    title: "Ajak kerja sama",
    description:
      "Untuk instansi, perusahaan, atau komunitas yang ingin bermitra: magang, narasumber, penelitian, pengabdian, atau MoU.",
    group: "Masyarakat & mitra",
    titleField: "instansi",
    success:
      "Terima kasih. Pengajuan kerja sama akan diteruskan ke pimpinan prodi.",
    fields: [
      nama,
      {
        name: "instansi",
        label: "Instansi",
        type: "text",
        required: true,
        max: 160,
      },
      { name: "jabatan", label: "Jabatan", type: "text", max: 120 },
      {
        name: "jenis",
        label: "Bentuk kerja sama",
        type: "select",
        required: true,
        options: [
          "Magang",
          "Narasumber / kuliah tamu",
          "Penelitian",
          "Pengabdian masyarakat",
          "MoU / PKS",
          "Liputan media",
          "Lainnya",
        ],
      },
      {
        name: "pesan",
        label: "Penjelasan singkat",
        type: "textarea",
        required: true,
        max: 3000,
      },
      email,
      wa,
    ],
  },
  {
    slug: "konsultasi",
    retired: true,
    title: "Konsultasi ekonomi syariah",
    description:
      "Layanan pengabdian prodi untuk masyarakat dan UMKM: tanyakan seputar zakat, wakaf, keuangan syariah, atau usaha halal.",
    group: "Masyarakat & mitra",
    titleField: "kategori",
    success:
      "Pertanyaan diterima. Jawaban akan dikirim ke email Anda, dan bila diizinkan, ditampilkan (tanpa nama) di halaman Tanya Jawab.",
    fields: [
      nama,
      {
        name: "kategori",
        label: "Kategori",
        type: "select",
        required: true,
        options: [
          "Zakat",
          "Wakaf",
          "Perbankan & keuangan syariah",
          "Usaha & sertifikasi halal",
          "Investasi syariah",
          "Lainnya",
        ],
      },
      {
        name: "pertanyaan",
        label: "Pertanyaan",
        type: "textarea",
        required: true,
        max: 3000,
      },
      {
        name: "boleh_tampil",
        label: "Pertanyaan boleh ditampilkan tanpa nama di halaman Tanya Jawab",
        type: "checkbox",
      },
      email,
    ],
  },
  {
    slug: "tanya",
    title: "Kirim pertanyaan",
    description:
      "Belum menemukan jawaban di FAQ? Kirim pertanyaan seputar perkuliahan, administrasi, atau kegiatan prodi. Jawaban dikirim ke email Anda.",
    group: "Layanan",
    embedded: true,
    titleField: "pertanyaan",
    success: "Pertanyaan terkirim. Jawaban akan dikirim ke email Anda.",
    fields: [
      nama,
      email,
      {
        name: "pertanyaan",
        label: "Pertanyaan",
        type: "textarea",
        required: true,
        max: 1500,
      },
    ],
  },
  {
    slug: "komentar",
    retired: true,
    title: "Komentar",
    description: "Komentar tampil setelah dimoderasi.",
    group: "Layanan",
    embedded: true,
    titleField: "komentar",
    success: "Komentar terkirim dan akan tampil setelah dimoderasi.",
    fields: [
      { name: "nama", label: "Nama", type: "text", required: true, max: 80 },
      {
        name: "komentar",
        label: "Komentar",
        type: "textarea",
        required: true,
        max: 1500,
      },
    ],
  },
  {
    slug: "acara",
    title: "Pendaftaran acara",
    description: "Daftar untuk mengikuti acara prodi.",
    group: "Layanan",
    embedded: true,
    titleField: "nama",
    success:
      "Pendaftaran berhasil. Simpan email konfirmasi dan datang tepat waktu.",
    fields: [
      nama,
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          "Mahasiswa UIN SGD",
          "Mahasiswa kampus lain",
          "Dosen/tendik",
          "Umum",
        ],
      },
      {
        name: "instansi",
        label: "Asal kampus / instansi",
        type: "text",
        max: 160,
      },
      email,
      wa,
    ],
  },
  {
    slug: "profil-dosen",
    title: "Pembaruan profil dosen",
    description:
      "Untuk dosen Ekonomi Syariah: perbarui data profil yang tampil di website. Perubahan diterapkan setelah diverifikasi admin.",
    group: "Dosen",
    titleField: "nama",
    success:
      "Terima kasih, Bapak/Ibu. Pembaruan akan diterapkan setelah diverifikasi.",
    fields: [
      {
        name: "nama",
        label: "Nama lengkap dengan gelar",
        type: "text",
        required: true,
        max: 160,
      },
      {
        name: "jabatan",
        label: "Jabatan (mis. Dosen, Lektor Kepala)",
        type: "text",
        max: 160,
      },
      {
        name: "keahlian",
        label: "Bidang keahlian (pisahkan dengan koma)",
        type: "text",
        max: 300,
      },
      {
        name: "pendidikan",
        label: "Riwayat pendidikan",
        type: "textarea",
        max: 1000,
      },
      { name: "sinta", label: "Tautan profil SINTA", type: "url" },
      { name: "scholar", label: "Tautan Google Scholar", type: "url" },
      {
        name: "foto",
        label: "Tautan foto formal (Google Drive/website)",
        type: "url",
      },
      {
        name: "konsultasi",
        label: "Jadwal konsultasi (mis. Selasa 10.00–12.00, R. Prodi)",
        type: "text",
        max: 200,
      },
      email,
    ],
  },
];

/** Formulir yang masih menerima kiriman dari publik. */
export const ACTIVE_FORMS = FORMS.filter((f) => !f.retired);
export const findActiveForm = (slug: string) =>
  ACTIVE_FORMS.find((f) => f.slug === slug);
export const findForm = (slug: string) =>
  FORMS.find((f) => f.slug === slug) ?? null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/[^\s]+$/i;

/** Validator zod dari definisi formulir (opsi dinamis dicek terhadap `options`). */
export function formSchema(
  def: FormDef,
  dynamicOptions: Record<string, string[]> = {},
) {
  const shape: Record<string, z.ZodType> = {};
  for (const f of def.fields) {
    const opts =
      f.options ?? (f.optionsFrom ? dynamicOptions[f.optionsFrom] : undefined);
    let s: z.ZodType;
    switch (f.type) {
      case "checkbox":
        s = z.boolean().optional();
        break;
      case "rating":
        s = z
          .number()
          .int()
          .min(1)
          .max(f.scale ?? 5);
        if (!f.required) s = s.optional();
        break;
      case "number":
        s = z.coerce.number().int().min(0).max(100000);
        if (!f.required) s = s.optional();
        break;
      default: {
        let str = z
          .string()
          .trim()
          .max(f.max ?? (f.type === "textarea" ? 3000 : 300));
        if (f.type === "email")
          str = str.refine(
            (v) => !v || EMAIL.test(v),
            "Email tidak valid",
          ) as never;
        if (f.type === "url")
          str = str.refine(
            (v) => !v || URL_RE.test(v),
            "Tautan harus diawali https://",
          ) as never;
        if (f.type === "date")
          str = str.refine(
            (v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v),
            "Tanggal tidak valid",
          ) as never;
        if (f.type === "select" && opts?.length)
          str = str.refine(
            (v) => !v || opts.includes(v),
            "Pilihan tidak valid",
          ) as never;
        s = f.required ? str.min(1, `${f.label} wajib diisi`) : str.optional();
      }
    }
    shape[f.name] = s;
  }
  return z.object(shape);
}
