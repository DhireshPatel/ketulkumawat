// Anon-key Supabase client for the server. Every query made with it is limited by
// Row Level Security, so it can only ever see active exams and published papers.
import { createClient } from "@supabase/supabase-js";

// Next.js 14 caches fetch() on the server by default - disable it so that
// publish / unpublish takes effect immediately.
const noStoreFetch = (url, options = {}) =>
  fetch(url, { ...options, cache: "no-store" });

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function getPublicClient() {
  if (!isSupabaseConfigured())
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: noStoreFetch },
    },
  );
}
