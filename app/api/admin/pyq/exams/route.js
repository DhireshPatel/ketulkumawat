import { requireAdmin } from "../../../../../lib/pyq/auth";
import {
  dbError,
  json,
  readJson,
  validationError,
} from "../../../../../lib/pyq/http";
import { getServiceClient } from "../../../../../lib/pyq/supabaseAdmin";
import { validateExam } from "../../../../../lib/pyq/validation";
import { removeOrLog, verifyThumbObject } from "../../../../../lib/pyq/storage";
import { THUMBS_BUCKET } from "../../../../../lib/pyq/config";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const g = await requireAdmin(request);
  if (g.response) return g.response;
  const { data, error } = await getServiceClient()
    .from("pyq_exams")
    .select("*, pyq_papers(count)")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) return dbError(error, "Could not load exams.");
  const exams = (data || []).map(({ pyq_papers, ...e }) => ({
    ...e,
    paper_count: pyq_papers?.[0]?.count ?? 0,
  }));
  return json({ exams });
}

export async function POST(request) {
  const g = await requireAdmin(request);
  if (g.response) return g.response;
  const body = await readJson(request);
  if (!body) return json({ error: "Invalid request." }, 400);

  const v = validateExam(body);
  if (!v.ok) return validationError(v.errors);

  if (v.value.thumbnail_path) {
    const chk = await verifyThumbObject(v.value.thumbnail_path);
    if (!chk.ok) return validationError({ thumbnail_path: chk.error });
  }

  const sb = getServiceClient();
  const { data, error } = await sb
    .from("pyq_exams")
    .insert(v.value)
    .select()
    .single();
  if (error) {
    if (v.value.thumbnail_path)
      await removeOrLog(
        THUMBS_BUCKET,
        v.value.thumbnail_path,
        "exam insert failed",
      );
    if (error.code === "23505")
      return validationError({
        slug: "This slug is already used by another exam.",
      });
    return dbError(error, "Could not create the exam.");
  }
  return json({ exam: data }, 201);
}
