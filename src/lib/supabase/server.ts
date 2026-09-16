import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for server-only routes (API route handlers).
 * Never import this from a client component — the service role key
 * bypasses RLS entirely.
 */
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Supabase returns a to-one related row as either an object or a
 * single-element array depending on the join — normalize to one shape.
 */
export function unwrapRelation<T>(value: T | T[] | null | undefined): T | null {
  return (Array.isArray(value) ? value[0] : value) ?? null;
}
