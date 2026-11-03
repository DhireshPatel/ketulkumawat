// Pure validation helpers - used on BOTH the client (instant feedback) and the
// server (the real enforcement). No imports from Next or Supabase here.
import {
  MAX_PDF_BYTES,
  MAX_PDF_MB,
  MAX_THUMB_BYTES,
  PAPER_TYPES,
  PAPER_STATUSES,
  THUMB_TYPES,
} from "./config";

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

// Trim, collapse whitespace/control characters. Returns '' for null/undefined.
export function cleanText(v) {
  if (v === null || v === undefined) return "";
  return String(v)
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanMultiline(v) {
  if (v === null || v === undefined) return "";
  return String(v)
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function toInt(v) {
  if (typeof v === "number") return Number.isInteger(v) ? v : NaN;
  if (typeof v === "string" && /^-?\d+$/.test(v.trim()))
    return parseInt(v.trim(), 10);
  return NaN;
}

function toBool(v) {
  if (typeof v === "boolean") return v;
  if (v === "true" || v === 1 || v === "1") return true;
  if (v === "false" || v === 0 || v === "0") return false;
  return null;
}

const SAFE_PATH_RE = /^[A-Za-z0-9._\-/]+$/;
export function isSafePath(p) {
  return (
    typeof p === "string" &&
    p.length > 0 &&
    p.length <= 300 &&
    SAFE_PATH_RE.test(p) &&
    !p.includes("..") &&
    !p.startsWith("/") &&
    !p.includes("//")
  );
}

/**
 * Validate an exam. `partial: true` only checks the fields that are present.
 * Returns { ok, errors: {field: msg}, value: {cleaned fields} }
 */
export function validateExam(input = {}, { partial = false } = {}) {
  const errors = {};
  const value = {};
  const has = (k) => Object.prototype.hasOwnProperty.call(input, k);

  if (!partial || has("name")) {
    const name = cleanText(input.name);
    if (name.length < 2 || name.length > 100)
      errors.name = "Name must be 2-100 characters.";
    else value.name = name;
  }

  if (!partial || has("slug") || has("name")) {
    const raw = cleanText(input.slug) || slugify(input.name);
    const slug = raw.toLowerCase();
    if (!slug) errors.slug = "Slug is required.";
    else if (!SLUG_RE.test(slug) || slug.length > 80)
      errors.slug =
        "Use lowercase letters, numbers and single hyphens only (max 80).";
    else value.slug = slug;
  }

  if (!partial || has("description")) {
    const d = cleanMultiline(input.description);
    if (d.length > 500)
      errors.description = "Description can be at most 500 characters.";
    else value.description = d || null;
  }

  if (!partial || has("display_order")) {
    const n =
      input.display_order === "" || input.display_order == null
        ? 0
        : toInt(input.display_order);
    if (Number.isNaN(n) || n < -9999 || n > 9999)
      errors.display_order =
        "Display order must be a whole number between -9999 and 9999.";
    else value.display_order = n;
  }

  if (!partial || has("is_active")) {
    const b = input.is_active === undefined ? true : toBool(input.is_active);
    if (b === null) errors.is_active = "Invalid value.";
    else value.is_active = b;
  }

  if (has("thumbnail_path")) {
    if (input.thumbnail_path === null || input.thumbnail_path === "")
      value.thumbnail_path = null;
    else if (!isSafePath(input.thumbnail_path))
      errors.thumbnail_path = "Invalid thumbnail path.";
    else value.thumbnail_path = input.thumbnail_path;
  }

  return { ok: Object.keys(errors).length === 0, errors, value };
}

/** Validate paper metadata (not the file). */
export function validatePaper(input = {}, { partial = false } = {}) {
  const errors = {};
  const value = {};
  const has = (k) => Object.prototype.hasOwnProperty.call(input, k);

  if (!partial || has("exam_id")) {
    if (!UUID_RE.test(String(input.exam_id || "")))
      errors.exam_id = "Please select an exam.";
    else value.exam_id = input.exam_id;
  }

  if (!partial || has("year")) {
    const y = toInt(input.year);
    if (Number.isNaN(y) || y < 1900 || y > 2200)
      errors.year = "Enter a valid year (1900-2200).";
    else value.year = y;
  }

  if (!partial || has("title")) {
    const t = cleanText(input.title);
    if (t.length < 2 || t.length > 200)
      errors.title = "Title must be 2-200 characters.";
    else value.title = t;
  }

  for (const [key, label] of [
    ["session", "Session"],
    ["shift", "Shift"],
    ["subject", "Subject"],
    ["language", "Language"],
  ]) {
    if (!partial || has(key)) {
      const s = cleanText(input[key]);
      if (s.length > 100)
        errors[key] = `${label} can be at most 100 characters.`;
      else value[key] = s || null;
    }
  }

  if (!partial || has("paper_type")) {
    const pt =
      input.paper_type === undefined || input.paper_type === ""
        ? "question_paper"
        : input.paper_type;
    if (!PAPER_TYPES.some((t) => t.value === pt))
      errors.paper_type = "Invalid paper type.";
    else value.paper_type = pt;
  }

  if (!partial || has("description")) {
    const d = cleanMultiline(input.description);
    if (d.length > 1000)
      errors.description = "Description can be at most 1000 characters.";
    else value.description = d || null;
  }

  if (!partial || has("display_order")) {
    const n =
      input.display_order === "" || input.display_order == null
        ? 0
        : toInt(input.display_order);
    if (Number.isNaN(n) || n < -9999 || n > 9999)
      errors.display_order =
        "Display order must be a whole number between -9999 and 9999.";
    else value.display_order = n;
  }

  if (!partial || has("status")) {
    const s = input.status === undefined ? "draft" : input.status;
    if (!PAPER_STATUSES.includes(s))
      errors.status = "Status must be draft or published.";
    else value.status = s;
  }

  return { ok: Object.keys(errors).length === 0, errors, value };
}

/** Validate a PDF's declared name / mime / size. Works with a File object or plain {name,type,size}. */
export function validatePdfMeta({ name, type, size } = {}) {
  const nm = cleanText(name);
  if (!nm) return "Please choose a PDF file.";
  if (type !== "application/pdf" || !/\.pdf$/i.test(nm))
    return "Only PDF files are allowed.";
  if (!Number.isFinite(size) || size <= 0) return "The selected file is empty.";
  if (size > MAX_PDF_BYTES)
    return `File is too large. Maximum size is ${MAX_PDF_MB} MB.`;
  return null;
}

export function validateThumbMeta({ name, type, size } = {}) {
  if (!cleanText(name)) return "Please choose an image.";
  if (!THUMB_TYPES[type]) return "Logo must be a PNG, JPG or WebP image.";
  if (!Number.isFinite(size) || size <= 0) return "The selected file is empty.";
  if (size > MAX_THUMB_BYTES) return "Logo must be 2 MB or smaller.";
  return null;
}

// Safe display name for the original file (never used to build storage paths).
export function safeFileName(name) {
  const base = String(name || "paper.pdf")
    .split(/[\\/]/)
    .pop();
  const cleaned = cleanText(base)
    .replace(/["<>:|?*]/g, "")
    .slice(0, 150);
  return cleaned || "paper.pdf";
}

// Escape % and _ so user text can't act as ILIKE wildcards.
export function escapeLike(s) {
  return cleanText(s)
    .replace(/[\\%_]/g, (m) => `\\${m}`)
    .slice(0, 100);
}
