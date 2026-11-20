/**
 * Satu sumber untuk mengenali admin utama. Admin bisa masuk dengan beberapa
 * alamat (email kampus atau Gmail); semuanya dipetakan ke satu akun anggota.
 * Pencocokan selalu persis (bukan "mengandung"), supaya email lain yang mirip
 * tidak ikut dianggap admin.
 */
export const ADMIN_PRIMARY_EMAIL = "1239220061@student.uinsgd.ac.id";

const ADMIN_ALIASES = new Set([
  ADMIN_PRIMARY_EMAIL,
  "humaseksyaruinbdg@gmail.com",
  "ridwanalamsyah122@gmail.com",
  "admin@eksyar.ac.id",
]);

export const normalizeEmail = (email?: string | null) => (email ?? "").trim().toLowerCase();

export function isSuperAdminEmail(email?: string | null): boolean {
  return ADMIN_ALIASES.has(normalizeEmail(email));
}

/** Email yang dipakai untuk mencari anggota: alias admin → email utama admin. */
export function canonicalMemberEmail(email?: string | null): string {
  const e = normalizeEmail(email);
  return ADMIN_ALIASES.has(e) ? ADMIN_PRIMARY_EMAIL : e;
}
