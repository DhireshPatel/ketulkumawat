// Server-side admin check for the PYQ API routes.
//
// This project does NOT own your login. Your existing admin login signs the user in
// with Supabase Auth in the browser; the PYQ screens then send that session's
// access token with every API call:   Authorization: Bearer <access_token>
// Here the server verifies the token with Supabase and checks the user is an admin.
//
// >>> If your project decides "who is an admin" differently, change ONLY isAdminUser() below. <<<
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServiceClient } from "./supabaseAdmin";

function authClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

/**
 * Who counts as an admin? (either rule is enough)
 *  1. their email is listed in the ADMIN_EMAILS env variable (comma separated), or
 *  2. their user id exists in the public.admin_users table (created by the SQL file).
 * Replace this with your own rule (e.g. a `role` column / profiles table) if you have one.
 */
export async function isAdminUser(user) {
  const emails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (user.email && emails.includes(user.email.toLowerCase())) return true;

  const { data, error } = await getServiceClient()
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) return false; // table missing etc. -> not admin
  return Boolean(data);
}

function bearer(request) {
  const h = request.headers.get("authorization") || "";
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1].trim() : null;
}

/**
 * Use at the top of every admin route handler:
 *   const g = await requireAdmin(request); if (g.response) return g.response;
 */
export async function requireAdmin(request) {
  const token = bearer(request);
  if (!token) {
    return {
      response: NextResponse.json(
        { error: "Please sign in.", code: "unauthenticated" },
        { status: 401 },
      ),
    };
  }
  let user;
  try {
    const { data, error } = await authClient().auth.getUser(token); // verified by Supabase, not just decoded
    if (error || !data?.user) {
      return {
        response: NextResponse.json(
          { error: "Session expired. Please sign in again.", code: "expired" },
          { status: 401 },
        ),
      };
    }
    user = data.user;
    if (!(await isAdminUser(user))) {
      return {
        response: NextResponse.json(
          { error: "You do not have admin access." },
          { status: 403 },
        ),
      };
    }
  } catch (e) {
    console.error("[pyq] admin check failed", e.message);
    return {
      response: NextResponse.json(
        { error: "Server error while checking permissions." },
        { status: 500 },
      ),
    };
  }
  return { admin: { user } };
}
