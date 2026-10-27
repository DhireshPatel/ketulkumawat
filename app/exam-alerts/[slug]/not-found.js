import Link from "next/link";
import styles from "../../../components/exam-alerts/examAlerts.module.css";

export default function ExamNotFound() {
  return (
    <main className={styles.wrap}>
      <div className={styles.state}>
        <h1 className={styles.heading}>Exam notification not found</h1>
        <p>This notification does not exist or is no longer available.</p>
        <Link className={styles.btn} href="/exam-alerts">
          Browse exam alerts
        </Link>
      </div>
    </main>
  );
}
