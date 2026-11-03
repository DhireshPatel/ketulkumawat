import { requireAdmin } from "../../../../../lib/pyq/auth";
import { json } from "../../../../../lib/pyq/http";
import { getServiceClient } from "../../../../../lib/pyq/supabaseAdmin";
import { PAPERS_BUCKET } from "../../../../../lib/pyq/config";

export const dynamic = "force-dynamic";

// Deletes PDFs that no paper points to (older than 1 hour) and retries any deletions
// that failed earlier. Safe: files referenced by a paper are never touched.
export async function POST(request) {
  const g = await requireAdmin(request);
  if (g.response) return g.response;
  const sb = getServiceClient();

  try {
    const { data: orphans, error } = await sb
      .from("pyq_orphan_objects")
      .select("path")
      .limit(200);
    if (error) throw error;
    const paths = (orphans || []).map((o) => o.path);

    let removed = 0;
    if (paths.length) {
      // Double-check no paper uses these paths right now.
      const { data: used, error: uErr } = await sb
        .from("pyq_papers")
        .select("storage_path")
        .in("storage_path", paths);
      if (uErr) throw uErr;
      const usedSet = new Set((used || []).map((u) => u.storage_path));
      const safe = paths.filter((p) => !usedSet.has(p));
      if (safe.length) {
        const { error: rErr } = await sb.storage
          .from(PAPERS_BUCKET)
          .remove(safe);
        if (rErr) throw rErr;
        removed += safe.length;
      }
    }

    // Retry logged failures
    const { data: logged } = await sb
      .from("pyq_orphaned_files")
      .select("id, bucket, path")
      .is("resolved_at", null)
      .limit(200);
    for (const row of logged || []) {
      if (row.bucket === PAPERS_BUCKET) {
        const { data: stillUsed } = await sb
          .from("pyq_papers")
          .select("id")
          .eq("storage_path", row.path)
          .maybeSingle();
        if (stillUsed) {
          await sb
            .from("pyq_orphaned_files")
            .update({ resolved_at: new Date().toISOString() })
            .eq("id", row.id);
          continue;
        }
      }
      const { error: rErr } = await sb.storage
        .from(row.bucket)
        .remove([row.path]);
      if (!rErr) {
        await sb
          .from("pyq_orphaned_files")
          .update({ resolved_at: new Date().toISOString() })
          .eq("id", row.id);
        removed += 1;
      }
    }
    return json({ removed });
  } catch (e) {
    console.error("[pyq] orphan cleanup failed", e.message);
    return json(
      { error: "Cleanup failed. Did you run the SQL migration?" },
      500,
    );
  }
}
