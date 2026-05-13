/**
 * Neon Postgres client (serverless HTTP driver).
 *
 * Falls back to a dev-time stub when `DATABASE_URL` is not set so the app
 * can still build locally without a database. Run-time queries on the stub
 * throw — call sites must check `isDbEnabled` before querying.
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const isDbEnabled = !!process.env.DATABASE_URL;

function makeClient() {
  if (!isDbEnabled) {
    return null;
  }
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql, { schema });
}

export const db = makeClient();

export { schema };
