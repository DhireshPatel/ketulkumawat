import { requireAdmin } from "../../../../../../lib/pyq/auth";
import {
  dbError,
  json,
  readJson,
  validationError,
} from "../../../../../../lib/pyq/http";
import { getServiceClient } from "../../../../../../lib/pyq/supabaseAdmin";
import {
  UUID_RE,
  safeFileName,
  validatePaper,
} from "../../../../../../lib/pyq/validation";
import {
  isPaperPathFor,
  removeOrLog,
  verifyPdfObject,
} from "../../../../../../lib/pyq/storage";
import { PAPERS_BUCKET } from "../../../../../../lib/pyq/config";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { id } = await params; // Next 15+: params is a Promise (also fine on Next 14)
  const g = await requireAdmin(request);
  if (g.response) return g.response;
  if (!UUID_RE.test(id)) return json({ error: "Not found." }, 404);
  const { data, error } = await getServiceClient()
    .from("pyq_papers")
    .select("*, exam:pyq_exams(id, name, slug)")
    .eq("id", id)
    .maybeSingle();
  if (error) return dbError(error);
  if (!data) return json({ error: "Paper not found." }, 404);
  return json({ paper: data });
}

// Edit metadata (no PDF needed), publish / unpublish (send only {status}),
// and optionally replace the PDF (send `new_file`).
export async function PATCH(request, { params }) {
  const { id } = await params; // Next 15+: params is a Promise (also fine on Next 14)
  const g = await requireAdmin(request);
  if (g.response) return g.response;
  if (!UUID_RE.test(id)) return json({ error: "Not found." }, 404);
  const body = await readJson(request);
  if (!body) return json({ error: "Invalid request." }, 400);

  const { new_file: newFile, ...meta } = body;
  const v = validatePaper(meta, { partial: true });
  if (!v.ok) return validationError(v.errors);

  const sb = getServiceClient();
  const { data: existing, error: gErr } = await sb
    .from("pyq_papers")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (gErr) return dbError(gErr);
  if (!existing) return json({ error: "Paper not found." }, 404);

  const update = { ...v.value };

  if (newFile) {
    const examId = update.exam_id || existing.exam_id;
    const year = update.year || existing.year;
    const { data: exam, error: eErr } = await sb
      .from("pyq_exams")
      .select("id, slug")
      .eq("id", examId)
      .maybeSingle();
    if (eErr) return dbError(eErr);
    if (!exam)
      return validationError({ exam_id: "Selected exam no longer exists." });

    const path = String(newFile.storage_path || "");
    if (
      !isPaperPathFor(path, exam.slug, year) ||
      path === existing.storage_path
    ) {
      return validationError({
        file: "Invalid upload reference. Please upload the PDF again.",
      });
    }
    const chk = await verifyPdfObject(path);
    if (!chk.ok) {
      await removeOrLog(PAPERS_BUCKET, path, "replace verification failed");
      return validationError({ file: chk.error });
    }
    update.storage_path = path;
    update.original_file_name = safeFileName(newFile.original_file_name);
    update.file_size = chk.size;
    update.mime_type = "application/pdf";
  } else if (update.exam_id && update.exam_id !== existing.exam_id) {
    const { data: exam } = await sb
      .from("pyq_exams")
      .select("id")
      .eq("id", update.exam_id)
      .maybeSingle();
    if (!exam)
      return validationError({ exam_id: "Selected exam no longer exists." });
  }

  if (Object.keys(update).length === 0)
    return json({ error: "Nothing to update." }, 400);

  const { data, error } = await sb
    .from("pyq_papers")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    // Update failed: the previous PDF is still referenced and untouched. Discard the new upload.
    if (update.storage_path)
      await removeOrLog(
        PAPERS_BUCKET,
        update.storage_path,
        "paper update failed",
      );
    return dbError(
      error,
      "Could not update the paper. Your existing PDF is unchanged.",
    );
  }

  // Only after the database points at the new file do we delete the old one.
  let warning;
  if (update.storage_path) {
    const removed = await removeOrLog(
      PAPERS_BUCKET,
      existing.storage_path,
      "replaced PDF",
    );
    if (!removed)
      warning =
        "The paper was updated, but the old PDF could not be deleted. It was logged for cleanup.";
  }
  return json({ paper: data, warning });
}

export async function DELETE(request, { params }) {
  const { id } = await params; // Next 15+: params is a Promise (also fine on Next 14)
  const g = await requireAdmin(request);
  if (g.response) return g.response;
  if (!UUID_RE.test(id)) return json({ error: "Not found." }, 404);
  const sb = getServiceClient();

  const { data: paper, error: gErr } = await sb
    .from("pyq_papers")
    .select("id, storage_path")
    .eq("id", id)
    .maybeSingle();
  if (gErr) return dbError(gErr);
  if (!paper) return json({ error: "Paper not found." }, 404);

  // 1) delete the row, 2) only then delete the file.
  const { error } = await sb.from("pyq_papers").delete().eq("id", id);
  if (error) return dbError(error, "Could not delete the paper.");

  const removed = await removeOrLog(
    PAPERS_BUCKET,
    paper.storage_path,
    "paper deleted",
  );
  return json({
    ok: true,
    warning: removed
      ? undefined
      : "Paper deleted, but its file could not be removed. It was logged for cleanup.",
  });
}
