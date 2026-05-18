"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Volume2,
  Languages,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/common/avatar";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/common/pill";
import type { Member } from "@/lib/data/types";

interface Props {
  member: Member;
}

const subscribeNoop = () => () => {};

export function SettingsPanels({ member }: Props) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [sounds, setSounds] = useState(false);
  const [haptics, setHaptics] = useState(true);
  const [lang, setLang] = useState<"id" | "en">("id");

  return (
    <div className="mt-4 space-y-6">
      <GlassCard variant="thick" className="p-5">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar member={member} size={64} />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold tracking-tight">
              {member.name}
            </p>
            <p className="text-[12px] text-foreground/65">{member.email}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone="brand">{member.role}</Pill>
              <Pill>Angkatan {member.angkatan}</Pill>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Edit profil
          </Button>
        </div>
      </GlassCard>

      <Panel
        icon={<Sun className="size-4" strokeWidth={1.75} />}
        title="Tampilan"
        hint="Ikut OS, atau pilih manual."
      >
        <div className="grid grid-cols-3 gap-2">
          {[
            { v: "light", Icon: Sun, label: "Terang" },
            { v: "dark", Icon: Moon, label: "Gelap" },
            { v: "system", Icon: Monitor, label: "Sistem" },
          ].map(({ v, Icon, label }) => {
            const active = mounted && theme === v;
            return (
              <motion.button
                key={v}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setTheme(v);
                  toast.success(`Tema: ${label}`);
                }}
                className={`flex flex-col items-start gap-1 rounded-2xl border px-3 py-2.5 text-left text-[12px] transition-colors ${
                  active
                    ? "border-brand-500/45 bg-brand-500/10"
                    : "border-foreground/10 bg-foreground/[0.04] dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <Icon className="size-4" strokeWidth={1.75} />
                <span className="font-medium">{label}</span>
              </motion.button>
            );
          })}
        </div>
      </Panel>

      <Panel
        icon={<Bell className="size-4" strokeWidth={1.75} />}
        title="Notifikasi"
        hint="Pilih channel mana yang dipakai."
      >
        <Toggle
          label="Email digest mingguan"
          checked={notifEmail}
          onChange={setNotifEmail}
        />
        <Toggle
          label="Push notification PWA"
          checked={notifPush}
          onChange={setNotifPush}
        />
      </Panel>

      <Panel
        icon={<Volume2 className="size-4" strokeWidth={1.75} />}
        title="Sound &amp; haptic"
        hint="Untuk mobile, getaran lembut saat aksi penting."
      >
        <Toggle label="Sound effect halus" checked={sounds} onChange={setSounds} />
        <Toggle label="Haptic mobile" checked={haptics} onChange={setHaptics} />
      </Panel>

      <Panel
        icon={<Languages className="size-4" strokeWidth={1.75} />}
        title="Bahasa"
      >
        <div className="grid grid-cols-2 gap-2">
          {(["id", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`rounded-2xl border px-3 py-2 text-left text-[12px] transition-colors ${
                lang === l
                  ? "border-brand-500/45 bg-brand-500/10"
                  : "border-foreground/10 bg-foreground/[0.04] dark:border-white/10 dark:bg-white/5"
              }`}
            >
              <p className="font-medium">{l === "id" ? "Indonesia" : "English"}</p>
              <p className="text-[10px] text-foreground/55">
                {l === "id" ? "Bahasa default" : "Coming soon"}
              </p>
            </button>
          ))}
        </div>
      </Panel>

      <Panel
        icon={<ShieldCheck className="size-4" strokeWidth={1.75} />}
        title="Privasi &amp; akun"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ redirectTo: "/login" })}
        >
          <LogOut className="size-3.5" strokeWidth={1.75} /> Keluar dari akun
        </Button>
      </Panel>
    </div>
  );
}

function Panel({
  icon,
  title,
  hint,
  children,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/55">
        {icon}
        {title}
      </div>
      {hint && (
        <p className="mt-1 text-[12px] text-foreground/65">{hint}</p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">{children}</div>
    </GlassCard>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex w-full items-center justify-between gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2.5 text-[13px] dark:border-white/10 dark:bg-white/[0.03]">
      <span>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-brand-500" : "bg-foreground/15"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow ${
            checked ? "right-0.5" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}
