"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Search, Shield } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/common/avatar";
import { Pill } from "@/components/common/pill";
import type { Member, Role } from "@/lib/data/types";

interface Props {
  initial: Member[];
  currentMemberId: string;
}

type PillTone = "neutral" | "brand" | "gold" | "danger" | "success" | "info";

const ROLES: { value: Role; label: string; desc: string; tone: PillTone }[] = [
  { value: "monitoring", label: "Monitoring", desc: "View-only, mantau saja (cocok untuk pembina).", tone: "neutral" },
  { value: "anggota", label: "Anggota", desc: "Bisa submit konten.", tone: "neutral" },
  { value: "pengurus", label: "Pengurus", desc: "Submit + co-edit.", tone: "info" },
  { value: "ketua_divisi", label: "Koordinator", desc: "Review submission tim.", tone: "gold" },
  { value: "sekjen", label: "Sekjen", desc: "Cross-team coordinator.", tone: "gold" },
  { value: "admin", label: "Admin", desc: "Full access: settings + role + final approval.", tone: "brand" },
];

const ROLE_INDEX: Record<Role, (typeof ROLES)[number]> = Object.fromEntries(
  ROLES.map((r) => [r.value, r]),
) as Record<Role, (typeof ROLES)[number]>;

export function MembersRoleEditor({ initial, currentMemberId }: Props) {
  const [members, setMembers] = useState<Member[]>(initial);
  const [filter, setFilter] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.position.toLowerCase().includes(q),
    );
  }, [filter, members]);

  async function changeRole(memberId: string, nextRole: Role) {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    if (member.id === currentMemberId && nextRole !== "admin") {
      toast.error("Admin tidak boleh menurunkan rolenya sendiri.");
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
        toast.error(j.error ?? "Gagal mengubah role");
        return;
      }
      const j = (await res.json()) as { member?: Member };
      if (j.member) {
        setMembers((prev) =>
          prev.map((m) => (m.id === memberId ? (j.member as Member) : m)),
        );
        toast.success(
          `Role ${j.member.name} → ${ROLE_INDEX[nextRole].label}`,
        );
      }
    });
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex flex-1 items-center gap-2 rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
          <Search className="size-4 text-foreground/40" strokeWidth={1.75} />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Cari nama, email, atau posisi…"
            className="w-full bg-transparent text-[14px] outline-none"
          />
        </label>
        <p className="text-[11px] text-foreground/55">
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
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-medium text-brand-700 dark:text-brand-300">
                        <Shield className="size-3" strokeWidth={2} /> kamu
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[12px] text-foreground/55">
                    {m.email} · {m.position}
                  </p>
                </div>
                <Pill tone={ROLE_INDEX[m.role].tone}>
                  {ROLE_INDEX[m.role].label}
                </Pill>
                <select
                  value={m.role}
                  disabled={pending}
                  onChange={(e) =>
                    changeRole(m.id, e.target.value as Role)
                  }
                  className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] px-2 py-1.5 text-[12px] outline-none focus:border-brand-500/40 dark:border-white/10 dark:bg-white/5"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="p-8 text-center text-[12px] text-foreground/55">
              Tidak ada anggota yang cocok.
            </li>
          )}
        </ul>
      </GlassCard>

      <GlassCard className="p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
          Penjelasan role
        </p>
        <ul className="mt-3 space-y-2 text-[12px]">
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
