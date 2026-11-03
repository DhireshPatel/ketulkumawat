"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  adminFetch,
  fmtDate,
  openPdfPreview,
} from "../../../lib/pyq/adminClient";
import { formatBytes, typeLabel } from "../../../lib/pyq/config";
import ConfirmDialog from "./ConfirmDialog";

const PAGE_SIZE = 10;

export default function PapersManager() {
  const [exams, setExams] = useState([]);
  const [filters, setFilters] = useState({
    q: "",
    exam: "",
    year: "",
    status: "",
  });
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null); // {papers,total}
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [details, setDetails] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    adminFetch("/api/admin/pyq/exams").then(
      ({ ok, data }) => ok && setExams(data.exams),
    );
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(filters.q);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [filters.q]);

  const load = useCallback(async () => {
    setLoading(true);
    const sp = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
    });
    if (debouncedQ) sp.set("q", debouncedQ);
    if (filters.exam) sp.set("exam", filters.exam);
    if (/^\d{4}$/.test(filters.year)) sp.set("year", filters.year);
    if (filters.status) sp.set("status", filters.status);
    const { ok, data } = await adminFetch(`/api/admin/pyq/papers?${sp}`);
    if (ok) setResult(data);
    else setMsg({ type: "bad", text: data.error || "Could not load papers." });
    setLoading(false);
  }, [page, debouncedQ, filters.exam, filters.year, filters.status]);

  useEffect(() => {
    load();
  }, [load]);

  const setFilter = (k, v) => {
    setFilters((p) => ({ ...p, [k]: v }));
    if (k !== "q") setPage(1);
  };

  async function toggleStatus(p) {
    setMsg(null);
    const next = p.status === "published" ? "draft" : "published";
    const { ok, data } = await adminFetch(`/api/admin/pyq/papers/${p.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
    });
    if (ok) {
      setMsg({
        type: "ok",
        text:
          next === "published"
            ? `“${p.title}” is now published.`
            : `“${p.title}” was unpublished and is no longer public.`,
      });
      load();
    } else
      setMsg({
        type: "bad",
        text: data.error || "Could not change the status.",
      });
  }

  async function confirmDelete() {
    setBusy(true);
    const { ok, data } = await adminFetch(
      `/api/admin/pyq/papers/${toDelete.id}`,
      { method: "DELETE" },
    );
    setBusy(false);
    if (ok)
      setMsg({
        type: data.warning ? "warn" : "ok",
        text: data.warning || `“${toDelete.title}” deleted.`,
      });
    else
      setMsg({
        type: "bad",
        text: data.error || "Could not delete the paper.",
      });
    setToDelete(null);
    if (ok) {
      // if we deleted the last item on this page, go back one page
      if (result?.papers.length === 1 && page > 1) setPage(page - 1);
      else load();
    }
  }

  const totalPages = result
    ? Math.max(1, Math.ceil(result.total / PAGE_SIZE))
    : 1;

  return (
    <>
      <div className="admin-head-row">
        <div>
          <h1 className="admin-title">Question Papers</h1>
          <p className="admin-desc">Upload, edit, publish and delete papers.</p>
        </div>
        <Link href="/admin/pyq/papers/new" className="btn btn-brown btn-small">
          + Upload paper
        </Link>
      </div>

      {msg && (
        <div
          className={`alert ${msg.type}`}
          role={msg.type === "bad" ? "alert" : "status"}
        >
          {msg.text}
        </div>
      )}

      <section className="panel">
        <div className="filters">
          <div>
            <label htmlFor="f-q" className="sr-only">
              Search by title
            </label>
            <input
              id="f-q"
              type="search"
              placeholder="Search by title…"
              value={filters.q}
              onChange={(e) => setFilter("q", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="f-exam" className="sr-only">
              Filter by exam
            </label>
            <select
              id="f-exam"
              value={filters.exam}
              onChange={(e) => setFilter("exam", e.target.value)}
            >
              <option value="">All exams</option>
              {exams.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-year" className="sr-only">
              Filter by year
            </label>
            <input
              id="f-year"
              type="number"
              placeholder="Year"
              value={filters.year}
              onChange={(e) => setFilter("year", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="f-status" className="sr-only">
              Filter by status
            </label>
            <select
              id="f-status"
              value={filters.status}
              onChange={(e) => setFilter("status", e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-xs"
            onClick={() => {
              setFilters({ q: "", exam: "", year: "", status: "" });
              setPage(1);
            }}
          >
            Reset
          </button>
        </div>

        {loading && !result ? (
          <p className="muted">Loading…</p>
        ) : result?.papers.length === 0 ? (
          <p className="muted">No papers found.</p>
        ) : (
          <div className="table-wrap" style={{ opacity: loading ? 0.6 : 1 }}>
            <table className="data">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Exam</th>
                  <th>Year</th>
                  <th>Session / Shift</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {result?.papers.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Title">
                      <strong>{p.title}</strong>
                    </td>
                    <td data-label="Exam">{p.exam?.name}</td>
                    <td data-label="Year">{p.year}</td>
                    <td data-label="Session / Shift">
                      {[p.session, p.shift].filter(Boolean).join(" / ") || "—"}
                    </td>
                    <td data-label="Type">{typeLabel(p.paper_type)}</td>
                    <td data-label="Status">
                      <span className={`badge ${p.status}`}>{p.status}</span>
                    </td>
                    <td data-label="Updated">{fmtDate(p.updated_at)}</td>
                    <td>
                      <div className="cell-actions">
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => setDetails(p)}
                        >
                          Details
                        </button>
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => openPdfPreview(p.id)}
                        >
                          Preview PDF
                        </button>
                        <Link
                          className="link-btn"
                          href={`/admin/pyq/papers/${p.id}/edit`}
                        >
                          Edit
                        </Link>
                        <Link
                          className="link-btn"
                          href={`/admin/pyq/papers/${p.id}/edit#replace`}
                        >
                          Replace PDF
                        </Link>
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => toggleStatus(p)}
                        >
                          {p.status === "published" ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          type="button"
                          className="link-btn danger"
                          onClick={() => setToDelete(p)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {result && result.total > 0 && (
          <div className="pager">
            <span>
              {result.total} paper(s) · page {page} of {totalPages}
            </span>
            <span className="cell-actions">
              <button
                type="button"
                className="btn btn-outline btn-xs"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                ← Previous
              </button>
              <button
                type="button"
                className="btn btn-outline btn-xs"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>
            </span>
          </div>
        )}
      </section>

      {details && (
        <div
          className="modal-back"
          role="presentation"
          onMouseDown={(e) => e.target === e.currentTarget && setDetails(null)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="det-title"
          >
            <h2 id="det-title">{details.title}</h2>
            <dl>
              <dt>Exam</dt>
              <dd>{details.exam?.name}</dd>
              <dt>Year</dt>
              <dd>{details.year}</dd>
              <dt>Type</dt>
              <dd>{typeLabel(details.paper_type)}</dd>
              <dt>Session</dt>
              <dd>{details.session || "—"}</dd>
              <dt>Shift</dt>
              <dd>{details.shift || "—"}</dd>
              <dt>Subject</dt>
              <dd>{details.subject || "—"}</dd>
              <dt>Language</dt>
              <dd>{details.language || "—"}</dd>
              <dt>Status</dt>
              <dd>{details.status}</dd>
              <dt>Display order</dt>
              <dd>{details.display_order}</dd>
              <dt>File</dt>
              <dd>
                {details.original_file_name} ({formatBytes(details.file_size)})
              </dd>
              <dt>Created</dt>
              <dd>{fmtDate(details.created_at)}</dd>
              <dt>Updated</dt>
              <dd>{fmtDate(details.updated_at)}</dd>
              <dt>Description</dt>
              <dd>{details.description || "—"}</dd>
            </dl>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-brown btn-small"
                onClick={() => setDetails(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete paper?"
          confirmLabel="Delete paper"
          danger
          busy={busy}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        >
          <p>
            Permanently delete <strong>{toDelete.title}</strong> (
            {toDelete.year}) and its PDF file? This cannot be undone.
          </p>
        </ConfirmDialog>
      )}
    </>
  );
}
