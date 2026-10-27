import { getPublicSupabase } from "./supabase.js";
import { getApplicationStatus } from "./dates.js";
import { PUBLIC_LIST_LIMIT } from "./constants.js";

const LIST_FIELDS =
  "id,title,slug,category,short_description,application_start,application_end,exam_date,application_url,is_featured,published_at,created_at";

const DETAIL_FIELDS =
  "id,title,slug,category,short_description,description,application_start,application_end,exam_date,eligibility,application_fee,application_url,official_notice_url,verified_at,published_at";

// PostgREST filter strings treat , ( ) % * specially: strip them from user search text.
const sanitizeSearch = (s) =>
  String(s || "")
    .replace(/[,()%*\\]/g, " ")
    .trim()
    .slice(0, 80);

/** Public listing. Only published rows (also enforced by RLS). Never throws: returns { data, error }. */
export async function fetchPublishedExams({
  search = "",
  category = "",
  status = "",
} = {}) {
  try {
    const supabase = getPublicSupabase();
    let q = supabase
      .from("exam_notifications")
      .select(LIST_FIELDS)
      .eq("publication_status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(PUBLIC_LIST_LIMIT);

    const s = sanitizeSearch(search);
    if (s) q = q.ilike("title", `%${s}%`);
    if (category) q = q.eq("category", category);

    const { data, error } = await q;
    if (error)
      return {
        data: [],
        error: "Could not load exam notifications right now.",
      };

    let rows = data || [];
    if (status) rows = rows.filter((r) => getApplicationStatus(r) === status);
    return { data: rows, error: null };
  } catch {
    return { data: [], error: "Could not load exam notifications right now." };
  }
}

/** Homepage: featured first, then newest. */
export async function fetchLatestExams(limit = 5) {
  try {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
      .from("exam_notifications")
      .select(LIST_FIELDS)
      .eq("publication_status", "published")
      .order("is_featured", { ascending: false })
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(Math.min(Math.max(limit, 1), 5));
    if (error) return { data: [], error: "unavailable" };
    return { data: data || [], error: null };
  } catch {
    return { data: [], error: "unavailable" };
  }
}

/** Single published exam by slug; null when missing, draft or archived. */
export async function fetchPublishedExamBySlug(slug) {
  if (
    typeof slug !== "string" ||
    !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) ||
    slug.length > 120
  ) {
    return { data: null, error: null };
  }
  try {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
      .from("exam_notifications")
      .select(DETAIL_FIELDS)
      .eq("slug", slug)
      .eq("publication_status", "published")
      .maybeSingle();
    if (error)
      return { data: null, error: "Could not load this notification." };
    return { data: data || null, error: null };
  } catch {
    return { data: null, error: "Could not load this notification." };
  }
}
