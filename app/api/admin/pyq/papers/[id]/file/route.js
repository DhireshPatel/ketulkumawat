import { requireAdmin } from "../../../../../../../lib/pyq/auth";
import { json } from "../../../../../../../lib/pyq/http";
import { getServiceClient } from "../../../../../../../lib/pyq/supabaseAdmin";
import { UUID_RE } from "../../../../../../../lib/pyq/validation";
import { signedUrlFor } from "../../../../../../../lib/pyq/storage";

export const dynamic = "force-dynamic";

// Admin preview - works for drafts too. Returns a 60-second signed URL as JSON
// (a plain link can't carry the Authorization header). Admin only.
export async function GET(request, { params }) {
  const { id } = await params; // Next 15+: params is a Promise (also fine on Next 14)
  const g = await requireAdmin(request);
  if (g.response) return g.response;
  if (!UUID_RE.test(id)) return json({ error: "Not found." }, 404);
  const { data } = await getServiceClient()
    .from("pyq_papers")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();
  if (!data) return json({ error: "Paper not found." }, 404);
  const url = await signedUrlFor(data.storage_path);
  if (!url) return json({ error: "File not available." }, 404);
  return json({ url });
}
