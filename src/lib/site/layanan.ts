import { randomInt, randomUUID } from "node:crypto";
import { z } from "zod";
import type { Role, ServiceRequestStatus } from "@/lib/data/types";

/** Label & warna status untuk UI publik maupun CMS. */
export const STATUS_LABEL: Record<ServiceRequestStatus, string> = {
  diajukan: "Diajukan",
  diproses: "Sedang diproses",
  selesai: "Selesai",
  ditolak: "Ditolak",
};

export const STATUS_ORDER: ServiceRequestStatus[] = ["diajukan", "diproses", "selesai"];

/** Role CMS yang boleh memproses pengajuan; `monitoring` hanya melihat. */
export const PROCESSOR_ROLES: Role[] = ["admin", "sekjen", "ketua_divisi", "pengurus"];
export const VIEWER_ROLES: Role[] = [...PROCESSOR_ROLES, "monitoring"];

const SAFE_HTTPS = /^https:\/\/[^\s]+$/i;

/** Validasi formulir pengajuan publik. `jenisValid` = daftar layanan aktif dari CMS. */
export function submissionSchema(jenisValid: string[]) {
  return z.object({
    type: z.string().trim().refine((v) => jenisValid.includes(v), "Jenis layanan tidak tersedia"),
    name: z.string().trim().min(3, "Nama minimal 3 huruf").max(120),
    nim: z
      .string()
      .trim()
      .regex(/^[0-9A-Za-z]{5,20}$/, "NIM hanya huruf/angka, 5–20 karakter"),
    email: z.string().trim().max(200).email("Email tidak valid"),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s-]{8,20}$/, "Nomor WhatsApp tidak valid"),
    purpose: z.string().trim().min(3, "Isi keperluan").max(300),
    details: z.string().trim().max(2000).default(""),
    attachmentUrl: z
      .string()
      .trim()
      .max(2000)
      .refine((v) => v === "" || SAFE_HTTPS.test(v), "Tautan lampiran harus https://")
      .default(""),
    /** Honeypot anti-bot: harus kosong. */
    website: z.string().max(0).optional().default(""),
  });
}

export const statusQuerySchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^ES-[A-Z0-9]{6}$/, "Format kode: ES-XXXXXX"),
  nim: z.string().trim().min(5).max(20),
});

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Kode tiket acak yang mudah dibaca (tanpa 0/O/1/I), mis. "ES-7K3F9Q". */
export function generateCode(): string {
  let out = "";
  for (let i = 0; i < 6; i++) out += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return `ES-${out}`;
}

export const newId = () => `req-${randomUUID()}`;

/**
 * Pembatas sederhana per IP (in-memory, per instance server). Cukup untuk
 * menahan spam formulir; bukan pengganti WAF.
 */
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const g = globalThis as { __rateLimit?: Map<string, number[]> };
  const map = (g.__rateLimit ??= new Map<string, number[]>());
  const now = Date.now();
  const hits = (map.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    map.set(key, hits);
    return false;
  }
  hits.push(now);
  map.set(key, hits);
  return true;
}

export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

/** Escape teks bebas dari pengguna sebelum dimasukkan ke HTML email. */
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function siteOrigin(fallback: string): string {
  return (process.env.NEXT_PUBLIC_APP_URL || fallback).replace(/\/$/, "");
}
