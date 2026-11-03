import "../../pyq/pyq-base.css";
import "./admin.css";
import PyqShell from "../../../components/pyq/admin/PyqShell";

export const metadata = {
  title: "PYQ Management | Admin",
  robots: { index: false, follow: false },
};

export default function PyqAdminLayout({ children }) {
  return <PyqShell>{children}</PyqShell>;
}
