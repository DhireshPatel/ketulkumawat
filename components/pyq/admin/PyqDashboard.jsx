"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch, fmtDate } from "../../../lib/pyq/adminClient";

export default function PyqDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [cleaning, setCleaning] = useState(false);

  const load = useCallback(async () => {
    const { ok, data } = await adminFetch("/api/admin/pyq/stats");
    if (ok) setStats(data);
    else setError(data.error || "Could not load statistics.");
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function cleanup() {
    setCleaning(true);
    setMsg("");
    const { ok, data } = await adminFetch("/api/admin/pyq/orphans", {
      method: "POST",
    });
    setMsg(
      ok
        ? `Cleanup finished. ${data.removed} unused file(s) removed.`
        : data.error || "Cleanup failed.",
    );
    setCleaning(false);
  }

  return (
    <>
      <div className="admin-head-row">
        <div>
          <h1 className="admin-title">PYQ Management</h1>
          <p className="admin-desc">
            Manage exams and previous year question papers.
          </p>
        </div>
        <div className="cell-actions">
          <Link
            href="/admin/pyq/papers/new"
            className="btn btn-brown btn-small"
          >
            + Upload paper
          </Link>
          <Link
            href="/admin/pyq/exams/new"
            className="btn btn-outline btn-small"
          >
            + New exam
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert bad" role="alert">
          {error}
        </div>
      )}
      {msg && (
        <div className="alert ok" role="status">
          {msg}
        </div>
      )}

      <div className="stat-grid">
        {[
          ["Total exams", stats?.exams],
          ["Total papers", stats?.papers],
          ["Published", stats?.published],
          ["Drafts", stats?.draft],
        ].map(([label, val]) => (
          <div className="stat-card" key={label}>
            <b>{val ?? "—"}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <section className="panel">
        <h2>Recently added papers</h2>
        {!stats ? (
          <p className="muted">Loading…</p>
        ) : stats.recent.length === 0 ? (
          <p className="muted">
            No papers yet. Create an exam first, then upload your first PDF.
          </p>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Exam</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Title">{p.title}</td>
                    <td data-label="Exam">{p.exam?.name}</td>
                    <td data-label="Year">{p.year}</td>
                    <td data-label="Status">
                      <span className={`badge ${p.status}`}>{p.status}</span>
                    </td>
                    <td data-label="Added">{fmtDate(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Maintenance</h2>
        <p className="muted" style={{ marginBottom: 12 }}>
          Removes uploaded PDFs that are not attached to any paper (for example
          after an interrupted upload).
        </p>
        <button
          type="button"
          className="btn btn-outline btn-small"
          onClick={cleanup}
          disabled={cleaning}
        >
          {cleaning ? "Cleaning…" : "Clean up unused files"}
        </button>
      </section>
    </>
  );
}
