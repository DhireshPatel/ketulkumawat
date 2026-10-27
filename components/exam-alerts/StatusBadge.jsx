import styles from "./examAlerts.module.css";
import { APPLICATION_STATUS_LABELS } from "../../lib/examAlerts/constants";

export default function StatusBadge({ status }) {
  const label =
    APPLICATION_STATUS_LABELS[status] || APPLICATION_STATUS_LABELS.check;
  const key = APPLICATION_STATUS_LABELS[status] ? status : "check";
  return (
    <span className={`${styles.badge} ${styles[`badge_${key}`]}`}>{label}</span>
  );
}
