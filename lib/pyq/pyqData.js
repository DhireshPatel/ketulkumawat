// Public data access for server components. Uses the anon client, so RLS guarantees
// only active exams / published papers can ever be returned.
import { getPublicClient, isSupabaseConfigured } from "./supabasePublic";

const PAPER_COLUMNS =
  "id, exam_id, year, title, session, shift, subject, paper_type, language, description, original_file_name, file_size, display_order, created_at, updated_at";

export async function getActiveExams() {
  if (!isSupabaseConfigured())
    return { configured: false, exams: [], error: null };
  const { data, error } = await getPublicClient()
    .from("pyq_exams")
    .select(
      "id, name, slug, description, thumbnail_path, display_order, pyq_papers(count)",
    )
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) return { configured: true, exams: [], error: error.message };
  const exams = (data || []).map((e) => ({
    id: e.id,
    name: e.name,
    slug: e.slug,
    description: e.description,
    thumbnail_path: e.thumbnail_path,
    paperCount: e.pyq_papers?.[0]?.count ?? 0, // RLS: counts published papers only
  }));
  return { configured: true, exams, error: null };
}

export async function getExamWithPapers(slug) {
  if (!isSupabaseConfigured())
    return { configured: false, exam: null, papers: [], error: null };
  const sb = getPublicClient();
  const { data: exam, error } = await sb
    .from("pyq_exams")
    .select("id, name, slug, description, thumbnail_path")
    .eq("slug", slug)
    .maybeSingle();
  if (error)
    return { configured: true, exam: null, papers: [], error: error.message };
  if (!exam) return { configured: true, exam: null, papers: [], error: null };

  const { data: papers, error: pErr } = await sb
    .from("pyq_papers")
    .select(PAPER_COLUMNS)
    .eq("exam_id", exam.id)
    .order("year", { ascending: false })
    .order("display_order", { ascending: true })
    .order("title", { ascending: true })
    .limit(2000);
  if (pErr) return { configured: true, exam, papers: [], error: pErr.message };
  return { configured: true, exam, papers: papers || [], error: null };
}
