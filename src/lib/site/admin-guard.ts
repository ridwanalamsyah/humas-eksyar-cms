import { auth } from "@/auth";
import { findMemberByEmail, getCurrentMember } from "@/lib/data/provider";
import type { Member } from "@/lib/data/types";

/** Admin CMS saja. */
export async function requireAdmin(): Promise<Member | null> {
  const session = await auth();
  if (session?.user?.email) {
    const me = await findMemberByEmail(session.user.email);
    return me?.role === "admin" ? me : null;
  }
  if (!process.env.GOOGLE_CLIENT_ID) {
    const fallback = await getCurrentMember();
    return fallback?.role === "admin" ? fallback : null;
  }
  return null;
}
