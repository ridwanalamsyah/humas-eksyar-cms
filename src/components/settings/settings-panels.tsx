"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  LogOut,
  ShieldCheck,
  ChevronRight,
  Palette,
  Tag,
  Users as UsersIcon,
  Globe,
  Inbox,
  BarChart3,
  Camera,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/common/avatar";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/common/pill";
import { ROLE_LABEL, type Member } from "@/lib/data/types";

interface Props {
  member: Member;
}


export function SettingsPanels({ member }: Props) {

  const emailLower = (member.email || "").toLowerCase();
  const isSuperAdminEmail =
    emailLower.includes("1239220061") ||
    emailLower === "1239220061@student.uinsgd.ac.id" ||
    emailLower === "humaseksyaruinbdg@gmail.com" ||
    emailLower === "ridwanalamsyah122@gmail.com";
  const canManage =
    member.role === "admin" ||
    member.role === "sekjen" ||
    member.role === "ketua_divisi" ||
    member.role === "pengurus" ||
    isSuperAdminEmail;

  return (
    <div className="mt-4 space-y-6">
      <GlassCard variant="thick" className="p-5">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar member={member} size={64} />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold tracking-tight">
              {member.name}
            </p>
            <p className="text-[13px] text-foreground/65">{member.email}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone="brand">{ROLE_LABEL[member.role]}</Pill>
              <Pill>Angkatan {member.angkatan}</Pill>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/profile/edit">Ubah profil</Link>
          </Button>
        </div>
      </GlassCard>

      {canManage && (
        <Panel
          icon={<ShieldCheck className="size-4" strokeWidth={1.75} />}
          title="Kelola Website & Tim"
          hint="Pengaturan konten website, anggota, dan fitur."
        >
          <div className="flex w-full flex-col gap-2">
            <AdminLink
              href="/settings/website"
              icon={<Globe className="size-4" strokeWidth={1.75} />}
              title="Website Prodi"
              desc="Semua isi website: beranda, akademik, kalender, lomba, beasiswa, karier, kamus, zakat, sertifikat, layanan."
            />
            <AdminLink
              href="/settings/formulir"
              icon={<Inbox className="size-4" strokeWidth={1.75} />}
              title="Kotak masuk"
              desc="Kiriman formulir, pertanyaan, dan pendaftaran acara dari website."
            />
            <AdminLink
              href="/content/instagram"
              icon={<Camera className="size-4" strokeWidth={1.75} />}
              title="Instagram"
              desc="Sambungkan akun resmi dan ubah unggahan jadi berita."
            />
            <AdminLink
              href="/settings/kinerja"
              icon={<BarChart3 className="size-4" strokeWidth={1.75} />}
              title="Laporan"
              desc="Pengunjung website, laporan bulanan, unduh data, dan cadangan."
            />
            <AdminLink
              href="/settings/skripsi"
              icon={<Tag className="size-4" strokeWidth={1.75} />}
              title="Direktori skripsi"
              desc="Data untuk fitur Cek Judul di website prodi."
            />
            <AdminLink
              href="/settings/branding"
              icon={<Palette className="size-4" strokeWidth={1.75} />}
              title="Identitas konten"
              desc="Nama organisasi, penutup caption, dan tagar bawaan."
            />
            <AdminLink
              href="/settings/rubrics"
              icon={<Tag className="size-4" strokeWidth={1.75} />}
              title="Rubrik konten"
              desc="Tambah atau ubah kategori konten."
            />
            <AdminLink
              href="/settings/members"
              icon={<UsersIcon className="size-4" strokeWidth={1.75} />}
              title="Anggota & peran"
              desc="Tambah, hapus, dan atur peran anggota."
            />
          </div>
        </Panel>
      )}

      <Panel
        icon={<ShieldCheck className="size-4" strokeWidth={1.75} />}
        title="Akun"
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
      <div className="flex items-center gap-2 text-[13px] text-foreground/60">
        {icon}
        {title}
      </div>
      {hint && (
        <p className="mt-1 text-[13px] text-foreground/65">{hint}</p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">{children}</div>
    </GlassCard>
  );
}

function AdminLink({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex w-full items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2.5 text-left transition-colors hover:border-brand-500/30 hover:bg-brand-500/5 dark:border-white/10 dark:bg-white/[0.03]"
    >
      <span className="inline-flex size-8 items-center justify-center rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-300">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium leading-tight">{title}</span>
        <span className="block text-[13px] text-foreground/60">{desc}</span>
      </span>
      <ChevronRight className="size-4 text-foreground/60 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
    </Link>
  );
}
