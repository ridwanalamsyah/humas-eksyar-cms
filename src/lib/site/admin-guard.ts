import { auth } from "@/auth";
import { findMemberByEmail } from "@/lib/data/provider";
import type { Member } from "@/lib/data/types";

/** Admin CMS saja. */
export async function requireAdmin(): Promise<Member | null> {
  const session = await auth();
  if (!session?.user?.email) return null;
  const me = await findMemberByEmail(session.user.email);
  return me?.role === "admin" ? me : null;
}
