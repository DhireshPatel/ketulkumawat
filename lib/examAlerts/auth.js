import { redirect } from "next/navigation";
import { getSessionSupabase } from "./supabase.js";
import { ADMIN_LOGIN_PATH } from "./constants.js";

/**
 * Verifies the logged-in user AND their admin status on the server.
 * Admin status comes from the SQL function public.exam_alerts_is_admin(),
 * the same function the RLS policies use, so UI and database always agree.
 * Returns { supabase, user } or null.
 */
export async function getAdminContext() {
  const supabase = await getSessionSupabase();
  const { data, error } = await supabase.auth.getUser(); // validates the JWT with Supabase
  if (error || !data?.user) return null;

  const { data: isAdmin, error: rpcError } = await supabase.rpc(
    "exam_alerts_is_admin",
  );
  if (rpcError || isAdmin !== true) return null;

  return { supabase, user: data.user };
}

/** For admin pages: redirect to login if not allowed. */
export async function requireAdminPage() {
  const ctx = await getAdminContext();
  if (!ctx) redirect(ADMIN_LOGIN_PATH);
  return ctx;
}
