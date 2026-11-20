import { redirect } from "next/navigation";

/** Halaman lama (data contoh, tidak di menu): dialihkan ke halaman yang datanya asli. */
export default function Page() {
  redirect("/dashboard");
}
