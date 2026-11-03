"use client";
// Browser helpers for the PYQ admin screens.
import { getBrowserClient } from "./supabaseBrowser";

export const LOGIN_PATH = "/admin/login"; // <- your existing admin login page

/** Current Supabase access token (auto-refreshed by supabase-js), or null if signed out. */
export async function getAccessToken() {
  const { data } = await getBrowserClient().auth.getSession();
  return data?.session?.access_token || null;
}

/** fetch() for the admin API: attaches the Bearer token; sends you to login if signed out. */
export async function adminFetch(url, options = {}) {
  const token = await getAccessToken();
  if (!token) {
    window.location.href = LOGIN_PATH;
    return { ok: false, status: 401, data: { error: "Please sign in." } };
  }
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }
  if (res.status === 401) window.location.href = LOGIN_PATH;
  return { ok: res.ok, status: res.status, data: data || {} };
}

/** Opens a draft/published PDF in a new tab (admin only). Needs a token, so we fetch the URL first. */
export async function openPdfPreview(paperId) {
  const win = window.open("", "_blank"); // open synchronously so popup blockers allow it
  const { ok, data } = await adminFetch(
    `/api/admin/pyq/papers/${paperId}/file`,
  );
  if (ok && data.url) {
    if (win) win.location.href = data.url;
    else window.location.href = data.url;
  } else {
    if (win) win.close();
    alert(data.error || "Could not open the PDF.");
  }
}

/**
 * Uploads a file straight to Supabase Storage using a one-time signed URL,
 * reporting progress (0-100). Resolves when finished, rejects with a message.
 */
export function uploadToSignedUrl(signedUrl, file, onProgress) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("cacheControl", "3600");
    form.append("", file); // same multipart layout the Supabase SDK uses

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signedUrl);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress)
        onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      let msg = "Upload failed.";
      try {
        const j = JSON.parse(xhr.responseText);
        if (j?.message) msg = `Upload failed: ${j.message}`;
      } catch {
        /* ignore */
      }
      reject(new Error(msg));
    };
    xhr.onerror = () =>
      reject(new Error("Network error while uploading. Please try again."));
    xhr.onabort = () => reject(new Error("Upload cancelled."));
    xhr.send(form);
  });
}

export const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
