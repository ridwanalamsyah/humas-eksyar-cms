import { redirect } from "next/navigation";

export default function PojokSkripsiRedirectPage() {
  redirect("/prodi/skripsi?mode=pojok");
}
