import { CATEGORIES, PUBLICATION_STATUSES } from "./constants.js";
import { isValidDateString, siteDateToTimestamp } from "./dates.js";

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/g, "");
}

/** Accepts only well-formed https URLs with a real hostname and no embedded credentials. */
export function isSafeHttpsUrl(value) {
  if (typeof value !== "string") return false;
  const v = value.trim();
  if (!v || v.length > 2048 || /\s/.test(v)) return false;
  let u;
  try {
    u = new URL(v);
  } catch {
    return false;
  }
  if (u.protocol !== "https:") return false;
  if (u.username || u.password) return false;
  if (!u.hostname.includes(".")) return false;
  return true;
}

const clean = (v, max) => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  if (!s) return null;
  return s.slice(0, max);
};

/**
 * Validates and normalises form input. Runs on the SERVER (browser validation is only a convenience).
 * Publishing is stricter than saving a draft.
 * Returns { errors: {field: message}, values }.
 */
export function validateExamInput(input) {
  const errors = {};

  const title = clean(input.title, 200);
  if (!title) errors.title = "Exam title is required.";

  let slug = clean(input.slug, 120);
  slug = slug ? slugify(slug) : slugify(title || "");
  if (!slug)
    errors.slug = "A URL slug is required (it is generated from the title).";

  const category = clean(input.category, 80);
  if (!category) errors.category = "Please choose an exam category.";
  else if (!CATEGORIES.includes(category))
    errors.category = "Unknown category.";

  const publication_status = clean(input.publication_status, 20) || "draft";
  if (!PUBLICATION_STATUSES.includes(publication_status)) {
    errors.publication_status = "Invalid publication status.";
  }

  const dateField = (key, label) => {
    const v = clean(input[key], 10);
    if (v && !isValidDateString(v)) {
      errors[key] = `${label} is not a valid date.`;
      return null;
    }
    return v;
  };
  const application_start = dateField(
    "application_start",
    "Application start date",
  );
  const application_end = dateField("application_end", "Application last date");
  const exam_date = dateField("exam_date", "Exam date");
  const verifiedDate = dateField("verified_at", "Last verified date");

  if (
    application_start &&
    application_end &&
    application_start > application_end
  ) {
    errors.application_end = "The last date cannot be before the start date.";
  }

  const application_url = clean(input.application_url, 2048);
  if (application_url && !isSafeHttpsUrl(application_url)) {
    errors.application_url =
      "Enter a valid https:// link (javascript: and other schemes are rejected).";
  }
  const official_notice_url = clean(input.official_notice_url, 2048);
  if (official_notice_url && !isSafeHttpsUrl(official_notice_url)) {
    errors.official_notice_url = "Enter a valid https:// link.";
  }

  if (publication_status === "published") {
    if (!application_url && !errors.application_url) {
      errors.application_url =
        "An official application URL is required before publishing.";
    }
    if (!verifiedDate && !errors.verified_at) {
      errors.verified_at =
        "Set the last verified date before publishing (confirm links and dates against the official notice).";
    }
  }

  const is_featured =
    input.is_featured === true ||
    input.is_featured === "on" ||
    input.is_featured === "true";

  const values = {
    title,
    slug,
    category,
    short_description: clean(input.short_description, 500),
    description: clean(input.description, 20000),
    application_start,
    application_end,
    exam_date,
    eligibility: clean(input.eligibility, 5000),
    application_fee: clean(input.application_fee, 1000),
    application_url,
    official_notice_url,
    publication_status,
    is_featured,
    verified_at: siteDateToTimestamp(verifiedDate),
  };

  return { errors, values };
}
