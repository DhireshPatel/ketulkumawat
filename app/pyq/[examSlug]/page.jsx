import Link from "next/link";
import { notFound } from "next/navigation";
import ExamPapers from "../../../components/pyq/ExamPapers";
import { getExamWithPapers } from "../../../lib/pyq/pyqData";
import { SITE_URL } from "../../../lib/pyq/config";
import { SLUG_RE } from "../../../lib/pyq/validation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { examSlug } = await params; // Next 15+: params is a Promise (also fine on Next 14)
  if (!SLUG_RE.test(examSlug)) return { title: "Not found" };
  const { exam } = await getExamWithPapers(examSlug);
  // Inactive / unknown exams expose nothing.
  if (!exam) return { title: "Exam not found", robots: { index: false } };
  const title = `${exam.name} Previous Year Question Papers`;
  const description =
    exam.description ||
    `Download ${exam.name} previous year question papers, answer keys and solutions year-wise.`;
  return {
    title: `${title} | Dr. Ketul Kumawat`,
    description,
    alternates: { canonical: `${SITE_URL}/pyq/${exam.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/pyq/${exam.slug}`,
      type: "website",
    },
  };
}

export default async function ExamPage({ params }) {
  const { examSlug } = await params;
  if (!SLUG_RE.test(examSlug)) notFound();
  const { configured, exam, papers, error } = await getExamWithPapers(examSlug);

  if (!configured) {
    return (
      <div className="notice">
        <strong>Database not connected yet.</strong> Add your Supabase keys to{" "}
        <code>.env.local</code>.
      </div>
    );
  }
  if (error) {
    return (
      <div className="notice error" role="alert">
        <strong>Could not load papers.</strong> Please try again in a moment.
      </div>
    );
  }
  if (!exam) notFound();

  return (
    <>
      {/* <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/pyq">PYQ</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{exam.name}</span>
      </nav> */}

      <header className="pyq-head">
        <h1>
          {exam.name} <em>Previous Year Papers</em>
        </h1>
        {exam.description && <p>{exam.description}</p>}
      </header>

      <ExamPapers papers={papers} />
    </>
  );
}
