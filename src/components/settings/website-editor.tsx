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

type FieldType = "text" | "textarea" | "url" | "image" | "file" | "date" | "number" | "lines" | "paragraphs";

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
  | { key: keyof WebsiteConfig; title: string; hint?: string; kind: "object"; fields: FieldSpec[] }
  | {
      key: keyof WebsiteConfig;
      title: string;
      hint?: string;
      kind: "list";
      itemTitle: (item: AnyObj, i: number) => string;
      fields: FieldSpec[];
      empty: AnyObj;
    }
  | { key: keyof WebsiteConfig; title: string; hint?: string; kind: "field"; field: FieldSpec }
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
          { name: "heroDescription", label: "Deskripsi beranda", type: "textarea", wide: true },
          { name: "heroImage", label: "Foto utama beranda (opsional, 16:9)", type: "image", wide: true },
          { name: "degree", label: "Gelar lulusan", type: "text" },
          { name: "totalCredits", label: "Total SKS", type: "number" },
          { name: "normalDuration", label: "Masa studi normal", type: "text" },
          { name: "maxSemesters", label: "Batas maksimal semester", type: "number" },
          { name: "prodiAccreditation", label: "Akreditasi prodi", type: "text", hint: "Kosongkan untuk menampilkan \"Terakreditasi\"." },
          { name: "universityAccreditation", label: "Akreditasi UIN", type: "text" },
          { name: "universityAccreditationPeriod", label: "Masa berlaku akreditasi UIN", type: "text" },
        ],
      },
      {
        key: "kontak",
        title: "Kontak & media sosial",
        kind: "object",
        fields: [
          { name: "email", label: "Email", type: "text" },
          { name: "hours", label: "Jam layanan", type: "text" },
          { name: "address", label: "Alamat (baris 1)", type: "text", wide: true },
          { name: "street", label: "Alamat (baris 2)", type: "text", wide: true },
          { name: "instagram", label: "URL Instagram", type: "url" },
          { name: "instagramHandle", label: "Handle Instagram", type: "text" },
          { name: "tiktok", label: "URL TikTok", type: "url" },
          { name: "x", label: "URL X", type: "url" },
          { name: "facebookName", label: "Nama Facebook", type: "text" },
          { name: "linktree", label: "URL Linktree", type: "url" },
          { name: "website", label: "Website resmi prodi", type: "url" },
          { name: "pmbUrl", label: "URL portal PMB", type: "url" },
          { name: "mapsUrl", label: "URL Google Maps", type: "url", wide: true },
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
          { name: "sejarah", label: "Sejarah", type: "paragraphs", wide: true, hint: "Pisahkan paragraf dengan baris kosong." },
          { name: "visi", label: "Visi", type: "textarea", wide: true },
          { name: "misi", label: "Misi", type: "lines", wide: true, hint: "Satu butir per baris." },
          { name: "tujuan", label: "Tujuan", type: "lines", wide: true, hint: "Satu butir per baris." },
        ],
      },
      {
        key: "pimpinan",
        title: "Pimpinan",
        kind: "list",
        itemTitle: (p) => String(p.name || "Pimpinan baru"),
        fields: person,
        empty: { name: "", role: "", photo: null },
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
        fields: [...person, { name: "expertise", label: "Bidang keahlian", type: "lines", wide: true, hint: "Satu bidang per baris." }],
        empty: { name: "", role: "Dosen", photo: null, expertise: [] },
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
          { name: "group", label: "Kategori", type: "text", placeholder: "Mahasiswa / Dosen / Alumni" },
          { name: "achievement", label: "Prestasi / amanah", type: "text", wide: true },
          { name: "photo", label: "Foto (potret 4:5)", type: "image", wide: true },
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
          { name: "category", label: "Kategori", type: "text", placeholder: "Akademik / Pengabdian / Karir" },
          { name: "summary", label: "Ringkasan", type: "textarea", wide: true },
          { name: "source", label: "Tautan sumber (opsional)", type: "url", wide: true },
          { name: "image", label: "Foto (opsional, 16:9)", type: "image", wide: true },
        ],
        empty: { title: "", date: new Date().toISOString().slice(0, 10), category: "Akademik", summary: "", source: "", image: null },
      },
    ],
  },
  {
    value: "akademik",
    label: "Akademik",
    sections: [
      { key: "bidangKajian", title: "Bidang kajian", kind: "list", itemTitle: (i) => String(i.title || "Bidang baru"), fields: titled, empty: { title: "", description: "" } },
      {
        key: "kelompokMataKuliah",
        title: "Kelompok mata kuliah",
        kind: "list",
        itemTitle: (i) => String(i.code || "Kelompok baru"),
        fields: [
          { name: "code", label: "Kode", type: "text" },
          { name: "title", label: "Nama", type: "text" },
          { name: "description", label: "Deskripsi", type: "textarea", wide: true },
        ],
        empty: { code: "", title: "", description: "" },
      },
      { key: "kurikulum", title: "Sebaran mata kuliah", kind: "kurikulum" },
      { key: "profilLulusan", title: "Profil lulusan", kind: "list", itemTitle: (i) => String(i.title || "Profil baru"), fields: titled, empty: { title: "", description: "" } },
      { key: "capaianPembelajaran", title: "Capaian pembelajaran", kind: "list", itemTitle: (i) => String(i.title || "Capaian baru"), fields: titled, empty: { title: "", description: "" } },
      { key: "prospekKarir", title: "Prospek karir", kind: "list", itemTitle: (i) => String(i.title || "Karir baru"), fields: titled, empty: { title: "", description: "" } },
    ],
  },
  {
    value: "mahasiswa",
    label: "Mahasiswa",
    sections: [
      {
        key: "himpunan",
        title: "HMJ & program unggulan",
        kind: "object",
        fields: [
          { name: "name", label: "Nama himpunan", type: "text" },
          { name: "cabinet", label: "Kabinet", type: "text" },
          { name: "chair", label: "Ketua", type: "text" },
          { name: "chairPeriod", label: "Periode", type: "text" },
          { name: "description", label: "Deskripsi", type: "textarea", wide: true },
          { name: "flagshipName", label: "Program unggulan", type: "text" },
          { name: "flagshipFull", label: "Kepanjangan", type: "text" },
          { name: "flagshipDescription", label: "Deskripsi program unggulan", type: "textarea", wide: true },
          { name: "instagram", label: "URL Instagram HMJ", type: "url" },
          { name: "youtube", label: "URL YouTube HMJ", type: "url" },
        ],
      },
      { key: "kegiatanMahasiswa", title: "Kegiatan mahasiswa", kind: "list", itemTitle: (i) => String(i.title || "Kegiatan baru"), fields: titled, empty: { title: "", description: "" } },
      { key: "beasiswa", title: "Beasiswa", kind: "field", field: { name: "beasiswa", label: "Daftar beasiswa", type: "lines", wide: true, hint: "Satu beasiswa per baris." } },
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
          { name: "category", label: "Kategori", type: "text", placeholder: "Akademik / Skripsi / Akreditasi / Template" },
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
        key: "fasilitas",
        title: "Fasilitas",
        kind: "list",
        itemTitle: (i) => String(i.title || "Fasilitas baru"),
        fields: [...titled, { name: "image", label: "Foto (opsional, 16:9)", type: "image", wide: true }],
        empty: { title: "", description: "", image: null },
      },
      { key: "jalurMasuk", title: "Jalur masuk", kind: "list", itemTitle: (i) => String(i.title || "Jalur baru"), fields: titled, empty: { title: "", description: "" } },
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

export function WebsiteEditor({ initial, defaults }: { initial: WebsiteConfig; defaults: WebsiteConfig }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState(TABS[0].value);
  const [config, setConfig] = useState<WebsiteConfig>(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const dirty = useMemo(() => JSON.stringify(config) !== saved, [config, saved]);

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
          <SegmentedTabs value={tab} onChange={setTab} options={TABS.map((t) => ({ value: t.value, label: t.label }))} size="sm" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a href="/prodi" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3.5" strokeWidth={1.75} /> Lihat website
            </a>
          </Button>
          <Button size="sm" disabled={pending || !dirty} onClick={save}>
            <Save className="size-3.5" strokeWidth={1.75} /> {pending ? "Menyimpan…" : dirty ? "Simpan" : "Tersimpan"}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6">
        {active.sections.map((section) => (
          <GlassCard key={section.key} variant="thick" className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-[17px] font-semibold tracking-tight">{section.title}</h2>
                {section.hint && <p className="mt-1 text-[12px] text-foreground/55">{section.hint}</p>}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Kembalikan "${section.title}" ke data awal?`)) setSection(section.key, defaults[section.key]);
                }}
                className="inline-flex items-center gap-1 text-[12px] text-foreground/55 hover:text-foreground"
              >
                <RotateCcw className="size-3.5" strokeWidth={1.75} /> Data awal
              </button>
            </div>
            <div className="mt-4">
              <SectionBody section={section} value={config[section.key]} onChange={(v) => setSection(section.key, v)} />
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
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clean(v)])) as T;
  }
  return value;
}

function SectionBody({ section, value, onChange }: { section: SectionSpec; value: unknown; onChange: (v: unknown) => void }) {
  if (section.kind === "object") {
    return <FieldGrid fields={section.fields} value={value as AnyObj} onChange={onChange} />;
  }
  if (section.kind === "field") {
    return <FieldInput spec={section.field} value={value} onChange={onChange} />;
  }
  if (section.kind === "kurikulum") {
    return <KurikulumEditor value={value as WebsiteConfig["kurikulum"]} onChange={onChange} />;
  }
  return (
    <ListEditor
      items={value as AnyObj[]}
      onChange={onChange}
      itemTitle={section.itemTitle}
      empty={section.empty}
      render={(item, update) => <FieldGrid fields={section.fields} value={item} onChange={(v) => update(v as AnyObj)} />}
    />
  );
}

function FieldGrid({ fields, value, onChange }: { fields: FieldSpec[]; value: AnyObj; onChange: (v: AnyObj) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className={cn(f.wide && "sm:col-span-2")}>
          <FieldInput spec={f} value={value?.[f.name]} onChange={(v) => onChange({ ...value, [f.name]: v })} />
        </div>
      ))}
    </div>
  );
}

const inputCls = "w-full bg-transparent text-[14px] outline-none placeholder:text-foreground/35";

function FieldInput({ spec, value, onChange }: { spec: FieldSpec; value: unknown; onChange: (v: unknown) => void }) {
  let control: React.ReactNode;
  switch (spec.type) {
    case "textarea":
      control = (
        <textarea rows={3} value={String(value ?? "")} placeholder={spec.placeholder} onChange={(e) => onChange(e.target.value)} className={cn(inputCls, "resize-y")} />
      );
      break;
    case "number":
      control = (
        <input type="number" value={Number(value ?? 0)} onChange={(e) => onChange(Number(e.target.value))} className={inputCls} />
      );
      break;
    case "date":
      control = <input type="date" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={inputCls} />;
      break;
    case "lines":
      control = (
        <textarea
          rows={4}
          value={((value as string[]) ?? []).join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trimStart()).filter((s, i, a) => s !== "" || i === a.length - 1))}
          onBlur={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
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
          onBlur={(e) => onChange(e.target.value.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean))}
          className={cn(inputCls, "resize-y")}
        />
      );
      break;
    case "image":
      return <ImageInput label={spec.label} hint={spec.hint} value={(value as string | null) ?? ""} onChange={(v) => onChange(v || null)} />;
    case "file":
      return <FileInput label={spec.label} value={String(value ?? "")} onChange={onChange} />;
    default:
      control = (
        <input
          type={spec.type === "url" ? "url" : "text"}
          value={String(value ?? "")}
          placeholder={spec.placeholder ?? (spec.type === "url" ? "https://" : undefined)}
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

function ImageInput({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: form });
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
    <Field label={label} hint={hint ?? "Unggah foto atau tempel URL gambar (https://…)."}>
      <div className="flex items-center gap-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-foreground/5">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <ImagePlus className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-foreground/35" strokeWidth={1.5} />
          )}
        </div>
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" className={cn(inputCls, "min-w-0 flex-1")} />
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        <Button type="button" variant="secondary" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? "Mengunggah…" : "Unggah"}
        </Button>
        {value && (
          <button type="button" aria-label="Hapus foto" onClick={() => onChange("")} className="text-foreground/45 hover:text-red-500">
            <Trash2 className="size-4" strokeWidth={1.75} />
          </button>
        )}
      </div>
    </Field>
  );
}

function FileInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload/file", { method: "POST", body: form });
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
    <Field label={label} hint="Unggah PDF/DOCX/XLSX (maks 10MB) atau tempel tautan https:// (mis. Google Drive).">
      <div className="flex items-center gap-3">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" className={cn(inputCls, "min-w-0 flex-1")} />
        <input ref={fileRef} type="file" hidden accept=".pdf,.docx,.xlsx" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        <Button type="button" variant="secondary" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? "Mengunggah…" : "Unggah"}
        </Button>
        {value && (
          <a href={value} target="_blank" rel="noopener noreferrer" aria-label="Buka file" className="text-foreground/55 hover:text-foreground">
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
        <div key={i} className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] dark:border-white/10">
          <div className="flex items-center gap-2 px-3 py-2">
            <button type="button" onClick={() => setOpen(open === i ? null : i)} className="min-w-0 flex-1 truncate text-left text-[14px] font-medium">
              <span className="mr-2 text-foreground/40">{i + 1}.</span>
              {itemTitle(item, i)}
            </button>
            <IconBtn label="Naikkan" onClick={() => move(i, -1)} disabled={i === 0}>
              <ArrowUp className="size-3.5" />
            </IconBtn>
            <IconBtn label="Turunkan" onClick={() => move(i, 1)} disabled={i === list.length - 1}>
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
              {render(item, (v) => onChange(list.map((x, k) => (k === i ? v : x))))}
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

function KurikulumEditor({ value, onChange }: { value: WebsiteConfig["kurikulum"]; onChange: (v: unknown) => void }) {
  return (
    <ListEditor
      items={value as unknown as AnyObj[]}
      onChange={onChange}
      itemTitle={(y) => String(y.label || "Tahun baru")}
      empty={{ label: "", semesters: [{ name: "Semester", courses: [] }] }}
      render={(year, update) => {
        const semesters = (year.semesters as { name: string; courses: string[] }[]) ?? [];
        return (
          <div className="grid gap-4">
            <FieldInput spec={{ name: "label", label: "Label tahun", type: "text" }} value={year.label} onChange={(v) => update({ ...year, label: v })} />
            <div className="grid gap-4 sm:grid-cols-2">
              {semesters.map((s, si) => (
                <div key={si} className="grid gap-2">
                  <FieldInput
                    spec={{ name: "name", label: `Nama semester ${si + 1}`, type: "text" }}
                    value={s.name}
                    onChange={(v) => update({ ...year, semesters: semesters.map((x, k) => (k === si ? { ...x, name: v as string } : x)) })}
                  />
                  <FieldInput
                    spec={{ name: "courses", label: "Mata kuliah", type: "lines", hint: "Satu mata kuliah per baris." }}
                    value={s.courses}
                    onChange={(v) => update({ ...year, semesters: semesters.map((x, k) => (k === si ? { ...x, courses: v as string[] } : x)) })}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {semesters.length < 4 && (
                <Button type="button" variant="secondary" size="sm" onClick={() => update({ ...year, semesters: [...semesters, { name: "Semester", courses: [] }] })}>
                  <Plus className="size-3.5" /> Semester
                </Button>
              )}
              {semesters.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => update({ ...year, semesters: semesters.slice(0, -1) })}>
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

function IconBtn({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">{label}</span>
      <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
        {children}
      </div>
      {hint && <span className="mt-1 block text-[11px] text-foreground/55">{hint}</span>}
    </label>
  );
}
