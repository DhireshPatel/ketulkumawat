import styles from "./PeriodicTable.module.css";
import { CATEGORIES } from "../../data/elements";
import { CATEGORY_CLASS } from "./categoryClasses";

export default function CategoryLegend() {
  return (
    <ul className={styles.legend} aria-label="Element categories">
      {CATEGORIES.map((cat) => (
        <li key={cat} className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles[CATEGORY_CLASS[cat]]}`} aria-hidden="true" />
          {cat}
        </li>
      ))}
    </ul>
  );
}
