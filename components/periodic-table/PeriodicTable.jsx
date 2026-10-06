"use client";

import { useState } from "react";
import { elements } from "../../data/elements";
import styles from "./PeriodicTable.module.css";
import CategoryLegend from "./CategoryLegend";
import ElementCard from "./ElementCard";
import ElementDetails from "./ElementDetails";

// Grid rows: 1-7 = periods, 8 = spacer, 9 = lanthanides, 10 = actinides.
function cellStyle(el) {
  if (el.fBlock === 1) return { gridColumn: el.column, gridRow: 9 };
  if (el.fBlock === 2) return { gridColumn: el.column, gridRow: 10 };
  return { gridColumn: el.group, gridRow: el.period };
}

export default function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState(null);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Periodic Table of Elements</h1>
        <p className={styles.subtitle}>Click any element to learn more</p>
      </header>

      <CategoryLegend />

      <div className={styles.scroll}>
        <div className={styles.grid} role="group" aria-label="Periodic table of elements">
          {elements.map((el) => (
            <ElementCard
              key={el.atomicNumber}
              element={el}
              style={cellStyle(el)}
              selected={selectedElement?.atomicNumber === el.atomicNumber}
              onSelect={setSelectedElement}
            />
          ))}
          <div className={`${styles.placeholder} ${styles.lanthanide}`} style={{ gridColumn: 3, gridRow: 6 }} aria-hidden="true">
            57–71
          </div>
          <div className={`${styles.placeholder} ${styles.actinide}`} style={{ gridColumn: 3, gridRow: 7 }} aria-hidden="true">
            89–103
          </div>
        </div>
      </div>

      <ElementDetails element={selectedElement} onClose={() => setSelectedElement(null)} />
    </div>
  );
}
