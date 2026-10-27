// ---------------------------------------------------------------------------
// Public (anonymous) Supabase client for the PUBLIC pages only (/exam-alerts and the homepage block).
// Uses your existing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.
// RLS lets this client read ONLY published rows.
// Admin pages use your existing browser client (@/lib/supabase/client) instead; see adminClient.js.
// ---------------------------------------------------------------------------
import { createClient } from "@supabase/supabase-js";

export function getPublicSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
