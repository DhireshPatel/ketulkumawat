// Admin data layer. Uses YOUR existing browser Supabase client, the same one app/admin/page.js uses.
// Security does not depend on this file: the database (RLS + constraints + exam_alerts_is_admin())
// rejects any write that is not from an admin, whatever the browser sends.
import { supabase } from "@/lib/supabase/client";
import { validateExamInput } from "./validation.js";
import { timestampToSiteDate } from "./dates.js";

const FAIL = "Something went wrong. Please try again.";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** 'login' (no session) | 'forbidden' (logged in but not admin) | 'ok' | 'error' */
export async function getAdminState() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return "login";
    const { data, error } = await supabase.rpc("exam_alerts_is_admin");
    if (error) return "error";
    return data === true ? "ok" : "forbidden";
  } catch {
    return "error";
  }
}

export async function listExams({ q = "", status = "", category = "" } = {}) {
  let query = supabase
    .from("exam_notifications")
    .select(
      "id,title,slug,category,publication_status,application_end,verified_at,updated_at",
    )
    .order("updated_at", { ascending: false })
    .limit(200);
  const s = String(q)
    .replace(/[,()%*\\]/g, " ")
    .trim()
    .slice(0, 80);
  if (s) query = query.ilike("title", `%${s}%`);
  if (status) query = query.eq("publication_status", status);
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  return error
    ? { data: [], error: "Could not load notifications." }
    : { data: data || [], error: null };
}

export async function getExam(id) {
  if (!UUID_RE.test(id || "")) return { data: null, error: null };
  const { data, error } = await supabase
    .from("exam_notifications")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return { data: null, error: "Could not load this notification." };
  return {
    data: data
      ? { ...data, verified_at: timestampToSiteDate(data.verified_at) || "" }
      : null,
    error: null,
  };
}

async function slugTaken(slug, exceptId) {
  let q = supabase
    .from("exam_notifications")
    .select("id")
    .eq("slug", slug)
    .limit(1);
  if (exceptId) q = q.neq("id", exceptId);
  const { data, error } = await q;
  return error ? null : data.length > 0;
}

export async function saveExam(id, input) {
  const { errors, values } = validateExamInput(input || {});
  if (Object.keys(errors).length)
    return { ok: false, errors, message: "Please fix the highlighted fields." };

  const taken = await slugTaken(values.slug, id);
  if (taken === null) return { ok: false, message: FAIL };
  if (taken)
    return {
      ok: false,
      errors: {
        slug: "This slug is already used by another notification. Please choose a different one.",
      },
      message: "Please fix the highlighted fields.",
    };

  let res;
  if (id) {
    res = await supabase
      .from("exam_notifications")
      .update(values)
      .eq("id", id)
      .select("id")
      .maybeSingle();
  } else {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return {
        ok: false,
        message: "Your session has expired. Please log in again.",
      };
    res = await supabase
      .from("exam_notifications")
      .insert({ ...values, created_by: user.id })
      .select("id")
      .maybeSingle();
  }
  if (res.error) {
    if (res.error.code === "23505")
      return {
        ok: false,
        errors: { slug: "This slug is already in use." },
        message: "Please fix the highlighted fields.",
      };
    if (res.error.code === "42501")
      return { ok: false, message: "You are not authorised to do this." };
    return { ok: false, message: FAIL };
  }
  if (!res.data)
    return {
      ok: false,
      message: "Not saved: notification not found or you are not authorised.",
    };
  return { ok: true, id: res.data.id, message: "Saved." };
}

export async function setPublicationStatus(id, status) {
  if (
    !UUID_RE.test(id || "") ||
    !["draft", "published", "archived"].includes(status)
  )
    return { ok: false, message: "Invalid request." };
  const { data: row, error: readError } = await supabase
    .from("exam_notifications")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (readError || !row)
    return { ok: false, message: "Notification not found." };

  if (status === "published") {
    const { errors } = validateExamInput({
      ...row,
      verified_at: timestampToSiteDate(row.verified_at),
      publication_status: "published",
    });
    if (Object.keys(errors).length)
      return {
        ok: false,
        message: `Cannot publish yet: ${Object.values(errors).join(" ")}`,
      };
  }
  const { data, error } = await supabase
    .from("exam_notifications")
    .update({ publication_status: status })
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error || !data)
    return {
      ok: false,
      message:
        error?.code === "42501" ? "You are not authorised to do this." : FAIL,
    };
  return { ok: true, message: "Updated." };
}

export async function deleteExam(id) {
  if (!UUID_RE.test(id || ""))
    return { ok: false, message: "Invalid request." };
  const { data, error } = await supabase
    .from("exam_notifications")
    .delete()
    .eq("id", id)
    .select("id");
  if (error || !data?.length) return { ok: false, message: FAIL };
  return { ok: true, message: "Deleted." };
}
