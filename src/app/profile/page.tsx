import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/data/provider";

export const metadata: Metadata = {
  title: "Profil",
};

export default async function ProfileRedirect() {
  const me = await getCurrentMember();
  redirect(`/members/${me.id}`);
}
