import Link from "next/link";
import ExamGrid from "../../../components/pyq/ExamGrid";
import { getActiveExams } from "../../../lib/pyq/pyqData";
import { SITE_URL } from "../../../lib/pyq/config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Previous Year Question Papers (PYQ) | Dr. Ketul Kumawat",
  description:
    "Download previous year question papers, answer keys and solutions for competitive exams such as CSIR NET, GATE, JEE and NEET.",
  alternates: { canonical: `${SITE_URL}/pyq` },
};

export default async function PyqHome() {
  const { configured, exams, error } = await getActiveExams();

  return (
    <>
      {/* <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">PYQ</span>
      </nav> */}

      <header className="pyq-head">
        <h1>
          Previous Year <em>Question Papers</em>
        </h1>
        <p>
          Practise with real exam papers. Choose an exam to browse year-wise
          question papers, answer keys and solutions — view them online or
          download the PDF.
        </p>
      </header>

      {!configured ? (
        <div className="notice" style={{ marginTop: 28 }}>
          <strong>Database not connected yet.</strong> Add your Supabase keys to{" "}
          <code>.env.local</code> (see README), then restart the server.
        </div>
      ) : error ? (
        <div className="notice error" style={{ marginTop: 28 }} role="alert">
          <strong>Could not load exams.</strong> Please try again in a moment.
        </div>
      ) : (
        <ExamGrid exams={exams} />
      )}
    </>
  );
}
