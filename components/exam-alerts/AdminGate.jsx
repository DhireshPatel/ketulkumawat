"use client";
import styles from "./examAlerts.module.css";
import { useAdminGuard } from "../../lib/examAlerts/useAdminGuard.js";

// Wrap every admin exam-alerts page. Renders children only for a logged-in admin.
export default function AdminGate({ children }) {
  const state = useAdminGuard();
  if (state === "ok") return children;
  return (
    <div className={styles.wrap}>
      <div
        className={`${styles.state} ${state === "checking" ? "" : styles.stateError}`}
        role={state === "checking" ? "status" : "alert"}
      >
        {state === "checking" && "Checking access…"}
        {state === "forbidden" &&
          "You are logged in but not authorised to manage exam alerts. (Check exam_alerts_is_admin() in Supabase.)"}
        {state === "error" &&
          "Could not verify access. Make sure the SQL migration has been run."}
      </div>
    </div>
  );
}
