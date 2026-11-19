"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, Clock, Search, Shield, Trash2, UserCheck, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/common/avatar";
import { Pill } from "@/components/common/pill";
import type { Member, PendingMember, Role } from "@/lib/data/types";

interface Props {
  initial: Member[];
  initialPending?: PendingMember[];
  currentMemberId: string;
  isAdmin?: boolean;
}

type PillTone = "neutral" | "brand" | "gold" | "danger" | "success" | "info";

const ROLES: { value: Role; label: string; desc: string; tone: PillTone }[] = [
  { value: "monitoring", label: "Pembina", desc: "Hanya bisa melihat (cocok untuk dosen pembina).", tone: "neutral" },
  { value: "anggota", label: "Penulis Buletin", desc: "Untuk mahasiswa penulis: hanya menulis Buletin Mahasiswa dan mengunggah fotonya. Terbit setelah diperiksa Humas.", tone: "neutral" },
  { value: "pengurus", label: "Pengurus", desc: "Menulis dan ikut menyunting konten.", tone: "info" },
  { value: "ketua_divisi", label: "Koordinator", desc: "Memeriksa konten kiriman tim.", tone: "gold" },
  { value: "sekjen", label: "Sekretaris", desc: "Mengoordinasikan antartim.", tone: "gold" },
  { value: "admin", label: "Admin", desc: "Akses penuh: isi website, anggota, dan persetujuan akhir.", tone: "brand" },
  { value: "pending", label: "Menunggu", desc: "Menunggu konfirmasi admin.", tone: "danger" },
];

const ROLE_INDEX: Record<Role, (typeof ROLES)[number]> = Object.fromEntries(
  ROLES.map((r) => [r.value, r]),
) as Record<Role, (typeof ROLES)[number]>;

/**
 * Peran dari database bisa berisi nilai lama yang tidak ada di daftar (mis.
 * dari versi sebelumnya). Jangan sampai satu baris seperti itu membuat seluruh
 * halaman gagal dibuka: tampilkan apa adanya dengan warna netral.
 */
function roleInfo(role: string) {
  return (
    ROLE_INDEX[role as Role] ?? { value: role as Role, label: role || "Tanpa peran", desc: "", tone: "neutral" as PillTone }
  );
}

/** NIM UIN SGD: digit ke-2–3 = tahun masuk (mis. 1239… → 2023). */
function angkatanDariNim(nim: string): number {
  const d = nim.replace(/\D/g, "");
  const yy = Number(d.slice(1, 3));
  return d.length >= 8 && yy >= 10 ? 2000 + yy : new Date().getFullYear();
}

