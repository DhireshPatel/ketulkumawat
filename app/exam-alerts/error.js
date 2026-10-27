"use client";

import styles from "../../components/exam-alerts/examAlerts.module.css";

export default function ExamAlertsError({ reset }) {
  return (
    <main className={styles.wrap}>
      <div className={`${styles.state} ${styles.stateError}`} role="alert">
        <p>Something went wrong while loading exam alerts.</p>
        <button className={styles.btn} type="button" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </main>
  );
}
