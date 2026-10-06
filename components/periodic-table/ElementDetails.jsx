import styles from "./PeriodicTable.module.css";
import { CATEGORY_CLASS } from "./categoryClasses";

export default function ElementDetails({ element, onClose }) {
  return (
    <section className={styles.details} aria-live="polite" aria-labelledby="element-details-heading">
      <div className={styles.detailsHeader}>
        <h2 id="element-details-heading" className={styles.detailsTitle}>
          Element Details
        </h2>
        {element && (
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Clear selected element">
            ✕ Close
          </button>
        )}
      </div>

      {!element ? (
        <p className={styles.empty}>Select an element to view its details</p>
      ) : (
        <div className={styles.detailsBody}>
          <div className={`${styles.bigSymbol} ${styles[CATEGORY_CLASS[element.category]]}`}>
            <span className={styles.bigNumber}>{element.atomicNumber}</span>
            {element.symbol}
          </div>

          <div className={styles.detailsInfo}>
            <h3 className={styles.elementName}>{element.name}</h3>
            <p className={styles.elementNumber}>#{element.atomicNumber}</p>
            <p className={styles.elementDesc}>{element.description}</p>

            <dl className={styles.facts}>
              <div>
                <dt>Atomic Mass</dt>
                <dd>{element.atomicMass}</dd>
              </div>
              <div>
                <dt>Phase</dt>
                <dd>{element.phase}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{element.category}</dd>
              </div>
              <div>
                <dt>Discovered</dt>
                <dd>{element.discovered}</dd>
              </div>
              <div className={styles.factWide}>
                <dt>Electron Configuration</dt>
                <dd>{element.electronConfiguration}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </section>
  );
}
