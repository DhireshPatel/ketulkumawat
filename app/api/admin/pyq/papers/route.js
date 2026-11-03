import { requireAdmin } from "../../../../../lib/pyq/auth";
import {
  dbError,
  json,
  readJson,
  validationError,
} from "../../../../../lib/pyq/http";
import { getServiceClient } from "../../../../../lib/pyq/supabaseAdmin";
import {
  UUID_RE,
  escapeLike,
  safeFileName,
  validatePaper,
} from "../../../../../lib/pyq/validation";
import {
  isPaperPathFor,
  removeOrLog,
  verifyPdfObject,
} from "../../../../../lib/pyq/storage";
import { PAPERS_BUCKET, PAPER_STATUSES } from "../../../../../lib/pyq/config";

export const dynamic = "force-dynamic";

// List with search / filters / pagination (queried in one round trip, no N+1).
export async function GET(request) {
  const g = await requireAdmin(request);
  if (g.response) return g.response;
  const sp = new URL(request.url).searchParams;

  const page = Math.max(1, parseInt(sp.get("page") || "1", 10) || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(sp.get("pageSize") || "10", 10) || 10),
  );
  const q = escapeLike(sp.get("q") || "");
  const exam = sp.get("exam") || "";
  const year = sp.get("year") || "";
  const status = sp.get("status") || "";

  let query = getServiceClient()
    .from("pyq_papers")
    .select("*, exam:pyq_exams(id, name, slug)", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (q) query = query.ilike("title", `%${q}%`);
  if (exam) {
    if (!UUID_RE.test(exam))
      return json({ error: "Invalid exam filter." }, 400);
    query = query.eq("exam_id", exam);
  }
  if (year) {
    if (!/^\d{4}$/.test(year))
      return json({ error: "Invalid year filter." }, 400);
    query = query.eq("year", parseInt(year, 10));
  }
  if (status) {
    if (!PAPER_STATUSES.includes(status))
      return json({ error: "Invalid status filter." }, 400);
    query = query.eq("status", status);
  }

  const { data, count, error } = await query;
  if (error) return dbError(error, "Could not load papers.");
  return json({ papers: data || [], total: count ?? 0, page, pageSize });
}

// Step 2 of an upload: the PDF is already in Storage; save the record.
export async function POST(request) {
  const g = await requireAdmin(request);
  if (g.response) return g.response;
  const body = await readJson(request);
  if (!body) return json({ error: "Invalid request." }, 400);

  const v = validatePaper(body);
  if (!v.ok) return validationError(v.errors);
  const storagePath = String(body.storage_path || "");

  const sb = getServiceClient();
  const { data: exam, error: eErr } = await sb
    .from("pyq_exams")
    .select("id, slug")
    .eq("id", v.value.exam_id)
    .maybeSingle();
  if (eErr) return dbError(eErr);
  if (!exam)
    return validationError({ exam_id: "Selected exam no longer exists." });

  if (!isPaperPathFor(storagePath, exam.slug, v.value.year)) {
    return validationError({
      file: "Invalid upload reference. Please upload the PDF again.",
    });
  }
  const chk = await verifyPdfObject(storagePath);
  if (!chk.ok) {
    await removeOrLog(PAPERS_BUCKET, storagePath, "verification failed");
    return validationError({ file: chk.error });
  }

  const row = {
    ...v.value,
    storage_path: storagePath,
    original_file_name: safeFileName(body.original_file_name),
    file_size: chk.size,
    mime_type: "application/pdf",
  };
  const { data, error } = await sb
    .from("pyq_papers")
    .insert(row)
    .select("*")
    .single();
  if (error) {
    // Do not leave an orphaned PDF behind if the database insert failed.
    await removeOrLog(PAPERS_BUCKET, storagePath, "paper insert failed");
    return dbError(
      error,
      "Could not save the paper. The uploaded file was removed.",
    );
  }
  return json({ paper: data }, 201);
}
