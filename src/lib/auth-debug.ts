/**
 * Tiny in-memory ring buffer for the most recent Auth.js errors.
 *
 * Auth.js v5 ships generic `?error=Configuration` pages and pushes the actual
 * exception only to the server logs. Reading Vercel runtime logs requires
 * project-level access we don't always have during a remote debugging
 * session, so we mirror those errors here and expose them through
 * `/api/auth/health` for the duration of a single warm Lambda.
 *
 * Intentionally minimal — no persistence, no PII redaction beyond what we
 * already strip when serialising. Toggle off (or just remove) once login is
 * stable in production.
 */

type AuthDebugEntry = {
  at: string;
  name: string;
  message: string;
  cause?: string;
  stack?: string;
};

const MAX = 10;
const buffer: AuthDebugEntry[] = [];

function safeMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export function recordAuthError(err: unknown): void {
  const entry: AuthDebugEntry = {
    at: new Date().toISOString(),
    name: err instanceof Error ? err.name : "AuthError",
    message: safeMessage(err),
  };
  if (err instanceof Error) {
    if (err.stack) entry.stack = err.stack.split("\n").slice(0, 5).join("\n");
    const cause = (err as { cause?: unknown }).cause;
    if (cause) entry.cause = safeMessage(cause);
  }
  buffer.unshift(entry);
  if (buffer.length > MAX) buffer.length = MAX;
}

export function readAuthErrors(): AuthDebugEntry[] {
  return [...buffer];
}
