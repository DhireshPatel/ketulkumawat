// Server-only Storage helpers (service-role). Keeps upload / replace / delete safe
// and makes sure failures never silently leave unreachable files behind.
import { randomUUID } from "crypto";
import { getServiceClient } from "./supabaseAdmin";
import {
  PAPERS_BUCKET,
  THUMBS_BUCKET,
  MAX_PDF_BYTES,
  MAX_THUMB_BYTES,
  THUMB_TYPES,
} from "./config";

// Storage paths are generated here - user-provided file names are never used.
export function newPaperPath(examSlug, year) {
  return `${examSlug}/${year}/${randomUUID()}.pdf`;
}

export function newThumbPath(mime) {
  return `exam-logos/${randomUUID()}.${THUMB_TYPES[mime] || "png"}`;
}

export function isPaperPathFor(path, examSlug, year) {
  const re = new RegExp(
    `^${examSlug.replace(/[^a-z0-9-]/g, "")}/${Number(year)}/[0-9a-f-]{36}\\.pdf$`,
  );
  return re.test(path);
}

export async function createSignedUpload(bucket, path) {
  const { data, error } = await getServiceClient()
    .storage.from(bucket)
    .createSignedUploadUrl(path);
  if (error) throw new Error(`Could not create upload URL: ${error.message}`);
  return data; // { signedUrl, token, path }
}

/** Confirms the object really exists in the bucket and meets size/type limits. */
export async function verifyPdfObject(path) {
  const { data, error } = await getServiceClient()
    .storage.from(PAPERS_BUCKET)
    .info(path);
  if (error || !data)
    return {
      ok: false,
      error: "The uploaded file was not found. Please upload it again.",
    };
  const size = Number(data.size);
  const type = String(data.contentType || "").toLowerCase();
  if (!type.startsWith("application/pdf"))
    return { ok: false, error: "Uploaded file is not a PDF." };
  if (!Number.isFinite(size) || size <= 0 || size > MAX_PDF_BYTES)
    return { ok: false, error: "Uploaded file has an invalid size." };
  return { ok: true, size };
}

export async function verifyThumbObject(path) {
  const { data, error } = await getServiceClient()
    .storage.from(THUMBS_BUCKET)
    .info(path);
  if (error || !data)
    return {
      ok: false,
      error: "The uploaded logo was not found. Please upload it again.",
    };
  const size = Number(data.size);
  if (!THUMB_TYPES[String(data.contentType || "").toLowerCase()])
    return { ok: false, error: "Logo must be PNG, JPG or WebP." };
  if (!Number.isFinite(size) || size <= 0 || size > MAX_THUMB_BYTES)
    return { ok: false, error: "Logo has an invalid size." };
  return { ok: true, size };
}

/**
 * Remove a file. If removal fails, the path is recorded in pyq_orphaned_files so it
 * can be cleaned up later - it is never lost silently. Returns true when removed.
 */
export async function removeOrLog(bucket, path, reason) {
  if (!path) return true;
  const sb = getServiceClient();
  try {
    const { error } = await sb.storage.from(bucket).remove([path]);
    if (!error) return true;
    throw new Error(error.message);
  } catch (e) {
    console.error("[pyq] storage remove failed:", bucket, path, e.message);
    try {
      await sb.from("pyq_orphaned_files").insert({
        bucket,
        path,
        reason: `${reason}: ${e.message}`.slice(0, 500),
      });
    } catch (e2) {
      console.error("[pyq] could not log orphan:", e2.message);
    }
    return false;
  }
}

export async function signedUrlFor(path, { download, filename } = {}) {
  const { data, error } = await getServiceClient()
    .storage.from(PAPERS_BUCKET)
    .createSignedUrl(
      path,
      60,
      download ? { download: filename || true } : undefined,
    );
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

export function thumbnailUrl(path) {
  if (!path || !process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${THUMBS_BUCKET}/${path}`;
}
