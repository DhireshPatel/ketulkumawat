import { NextResponse } from "next/server";
import {
  getPublicClient,
  isSupabaseConfigured,
} from "../../../../../../lib/pyq/supabasePublic";
import { signedUrlFor } from "../../../../../../lib/pyq/storage";
import { UUID_RE, safeFileName } from "../../../../../../lib/pyq/validation";

export const dynamic = "force-dynamic";

const text = (msg, status) =>
  new NextResponse(msg, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

// Public PDF access: /api/pyq/papers/<id>/file            -> view in browser
//                    /api/pyq/papers/<id>/file?download=1 -> download
// The paper is first looked up with the ANON client, so Row Level Security only
// returns it if it is published AND its exam is active. Only then is a 60-second
// signed URL created. Drafts / inactive exams get a 404 and no URL.
export async function GET(request, { params }) {
  const { id } = await params; // Next 15+: params is a Promise (also fine on Next 14)
  if (!UUID_RE.test(id)) return text("Not found", 404);
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY)
    return text("Service unavailable", 503);

  const { data: paper, error } = await getPublicClient()
    .from("pyq_papers")
    .select("id, status, storage_path, original_file_name")
    .eq("id", id)
    .maybeSingle();

  if (error) return text("Service unavailable", 503);
  if (!paper || paper.status !== "published") return text("Not found", 404);

  const download = new URL(request.url).searchParams.get("download") === "1";
  const url = await signedUrlFor(paper.storage_path, {
    download,
    filename: safeFileName(paper.original_file_name),
  });
  if (!url) return text("Not found", 404);

  const res = NextResponse.redirect(url, 302);
  res.headers.set("Cache-Control", "no-store");
  return res;
}
