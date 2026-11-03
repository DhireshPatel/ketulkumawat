import Link from "next/link";

export default function ExamNotFound() {
  return (
    <div className="notice">
      <strong>Exam not found.</strong> It may have been removed or is not
      available right now.{" "}
      <Link href="/pyq" style={{ color: "var(--brown)", fontWeight: 700 }}>
        Browse all exams
      </Link>
    </div>
  );
}
