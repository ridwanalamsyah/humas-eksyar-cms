import { redirect } from "next/navigation";

/**
 * Divisi concept removed from the product. Detail divisi tidak lagi
 * dirender — redirect ke daftar anggota.
 */
export default function DivisionDetailPage() {
  redirect("/members");
}
