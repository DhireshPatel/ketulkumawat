import Link from "next/link";
import styles from "./examAlerts.module.css";
import StatusBadge from "./StatusBadge";
import { formatDate, getApplicationStatus } from "../../lib/examAlerts/dates";

// compact = homepage variant (shows only the deadline).
export default function ExamCard({ exam, today, compact = false }) {
  const status = getApplicationStatus(exam, today);
  const start = formatDate(exam.application_start);
  const end = formatDate(exam.application_end);
  const examDate = formatDate(exam.exam_date);

  return (
    <li className={styles.card}>
      <div className={styles.meta}>
        <span className={styles.category}>{exam.category}</span>
        <StatusBadge status={status} />
      </div>
      <h3 className={styles.cardTitle}>
        <Link href={`/exam-alerts/${exam.slug}`}>{exam.title}</Link>
      </h3>
      {!compact && exam.short_description ? (
        <p className={styles.excerpt}>{exam.short_description}</p>
      ) : null}

      <dl className={styles.dates}>
        {!compact && start ? (
          <>
            <dt>Application starts</dt>
            <dd>{start}</dd>
          </>
        ) : null}
        {end ? (
          <>
            <dt>Last date</dt>
            <dd>{end}</dd>
          </>
        ) : null}
        {!compact && examDate ? (
          <>
            <dt>Exam date</dt>
            <dd>{examDate}</dd>
          </>
        ) : null}
        {!start && !end && !(examDate && !compact) ? (
          <>
            <dt>Dates</dt>
            <dd>See official notice</dd>
          </>
        ) : null}
      </dl>

      <div className={styles.actions}>
        <Link className={styles.btnGhost} href={`/exam-alerts/${exam.slug}`}>
          View Details
        </Link>
        {!compact && exam.application_url ? (
          <a
            className={styles.btn}
            href={exam.application_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Apply Now
          </a>
        ) : null}
      </div>
    </li>
  );
}
