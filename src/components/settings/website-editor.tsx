"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  ImagePlus,
  Plus,
  RotateCcw,
  Sparkles,
  Save,
  Trash2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { SegmentedTabs } from "@/components/common/tabs";
import type { WebsiteConfig } from "@/lib/site/schema";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Spesifikasi field & bagian                                          */
/* ------------------------------------------------------------------ */

type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "image"
  | "file"
  | "date"
  | "number"
  | "lines"
  | "paragraphs"
  | "checkbox"
  | "pairs";

interface FieldSpec {
  name: string;
  label: string;
  type: FieldType;
  hint?: string;
  placeholder?: string;
  /** Lebar penuh di grid 2 kolom. */
  wide?: boolean;
}

type AnyObj = Record<string, unknown>;

type SectionSpec =
  | {
      key: keyof WebsiteConfig;
      title: string;
      hint?: string;
      kind: "object";
      fields: FieldSpec[];
    }
  | {
      key: keyof WebsiteConfig;
      title: string;
      hint?: string;
      kind: "list";
      itemTitle: (item: AnyObj, i: number) => string;
      fields: FieldSpec[];
      empty: AnyObj;
    }
  | {
      key: keyof WebsiteConfig;
      title: string;
      hint?: string;
      kind: "field";
      field: FieldSpec;
    }
  | { key: "kurikulum"; title: string; hint?: string; kind: "kurikulum" };

const titled: FieldSpec[] = [
  { name: "title", label: "Judul", type: "text" },
  { name: "description", label: "Deskripsi", type: "textarea", wide: true },
];

const person: FieldSpec[] = [
  { name: "name", label: "Nama & gelar", type: "text" },
  { name: "role", label: "Jabatan", type: "text" },
  { name: "photo", label: "Foto (potret 4:5)", type: "image", wide: true },
];