export function MembersRoleEditor({
  initial,
  initialPending = [],
  currentMemberId,
  isAdmin = true,
}: Props) {
  const [members, setMembers] = useState<Member[]>(initial);
  const [pendingList, setPendingList] = useState<PendingMember[]>(initialPending);
  const [pendingRoles, setPendingRoles] = useState<Record<string, Role>>({});
  const [filter, setFilter] = useState("");
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    email: "",
    nim: "",
    position: "Anggota Eksyar",
    role: "anggota" as Role,
  });

  function handleApprove(p: PendingMember) {
    const assignedRole = pendingRoles[p.email] || "anggota";
    startTransition(async () => {
      const res = await fetch("/api/members/pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: p.email, role: assignedRole, position: "Anggota Eksyar" }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.member) {
        toast.error(j.error ?? "Gagal mengonfirmasi pendaftar");
        return;
      }
      setMembers((prev) => [...prev, j.member as Member]);
      setPendingList((prev) => prev.filter((x) => (x.email ?? "").toLowerCase() !== (p.email ?? "").toLowerCase()));
      toast.success(`${p.name || p.email} berhasil dikonfirmasi sebagai ${ROLE_INDEX[assignedRole]?.label || assignedRole}.`);
    });
  }

  function handleReject(p: PendingMember) {
    if (!confirm(`Tolak pendaftaran ${p.name || p.email}?`)) return;
    startTransition(async () => {
      const res = await fetch(`/api/members/pending?email=${encodeURIComponent(p.email)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j.error ?? "Gagal menolak pendaftar");
        return;
      }
      setPendingList((prev) => prev.filter((x) => (x.email ?? "").toLowerCase() !== (p.email ?? "").toLowerCase()));
      toast.success(`Pendaftaran ${p.name || p.email} telah ditolak.`);
    });
  }

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        (m.name ?? "").toLowerCase().includes(q) ||
        (m.email ?? "").toLowerCase().includes(q) ||
        (m.position ?? "").toLowerCase().includes(q),
    );
  }, [filter, members]);

  async function changeRole(memberId: string, nextRole: Role) {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    if (member.id === currentMemberId && nextRole !== "admin") {
      toast.error("Admin tidak bisa menurunkan perannya sendiri.");
      return;
    }
    startTransition(async () => {
      const res = await fetch(`/api/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j.error ?? "Gagal mengubah peran");
        return;
      }
      const j = (await res.json()) as { member?: Member };
      if (j.member) {
        setMembers((prev) =>
          prev.map((m) => (m.id === memberId ? (j.member as Member) : m)),
        );
        toast.success(
          `Peran ${j.member.name} → ${roleInfo(nextRole).label}`,
        );
      }
    });
  }

  function addMember(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          angkatan: angkatanDariNim(form.nim),
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.member) {
        toast.error(j.error ?? "Gagal menambah anggota");
        return;
      }
      setMembers((prev) => [...prev, j.member as Member]);
      setForm({ name: "", email: "", nim: "", position: "Anggota Humas", role: "anggota" });
      toast.success(`${j.member.name} ditambahkan. Ia bisa login dengan email tersebut.`);
    });
  }

  function removeMember(m: Member) {
    if (
      !confirm(
        `Hapus ${m.name} dari anggota? Konten miliknya akan dipindahkan ke akun Anda.`,
      )
    )
      return;
    startTransition(async () => {
      const res = await fetch(`/api/members/${m.id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j.error ?? "Gagal menghapus anggota");
        return;
      }
      setMembers((prev) => prev.filter((x) => x.id !== m.id));
      toast.success(`${m.name} dihapus.`);
    });
  }

  const inputCls =
    "w-full rounded-xl border border-foreground/10 bg-foreground/[0.04] px-3 py-2 text-[13.5px] outline-none focus:border-brand-500/40 dark:border-white/10 dark:bg-white/5";

  return (
    <div className="mt-6 space-y-5">
      {/* Pendaftar Baru Menunggu Konfirmasi */}
      {pendingList.length > 0 && (
        <GlassCard variant="thick" className="border-amber-500/30 bg-amber-500/[0.04] p-5 dark:border-amber-400/25 dark:bg-amber-400/[0.03]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold text-amber-900 dark:text-amber-200">
              <Clock className="size-4 text-amber-600 dark:text-amber-400" />
              Pendaftar Baru Menunggu Konfirmasi ({pendingList.length})
            </h2>
            <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[13px] font-semibold text-amber-800 dark:text-amber-300">
              Perlu Tindakan Admin
            </span>
          </div>
          <p className="mt-1 text-[13px] text-foreground/65">
            Pengguna Google ini telah masuk pertama kali dan menunggu persetujuan Admin sebelum dapat mengakses fitur CMS.
          </p>

          <ul className="mt-4 divide-y divide-foreground/10 rounded-xl border border-foreground/10 bg-background/60">
            {pendingList.map((p) => {
              const selectedRole = pendingRoles[p.email] || "anggota";
              return (
                <li key={p.email} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent text-sm">
                      {(p.name || p.email || "?").slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-foreground">{p.name || p.email}</p>
                      <p className="text-[13px] text-foreground/60">{p.email}{(p.at || p.createdAt) && ` · Mendaftar ${new Date((p.at || p.createdAt) as string).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" })}`}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={selectedRole}
                      onChange={(e) => setPendingRoles((prev) => ({ ...prev, [p.email]: e.target.value as Role }))}
                      className="rounded-lg border border-foreground/15 bg-background px-3 py-1.5 text-[13px] font-medium outline-none focus:border-accent"
                    >
                      {ROLES.filter((r) => r.value !== "pending").map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>

                    <Button
                      size="sm"
                      onClick={() => handleApprove(p)}
                      disabled={pending}
                      className="gap-1.5 bg-accent text-white hover:bg-accent-strong"
                    >
                      <Check className="size-3.5" />
                      Konfirmasi
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleReject(p)}
                      disabled={pending}
                      className="text-foreground/60 hover:bg-rose-500/10 hover:text-rose-600"
                    >
                      <X className="size-3.5" />
                      Tolak
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </GlassCard>
      )}

      {isAdmin && (
        <GlassCard variant="thick" className="p-5">
          <h2 className="flex items-center gap-2 text-[15px] font-semibold">
            <UserPlus className="size-4" strokeWidth={1.75} /> Tambah anggota
          </h2>
          <p className="mt-1 text-[13px] text-foreground/60">
            Gunakan email Google yang dipakai orang itu untuk masuk. Setelah ditambahkan,
            anggota langsung bisa masuk sesuai perannya.
          </p>
          <form onSubmit={addMember} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="text-[13px] text-foreground/65">
              Nama lengkap
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`mt-1 ${inputCls}`}
              />
            </label>
            <label className="text-[13px] text-foreground/65">
              Email untuk masuk
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="nama@gmail.com"
                className={`mt-1 ${inputCls}`}
              />
            </label>
            <label className="text-[13px] text-foreground/65">
              NIM (opsional)
              <input
                inputMode="numeric"
                value={form.nim}
                onChange={(e) => setForm({ ...form, nim: e.target.value })}
                className={`mt-1 ${inputCls}`}
              />
            </label>
            <label className="text-[13px] text-foreground/65">
              Jabatan
              <input
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className={`mt-1 ${inputCls}`}
              />
            </label>
            <label className="text-[13px] text-foreground/65">
              Peran
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                className={`mt-1 ${inputCls}`}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <Button type="submit" disabled={pending} className="w-full sm:w-auto">
                <UserPlus className="size-4" strokeWidth={1.75} />
                {pending ? "Menyimpan…" : "Tambah anggota"}
              </Button>
            </div>
          </form>
        </GlassCard>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex flex-1 items-center gap-2 rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
          <Search className="size-4 text-foreground/60" strokeWidth={1.75} />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Cari nama, email, atau posisi…"
            className="w-full bg-transparent text-[14px] outline-none"
          />
        </label>
        <p className="text-[13px] text-foreground/60">
          {filtered.length} dari {members.length} anggota
        </p>
      </div>

      <GlassCard variant="thick" className="p-0">
        <ul className="divide-y divide-foreground/10 dark:divide-white/10">
          {filtered.map((m) => {
            const isSelf = m.id === currentMemberId;
            return (
              <li
                key={m.id}
                className="flex flex-wrap items-center gap-3 p-4"
              >
                <Avatar member={m} size={42} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium">
                    {m.name}
                    {isSelf && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-brand-500/15 px-2 py-0.5 text-[13px] font-medium text-brand-700 dark:text-brand-300">
                        <Shield className="size-3" strokeWidth={2} /> kamu
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[13px] text-foreground/60">
                    {[m.email, m.position].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <Pill tone={roleInfo(m.role).tone}>
                  {roleInfo(m.role).label}
                </Pill>
                {isAdmin ? (
                  <>
                    <select
                      value={m.role}
                      disabled={pending}
                      onChange={(e) =>
                        changeRole(m.id, e.target.value as Role)
                      }
                      className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] px-2 py-1.5 text-[13px] outline-none focus:border-brand-500/40 dark:border-white/10 dark:bg-white/5"
                    >
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    {!isSelf && (
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => removeMember(m)}
                        aria-label={`Hapus ${m.name}`}
                        title="Hapus anggota"
                        className="grid grid-cols-1 size-8 place-items-center rounded-lg text-foreground/60 transition-colors hover:bg-red-500/10 hover:text-red-600"
                      >
                        <Trash2 className="size-4" strokeWidth={1.75} />
                      </button>
                    )}
                  </>
                ) : null}
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="p-8 text-center text-[13px] text-foreground/60">
              Tidak ada anggota yang cocok.
            </li>
          )}
        </ul>
      </GlassCard>

      <GlassCard className="p-5">
        <p className="text-[13px] text-foreground/60">
          Penjelasan peran
        </p>
        <ul className="mt-3 space-y-2 text-[13px]">
          {ROLES.map((r) => (
            <li key={r.value} className="flex gap-2">
              <Pill tone={r.tone}>{r.label}</Pill>
              <span className="text-foreground/65">{r.desc}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
