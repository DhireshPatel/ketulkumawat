"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../../components/exam-alerts/examAlerts.module.css";
import AdminGate from "../../../components/exam-alerts/AdminGate";
import {
  listExams,
  setPublicationStatus,
  deleteExam,
} from "../../../lib/examAlerts/adminClient.js";
import {
  CATEGORIES,
  PUBLICATION_STATUSES,
} from "../../../lib/examAlerts/constants.js";
import {
  formatDate,
  timestampToSiteDate,
} from "../../../lib/examAlerts/dates.js";

function List() {
  const [filters, setFilters] = useState({ q: "", status: "", category: "" });
  const [applied, setApplied] = useState(filters);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async (f) => {
    setLoading(true);
    const res = await listExams(f);
    setRows(res.data);
    setError(res.error || "");
    setLoading(false);
  }, []);

  useEffect(() => {
    load(applied);
  }, [applied, load]);

  const run = async (id, fn, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusyId(id);
    setMessage("");
    const res = await fn();
    setBusyId(null);
    if (!res.ok) setMessage(res.message);
    else load(applied);
  };

  const small = `${styles.btnGhost} ${styles.smallBtn}`;

  return (
    <div className={styles.wrap}>
      <div className={styles.adminBar}>
        <h1 className={styles.heading}>Exam Alerts</h1>
        <div className={styles.rowActions}>
          <Link className={styles.btnGhost} href="/admin">
            ← Admin home
          </Link>
          <Link className={styles.btn} href="/admin/exam-alerts/new">
            Add notification
          </Link>
        </div>
      </div>

      <form
        className={styles.filters}
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          setApplied(filters);
        }}
      >
        <div className={styles.field}>
          <label className={styles.label} htmlFor="aq">
            Search title
          </label>
          <input
            className={styles.input}
            id="aq"
            value={filters.q}
            maxLength={80}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="astatus">
            Publication status
          </label>
          <select
            className={styles.select}
            id="astatus"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All</option>
            {PUBLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="acat">
            Category
          </label>
          <select
            className={styles.select}
            id="acat"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button className={styles.btn} type="submit">
          Filter
        </button>
      </form>

      {message ? (
        <p className={styles.error} role="alert">
          {message}
        </p>
      ) : null}

      {loading ? (
        <div className={styles.state} role="status">
          Loading…
        </div>
      ) : error ? (
        <div className={`${styles.state} ${styles.stateError}`} role="alert">
          {error}
        </div>
      ) : rows.length === 0 ? (
        <div className={styles.state}>No notifications found.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Last date</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.title}</strong>
                    <div className={styles.hint}>/{r.slug}</div>
                  </td>
                  <td>{r.category}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${styles[`badge_${r.publication_status}`]}`}
                    >
                      {r.publication_status}
                    </span>
                  </td>
                  <td>{formatDate(r.application_end) || "—"}</td>
                  <td>
                    {formatDate(timestampToSiteDate(r.verified_at)) ||
                      "Not verified"}
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link
                        className={small}
                        href={`/admin/exam-alerts/${r.id}/edit`}
                      >
                        Edit
                      </Link>
                      {r.publication_status === "published" ? (
                        <>
                          <Link
                            className={small}
                            href={`/exam-alerts/${r.slug}`}
                            target="_blank"
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            className={small}
                            disabled={busyId === r.id}
                            onClick={() =>
                              run(r.id, () =>
                                setPublicationStatus(r.id, "draft"),
                              )
                            }
                          >
                            Unpublish
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className={small}
                          disabled={busyId === r.id}
                          onClick={() =>
                            run(r.id, () =>
                              setPublicationStatus(r.id, "published"),
                            )
                          }
                        >
                          Publish
                        </button>
                      )}
                      {r.publication_status !== "archived" ? (
                        <button
                          type="button"
                          className={small}
                          disabled={busyId === r.id}
                          onClick={() =>
                            run(r.id, () =>
                              setPublicationStatus(r.id, "archived"),
                            )
                          }
                        >
                          Archive
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className={`${small} ${styles.btnDanger}`}
                        disabled={busyId === r.id}
                        onClick={() =>
                          run(
                            r.id,
                            () => deleteExam(r.id),
                            `Delete "${r.title}" permanently? This cannot be undone.`,
                          )
                        }
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
    </div>
  );
}

export default function AdminExamAlertsPage() {
  return (
    <AdminGate>
      <List />
    </AdminGate>
  );
}
