import PaperForm from "../../../../../../components/pyq/admin/PaperForm";

export default async function Page({ params }) {
  const { id } = await params; // Next 15+: params is a Promise (also fine on Next 14)
  return <PaperForm paperId={id} />;
}
