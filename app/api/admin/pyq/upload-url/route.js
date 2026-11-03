import { requireAdmin } from "../../../../../lib/pyq/auth";
import { json, readJson, validationError } from "../../../../../lib/pyq/http";
import { getServiceClient } from "../../../../../lib/pyq/supabaseAdmin";
import {
  createSignedUpload,
  newPaperPath,
  newThumbPath,
} from "../../../../../lib/pyq/storage";
import {
  validatePdfMeta,
  validateThumbMeta,
  validatePaper,
} from "../../../../../lib/pyq/validation";
import { PAPERS_BUCKET, THUMBS_BUCKET } from "../../../../../lib/pyq/config";

export const dynamic = "force-dynamic";

// Step 1 of an upload: the browser asks permission, the server validates the
// declared file and hands back a one-time signed upload URL. The bucket itself
// also enforces PDF-only and the size limit.
export async function POST(request) {
  const g = await requireAdmin(request);
  if (g.response) return g.response;

  const body = await readJson(request);
  if (!body) return json({ error: "Invalid request." }, 400);
  const file = {
    name: body.file_name,
    type: body.type,
    size: Number(body.size),
  };

  try {
    if (body.kind === "thumbnail") {
      const err = validateThumbMeta(file);
      if (err) return validationError({ file: err });
      const path = newThumbPath(file.type);
      const up = await createSignedUpload(THUMBS_BUCKET, path);
      return json({ bucket: THUMBS_BUCKET, path, signedUrl: up.signedUrl });
    }

    if (body.kind === "paper") {
      const err = validatePdfMeta(file);
      const v = validatePaper(
        { exam_id: body.exam_id, year: body.year },
        { partial: true },
      );
      const errors = { ...v.errors };
      if (err) errors.file = err;
      if (Object.keys(errors).length) return validationError(errors);

      const { data: exam, error } = await getServiceClient()
        .from("pyq_exams")
        .select("id, slug")
        .eq("id", v.value.exam_id)
        .maybeSingle();
      if (error) return json({ error: "Database error." }, 500);
      if (!exam)
        return validationError({ exam_id: "Selected exam no longer exists." });

      const path = newPaperPath(exam.slug, v.value.year);
      const up = await createSignedUpload(PAPERS_BUCKET, path);
      return json({ bucket: PAPERS_BUCKET, path, signedUrl: up.signedUrl });
    }

    return json({ error: "Invalid upload kind." }, 400);
  } catch (e) {
    console.error("[pyq] upload-url failed", e.message);
    return json(
      { error: "Could not prepare the upload. Please try again." },
      500,
    );
  }
}
