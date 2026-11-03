// Shared constants (safe to import on both server and client).

export const PAPERS_BUCKET = "pyq-papers";
export const THUMBS_BUCKET = "pyq-thumbnails";

// Keep in sync with the bucket limit set in supabase/migrations/001_pyq_system.sql
export const MAX_PDF_MB = Number(process.env.NEXT_PUBLIC_PYQ_MAX_FILE_MB || 25);
export const MAX_PDF_BYTES = MAX_PDF_MB * 1024 * 1024;

export const MAX_THUMB_BYTES = 2 * 1024 * 1024;
export const THUMB_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export const PAPER_TYPES = [
  { value: "question_paper", label: "Question Paper" },
  { value: "answer_key", label: "Answer Key" },
  { value: "solution", label: "Solution" },
  { value: "other", label: "Other" },
];

export const PAPER_TYPE_PLURAL = {
  question_paper: "Question Papers",
  answer_key: "Answer Keys",
  solution: "Solutions",
  other: "Other Resources",
};

export const PAPER_STATUSES = ["draft", "published"];

export const typeLabel = (v) =>
  PAPER_TYPES.find((t) => t.value === v)?.label || "Other";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export function formatBytes(n) {
  if (!n && n !== 0) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
