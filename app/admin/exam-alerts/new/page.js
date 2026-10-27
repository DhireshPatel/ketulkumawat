"use client";

import Link from "next/link";
import styles from "../../../../components/exam-alerts/examAlerts.module.css";
import AdminGate from "../../../../components/exam-alerts/AdminGate";
import ExamForm from "../ExamForm";

export default function NewExamAlertPage() {
  return (
    <AdminGate>
      <div className={styles.wrap}>
        <Link
          className={`${styles.link} ${styles.back}`}
          href="/admin/exam-alerts"
        >
          ← Back to exam alerts
        </Link>
        <h1 className={styles.heading}>Add exam notification</h1>
        <ExamForm initial={null} />
      </div>
    </AdminGate>
  );
}
