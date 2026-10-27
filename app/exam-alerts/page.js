import styles from "../../components/exam-alerts/examAlerts.module.css";
import ExamCard from "../../components/exam-alerts/ExamCard";
import { fetchPublishedExams } from "../../lib/examAlerts/queries";
import { todayInSiteTimezone } from "../../lib/examAlerts/dates";
import {
  CATEGORIES,
  APPLICATION_STATUS_LABELS,
} from "../../lib/examAlerts/constants";

export const dynamic = "force-dynamic"; // edits/publishing show up immediately

export const metadata = {
  title: "Exam Alerts",
  description:
    "Exam notifications, application dates, eligibility and official links for major Indian entrance and recruitment exams.",
};

const first = (v) => (Array.isArray(v) ? v[0] : v) || "";

export default async function ExamAlertsPage({ searchParams }) {
  const sp = (await searchParams) || {}; // await works on Next 14 and 15
  const search = first(sp.q).slice(0, 80);
  const category = CATEGORIES.includes(first(sp.category))
    ? first(sp.category)
    : "";
  const status = APPLICATION_STATUS_LABELS[first(sp.status)]
    ? first(sp.status)
    : "";

  const { data, error } = await fetchPublishedExams({
    search,
    category,
    status,
  });
  const today = todayInSiteTimezone();
  const filtered = Boolean(search || category || status);

  return (
    <main className={styles.wrap}>
      <h1 className={styles.heading}>Exam Notifications</h1>
      <p className={styles.intro}>
        Application dates, eligibility and official links for major entrance and
        recruitment exams. Every entry links to the official notice, so you can
        confirm details at the source.
      </p>

      <form
        className={styles.filters}
        method="get"
        action="/exam-alerts"
        role="search"
      >
        <div className={styles.field}>
          <label className={styles.label} htmlFor="q">
            Search exams
          </label>
          <input
            className={styles.input}
            id="q"
            name="q"
            type="search"
            defaultValue={search}
            placeholder="e.g. JEE Main"
            maxLength={80}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="category">
            Category
          </label>
          <select
            className={styles.select}
            id="category"
            name="category"
            defaultValue={category}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="status">
            Application status
          </label>
          <select
            className={styles.select}
            id="status"
            name="status"
            defaultValue={status}
          >
            <option value="">Any status</option>
            {Object.entries(APPLICATION_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <button className={styles.btn} type="submit">
          Search
        </button>
      </form>

      {error ? (
        <div className={`${styles.state} ${styles.stateError}`} role="alert">
          {error} Please try again in a moment.
        </div>
      ) : data.length === 0 ? (
        <div className={styles.state}>
          {filtered
            ? "No exam notifications match your search. Try clearing a filter."
            : "No exam notifications have been published yet. Please check back soon."}
        </div>
      ) : (
        <ul className={styles.grid}>
          {data.map((exam) => (
            <ExamCard key={exam.id} exam={exam} today={today} />
          ))}
        </ul>
      )}
    </main>
  );
}
