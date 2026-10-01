import { auth } from "@/auth";
import { findMemberByEmail } from "@/lib/data/provider";
import type { Member } from "@/lib/data/types";

/** Anggota CMS yang boleh membuat konten (bukan role monitoring). */
export async function requireEditor(): Promise<Member | null> {
  const session = await auth();
  if (!session?.user?.email) return null;
  const me = await findMemberByEmail(session.user.email);
  return me && me.role !== "monitoring" ? me : null;
}
