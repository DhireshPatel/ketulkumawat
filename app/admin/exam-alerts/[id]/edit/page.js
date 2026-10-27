"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "../../../../../components/exam-alerts/examAlerts.module.css";
import AdminGate from "../../../../../components/exam-alerts/AdminGate";
import ExamForm from "../../ExamForm";
import { getExam } from "../../../../../lib/examAlerts/adminClient.js";

function Editor() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, data: null, error: "" });

  useEffect(() => {
    let alive = true;
    getExam(id).then(
      (r) =>
        alive &&
        setState({ loading: false, data: r.data, error: r.error || "" }),
    );
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <div className={styles.wrap}>
      <Link
        className={`${styles.link} ${styles.back}`}
        href="/admin/exam-alerts"
      >
        ← Back to exam alerts
      </Link>
      <h1 className={styles.heading}>Edit exam notification</h1>
      {state.loading ? (
        <div className={styles.state} role="status">
          Loading…
        </div>
      ) : state.error ? (
        <div className={`${styles.state} ${styles.stateError}`} role="alert">
          {state.error}
        </div>
      ) : !state.data ? (
        <div className={styles.state}>Notification not found.</div>
      ) : (
        <ExamForm initial={state.data} />
      )}
    </div>
  );
}

export default function EditExamAlertPage() {
  return (
    <AdminGate>
      <Editor />
    </AdminGate>
  );
}
