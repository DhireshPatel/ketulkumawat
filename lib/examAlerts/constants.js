// Shared constants for the Exam Alerts feature.

export const CATEGORIES = [
  "Engineering",
  "Medical",
  "Science & Research",
  "University Entrance",
  "Government & Recruitment",
  "Banking",
  "State-level Entrance",
  "Other",
];

export const PUBLICATION_STATUSES = ["draft", "published", "archived"];

export const APPLICATION_STATUS_LABELS = {
  upcoming: "Upcoming",
  open: "Open",
  closed: "Closed",
  check: "Check Official Notice",
};

// Where unauthenticated visitors are sent when they open an admin page.
// >>> Change to your existing login route. <<<
export const ADMIN_LOGIN_PATH = "/admin/login";

// All dates are interpreted in this timezone (server and client agree).
export const TIMEZONE = "Asia/Kolkata";

export const PUBLIC_LIST_LIMIT = 200;
