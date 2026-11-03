"use client";
// Browser Supabase client (anon key only). Used to read the signed-in admin's session.
// >>> If your project already has a browser Supabase client, delete this file and
//     import yours in lib/adminClient.js instead. <<<
import { createClient } from "@supabase/supabase-js";

let client;
export function getBrowserClient() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  }
  return client;
}
