"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  adminFetch,
  openPdfPreview,
  uploadToSignedUrl,
} from "../../../lib/pyq/adminClient";
import { validatePaper, validatePdfMeta } from "../../../lib/pyq/validation";
import { MAX_PDF_MB, PAPER_TYPES, formatBytes } from "../../../lib/pyq/config";

const blank = {
  exam_id: "",
  year: String(new Date().getFullYear()),
  title: "",
  session: "",
  shift: "",
  subject: "",
  paper_type: "question_paper",
  language: "",
  description: "",
  display_order: "0",
  status: "draft",
};

export default function PaperForm({ paperId }) {
  const router = useRouter();
  const editing = Boolean(paperId);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [f, setF] = useState(blank);
  const [current, setCurrent] = useState(null); // existing paper (edit mode)
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  const submitting = useRef(false);

  useEffect(() => {
    (async () => {
      const ex = await adminFetch("/api/admin/pyq/exams");
      if (ex.ok) setExams(ex.data.exams);
      else
        setMsg({ type: "bad", text: ex.data.error || "Could not load exams." });
      if (editing) {
        const { ok, data } = await adminFetch(
          `/api/admin/pyq/papers/${paperId}`,
        );
        if (ok) {
          const p = data.paper;
          setCurrent(p);
          setF({
            exam_id: p.exam_id,
            year: String(p.year),
            title: p.title,
            session: p.session || "",
            shift: p.shift || "",
            subject: p.subject || "",
            paper_type: p.paper_type,
            language: p.language || "",
            description: p.description || "",
            display_order: String(p.display_order),
            status: p.status,
          });
        } else
          setMsg({
            type: "bad",
            text: data.error || "Could not load the paper.",
          });
      }
      setLoading(false);
    })();
  }, [editing, paperId]);

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  function onFile(e) {
    const picked = e.target.files?.[0];
    if (!picked) {
      setFile(null);
      return;
    }
    const err = validatePdfMeta(picked);
    if (err) {
      setErrors((p) => ({ ...p, file: err }));
      setFile(null);
      e.target.value = "";
      return;
    }
    setErrors((p) => ({ ...p, file: undefined }));
    setFile(picked);
  }

  // `statusOverride` is used by the two create buttons (Save as draft / Publish).
  async function submit(statusOverride) {
    if (submitting.current) return; // prevent duplicate submissions
    setMsg(null);

    const values = {
      ...f,
      ...(statusOverride ? { status: statusOverride } : {}),
    };
    const v = validatePaper(values);
    const errs = { ...v.errors };
    if (!editing && !file) errs.file = "Please choose a PDF file.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});

    submitting.current = true;
    setBusy(true);
    setProgress(0);
    try {
      let uploaded = null;
      if (file) {
        setStage("Preparing upload…");
        const up = await adminFetch("/api/admin/pyq/upload-url", {
          method: "POST",
          body: JSON.stringify({
            kind: "paper",
            exam_id: v.value.exam_id,
            year: v.value.year,
            file_name: file.name,
            type: file.type,
            size: file.size,
          }),
        });
        if (!up.ok) {
          setErrors(up.data.errors || {});
          setMsg({
            type: "bad",
            text: up.data.error || "Could not start the upload.",
          });
          return;
        }
        setStage("Uploading PDF…");
        await uploadToSignedUrl(up.data.signedUrl, file, setProgress);
        uploaded = {
          storage_path: up.data.path,
          original_file_name: file.name,
        };
      }

      setStage("Saving…");
      let res;
      if (editing) {
        res = await adminFetch(`/api/admin/pyq/papers/${paperId}`, {
          method: "PATCH",
          body: JSON.stringify({
            ...v.value,
            ...(uploaded ? { new_file: uploaded } : {}),
          }),
        });
      } else {
        res = await adminFetch("/api/admin/pyq/papers", {
          method: "POST",
          body: JSON.stringify({ ...v.value, ...uploaded }),
        });
      }
      if (!res.ok) {
        if (res.data.errors) setErrors(res.data.errors);
        setMsg({
          type: "bad",
          text: res.data.error || "Could not save the paper.",
        });
        return;
      }
      if (editing) {
        setCurrent(res.data.paper);
        setFile(null);
        setMsg({
          type: res.data.warning ? "warn" : "ok",
          text: res.data.warning || "Changes saved.",
        });
        const input = document.getElementById("pdf");
        if (input) input.value = "";
      } else {
        router.push("/admin/pyq/papers");
        router.refresh();
      }
    } catch (err) {
      setMsg({
        type: "bad",
        text: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      submitting.current = false;
      setBusy(false);
      setStage("");
    }
  }

  if (loading) return <p className="muted">Loading…</p>;
  if (editing && !current)
    return (
      <div className="alert bad" role="alert">
        {msg?.text || "Paper not found."}
      </div>
    );

  const field = (k, extra = "") =>
    `${errors[k] ? "field invalid" : "field"} ${extra}`.trim();

  return (
    <>
      <h1 className="admin-title">{editing ? "Edit paper" : "Upload paper"}</h1>
      <p className="admin-desc">
        <Link href="/admin/pyq/papers" className="link-btn">
          ← Back to papers
        </Link>
      </p>
      {msg && (
        <div
          className={`alert ${msg.type}`}
          role={msg.type === "bad" ? "alert" : "status"}
        >
          {msg.text}
        </div>
      )}

      {exams.length === 0 && !editing && (
        <div className="alert warn">
          You need at least one exam first.{" "}
          <Link href="/admin/pyq/exams/new" className="link-btn">
            Create an exam →
          </Link>
        </div>
      )}

      <form
        className="panel"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        noValidate
      >
        <div className="form-grid">
          <div className={field("exam_id")}>
            <label htmlFor="exam_id">Exam *</label>
            <select
              id="exam_id"
              value={f.exam_id}
              onChange={(e) => set("exam_id", e.target.value)}
            >
              <option value="">Select an exam…</option>
              {exams.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                  {e.is_active ? "" : " (inactive)"}
                </option>
              ))}
            </select>
            {errors.exam_id && <span className="err">{errors.exam_id}</span>}
          </div>
          <div className={field("year")}>
            <label htmlFor="year">Year *</label>
            <input
              id="year"
              type="number"
              value={f.year}
              onChange={(e) => set("year", e.target.value)}
              placeholder="e.g. 2026"
            />
            {errors.year && <span className="err">{errors.year}</span>}
          </div>
          <div className={field("title", "full")}>
            <label htmlFor="title">Paper title *</label>
            <input
              id="title"
              value={f.title}
              onChange={(e) => set("title", e.target.value)}
              maxLength={200}
              placeholder="e.g. Question Paper — June Session"
            />
            {errors.title && <span className="err">{errors.title}</span>}
          </div>
          <div className={field("session")}>
            <label htmlFor="session">Session (optional)</label>
            <input
              id="session"
              value={f.session}
              onChange={(e) => set("session", e.target.value)}
              maxLength={100}
              placeholder="January / June / Dec"
            />
            {errors.session && <span className="err">{errors.session}</span>}
          </div>
          <div className={field("shift")}>
            <label htmlFor="shift">Shift (optional)</label>
            <input
              id="shift"
              value={f.shift}
              onChange={(e) => set("shift", e.target.value)}
              maxLength={100}
              placeholder="Shift 1"
            />
            {errors.shift && <span className="err">{errors.shift}</span>}
          </div>
          <div className={field("subject")}>
            <label htmlFor="subject">Subject (optional)</label>
            <input
              id="subject"
              value={f.subject}
              onChange={(e) => set("subject", e.target.value)}
              maxLength={100}
              placeholder="Chemical Sciences"
            />
            {errors.subject && <span className="err">{errors.subject}</span>}
          </div>
          <div className={field("language")}>
            <label htmlFor="language">Language (optional)</label>
            <input
              id="language"
              value={f.language}
              onChange={(e) => set("language", e.target.value)}
              maxLength={100}
              placeholder="English / Hindi"
            />
            {errors.language && <span className="err">{errors.language}</span>}
          </div>
          <div className={field("paper_type")}>
            <label htmlFor="paper_type">Paper type *</label>
            <select
              id="paper_type"
              value={f.paper_type}
              onChange={(e) => set("paper_type", e.target.value)}
            >
              {PAPER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.paper_type && (
              <span className="err">{errors.paper_type}</span>
            )}
          </div>
          <div className={field("display_order")}>
            <label htmlFor="display_order">Display order (optional)</label>
            <input
              id="display_order"
              type="number"
              value={f.display_order}
              onChange={(e) => set("display_order", e.target.value)}
            />
            {errors.display_order && (
              <span className="err">{errors.display_order}</span>
            )}
          </div>
          <div className={field("description", "full")}>
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              value={f.description}
              onChange={(e) => set("description", e.target.value)}
              maxLength={1000}
            />
            {errors.description && (
              <span className="err">{errors.description}</span>
            )}
          </div>

          <div className={field("file", "full")} id="replace">
            <label htmlFor="pdf">
              {editing ? "Replace PDF (optional)" : "PDF file *"}
            </label>
            {editing && current && (
              <span className="hint">
                Current file: {current.original_file_name} (
                {formatBytes(current.file_size)}) ·{" "}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => openPdfPreview(current.id)}
                >
                  Preview
                </button>
                . Leave empty to keep it.
              </span>
            )}
            <input
              id="pdf"
              type="file"
              accept="application/pdf,.pdf"
              onChange={onFile}
              disabled={busy}
            />
            <span className="hint">PDF only, up to {MAX_PDF_MB} MB.</span>
            {file && (
              <div className="file-chip">
                <strong>{file.name}</strong>{" "}
                <span>{formatBytes(file.size)}</span>
              </div>
            )}
            {errors.file && <span className="err">{errors.file}</span>}
            {busy && (
              <>
                <div
                  className="progress"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div style={{ width: `${progress}%` }} />
                </div>
                <span className="hint">
                  {stage} {stage.startsWith("Uploading") ? `${progress}%` : ""}
                </span>
              </>
            )}
          </div>

          {editing && (
            <div className={field("status")}>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={f.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="draft">Draft (hidden)</option>
                <option value="published">Published (public)</option>
              </select>
            </div>
          )}
        </div>

        <div className="form-actions">
          {editing ? (
            <button
              type="submit"
              className="btn btn-brown btn-small"
              disabled={busy}
            >
              {busy ? "Saving…" : "Save changes"}
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-outline btn-small"
                disabled={busy}
                onClick={() => submit("draft")}
              >
                Save as draft
              </button>
              <button
                type="button"
                className="btn btn-brown btn-small"
                disabled={busy}
                onClick={() => submit("published")}
              >
                Publish
              </button>
            </>
          )}
          <Link href="/admin/pyq/papers" className="btn btn-outline btn-small">
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
