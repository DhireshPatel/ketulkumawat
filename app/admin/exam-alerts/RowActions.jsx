"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../../../components/exam-alerts/examAlerts.module.css";
import { setPublicationStatus, deleteExam } from "./actions";

export default function RowActions({ id, slug, status, title }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const run = (fn, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setMessage("");
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setMessage(res.message);
      else router.refresh();
    });
  };

  const small = `${styles.btnGhost} ${styles.smallBtn}`;

  return (
    <div>
      <div className={styles.rowActions}>
        <Link className={small} href={`/admin/exam-alerts/${id}/edit`}>
          Edit
        </Link>
        {status === "published" ? (
          <>
            <Link
              className={small}
              href={`/exam-alerts/${slug}`}
              target="_blank"
            >
              View
            </Link>
            <button
              type="button"
              className={small}
              disabled={pending}
              onClick={() => run(() => setPublicationStatus(id, "draft"))}
            >
              Unpublish
            </button>
          </>
        ) : (
          <button
            type="button"
            className={small}
            disabled={pending}
            onClick={() => run(() => setPublicationStatus(id, "published"))}
          >
            Publish
          </button>
        )}
        {status !== "archived" ? (
          <button
            type="button"
            className={small}
            disabled={pending}
            onClick={() => run(() => setPublicationStatus(id, "archived"))}
          >
            Archive
          </button>
        ) : null}
        <button
          type="button"
          className={`${small} ${styles.btnDanger}`}
          disabled={pending}
          onClick={() =>
            run(
              () => deleteExam(id),
              `Delete "${title}" permanently? This cannot be undone.`,
            )
          }
        >
          Delete
        </button>
      </div>
      {message ? (
        <p className={styles.error} role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
