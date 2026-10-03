"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/common/avatar";
import { Pill } from "@/components/common/pill";
import { EmptyState } from "@/components/common/empty-state";
import type { Member, Role } from "@/lib/data/types";

interface Props {
  members: Member[];
}

const ROLE_LABEL: Record<Role, string> = {
  monitoring: "Pembina",
  anggota: "Anggota",
  pengurus: "Pengurus",
  ketua_divisi: "Koordinator",
  sekjen: "Sekjen",
  admin: "Admin",
};

export function MembersDirectory({ members }: Props) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");

  const filtered = useMemo(() => {
    return members.filter((m) => {
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
  }, [members, roleFilter, query]);

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
                          </div>
                        </div>
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
