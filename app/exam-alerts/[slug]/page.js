import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../../components/exam-alerts/examAlerts.module.css";
import ExamDetailView from "../../../components/exam-alerts/ExamDetailView";
import { fetchPublishedExamBySlug } from "../../../lib/examAlerts/queries";
import { todayInSiteTimezone } from "../../../lib/examAlerts/dates";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data } = await fetchPublishedExamBySlug(slug);
  if (!data) return { title: "Exam not found" };
  return {
    title: `${data.title} – Exam Alerts`,
    description: data.short_description || undefined,
  };
}

export default async function ExamAlertDetailPage({ params }) {
  const { slug } = await params;
  const { data, error } = await fetchPublishedExamBySlug(slug);

  if (error) {
    return (
      <main className={styles.wrap}>
        <div className={`${styles.state} ${styles.stateError}`} role="alert">
          {error} Please try again shortly.
        </div>
      </main>
    );
  }
  if (!data) notFound(); // missing, draft and archived all look the same to the public

  return (
    <main className={styles.wrap}>
      <Link className={`${styles.link} ${styles.back}`} href="/exam-alerts">
        ← All exam alerts
      </Link>
      <ExamDetailView exam={data} today={todayInSiteTimezone()} />
    </main>
  );
}
