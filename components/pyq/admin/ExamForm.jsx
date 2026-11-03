"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminFetch, uploadToSignedUrl } from "../../../lib/pyq/adminClient";
import {
  slugify,
  validateExam,
  validateThumbMeta,
} from "../../../lib/pyq/validation";
import { THUMBS_BUCKET } from "../../../lib/pyq/config";

const logoUrl = (p) =>
  p && process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${THUMBS_BUCKET}/${p}`
    : null;

export default function ExamForm({ examId }) {
  const router = useRouter();
  const editing = Boolean(examId);
  const [loading, setLoading] = useState(editing);
  const [f, setF] = useState({
    name: "",
    slug: "",
    description: "",
    display_order: "0",
    is_active: true,
  });
  const [slugTouched, setSlugTouched] = useState(false);
  const [thumbPath, setThumbPath] = useState(null); // current saved path
  const [newThumb, setNewThumb] = useState(null); // File chosen
  const [removeThumb, setRemoveThumb] = useState(false);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const submitting = useRef(false);
  const previewUrl = useMemo(
    () => (newThumb ? URL.createObjectURL(newThumb) : null),
    [newThumb],
  );
  useEffect(
    () => () => previewUrl && URL.revokeObjectURL(previewUrl),
    [previewUrl],
  );

  useEffect(() => {
    if (!editing) return;
    (async () => {
      const { ok, data } = await adminFetch(`/api/admin/pyq/exams/${examId}`);
      if (ok) {
        const e = data.exam;
        setF({
          name: e.name,
          slug: e.slug,
          description: e.description || "",
          display_order: String(e.display_order),
          is_active: e.is_active,
        });
        setThumbPath(e.thumbnail_path);
        setSlugTouched(true);
      } else
        setMsg({ type: "bad", text: data.error || "Could not load the exam." });
      setLoading(false);
    })();
  }, [editing, examId]);

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  function onName(v) {
    setF((p) => ({ ...p, name: v, slug: slugTouched ? p.slug : slugify(v) }));
  }

  function onThumb(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateThumbMeta(file);
    if (err) {
      setErrors((p) => ({ ...p, thumbnail: err }));
      e.target.value = "";
      return;
    }
    setErrors((p) => ({ ...p, thumbnail: undefined }));
    setNewThumb(file);
    setRemoveThumb(false);
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting.current) return; // block double submit
    setMsg(null);

    const v = validateExam({ ...f });
    if (!v.ok) {
      setErrors(v.errors);
      return;
    }
    setErrors({});

    submitting.current = true;
    setBusy(true);
    try {
      const payload = { ...v.value };

      if (newThumb) {
        const up = await adminFetch("/api/admin/pyq/upload-url", {
          method: "POST",
          body: JSON.stringify({
            kind: "thumbnail",
            file_name: newThumb.name,
            type: newThumb.type,
            size: newThumb.size,
          }),
        });
        if (!up.ok) {
          setErrors({ thumbnail: up.data.errors?.file || up.data.error });
          return;
        }
        await uploadToSignedUrl(up.data.signedUrl, newThumb, setProgress);
        payload.thumbnail_path = up.data.path;
      } else if (removeThumb) {
        payload.thumbnail_path = null;
      }

      const { ok, data } = await adminFetch(
        editing ? `/api/admin/pyq/exams/${examId}` : "/api/admin/pyq/exams",
        {
          method: editing ? "PATCH" : "POST",
          body: JSON.stringify(payload),
        },
      );
      if (!ok) {
        if (data.errors) setErrors(data.errors);
        setMsg({ type: "bad", text: data.error || "Could not save the exam." });
        return;
      }
      router.push("/admin/pyq/exams");
      router.refresh();
    } catch (err) {
      setMsg({ type: "bad", text: err.message || "Something went wrong." });
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  if (loading) return <p className="muted">Loading…</p>;

  const field = (k) => (errors[k] ? "field invalid" : "field");
  const currentLogo = removeThumb ? null : previewUrl || logoUrl(thumbPath);

  return (
    <>
      <h1 className="admin-title">{editing ? "Edit exam" : "New exam"}</h1>
      <p className="admin-desc">
        <Link href="/admin/pyq/exams" className="link-btn">
          ← Back to exams
        </Link>
      </p>
      {msg && (
        <div className={`alert ${msg.type}`} role="alert">
          {msg.text}
        </div>
      )}

      <form className="panel" onSubmit={onSubmit} noValidate>
        <div className="form-grid">
          <div className={field("name")}>
            <label htmlFor="name">Exam name *</label>
            <input
              id="name"
              value={f.name}
              onChange={(e) => onName(e.target.value)}
              maxLength={100}
              placeholder="e.g. CSIR NET"
            />
            {errors.name && <span className="err">{errors.name}</span>}
          </div>
          <div className={field("slug")}>
            <label htmlFor="slug">URL slug *</label>
            <input
              id="slug"
              value={f.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value.toLowerCase());
              }}
              maxLength={80}
            />
            <span className="hint">
              Public page: /pyq/{f.slug || "your-slug"}
            </span>
            {errors.slug && <span className="err">{errors.slug}</span>}
          </div>
          <div className={`${field("description")} full`}>
            <label htmlFor="description">Short description</label>
            <textarea
              id="description"
              value={f.description}
              onChange={(e) => set("description", e.target.value)}
              maxLength={500}
            />
            {errors.description && (
              <span className="err">{errors.description}</span>
            )}
          </div>
          <div className={field("display_order")}>
            <label htmlFor="display_order">Display order</label>
            <input
              id="display_order"
              type="number"
              value={f.display_order}
              onChange={(e) => set("display_order", e.target.value)}
            />
            <span className="hint">Lower numbers appear first.</span>
            {errors.display_order && (
              <span className="err">{errors.display_order}</span>
            )}
          </div>
          <div className="field">
            <label htmlFor="is_active">Visibility</label>
            <div className="check-row">
              <input
                id="is_active"
                type="checkbox"
                checked={f.is_active}
                onChange={(e) => set("is_active", e.target.checked)}
              />
              <label htmlFor="is_active" style={{ fontWeight: 400 }}>
                Active (show on the public PYQ page)
              </label>
            </div>
          </div>
          <div className={`${field("thumbnail")} full`}>
            <label htmlFor="thumb">Logo / thumbnail (optional)</label>
            {currentLogo && (
              <div className="check-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentLogo}
                  alt="Exam logo preview"
                  className="logo-preview"
                />
                <button
                  type="button"
                  className="link-btn danger"
                  onClick={() => {
                    setNewThumb(null);
                    setRemoveThumb(true);
                  }}
                >
                  Remove logo
                </button>
              </div>
            )}
            <input
              id="thumb"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onThumb}
            />
            <span className="hint">PNG, JPG or WebP, up to 2 MB.</span>
            {errors.thumbnail && (
              <span className="err">{errors.thumbnail}</span>
            )}
            {busy && newThumb && (
              <div className="progress" aria-label="Upload progress">
                <div style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-brown btn-small"
            disabled={busy}
          >
            {busy ? "Saving…" : editing ? "Save changes" : "Create exam"}
          </button>
          <Link href="/admin/pyq/exams" className="btn btn-outline btn-small">
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
