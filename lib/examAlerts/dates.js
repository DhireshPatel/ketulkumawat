import { TIMEZONE } from "./constants.js";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Returns true for a real calendar date in YYYY-MM-DD form. */
export function isValidDateString(value) {
  if (typeof value !== "string" || !DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

/** Today's date (YYYY-MM-DD) in the site timezone. */
export function todayInSiteTimezone(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** "2026-03-05" -> "5 Mar 2026". Pure string work: no timezone, no hydration mismatch. */
export function formatDate(value) {
  if (!isValidDateString(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Timestamp (ISO string) -> YYYY-MM-DD in the site timezone, or null. */
export function timestampToSiteDate(ts) {
  if (!ts) return null;
  const dt = new Date(ts);
  if (Number.isNaN(dt.getTime())) return null;
  return todayInSiteTimezone(dt);
}

/** YYYY-MM-DD -> timestamptz string at start of that day in IST. */
export function siteDateToTimestamp(value) {
  return isValidDateString(value) ? `${value}T00:00:00+05:30` : null;
}

/**
 * Derives application status from verified dates only.
 *  - upcoming: start date is in the future
 *  - closed:   deadline has passed
 *  - open:     start <= today <= deadline (both dates known)
 *  - check:    anything we cannot decide reliably (e.g. only one date known)
 * Publication status is a separate concept and is never changed by this.
 */
export function getApplicationStatus(exam, today = todayInSiteTimezone()) {
  const start = isValidDateString(exam?.application_start)
    ? exam.application_start
    : null;
  const end = isValidDateString(exam?.application_end)
    ? exam.application_end
    : null;

  if (start && end && start > end) return "check";
  if (end && end < today) return "closed";
  if (start && start > today) return "upcoming";
  if (start && end && start <= today && today <= end) return "open";
  return "check";
}
