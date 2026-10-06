import styles from "./PeriodicTable.module.css";
import { CATEGORY_CLASS } from "./categoryClasses";

export default function ElementCard({ element, selected, onSelect, style }) {
  const catClass = styles[CATEGORY_CLASS[element.category]];
  return (
    <button
      type="button"
      className={`${styles.card} ${catClass} ${selected ? styles.cardSelected : ""}`}
      style={style}
      onClick={() => onSelect(element)}
      aria-pressed={selected}
      aria-label={`${element.name}, symbol ${element.symbol}, atomic number ${element.atomicNumber}, ${element.category}`}
    >
      <span className={styles.cardNumber}>{element.atomicNumber}</span>
      <span className={styles.cardSymbol}>{element.symbol}</span>
      <span className={styles.cardName}>{element.name}</span>
      <span className={styles.cardMass}>{formatMass(element.atomicMass)}</span>
    </button>
  );
}

// Shows a compact mass on the card (2 decimals); full value stays in the details panel.
function formatMass(mass) {
  if (mass.startsWith("(")) return mass;
  const n = parseFloat(mass);
  if (Number.isNaN(n)) return mass;
  return n >= 100 ? n.toFixed(2) : mass.length > 7 ? n.toFixed(3) : mass;
}
