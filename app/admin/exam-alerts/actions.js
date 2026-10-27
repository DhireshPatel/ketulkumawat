"use server";

import { revalidatePath } from "next/cache";
import { getAdminContext } from "../../../lib/examAlerts/auth";
import { validateExamInput } from "../../../lib/examAlerts/validation";
import { timestampToSiteDate } from "../../../lib/examAlerts/dates";
import { PUBLICATION_STATUSES } from "../../../lib/examAlerts/constants";

// Every action below re-checks the session AND admin status on the server.
// Hiding buttons in the UI is never the only protection (RLS enforces it again in the database).

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UNAUTHORIZED = {
  ok: false,
  message: "You are not authorised to do this. Please sign in as an admin.",
};
const GENERIC_FAIL = "Something went wrong while saving. Please try again.";

function refresh() {
  revalidatePath("/");
  revalidatePath("/exam-alerts");
  revalidatePath("/exam-alerts/[slug]", "page");
  revalidatePath("/admin/exam-alerts");
}

async function slugTaken(supabase, slug, exceptId) {
  let q = supabase
    .from("exam_notifications")
    .select("id")
    .eq("slug", slug)
    .limit(1);
  if (exceptId) q = q.neq("id", exceptId);
  const { data, error } = await q;
  if (error) return null; // unknown
  return data.length > 0;
}

/** Create (id = null) or update an exam notification. `input` is a plain object from the form. */
export async function saveExam(id, input) {
  const ctx = await getAdminContext();
  if (!ctx) return UNAUTHORIZED;
  const { supabase, user } = ctx;

  if (id && !UUID_RE.test(id))
    return { ok: false, message: "Invalid notification id." };

  const { errors, values } = validateExamInput(input || {});
  if (Object.keys(errors).length) {
    return { ok: false, errors, message: "Please fix the highlighted fields." };
  }

  const taken = await slugTaken(supabase, values.slug, id);
  if (taken === null) return { ok: false, message: GENERIC_FAIL };
  if (taken) {
    return {
      ok: false,
      errors: {
        slug: "This slug is already used by another notification. Please choose a different one.",
      },
      message: "Please fix the highlighted fields.",
    };
  }

  let result;
  if (id) {
    // created_by is deliberately never sent on update (and a DB trigger also protects it).
    result = await supabase
      .from("exam_notifications")
      .update(values)
      .eq("id", id)
      .select("id")
      .maybeSingle();
  } else {
    result = await supabase
      .from("exam_notifications")
      .insert({ ...values, created_by: user.id })
      .select("id")
      .maybeSingle();
  }

  if (result.error) {
    if (result.error.code === "23505") {
      return {
        ok: false,
        errors: { slug: "This slug is already in use." },
        message: "Please fix the highlighted fields.",
      };
    }
    return { ok: false, message: GENERIC_FAIL };
  }
  if (!result.data)
    return {
      ok: false,
      message: "Notification not found or you lack permission.",
    };

  refresh();
  return { ok: true, id: result.data.id, message: "Saved." };
}

/** Publish / unpublish (back to draft) / archive. Publishing re-runs the full publish validation. */
export async function setPublicationStatus(id, status) {
  const ctx = await getAdminContext();
  if (!ctx) return UNAUTHORIZED;
  const { supabase } = ctx;

  if (!UUID_RE.test(id || "") || !PUBLICATION_STATUSES.includes(status)) {
    return { ok: false, message: "Invalid request." };
  }

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
    if (Object.keys(errors).length) {
      return {
        ok: false,
        message: `Cannot publish yet: ${Object.values(errors).join(" ")}`,
      };
    }
  }

  const { error } = await supabase
    .from("exam_notifications")
    .update({ publication_status: status })
    .eq("id", id);
  if (error) return { ok: false, message: GENERIC_FAIL };

  refresh();
  return {
    ok: true,
    message:
      status === "published"
        ? "Published."
        : status === "archived"
          ? "Archived."
          : "Moved to drafts.",
  };
}

export async function deleteExam(id) {
  const ctx = await getAdminContext();
  if (!ctx) return UNAUTHORIZED;
  if (!UUID_RE.test(id || ""))
    return { ok: false, message: "Invalid request." };

  const { error } = await ctx.supabase
    .from("exam_notifications")
    .delete()
    .eq("id", id);
  if (error) return { ok: false, message: GENERIC_FAIL };

  refresh();
  return { ok: true, message: "Deleted." };
}
