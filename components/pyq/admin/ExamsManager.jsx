"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "../../../lib/pyq/adminClient";
import ConfirmDialog from "./ConfirmDialog";

export default function ExamsManager() {
  const [exams, setExams] = useState(null);
  const [msg, setMsg] = useState(null); // {type, text}
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { ok, data } = await adminFetch("/api/admin/pyq/exams");
    if (ok) setExams(data.exams);
    else setMsg({ type: "bad", text: data.error || "Could not load exams." });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleActive(exam) {
    setMsg(null);
    const { ok, data } = await adminFetch(`/api/admin/pyq/exams/${exam.id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_active: !exam.is_active }),
    });
    if (ok) {
      setMsg({
        type: "ok",
        text: `“${exam.name}” is now ${exam.is_active ? "inactive (hidden from students)" : "active"}.`,
      });
      load();
    } else
      setMsg({ type: "bad", text: data.error || "Could not update the exam." });
  }

  async function confirmDelete() {
    setBusy(true);
    const { ok, data } = await adminFetch(
      `/api/admin/pyq/exams/${toDelete.id}`,
      { method: "DELETE" },
    );
    setBusy(false);
    setMsg(
      ok
        ? { type: "ok", text: `Exam “${toDelete.name}” deleted.` }
        : { type: "bad", text: data.error || "Could not delete the exam." },
    );
    setToDelete(null);
    if (ok) load();
  }

  return (
    <>
      <div className="admin-head-row">
        <div>
          <h1 className="admin-title">Manage Exams</h1>
          <p className="admin-desc">
            Exams appear on the public PYQ page when they are active.
          </p>
        </div>
        <Link href="/admin/pyq/exams/new" className="btn btn-brown btn-small">
          + New exam
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
        {!exams ? (
          <p className="muted">Loading…</p>
        ) : exams.length === 0 ? (
          <p className="muted">
            No exams yet. Click “New exam” to add your first one (e.g. CSIR
            NET).
          </p>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Papers</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((e) => (
                  <tr key={e.id}>
                    <td data-label="Order">{e.display_order}</td>
                    <td data-label="Name">
                      <strong>{e.name}</strong>
                    </td>
                    <td data-label="Slug">
                      <code>{e.slug}</code>
                    </td>
                    <td data-label="Papers">{e.paper_count}</td>
                    <td data-label="Status">
                      <span
                        className={`badge ${e.is_active ? "active" : "inactive"}`}
                      >
                        {e.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="cell-actions">
                        <Link
                          href={`/admin/pyq/exams/${e.id}/edit`}
                          className="link-btn"
                        >
                          Edit
                        </Link>
                        <a
                          href={`/pyq/${e.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-btn"
                        >
                          Preview
                        </a>
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => toggleActive(e)}
                        >
                          {e.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          type="button"
                          className="link-btn danger"
                          onClick={() => setToDelete(e)}
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
      </section>

      {toDelete && (
        <ConfirmDialog
          title="Delete exam?"
          confirmLabel="Delete exam"
          danger
          busy={busy}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        >
          <p>
            Delete <strong>{toDelete.name}</strong>? This cannot be undone.
            {toDelete.paper_count > 0 && (
              <>
                {" "}
                It still has <strong>{toDelete.paper_count}</strong> paper(s),
                so deletion will be blocked until they are removed. You can
                deactivate it instead.
              </>
            )}
          </p>
        </ConfirmDialog>
      )}
    </>
  );
}
