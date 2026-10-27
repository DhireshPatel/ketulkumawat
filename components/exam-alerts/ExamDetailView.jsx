import styles from "./examAlerts.module.css";
import StatusBadge from "./StatusBadge";
import {
  formatDate,
  getApplicationStatus,
  timestampToSiteDate,
} from "../../lib/examAlerts/dates";

// Used by the public details page AND the admin preview, so they always look identical.
export default function ExamDetailView({ exam, today }) {
  const status = getApplicationStatus(exam, today);
  const verified = formatDate(
    /^\d{4}-\d{2}-\d{2}$/.test(exam.verified_at || "")
      ? exam.verified_at
      : timestampToSiteDate(exam.verified_at),
  );

  const facts = [
    ["Application starts", formatDate(exam.application_start)],
    ["Last date to apply", formatDate(exam.application_end)],
    ["Exam date", formatDate(exam.exam_date)],
    ["Application fee", exam.application_fee],
  ].filter(([, v]) => v);

  return (
    <article className={styles.detail}>
      <div className={styles.meta}>
        <span className={styles.category}>{exam.category}</span>
        <StatusBadge status={status} />
      </div>
      <h1>{exam.title || "Untitled exam"}</h1>
      {exam.short_description ? (
        <p className={styles.intro}>{exam.short_description}</p>
      ) : null}

      {facts.length ? (
        <div className={styles.factGrid}>
          {facts.map(([label, value]) => (
            <div className={styles.fact} key={label}>
              <span className={styles.factLabel}>{label}</span>
              <span className={styles.factValue}>{value}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.notice}>
          Dates are not confirmed here. Please check the official notice.
        </p>
      )}

      <div className={styles.actions}>
        {exam.official_notice_url ? (
          <a
            className={styles.btnGhost}
            href={exam.official_notice_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Read Official Notification
          </a>
        ) : null}
        {exam.application_url ? (
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

      {exam.description ? (
        <section className={styles.detailBlock}>
          <h2>About this exam</h2>
          <p className={styles.prose}>{exam.description}</p>
        </section>
      ) : null}

      {exam.eligibility ? (
        <section className={styles.detailBlock}>
          <h2>Eligibility</h2>
          <p className={styles.prose}>{exam.eligibility}</p>
        </section>
      ) : null}

      <p className={styles.notice}>
        {verified ? `Last verified: ${verified}. ` : ""}
        Always confirm dates, fees and eligibility on the official website
        before applying. Deadlines can be extended or changed by the exam
        authority.
      </p>
    </article>
  );
}