const TABS: { value: string; label: string; sections: SectionSpec[] }[] = [
  {
    value: "umum",
    label: "Umum",
    sections: [
      {
        key: "identity",
        title: "Beranda & identitas",
        kind: "object",
        fields: [
          { name: "heroTitle", label: "Judul utama", type: "text" },
          { name: "tagline", label: "Tagline", type: "text" },
          {
            name: "heroDescription",
            label: "Deskripsi beranda",
            type: "textarea",
            wide: true,
          },
          {
            name: "heroImage",
            label: "Foto utama beranda (opsional, 16:9)",
            type: "image",
            wide: true,
          },
          {
            name: "statement",
            label: "Paragraf pengantar (beranda)",
            type: "textarea",
            wide: true,
            hint: "Tampil besar di bawah hero; kata-katanya menyala saat digulir.",
          },
          { name: "degree", label: "Gelar lulusan", type: "text" },
          { name: "totalCredits", label: "Total SKS", type: "number" },
          { name: "normalDuration", label: "Masa studi normal", type: "text" },
          {
            name: "maxSemesters",
            label: "Batas maksimal semester",
            type: "number",
          },
          {
            name: "prodiAccreditation",
            label: "Akreditasi prodi",
            type: "text",
            hint: 'Kosongkan untuk menampilkan "Terakreditasi".',
          },
          {
            name: "universityAccreditation",
            label: "Akreditasi UIN",
            type: "text",
          },
          {
            name: "universityAccreditationPeriod",
            label: "Masa berlaku akreditasi UIN",
            type: "text",
          },
        ],
      },
      {
        key: "kontak",
        title: "Kontak & media sosial",
        kind: "object",
        fields: [
          { name: "email", label: "Email", type: "text" },
          { name: "hours", label: "Jam layanan", type: "text" },
          {
            name: "address",
            label: "Alamat (baris 1)",
            type: "text",
            wide: true,
          },
          {
            name: "street",
            label: "Alamat (baris 2)",
            type: "text",
            wide: true,
          },
          { name: "instagram", label: "URL Instagram", type: "url" },
          { name: "instagramHandle", label: "Handle Instagram", type: "text" },
          { name: "tiktok", label: "URL TikTok", type: "url" },
          { name: "x", label: "URL X", type: "url" },
          { name: "facebookName", label: "Nama Facebook", type: "text" },
          { name: "linktree", label: "URL Linktree", type: "url" },
          { name: "website", label: "Website resmi prodi", type: "url" },
          { name: "pmbUrl", label: "URL portal PMB", type: "url" },
          {
            name: "mapsUrl",
            label: "URL Google Maps",
            type: "url",
            wide: true,
          },
          {
            name: "whatsapp",
            label: "WhatsApp prodi (opsional)",
            type: "url",
            wide: true,
            placeholder: "https://wa.me/62812xxxxxxx",
            hint: 'Bila diisi, muncul tombol "Tanya prodi" di pojok website.',
          },
        ],
      },
    ],
  },
  {
    value: "promosi",
    label: "Promosi",
    sections: [
      {
        key: "kampanyePmb",
        title: "Kampanye PMB (hitung mundur)",
        hint: "Saat aktif, muncul pita kampanye dengan hitung mundur di beranda, halaman Mahasiswa Baru, dan halaman tautan bio.",
        kind: "object",
        fields: [
          {
            name: "aktif",
            label: "Tampilkan kampanye",
            type: "checkbox",
            wide: true,
          },
          {
            name: "judul",
            label: "Judul kampanye",
            type: "text",
            wide: true,
            placeholder: "Pendaftaran Mandiri UIN SGD 2027 dibuka",
          },
          { name: "tenggat", label: "Tenggat pendaftaran", type: "date" },
          { name: "teks", label: "Keterangan", type: "textarea", wide: true },
        ],
      },
      {
        key: "statusLayanan",
        title: "Status layanan prodi hari ini",
        hint: "Tampil di halaman Kontak & Layanan. Kosongkan untuk menyembunyikan.",
        kind: "object",
        fields: [
          {
            name: "status",
            label: "Status",
            type: "text",
            placeholder: "Buka / Terbatas / Tutup",
          },
          {
            name: "pesan",
            label: "Pesan",
            type: "text",
            wide: true,
            placeholder: "Kaprodi dinas luar, layanan TTD hingga Kamis",
          },
        ],
      },
      {
        key: "apresiasi",
        title: "Apresiasi bulanan (Insan Eksyar)",
        hint: "Entri dengan bulan terbaru tampil di beranda.",
        kind: "list",
        itemTitle: (i) => `${i.bulan || "YYYY-MM"} · ${i.nama || "Nama"}`,
        fields: [
          {
            name: "bulan",
            label: "Bulan (YYYY-MM)",
            type: "text",
            placeholder: "2026-10",
          },
          { name: "nama", label: "Nama", type: "text" },
          {
            name: "peran",
            label: "Peran",
            type: "text",
            placeholder: "Mahasiswa / Dosen / Tendik",
          },
          {
            name: "alasan",
            label: "Alasan apresiasi",
            type: "textarea",
            wide: true,
          },
          {
            name: "photo",
            label: "Foto (opsional)",
            type: "image",
            wide: true,
          },
        ],
        empty: {
          bulan: "",
          nama: "",
          peran: "Mahasiswa",
          alasan: "",
          photo: null,
        },
      },
      {
        key: "medsos",
        title: "Media sosial tambahan",
        kind: "object",
        fields: [
          {
            name: "youtubeChannelId",
            label: "ID kanal YouTube (UC…)",
            type: "text",
            hint: "Video terbaru tampil otomatis di beranda.",
          },
          {
            name: "whatsappChannel",
            label: "Tautan Saluran WhatsApp",
            type: "url",
          },
        ],
      },
      {
        key: "pressKit",
        title: "Ruang media",
        kind: "object",
        fields: [
          {
            name: "profilSingkat",
            label: "Profil singkat untuk media",
            type: "textarea",
            wide: true,
          },
          { name: "kontakMedia", label: "Kontak media (email)", type: "text" },
        ],
      },
    ],
  },
  {
    value: "profil",
    label: "Profil",
    sections: [
      {
        key: "profil",
        title: "Sejarah, visi, misi & tujuan",
        kind: "object",
        fields: [
          {
            name: "sejarah",
            label: "Sejarah",
            type: "paragraphs",
            wide: true,
            hint: "Pisahkan paragraf dengan baris kosong.",
          },
          { name: "visi", label: "Visi", type: "textarea", wide: true },
          {
            name: "misi",
            label: "Misi",
            type: "lines",
            wide: true,
            hint: "Satu butir per baris.",
          },
          {
            name: "tujuan",
            label: "Tujuan",
            type: "lines",
            wide: true,
            hint: "Satu butir per baris.",
          },
        ],
      },
      {
        key: "timeline",
        title: "Timeline sejarah",
        kind: "list",
        itemTitle: (i) => `${i.year || "----"} · ${i.title || "Tonggak baru"}`,
        fields: [
          { name: "year", label: "Tahun", type: "text" },
          { name: "title", label: "Judul", type: "text" },
          {
            name: "description",
            label: "Keterangan",
            type: "textarea",
            wide: true,
          },
        ],
        empty: { year: "", title: "", description: "" },
      },
      {
        key: "pimpinan",
        title: "Pimpinan",
        kind: "list",
        itemTitle: (p) => String(p.name || "Pimpinan baru"),
        fields: person,
        empty: { name: "", role: "", photo: null },
      },
      {
        key: "struktur",
        title: "Struktur organisasi",
        hint: "Level 1 = paling atas (Kaprodi), level 2 = di bawahnya, dst.",
        kind: "list",
        itemTitle: (i) => `${i.jabatan || "Jabatan"} · ${i.nama || "Nama"}`,
        fields: [
          { name: "jabatan", label: "Jabatan", type: "text" },
          { name: "nama", label: "Nama", type: "text" },
          { name: "level", label: "Level (1–4)", type: "number" },
        ],
        empty: { jabatan: "", nama: "", level: 2 },
      },
      {
        key: "statistik",
        title: "Statistik prodi per tahun",
        hint: "Tampil sebagai grafik di halaman Data & statistik. Sumber: PDDikti/data prodi.",
        kind: "list",
        itemTitle: (i) => String(i.tahun || "Tahun"),
        fields: [
          { name: "tahun", label: "Tahun", type: "text", placeholder: "2026" },
          { name: "mahasiswaAktif", label: "Mahasiswa aktif", type: "number" },
          { name: "mahasiswaBaru", label: "Mahasiswa baru", type: "number" },
          { name: "lulusan", label: "Lulusan", type: "number" },
          { name: "dosen", label: "Dosen", type: "number" },
        ],
        empty: {
          tahun: "",
          mahasiswaAktif: 0,
          mahasiswaBaru: 0,
          lulusan: 0,
          dosen: 0,
        },
      },
      {
        key: "infografis",
        title: "Infografis",
        kind: "list",
        itemTitle: (i) => String(i.judul || "Infografis baru"),
        fields: [
          { name: "judul", label: "Judul", type: "text", wide: true },
          {
            name: "satuan",
            label: "Satuan",
            type: "text",
            placeholder: "miliar rupiah",
          },
          { name: "sumber", label: "Sumber data", type: "text" },
          {
            name: "deskripsi",
            label: "Keterangan",
            type: "textarea",
            wide: true,
          },
          {
            name: "data",
            label: "Data (satu per baris: Label | angka)",
            type: "pairs",
            wide: true,
          },
        ],
        empty: { judul: "", deskripsi: "", satuan: "", sumber: "", data: [] },
      },
    ],
  },
  {
    value: "dosen",
    label: "Dosen",
    sections: [
      {
        key: "dosen",
        title: "Daftar dosen",
        kind: "list",
        itemTitle: (p) => String(p.name || "Dosen baru"),
        fields: [
          ...person,
          {
            name: "expertise",
            label: "Bidang keahlian",
            type: "lines",
            wide: true,
            hint: "Satu bidang per baris.",
          },
          {
            name: "pendidikan",
            label: "Riwayat pendidikan",
            type: "textarea",
            wide: true,
          },
          { name: "sinta", label: "Profil SINTA", type: "url" },
          { name: "scholar", label: "Google Scholar", type: "url" },
          {
            name: "konsultasi",
            label: "Jadwal konsultasi",
            type: "text",
            wide: true,
            placeholder: "Selasa 10.00–12.00, Ruang Prodi",
          },
        ],
        empty: { name: "", role: "Dosen", photo: null, expertise: [] },
      },
      {
        key: "tendik",
        title: "Tenaga kependidikan & staf",
        hint: "Staf administrasi prodi, laboran, dll. Tampil di halaman Dosen.",
        kind: "list",
        itemTitle: (p) => String(p.name || "Staf baru"),
        fields: person,
        empty: { name: "", role: "Staf Administrasi", photo: null },
      },
    ],
  },
  {
    value: "riset",
    label: "Riset",
    sections: [
      {
        key: "publikasi",
        title: "Publikasi & penelitian dosen",
        hint: "Artikel jurnal, buku, prosiding, dan hasil penelitian. Tampil di halaman Penelitian.",
        kind: "list",
        itemTitle: (i) => String(i.title || "Publikasi baru"),
        fields: [
          { name: "title", label: "Judul", type: "text", wide: true },
          { name: "authors", label: "Penulis", type: "text" },
          { name: "year", label: "Tahun", type: "text", placeholder: "2026" },
          {
            name: "type",
            label: "Jenis",
            type: "text",
            placeholder: "Artikel jurnal / Buku / Prosiding / Penelitian",
          },
          { name: "venue", label: "Jurnal / penerbit", type: "text" },
          {
            name: "url",
            label: "Tautan (DOI / jurnal)",
            type: "url",
            wide: true,
          },
        ],
        empty: {
          title: "",
          authors: "",
          year: "",
          venue: "",
          type: "Artikel jurnal",
          url: "",
        },
      },
      {
        key: "jurnal",
        title: "Jurnal ilmiah",
        kind: "list",
        itemTitle: (i) => String(i.name || "Jurnal baru"),
        fields: [
          { name: "name", label: "Nama jurnal", type: "text" },
          { name: "url", label: "Tautan", type: "url" },
          {
            name: "description",
            label: "Keterangan",
            type: "textarea",
            wide: true,
          },
        ],
        empty: { name: "", description: "", url: "" },
      },
    ],
  },
  {
    value: "galeri",
    label: "Galeri",
    sections: [
      {
        key: "galeri",
        title: "Foto kegiatan",
        hint: "Foto tampil di halaman Galeri (dengan filter album) dan beranda.",
        kind: "list",
        itemTitle: (i) => String(i.caption || "Foto baru"),
        fields: [
          { name: "image", label: "Foto", type: "image", wide: true },
          { name: "caption", label: "Keterangan", type: "text", wide: true },
          {
            name: "album",
            label: "Album",
            type: "text",
            placeholder: "Wisuda / Kuliah praktisi / PkM",
          },
          { name: "date", label: "Tanggal", type: "date" },
        ],
        empty: { image: "", caption: "", album: "Kegiatan", date: "" },
      },
      {
        key: "video",
        title: "Video (YouTube)",
        hint: "Video pertama tampil sebagai video profil di beranda.",
        kind: "list",
        itemTitle: (i) => String(i.title || "Video baru"),
        fields: [
          { name: "title", label: "Judul", type: "text" },
          { name: "url", label: "Tautan YouTube", type: "url" },
          {
            name: "kategori",
            label: "Kategori",
            type: "text",
            placeholder: "Profil / Kajian / Kuliah umum / Podcast",
          },
        ],
        empty: { title: "", url: "", kategori: "Kegiatan" },
      },
    ],
  },
  {
    value: "prestasi",
    label: "Prestasi",
    sections: [
      {
        key: "prestasi",
        title: "Selamat & Sukses",
        hint: "Tampil di beranda dan halaman Mahasiswa. Urutan teratas tampil pertama.",
        kind: "list",
        itemTitle: (p) => String(p.name || "Prestasi baru"),
        fields: [
          { name: "name", label: "Nama", type: "text" },
          {
            name: "group",
            label: "Kategori",
            type: "text",
            placeholder: "Mahasiswa / Dosen / Alumni",
          },
          {
            name: "achievement",
            label: "Prestasi / amanah",
            type: "text",
            wide: true,
          },
          {
            name: "photo",
            label: "Foto (potret 4:5)",
            type: "image",
            wide: true,
          },
        ],
        empty: { name: "", group: "Mahasiswa", achievement: "", photo: null },
      },
    ],
  },
  {
    value: "kegiatan",
    label: "Kegiatan",
    sections: [
      {
        key: "kegiatan",
        title: "Sorotan kegiatan",
        hint: "Tampil di beranda (saat belum ada berita CMS), halaman Mahasiswa, dan Berita.",
        kind: "list",
        itemTitle: (k) => String(k.title || "Kegiatan baru"),
        fields: [
          { name: "title", label: "Judul", type: "text", wide: true },
          { name: "date", label: "Tanggal", type: "date" },
          {
            name: "category",
            label: "Kategori",
            type: "text",
            placeholder: "Akademik / Pengabdian / Karir",
          },
          { name: "summary", label: "Ringkasan", type: "textarea", wide: true },
          {
            name: "source",
            label: "Tautan sumber (opsional)",
            type: "url",
            wide: true,
          },
          {
            name: "image",
            label: "Foto (opsional, 16:9)",
            type: "image",
            wide: true,
          },
        ],
        empty: {
          title: "",
          date: new Date().toISOString().slice(0, 10),
          category: "Akademik",
          summary: "",
          source: "",
          image: null,
        },
      },
    ],
  },
  {
    value: "akademik",
    label: "Akademik",
    sections: [
      {
        key: "bidangKajian",
        title: "Bidang kajian",
        kind: "list",
        itemTitle: (i) => String(i.title || "Bidang baru"),
        fields: titled,
        empty: { title: "", description: "" },
      },
      {
        key: "kelompokMataKuliah",
        title: "Kelompok mata kuliah",
        kind: "list",
        itemTitle: (i) => String(i.code || "Kelompok baru"),
        fields: [
          { name: "code", label: "Kode", type: "text" },
          { name: "title", label: "Nama", type: "text" },
          {
            name: "description",
            label: "Deskripsi",
            type: "textarea",
            wide: true,
          },
        ],
        empty: { code: "", title: "", description: "" },
      },
      { key: "kurikulum", title: "Sebaran mata kuliah", kind: "kurikulum" },
      {
        key: "profilLulusan",
        title: "Profil lulusan",
        kind: "list",
        itemTitle: (i) => String(i.title || "Profil baru"),
        fields: titled,
        empty: { title: "", description: "" },
      },
      {
        key: "capaianPembelajaran",
        title: "Capaian pembelajaran",
        kind: "list",
        itemTitle: (i) => String(i.title || "Capaian baru"),
        fields: titled,
        empty: { title: "", description: "" },
      },
      {
        key: "prospekKarir",
        title: "Prospek karir",
        kind: "list",
        itemTitle: (i) => String(i.title || "Karir baru"),
        fields: titled,
        empty: { title: "", description: "" },
      },
    ],
  },
  {
    value: "skripsi",
    label: "Skripsi & RPS",
    sections: [
      {
        key: "peminatan",
        title: "Peminatan / roadmap studi",
        kind: "list",
        itemTitle: (i) => String(i.nama || "Peminatan baru"),
        fields: [
          { name: "nama", label: "Nama peminatan", type: "text" },
          {
            name: "deskripsi",
            label: "Deskripsi",
            type: "textarea",
            wide: true,
          },
          {
            name: "mataKuliah",
            label: "Mata kuliah disarankan (urut)",
            type: "lines",
            wide: true,
          },
          { name: "karier", label: "Arah karier", type: "lines", wide: true },
        ],
        empty: { nama: "", deskripsi: "", mataKuliah: [], karier: [] },
      },
      {
        key: "rps",
        title: "RPS & referensi mata kuliah",
        kind: "list",
        itemTitle: (i) => String(i.mk || "Mata kuliah baru"),
        fields: [
          { name: "mk", label: "Mata kuliah", type: "text" },
          { name: "semester", label: "Semester", type: "text" },
          { name: "url", label: "File RPS", type: "file", wide: true },
          {
            name: "referensi",
            label: "Referensi (satu per baris)",
            type: "lines",
            wide: true,
          },
        ],
        empty: { mk: "", semester: "", url: "", referensi: [] },
      },
      {
        key: "topikSkripsi",
        title: "Topik skripsi yang disarankan dosen",
        kind: "list",
        itemTitle: (i) => String(i.topik || "Topik baru"),
        fields: [
          { name: "topik", label: "Topik", type: "text", wide: true },
          { name: "dosen", label: "Dosen pengusul", type: "text" },
          {
            name: "deskripsi",
            label: "Keterangan",
            type: "textarea",
            wide: true,
          },
        ],
        empty: { topik: "", deskripsi: "", dosen: "" },
      },
      {
        key: "jadwalSidang",
        title: "Jadwal seminar & sidang",
        kind: "list",
        itemTitle: (i) =>
          `${i.tanggal || "Tanggal"} · ${i.nama || "Mahasiswa"}`,
        fields: [
          { name: "tanggal", label: "Tanggal", type: "date" },
          {
            name: "jenis",
            label: "Jenis",
            type: "text",
            placeholder: "Seminar proposal / Sidang munaqasyah",
          },
          { name: "nama", label: "Mahasiswa", type: "text" },
          { name: "ruang", label: "Ruang", type: "text" },
          { name: "judul", label: "Judul", type: "text", wide: true },
        ],
        empty: {
          tanggal: "",
          jenis: "Seminar proposal",
          nama: "",
          judul: "",
          ruang: "",
        },
      },
      {
        key: "panduanSkripsi",
        title: "Panduan skripsi",
        kind: "list",
        itemTitle: (i) => String(i.name || "Tautan baru"),
        fields: [
          { name: "name", label: "Judul", type: "text" },
          { name: "url", label: "Tautan / file", type: "url" },
          {
            name: "description",
            label: "Keterangan",
            type: "text",
            wide: true,
          },
        ],
        empty: { name: "", description: "", url: "" },
      },
      {
        key: "integritas",
        title: "Integritas akademik",
        kind: "field",
        field: {
          name: "integritas",
          label: "Poin-poin (pisahkan dengan baris kosong)",
          type: "paragraphs",
          wide: true,
        },
      },
    ],
  },
  {
    value: "mahasiswa",
    label: "Mahasiswa",
    sections: [
      {
        key: "lomba",
        title: "Info lomba",
        kind: "list",
        itemTitle: (i) => String(i.nama || "Lomba baru"),
        fields: [
          { name: "nama", label: "Nama lomba", type: "text", wide: true },
          { name: "penyelenggara", label: "Penyelenggara", type: "text" },
          {
            name: "tingkat",
            label: "Tingkat",
            type: "text",
            placeholder: "Nasional",
          },
          { name: "deadline", label: "Tenggat", type: "date" },
          { name: "url", label: "Tautan info/daftar", type: "url" },
          {
            name: "deskripsi",
            label: "Keterangan",
            type: "textarea",
            wide: true,
          },
        ],
        empty: {
          nama: "",
          penyelenggara: "",
          tingkat: "Nasional",
          deadline: "",
          deskripsi: "",
          url: "",
        },
      },
      {
        key: "lowongan",
        title: "Lowongan (asisten dosen, relawan, magang, kerja)",
        hint: "Kosongkan tautan bila pendaftaran lewat formulir website (Asisten dosen & relawan).",
        kind: "list",
        itemTitle: (i) => String(i.title || "Lowongan baru"),
        fields: [
          { name: "title", label: "Posisi", type: "text", wide: true },
          {
            name: "jenis",
            label: "Jenis",
            type: "text",
            placeholder: "Asisten dosen / Relawan / Magang / Kerja",
          },
          { name: "deadline", label: "Tenggat", type: "date" },
          {
            name: "url",
            label: "Tautan pendaftaran eksternal (opsional)",
            type: "url",
            wide: true,
          },
          {
            name: "deskripsi",
            label: "Keterangan & syarat",
            type: "textarea",
            wide: true,
          },
        ],
        empty: {
          title: "",
          jenis: "Asisten dosen",
          deskripsi: "",
          deadline: "",
          url: "",
        },
      },
      {
        key: "wisuda",
        title: "Wisudawan",
        kind: "list",
        itemTitle: (i) => String(i.periode || "Periode baru"),
        fields: [
          {
            name: "periode",
            label: "Periode",
            type: "text",
            placeholder: "Wisuda ke-100, Oktober 2026",
          },
          { name: "tanggal", label: "Tanggal", type: "date" },
          { name: "url", label: "Album foto", type: "url" },
          { name: "image", label: "Foto utama", type: "image", wide: true },
          {
            name: "wisudawan",
            label: "Wisudawan (satu per baris: Nama | Judul skripsi)",
            type: "lines",
            wide: true,
          },
        ],
        empty: {
          periode: "",
          tanggal: "",
          wisudawan: [],
          url: "",
          image: null,
        },
      },
      {
        key: "karya",
        title: "Karya mahasiswa",
        kind: "list",
        itemTitle: (i) => String(i.judul || "Karya baru"),
        fields: [
          { name: "judul", label: "Judul", type: "text", wide: true },
          {
            name: "jenis",
            label: "Jenis",
            type: "text",
            placeholder: "Business plan / Esai / Produk UMKM",
          },
          { name: "pembuat", label: "Pembuat", type: "text" },
          { name: "url", label: "Tautan", type: "url" },
          { name: "image", label: "Gambar", type: "image", wide: true },
          {
            name: "deskripsi",
            label: "Deskripsi",
            type: "textarea",
            wide: true,
          },
        ],
        empty: {
          judul: "",
          jenis: "",
          pembuat: "",
          deskripsi: "",
          url: "",
          image: null,
        },
      },
      {
        key: "panduanMaba",
        title: "Langkah mahasiswa baru",
        kind: "list",
        itemTitle: (i) => String(i.name || "Langkah baru"),
        fields: [
          { name: "name", label: "Langkah", type: "text" },
          { name: "url", label: "Tautan", type: "url" },
          {
            name: "description",
            label: "Keterangan",
            type: "text",
            wide: true,
          },
        ],
        empty: { name: "", description: "", url: "" },
      },
      {
        key: "testimoni",
        title: "Testimoni alumni & mahasiswa",
        hint: "Tampil di beranda dan halaman Alumni. Cantumkan hanya kutipan yang sudah disetujui orangnya.",
        kind: "list",
        itemTitle: (i) => String(i.name || "Testimoni baru"),
        fields: [
          { name: "name", label: "Nama", type: "text" },
          {
            name: "role",
            label: "Angkatan / pekerjaan",
            type: "text",
            placeholder: "Alumni 2020 · Bank Syariah Indonesia",
          },
          { name: "quote", label: "Kutipan", type: "textarea", wide: true },
          {
            name: "photo",
            label: "Foto (opsional)",
            type: "image",
            wide: true,
          },
        ],
        empty: { name: "", role: "", quote: "", photo: null },
      },
      {
        key: "kegiatanMahasiswa",
        title: "Kegiatan mahasiswa",
        kind: "list",
        itemTitle: (i) => String(i.title || "Kegiatan baru"),
        fields: titled,
        empty: { title: "", description: "" },
      },
      {
        key: "beasiswa",
        title: "Beasiswa",
        hint: "Tampil di halaman Beasiswa & Mahasiswa. Perbarui periode setiap ada pengumuman baru.",
        kind: "list",
        itemTitle: (i) => String(i.name || "Beasiswa baru"),
        fields: [
          { name: "name", label: "Nama beasiswa", type: "text" },
          { name: "provider", label: "Penyelenggara", type: "text" },
          {
            name: "period",
            label: "Periode pendaftaran",
            type: "text",
            wide: true,
          },
          {
            name: "description",
            label: "Deskripsi",
            type: "textarea",
            wide: true,
          },
          {
            name: "requirements",
            label: "Syarat utama",
            type: "lines",
            wide: true,
            hint: "Satu syarat per baris.",
          },
          {
            name: "url",
            label: "Tautan info/pendaftaran",
            type: "url",
            wide: true,
          },
        ],
        empty: {
          name: "",
          provider: "",
          period: "",
          description: "",
          requirements: [],
          url: "",
        },
      },
    ],
  },
  {
    value: "edukasi",
    label: "Kamus",
    sections: [
      {
        key: "kamus",
        title: "Kamus istilah ekonomi syariah",
        kind: "list",
        itemTitle: (i) => String(i.istilah || "Istilah baru"),
        fields: [
          { name: "istilah", label: "Istilah", type: "text" },
          { name: "kategori", label: "Kategori", type: "text" },
          { name: "arti", label: "Arti", type: "textarea", wide: true },
        ],
        empty: { istilah: "", arti: "", kategori: "Dasar" },
      },
    ],
  },
  {
    value: "mitra",
    label: "Mitra",
    sections: [
      {
        key: "mitra",
        title: "Mitra kerja sama",
        hint: "Tampil di beranda dan halaman Profil. Cantumkan hanya kerja sama yang sudah resmi.",
        kind: "list",
        itemTitle: (i) => String(i.name || "Mitra baru"),
        fields: [
          { name: "name", label: "Nama lembaga", type: "text" },
          { name: "url", label: "Situs web", type: "url" },
          {
            name: "description",
            label: "Bentuk kerja sama",
            type: "textarea",
            wide: true,
          },
        ],
        empty: { name: "", description: "", url: "" },
      },
    ],
  },
  {
    value: "unduhan",
    label: "Unduhan",
    sections: [
      {
        key: "unduhan",
        title: "Dokumen unduhan",
        hint: "Pedoman akademik, kalender, jadwal kuliah, template surat, panduan skripsi, sertifikat akreditasi, dll.",
        kind: "list",
        itemTitle: (i) => String(i.title || "Dokumen baru"),
        fields: [
          { name: "title", label: "Judul dokumen", type: "text", wide: true },
          {
            name: "category",
            label: "Kategori",
            type: "text",
            placeholder: "Akademik / Skripsi / Akreditasi / Template",
          },
          { name: "description", label: "Keterangan (opsional)", type: "text" },
          { name: "url", label: "File", type: "file", wide: true },
        ],
        empty: { title: "", category: "Akademik", description: "", url: "" },
      },
    ],
  },
  {
    value: "layanan",
    label: "Layanan",
    sections: [
      {
        key: "ruangAlat",
        title: "Ruang & alat yang bisa dipinjam",
        hint: "Pilihan ini muncul di formulir peminjaman.",
        kind: "list",
        itemTitle: (i) => String(i.name || "Ruang/alat baru"),
        fields: [
          { name: "name", label: "Nama", type: "text" },
          {
            name: "description",
            label: "Keterangan",
            type: "text",
            wide: true,
          },
          { name: "image", label: "Foto", type: "image", wide: true },
        ],
        empty: { name: "", description: "", image: null },
      },
      {
        key: "sertifikat",
        title: "Sertifikat terverifikasi",
        hint: "Kode bisa dicek di /verifikasi/KODE. Sertifikat peserta acara bisa dibuat otomatis dari Kotak masuk.",
        kind: "list",
        itemTitle: (i) => `${i.kode || "KODE"} · ${i.nama || "Nama"}`,
        fields: [
          {
            name: "kode",
            label: "Kode (huruf besar/angka)",
            type: "text",
            placeholder: "EKSYAR-2610-0001",
          },
          { name: "nama", label: "Nama", type: "text" },
          { name: "kegiatan", label: "Kegiatan", type: "text", wide: true },
          {
            name: "peran",
            label: "Peran",
            type: "text",
            placeholder: "Peserta / Panitia / Pemateri",
          },
          { name: "tanggal", label: "Tanggal", type: "date" },
        ],
        empty: {
          kode: "",
          nama: "",
          kegiatan: "",
          peran: "Peserta",
          tanggal: "",
        },
      },
      {
        key: "zakat",
        title: "Kalkulator zakat",
        kind: "object",
        fields: [
          {
            name: "nisabPenghasilanTahun",
            label: "Nisab zakat penghasilan per tahun (Rp)",
            type: "number",
            wide: true,
          },
          {
            name: "hargaEmas",
            label: "Harga emas per gram (Rp, opsional)",
            type: "number",
          },
          { name: "nisabGram", label: "Nisab emas (gram)", type: "number" },
          {
            name: "sumber",
            label: "Sumber ketetapan",
            type: "text",
            wide: true,
          },
          { name: "diperbarui", label: "Tanggal ketetapan", type: "date" },
        ],
      },
      {
        key: "banner",
        title: "Pengumuman berjalan (atas website)",
        hint: "Bila tidak diaktifkan, website menampilkan pengumuman terbaru dari Konten (rubrik Pengumuman) selama 14 hari.",
        kind: "object",
        fields: [
          {
            name: "aktif",
            label: "Tampilkan pengumuman ini",
            type: "checkbox",
            wide: true,
          },
          { name: "teks", label: "Teks pengumuman", type: "text", wide: true },
          { name: "url", label: "Tautan (opsional)", type: "url", wide: true },
        ],
      },
      {
        key: "kalender",
        title: "Kalender akademik",
        hint: "Tampil di halaman Kalender. Isi dari kalender akademik resmi UIN SGD dan agenda prodi (seminar proposal, sidang, wisuda).",
        kind: "list",
        itemTitle: (i) => String(i.kegiatan || "Kegiatan baru"),
        fields: [
          { name: "kegiatan", label: "Kegiatan", type: "text", wide: true },
          { name: "mulai", label: "Mulai", type: "date" },
          { name: "selesai", label: "Selesai (opsional)", type: "date" },
          {
            name: "kategori",
            label: "Kategori",
            type: "text",
            placeholder: "Perkuliahan / Ujian / Administrasi / Wisuda / Libur",
          },
          { name: "sumber", label: "Sumber (opsional)", type: "url" },
        ],
        empty: {
          kegiatan: "",
          mulai: "",
          selesai: "",
          kategori: "Perkuliahan",
          sumber: "",
        },
      },
      {
        key: "prosedur",
        title: "Alur layanan akademik",
        hint: "Mis. pengajuan judul skripsi, seminar proposal, sidang munaqasyah, magang. Tampil di halaman Layanan.",
        kind: "list",
        itemTitle: (i) => String(i.title || "Alur baru"),
        fields: [
          { name: "title", label: "Nama layanan", type: "text" },
          { name: "url", label: "Formulir / dokumen (opsional)", type: "url" },
          {
            name: "description",
            label: "Keterangan singkat",
            type: "text",
            wide: true,
          },
          {
            name: "steps",
            label: "Langkah-langkah",
            type: "lines",
            wide: true,
            hint: "Satu langkah per baris, berurutan.",
          },
        ],
        empty: { title: "", description: "", steps: [], url: "" },
      },
      {
        key: "aksesCepat",
        title: "Akses cepat layanan digital",
        kind: "list",
        itemTitle: (i) => String(i.name || "Tautan baru"),
        fields: [
          { name: "name", label: "Nama", type: "text" },
          { name: "url", label: "Tautan", type: "url" },
          {
            name: "description",
            label: "Keterangan",
            type: "text",
            wide: true,
          },
        ],
        empty: { name: "", description: "", url: "" },
      },
      {
        key: "infoMaba",
        title: "Info mahasiswa baru",
        hint: "Tautan resmi untuk calon mahasiswa (UKT, pembayaran, PMB). Tampil di halaman Mahasiswa Baru.",
        kind: "list",
        itemTitle: (i) => String(i.name || "Tautan baru"),
        fields: [
          { name: "name", label: "Judul", type: "text" },
          { name: "url", label: "Tautan", type: "url" },
          {
            name: "description",
            label: "Keterangan",
            type: "text",
            wide: true,
          },
        ],
        empty: { name: "", description: "", url: "" },
      },
      {
        key: "mutu",
        title: "Penjaminan mutu & tracer study",
        kind: "object",
        fields: [
          {
            name: "description",
            label: "Keterangan penjaminan mutu",
            type: "textarea",
            wide: true,
          },
          {
            name: "surveiUrl",
            label: "Survei kepuasan (Google Form, dll.)",
            type: "url",
          },
          { name: "tracerUrl", label: "Tracer study", type: "url" },
          { name: "sebaranUrl", label: "Peta sebaran alumni", type: "url" },
        ],
      },
      {
        key: "fasilitas",
        title: "Fasilitas",
        kind: "list",
        itemTitle: (i) => String(i.title || "Fasilitas baru"),
        fields: [
          ...titled,
          {
            name: "image",
            label: "Foto (opsional, 16:9)",
            type: "image",
            wide: true,
          },
        ],
        empty: { title: "", description: "", image: null },
      },
      {
        key: "jalurMasuk",
        title: "Jalur masuk",
        kind: "list",
        itemTitle: (i) => String(i.title || "Jalur baru"),
        fields: titled,
        empty: { title: "", description: "" },
      },
      {
        key: "faq",
        title: "FAQ",
        kind: "list",
        itemTitle: (i) => String(i.q || "Pertanyaan baru"),
        fields: [
          { name: "q", label: "Pertanyaan", type: "text", wide: true },
          { name: "a", label: "Jawaban", type: "textarea", wide: true },
        ],
        empty: { q: "", a: "" },
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Editor                                                              */
/* ------------------------------------------------------------------ */

export function WebsiteEditor({
  initial,
  defaults,
}: {
  initial: WebsiteConfig;
  defaults: WebsiteConfig;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState(TABS[0].value);
  const [config, setConfig] = useState<WebsiteConfig>(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const dirty = useMemo(
    () => JSON.stringify(config) !== saved,
    [config, saved],
  );

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const setSection = (key: keyof WebsiteConfig, value: unknown) =>
    setConfig((c) => ({ ...c, [key]: value }) as WebsiteConfig);

  function save() {
    startTransition(async () => {
      const res = await fetch("/api/website", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: clean(config) }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(j.error ?? "Gagal menyimpan website");
        return;
      }
      const next = (j.website ?? config) as WebsiteConfig;
      setSaved(JSON.stringify(next));
      setConfig(next);
      toast.success("Website tersimpan dan langsung tayang.");
      router.refresh();
    });
  }

  const active = TABS.find((t) => t.value === tab) ?? TABS[0];

  return (
    <div className="mt-6">
      <div className="sticky top-2 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl glass-thick px-3 py-2">
        <div className="max-w-full overflow-x-auto">
          <SegmentedTabs
            value={tab}
            onChange={setTab}
            options={TABS.map((t) => ({ value: t.value, label: t.label }))}
            size="sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3.5" strokeWidth={1.75} /> Lihat
              website
            </a>
          </Button>
          <Button size="sm" disabled={pending || !dirty} onClick={save}>
            <Save className="size-3.5" strokeWidth={1.75} />{" "}
            {pending ? "Menyimpan…" : dirty ? "Simpan" : "Tersimpan"}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6">
        {active.sections.map((section) => (
          <GlassCard key={section.key} variant="thick" className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-[17px] font-semibold tracking-tight">
                  {section.title}
                </h2>
                {section.hint && (
                  <p className="mt-1 text-[12px] text-foreground/55">
                    {section.hint}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Kembalikan "${section.title}" ke data awal?`))
                      setSection(section.key, defaults[section.key]);
                  }}
                  className="inline-flex items-center gap-1 text-[12px] text-foreground/55 hover:text-foreground"
                >
                  <RotateCcw className="size-3.5" strokeWidth={1.75} /> Data
                  awal
                </button>
              </div>
            </div>
            <div className="mt-4">
              {section.key === "kegiatan" && (
                <div className="mb-3">
                  <KegiatanFromCaption
                    onCreate={(item) =>
                      setSection("kegiatan", [item, ...config.kegiatan])
                    }
                  />
                </div>
              )}
              <SectionBody
                section={section}
                value={config[section.key]}
                onChange={(v) => setSection(section.key, v)}
              />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

/** Buang baris kosong di daftar teks (sisa mengetik) sebelum disimpan. */
function clean<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .filter((v) => !(typeof v === "string" && v.trim() === ""))
      .map((v) => (typeof v === "string" ? v.trim() : clean(v))) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, clean(v)]),
    ) as T;
  }
  return value;
}

function SectionBody({
  section,
  value,
  onChange,
}: {
  section: SectionSpec;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (section.kind === "object") {
    return (
      <FieldGrid
        fields={section.fields}
        value={value as AnyObj}
        onChange={onChange}
      />
    );
  }
  if (section.kind === "field") {
    return (
      <FieldInput spec={section.field} value={value} onChange={onChange} />
    );
  }
  if (section.kind === "kurikulum") {
    return (
      <KurikulumEditor
        value={value as WebsiteConfig["kurikulum"]}
        onChange={onChange}
      />
    );
  }
  return (
    <ListEditor
      items={value as AnyObj[]}
      onChange={onChange}
      itemTitle={section.itemTitle}
      empty={section.empty}
      render={(item, update) => (
        <FieldGrid
          fields={section.fields}
          value={item}
          onChange={(v) => update(v as AnyObj)}
        />
      )}
    />
  );
}

function FieldGrid({
  fields,
  value,
  onChange,
}: {
  fields: FieldSpec[];
  value: AnyObj;
  onChange: (v: AnyObj) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className={cn(f.wide && "sm:col-span-2")}>
          <FieldInput
            spec={f}
            value={value?.[f.name]}
            onChange={(v) => onChange({ ...value, [f.name]: v })}
          />
        </div>
      ))}
    </div>
  );
}

const inputCls =
  "w-full bg-transparent text-[14px] outline-none placeholder:text-foreground/35";

function FieldInput({
  spec,
  value,
  onChange,
}: {
  spec: FieldSpec;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  let control: React.ReactNode;
  switch (spec.type) {
    case "textarea":
      return (
        <div>
          <Field label={spec.label} hint={spec.hint}>
            <textarea
              rows={3}
              value={String(value ?? "")}
              placeholder={spec.placeholder}
              onChange={(e) => onChange(e.target.value)}
              className={cn(inputCls, "resize-y")}
            />
          </Field>
          <AiAssist
            text={String(value ?? "")}
            field={spec.label}
            onApply={onChange}
          />
        </div>
      );
    case "pairs":
      control = (
        <textarea
          rows={5}
          defaultValue={((value as { label: string; nilai: number }[]) ?? [])
            .map((d) => `${d.label} | ${d.nilai}`)
            .join("\n")}
          placeholder={"2024 | 120\n2025 | 135"}
          onBlur={(e) =>
            onChange(
              e.target.value
                .split("\n")
                .map((l) => l.split("|").map((x) => x.trim()))
                .filter(
                  ([l, n]) =>
                    l &&
                    n !== undefined &&
                    !Number.isNaN(
                      Number(n.replace(/\./g, "").replace(",", ".")),
                    ),
                )
                .map(([label, n]) => ({
                  label,
                  nilai: Number(n.replace(/\./g, "").replace(",", ".")),
                })),
            )
          }
          className={cn(inputCls, "resize-y font-mono text-[13px]")}
        />
      );
      break;
    case "checkbox":
      return (
        <label className="flex items-center gap-2 py-2 text-[14px]">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          {spec.label}
        </label>
      );
    case "number":
      control = (
        <input
          type="number"
          value={Number(value ?? 0)}
          onChange={(e) => onChange(Number(e.target.value))}
          className={inputCls}
        />
      );
      break;
    case "date":
      control = (
        <input
          type="date"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      );
      break;
    case "lines":
      control = (
        <textarea
          rows={4}
          value={((value as string[]) ?? []).join("\n")}
          onChange={(e) =>
            onChange(
              e.target.value
                .split("\n")
                .map((s) => s.trimStart())
                .filter((s, i, a) => s !== "" || i === a.length - 1),
            )
          }
          onBlur={(e) =>
            onChange(
              e.target.value
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
          className={cn(inputCls, "resize-y")}
        />
      );
      break;
    case "paragraphs":
      control = (
        <textarea
          rows={6}
          value={((value as string[]) ?? []).join("\n\n")}
          onChange={(e) => onChange(e.target.value.split(/\n\s*\n/))}
          onBlur={(e) =>
            onChange(
              e.target.value
                .split(/\n\s*\n/)
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
          className={cn(inputCls, "resize-y")}
        />
      );
      break;
    case "image":
      return (
        <ImageInput
          label={spec.label}
          hint={spec.hint}
          value={(value as string | null) ?? ""}
          onChange={(v) => onChange(v || null)}
        />
      );
    case "file":
      return (
        <FileInput
          label={spec.label}
          value={String(value ?? "")}
          onChange={onChange}
        />
      );
    default:
      control = (
        <input
          type={spec.type === "url" ? "url" : "text"}
          value={String(value ?? "")}
          placeholder={
            spec.placeholder ?? (spec.type === "url" ? "https://" : undefined)
          }
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      );
  }
  return (
    <Field label={spec.label} hint={spec.hint}>
      {control}
    </Field>
  );
}

const AI_ACTIONS = [
  { action: "perbaiki", label: "Perbaiki" },
  { action: "ringkas", label: "Ringkas" },
  { action: "formal", label: "Lebih resmi" },
  { action: "santai", label: "Lebih ramah" },
  { action: "perluas", label: "Kembangkan" },
] as const;

/** AI Bantu tulis (Gemini) untuk kolom teks panjang. */
function AiAssist({
  text,
  field,
  onApply,
}: {
  text: string;
  field: string;
  onApply: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  async function run(action: string) {
    setBusy(action);
    setSuggestion(null);
    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, text, field }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "AI gagal");
      setSuggestion(j.text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI gagal");
    } finally {
      setBusy(null);
    }
  }

  if (text.trim().length < 3) return null;

  return (
    <div className="mt-1.5">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1 text-[12px] text-foreground/50 hover:text-brand-600"
        >
          <Sparkles className="size-3.5" strokeWidth={1.75} /> Bantu tulis
          dengan AI
        </button>
      ) : (
        <div className="flex flex-wrap items-center gap-1.5">
          <Sparkles className="size-3.5 text-brand-600" strokeWidth={1.75} />
          {AI_ACTIONS.map((a) => (
            <button
              key={a.action}
              type="button"
              disabled={!!busy}
              onClick={() => run(a.action)}
              className="rounded-md border border-foreground/10 px-2 py-0.5 text-[12px] text-foreground/70 hover:border-brand-500/40 hover:text-foreground disabled:opacity-50"
            >
              {busy === a.action ? "…" : a.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setSuggestion(null);
            }}
            className="text-[12px] text-foreground/40 hover:text-foreground"
          >
            Tutup
          </button>
        </div>
      )}
      {suggestion && (
        <div className="mt-2 rounded-lg border border-brand-500/25 bg-brand-500/[0.04] p-3">
          <p className="whitespace-pre-line text-[13.5px] leading-relaxed">
            {suggestion}
          </p>
          <div className="mt-2 flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onApply(suggestion);
                setSuggestion(null);
              }}
            >
              Pakai
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setSuggestion(null)}
            >
              Batal
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Buat item kegiatan dari caption Instagram dengan AI. */
function KegiatanFromCaption({
  onCreate,
}: {
  onCreate: (item: Record<string, unknown>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "kegiatan", caption }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "AI gagal");
      onCreate({ ...j.kegiatan, source: "", image: null });
      setCaption("");
      setOpen(false);
      toast.success("Kegiatan dibuat dari caption. Periksa lalu klik Simpan.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI gagal");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Sparkles className="size-3.5" strokeWidth={1.75} /> Isi dari caption IG
      </Button>
    );
  }
  return (
    <div className="mb-4 rounded-xl border border-brand-500/25 bg-brand-500/[0.04] p-3">
      <p className="text-[12.5px] text-foreground/60">
        Tempel caption Instagram — AI menyusun judul, tanggal, kategori, dan
        ringkasan.
      </p>
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={5}
        className="mt-2 w-full resize-y rounded-lg border border-foreground/10 bg-background px-3 py-2 text-[13.5px] outline-none"
      />
      <div className="mt-2 flex gap-2">
        <Button
          type="button"
          size="sm"
          disabled={busy || caption.trim().length < 10}
          onClick={run}
        >
          {busy ? "Memproses…" : "Buat kegiatan"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setOpen(false)}
        >
          Batal
        </Button>
      </div>
    </div>
  );
}

function ImageInput({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: form,
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "Upload gagal");
      onChange(j.url);
      toast.success("Foto terunggah. Jangan lupa klik Simpan.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <Field
      label={label}
      hint={hint ?? "Unggah foto atau tempel URL gambar (https://…)."}
    >
      <div className="flex items-center gap-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-foreground/5">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <ImagePlus
              className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-foreground/35"
              strokeWidth={1.5}
            />
          )}
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
          className={cn(inputCls, "min-w-0 flex-1")}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? "Mengunggah…" : "Unggah"}
        </Button>
        {value && (
          <button
            type="button"
            aria-label="Hapus foto"
            onClick={() => onChange("")}
            className="text-foreground/45 hover:text-red-500"
          >
            <Trash2 className="size-4" strokeWidth={1.75} />
          </button>
        )}
      </div>
    </Field>
  );
}

function FileInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload/file", {
        method: "POST",
        body: form,
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error ?? "Upload gagal");
      onChange(j.url);
      toast.success("File terunggah. Jangan lupa klik Simpan.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <Field
      label={label}
      hint="Unggah PDF/DOCX/XLSX (maks 10MB) atau tempel tautan https:// (mis. Google Drive)."
    >
      <div className="flex items-center gap-3">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
          className={cn(inputCls, "min-w-0 flex-1")}
        />
        <input
          ref={fileRef}
          type="file"
          hidden
          accept=".pdf,.docx,.xlsx"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? "Mengunggah…" : "Unggah"}
        </Button>
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buka file"
            className="text-foreground/55 hover:text-foreground"
          >
            <ExternalLink className="size-4" strokeWidth={1.75} />
          </a>
        )}
      </div>
    </Field>
  );
}

function ListEditor({
  items,
  onChange,
  itemTitle,
  empty,
  render,
}: {
  items: AnyObj[];
  onChange: (v: AnyObj[]) => void;
  itemTitle: (item: AnyObj, i: number) => string;
  empty: AnyObj;
  render: (item: AnyObj, update: (v: AnyObj) => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const list = items ?? [];

  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(open === i ? j : open);
  };

  return (
    <div className="grid gap-2">
      {list.map((item, i) => (
        <div
          key={i}
          className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] dark:border-white/10"
        >
          <div className="flex items-center gap-2 px-3 py-2">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="min-w-0 flex-1 truncate text-left text-[14px] font-medium"
            >
              <span className="mr-2 text-foreground/40">{i + 1}.</span>
              {itemTitle(item, i)}
            </button>
            <IconBtn
              label="Naikkan"
              onClick={() => move(i, -1)}
              disabled={i === 0}
            >
              <ArrowUp className="size-3.5" />
            </IconBtn>
            <IconBtn
              label="Turunkan"
              onClick={() => move(i, 1)}
              disabled={i === list.length - 1}
            >
              <ArrowDown className="size-3.5" />
            </IconBtn>
            <IconBtn
              label="Hapus"
              danger
              onClick={() => {
                if (confirm(`Hapus "${itemTitle(item, i)}"?`)) {
                  onChange(list.filter((_, k) => k !== i));
                  setOpen(null);
                }
              }}
            >
              <Trash2 className="size-3.5" />
            </IconBtn>
          </div>
          {open === i && (
            <div className="border-t border-foreground/10 p-3 dark:border-white/10">
              {render(item, (v) =>
                onChange(list.map((x, k) => (k === i ? v : x))),
              )}
            </div>
          )}
        </div>
      ))}
      <div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            onChange([...list, structuredClone(empty)]);
            setOpen(list.length);
          }}
        >
          <Plus className="size-3.5" strokeWidth={1.75} /> Tambah
        </Button>
      </div>
    </div>
  );
}

function KurikulumEditor({
  value,
  onChange,
}: {
  value: WebsiteConfig["kurikulum"];
  onChange: (v: unknown) => void;
}) {
  return (
    <ListEditor
      items={value as unknown as AnyObj[]}
      onChange={onChange}
      itemTitle={(y) => String(y.label || "Tahun baru")}
      empty={{ label: "", semesters: [{ name: "Semester", courses: [] }] }}
      render={(year, update) => {
        const semesters =
          (year.semesters as { name: string; courses: string[] }[]) ?? [];
        return (
          <div className="grid gap-4">
            <FieldInput
              spec={{ name: "label", label: "Label tahun", type: "text" }}
              value={year.label}
              onChange={(v) => update({ ...year, label: v })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {semesters.map((s, si) => (
                <div key={si} className="grid gap-2">
                  <FieldInput
                    spec={{
                      name: "name",
                      label: `Nama semester ${si + 1}`,
                      type: "text",
                    }}
                    value={s.name}
                    onChange={(v) =>
                      update({
                        ...year,
                        semesters: semesters.map((x, k) =>
                          k === si ? { ...x, name: v as string } : x,
                        ),
                      })
                    }
                  />
                  <FieldInput
                    spec={{
                      name: "courses",
                      label: "Mata kuliah",
                      type: "lines",
                      hint: "Satu mata kuliah per baris.",
                    }}
                    value={s.courses}
                    onChange={(v) =>
                      update({
                        ...year,
                        semesters: semesters.map((x, k) =>
                          k === si ? { ...x, courses: v as string[] } : x,
                        ),
                      })
                    }
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {semesters.length < 4 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    update({
                      ...year,
                      semesters: [
                        ...semesters,
                        { name: "Semester", courses: [] },
                      ],
                    })
                  }
                >
                  <Plus className="size-3.5" /> Semester
                </Button>
              )}
              {semesters.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    update({ ...year, semesters: semesters.slice(0, -1) })
                  }
                >
                  Hapus semester terakhir
                </Button>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid size-7 place-items-center rounded-lg text-foreground/55 transition-colors hover:bg-foreground/5 disabled:opacity-30",
        danger ? "hover:text-red-500" : "hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12.5px] text-foreground/50">
        {label}
      </span>
      <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
        {children}
      </div>
      {hint && (
        <span className="mt-1 block text-[11px] text-foreground/55">
          {hint}
        </span>
      )}
    </label>
  );
}
