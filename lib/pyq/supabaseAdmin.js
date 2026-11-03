// SERVER ONLY. Uses the service-role key, which bypasses RLS.
// Never import this file from a client component or a file with 'use client'.
import { createClient } from "@supabase/supabase-js";

const noStoreFetch = (url, options = {}) =>
  fetch(url, { ...options, cache: "no-store" });

export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new Error(
      "Supabase service role is not configured (SUPABASE_SERVICE_ROLE_KEY).",
    );
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: noStoreFetch },
  });
}
