import { redirect } from "next/navigation";

/**
 * Divisi concept removed from the product. Halaman ini di-redirect ke
 * /members untuk meminimalkan disruption pada bookmark lama.
 */
export default function DivisionsPage() {
  redirect("/members");
}
