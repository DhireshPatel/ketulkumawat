import Link from "next/link";
import styles from "./examAlerts.module.css";
import ExamCard from "./ExamCard";
import { fetchLatestExams } from "../../lib/examAlerts/queries";
import { todayInSiteTimezone } from "../../lib/examAlerts/dates";

// Server component. Drop <LatestExamAlerts /> into your existing homepage.
// Renders nothing if there are no published exams or the query fails, so the homepage never breaks.
export default async function LatestExamAlerts({ limit = 4 }) {
  const { data, error } = await fetchLatestExams(limit);
  if (error || !data.length) return null;
  const today = todayInSiteTimezone();

  return (
    <section
      className={styles.homeSection}
      aria-labelledby="exam-alerts-home-heading"
    >
      <div className={styles.homeHead}>
        <h2 id="exam-alerts-home-heading">Latest Exam Alerts</h2>
        <Link className={styles.link} href="/exam-alerts">
          View All Exam Alerts
        </Link>
      </div>
      <ul className={styles.grid}>
        {data.map((exam) => (
          <ExamCard key={exam.id} exam={exam} today={today} compact />
        ))}
      </ul>
    </section>
  );
}
