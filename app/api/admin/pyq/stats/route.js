import { requireAdmin } from "../../../../../lib/pyq/auth";
import { json } from "../../../../../lib/pyq/http";
import { getServiceClient } from "../../../../../lib/pyq/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const g = await requireAdmin(request);
  if (g.response) return g.response;
  const sb = getServiceClient();

  const count = (q) =>
    q.then(({ count: c, error }) => {
      if (error) throw error;
      return c ?? 0;
    });
  try {
    const [exams, papers, published, draft, recent] = await Promise.all([
      count(sb.from("pyq_exams").select("id", { count: "exact", head: true })),
      count(sb.from("pyq_papers").select("id", { count: "exact", head: true })),
      count(
        sb
          .from("pyq_papers")
          .select("id", { count: "exact", head: true })
          .eq("status", "published"),
      ),
      count(
        sb
          .from("pyq_papers")
          .select("id", { count: "exact", head: true })
          .eq("status", "draft"),
      ),
      sb
        .from("pyq_papers")
        .select("id, title, year, status, created_at, exam:pyq_exams(name)")
        .order("created_at", { ascending: false })
        .limit(6)
        .then(({ data, error }) => {
          if (error) throw error;
          return data || [];
        }),
    ]);
    return json({ exams, papers, published, draft, recent });
  } catch (e) {
    console.error("[pyq] stats failed", e.message);
    return json({ error: "Could not load statistics." }, 500);
  }
}
