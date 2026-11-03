import { requireAdmin } from "../../../../../../lib/pyq/auth";
import {
  dbError,
  json,
  readJson,
  validationError,
} from "../../../../../../lib/pyq/http";
import { getServiceClient } from "../../../../../../lib/pyq/supabaseAdmin";
import { UUID_RE, validateExam } from "../../../../../../lib/pyq/validation";
import {
  removeOrLog,
  verifyThumbObject,
} from "../../../../../../lib/pyq/storage";
import { THUMBS_BUCKET } from "../../../../../../lib/pyq/config";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { id } = await params; // Next 15+: params is a Promise (also fine on Next 14)
  const g = await requireAdmin(request);
  if (g.response) return g.response;
  if (!UUID_RE.test(id)) return json({ error: "Not found." }, 404);
  const { data, error } = await getServiceClient()
    .from("pyq_exams")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) return dbError(error);
  if (!data) return json({ error: "Exam not found." }, 404);
  return json({ exam: data });
}

export async function PATCH(request, { params }) {
  const { id } = await params; // Next 15+: params is a Promise (also fine on Next 14)
  const g = await requireAdmin(request);
  if (g.response) return g.response;
  if (!UUID_RE.test(id)) return json({ error: "Not found." }, 404);
  const body = await readJson(request);
  if (!body) return json({ error: "Invalid request." }, 400);

  const v = validateExam(body, { partial: true });
  if (!v.ok) return validationError(v.errors);
  if (Object.keys(v.value).length === 0)
    return json({ error: "Nothing to update." }, 400);

  const sb = getServiceClient();
  const { data: existing, error: gErr } = await sb
    .from("pyq_exams")
    .select("id, thumbnail_path")
    .eq("id", id)
    .maybeSingle();
  if (gErr) return dbError(gErr);
  if (!existing) return json({ error: "Exam not found." }, 404);

  const thumbChanged =
    "thumbnail_path" in v.value &&
    v.value.thumbnail_path !== existing.thumbnail_path;
  if (thumbChanged && v.value.thumbnail_path) {
    const chk = await verifyThumbObject(v.value.thumbnail_path);
    if (!chk.ok) return validationError({ thumbnail_path: chk.error });
  }

  const { data, error } = await sb
    .from("pyq_exams")
    .update(v.value)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    if (thumbChanged && v.value.thumbnail_path)
      await removeOrLog(
        THUMBS_BUCKET,
        v.value.thumbnail_path,
        "exam update failed",
      );
    if (error.code === "23505")
      return validationError({
        slug: "This slug is already used by another exam.",
      });
    return dbError(error, "Could not update the exam.");
  }
  // DB updated successfully -> now safe to delete the old logo.
  if (thumbChanged && existing.thumbnail_path)
    await removeOrLog(THUMBS_BUCKET, existing.thumbnail_path, "old logo");
  return json({ exam: data });
}

export async function DELETE(request, { params }) {
  const { id } = await params; // Next 15+: params is a Promise (also fine on Next 14)
  const g = await requireAdmin(request);
  if (g.response) return g.response;
  if (!UUID_RE.test(id)) return json({ error: "Not found." }, 404);
  const sb = getServiceClient();

  const { data: exam, error: gErr } = await sb
    .from("pyq_exams")
    .select("id, name, thumbnail_path")
    .eq("id", id)
    .maybeSingle();
  if (gErr) return dbError(gErr);
  if (!exam) return json({ error: "Exam not found." }, 404);

  // Safeguard: never delete an exam that still has papers.
  const { count, error: cErr } = await sb
    .from("pyq_papers")
    .select("id", { count: "exact", head: true })
    .eq("exam_id", id);
  if (cErr) return dbError(cErr);
  if (count > 0) {
    return json(
      {
        error: `"${exam.name}" still has ${count} paper(s). Delete or move them first, or deactivate the exam instead.`,
        code: "has_papers",
      },
      409,
    );
  }

  const { error } = await sb.from("pyq_exams").delete().eq("id", id);
  if (error) {
    if (error.code === "23503")
      return json(
        {
          error: "This exam still has papers and cannot be deleted.",
          code: "has_papers",
        },
        409,
      );
    return dbError(error, "Could not delete the exam.");
  }
  if (exam.thumbnail_path)
    await removeOrLog(THUMBS_BUCKET, exam.thumbnail_path, "exam deleted");
  return json({ ok: true });
}
