import ExamForm from "../../../../../../components/pyq/admin/ExamForm";

export default async function Page({ params }) {
  const { id } = await params; // Next 15+: params is a Promise (also fine on Next 14)
  return <ExamForm examId={id} />;
}
