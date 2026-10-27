import styles from "../../components/exam-alerts/examAlerts.module.css";

export default function Loading() {
  return (
    <main className={styles.wrap} aria-busy="true">
      <div className={styles.state} role="status">
        Loading exam notifications…
      </div>
    </main>
  );
}
