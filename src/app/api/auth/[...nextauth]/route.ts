/**
 * Auth.js HTTP handlers (sign-in/out, callback, session). Next.js 16 routes
 * the dynamic `[...nextauth]` segment here.
 */
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
