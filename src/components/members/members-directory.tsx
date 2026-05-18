"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Search, Flame, Trophy } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/common/avatar";
import { Pill } from "@/components/common/pill";
import { EmptyState } from "@/components/common/empty-state";
import type { Member, Division, Role } from "@/lib/data/types";

interface Props {
  members: Member[];
  divisions: Division[];
  topXP: string[];
}

const ROLE_LABEL: Record<Role, string> = {
  monitoring: "Pembina",
  anggota: "Anggota",
  pengurus: "Pengurus",
  ketua_divisi: "Koordinator",
  sekjen: "Sekjen",
  admin: "Admin",
};

export function MembersDirectory({ members, divisions, topXP }: Props) {
  const [query, setQuery] = useState("");
  const [divFilter, setDivFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (divFilter !== "all" && m.divisionId !== divFilter) return false;
      if (roleFilter !== "all" && m.role !== roleFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !m.name.toLowerCase().includes(q) &&
          !m.email.toLowerCase().includes(q) &&
          !m.position.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [members, divFilter, roleFilter, query]);

  return (
    <div className="mt-2 space-y-5">
      <GlassCard className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex flex-1 items-center gap-2 rounded-2xl border border-foreground/10 bg-foreground/[0.04] px-3 py-2 dark:border-white/10 dark:bg-white/5">
            <Search className="size-4 text-foreground/55" strokeWidth={1.75} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama, email, jabatan…"
              className="w-full bg-transparent text-[13px] outline-none placeholder:text-foreground/45"
            />
          </label>
          <select
            value={divFilter}
            onChange={(e) => setDivFilter(e.target.value)}
            className="h-10 rounded-2xl border border-foreground/10 bg-foreground/[0.04] px-3 text-[13px] dark:border-white/10 dark:bg-white/5"
          >
            <option value="all">Semua divisi</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.shortName}
              </option>
            ))}
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as Role | "all")}
            className="h-10 rounded-2xl border border-foreground/10 bg-foreground/[0.04] px-3 text-[13px] dark:border-white/10 dark:bg-white/5"
          >
            <option value="all">Semua peran</option>
            {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
        </div>
      </GlassCard>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState
              title="Tidak ada anggota cocok"
              description="Coba ubah filter atau hapus kata kunci."
            />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            layout
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((m) => {
              const division = divisions.find((d) => d.id === m.divisionId);
              const isTop = topXP.includes(m.id);
              return (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 26 }}
                >
                  <Link href={`/members/${m.id}`}>
                    <GlassCard hover className="relative h-full p-5">
                      {isTop && (
                        <span className="absolute -top-2 -right-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 px-2 py-0.5 text-[10px] font-semibold text-ink-900 shadow-[0_8px_24px_-6px_rgba(232,148,34,0.5)]">
                          <Trophy className="size-3" strokeWidth={2} />
                          Top XP
                        </span>
                      )}
                      <div className="flex items-start gap-3">
                        <Avatar member={m} size={56} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-[15px] font-semibold tracking-tight">
                            {m.name}
                          </p>
                          <p className="truncate text-[12px] text-foreground/65">
                            {m.position}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <Pill tone="brand">{ROLE_LABEL[m.role]}</Pill>
                            {division && (
                              <Pill>{division.shortName}</Pill>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-foreground/10 pt-3 text-center text-[11px] dark:border-white/10">
                        <Stat label="XP" value={m.xp.toLocaleString()} />
                        <Stat
                          label="Streak"
                          value={
                            <span className="inline-flex items-center gap-1">
                              <Flame
                                className="size-3 text-gold-500"
                                strokeWidth={2}
                              />
                              {m.streak}h
                            </span>
                          }
                        />
                        <Stat label="Badge" value={m.badges.length} />
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.16em] text-foreground/55">
        {label}
      </p>
      <p className="mt-0.5 text-[13px] font-semibold">{value}</p>
    </div>
  );
}
