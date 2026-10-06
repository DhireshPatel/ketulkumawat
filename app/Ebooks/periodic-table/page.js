import PeriodicTable from "../../../components/periodic-table/PeriodicTable";

export const metadata = {
  title: "Periodic Table of Elements | Dr. Ketul Kumawat",
  description:
    "Interactive periodic table of elements with atomic numbers, symbols, atomic masses, categories, phases, electron configurations and other useful information.",
};

export default function PeriodicTablePage() {
  return (
    <main>
      <PeriodicTable />
    </main>
  );
}
