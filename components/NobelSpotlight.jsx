import Link from "next/link";
import styles from "./NobelSpotlight.module.css";

const CITATION =
  "For the discovery of non-linear effects and autocatalysis in asymmetric organic synthesis";

export default function NobelSpotlight() {
  return (
    <section className={styles.wrap} aria-labelledby="nobel-spotlight-title">
      <div className={styles.container}>
        <div className={styles.card}>
          {/* Subtle decorative molecule (purely visual) */}
          <svg
            className={styles.molecule}
            viewBox="0 0 220 200"
            aria-hidden="true"
            focusable="false"
          >
            <g fill="none" strokeWidth="1.5" strokeLinejoin="round">
              <polygon points="70,40 105,20 140,40 140,80 105,100 70,80" />
              <polygon points="140,80 175,60 210,80 210,120 175,140 140,120" />
              <line x1="70" y1="80" x2="40" y2="100" />
              <line x1="40" y1="100" x2="40" y2="135" />
              <line x1="105" y1="100" x2="105" y2="140" />
              <line x1="105" y1="140" x2="140" y2="120" />
            </g>
            <g className={styles.atoms}>
              <circle cx="40" cy="100" r="4" />
              <circle cx="40" cy="135" r="4" />
              <circle cx="105" cy="140" r="4" />
              <circle cx="210" cy="80" r="4" />
            </g>
          </svg>

          <div className={styles.content}>
            <p className={styles.eyebrow}>NOBEL PRIZE IN CHEMISTRY · 2026</p>
            <h2 id="nobel-spotlight-title" className={styles.heading}>
              The Chemistry Behind
              <br />
              <em>Molecular Handedness</em>
            </h2>
            <p className={styles.laureates}>Henri B. Kagan &amp; Kenso Soai</p>
            <p className={styles.description}>
              The 2026 Nobel Prize in Chemistry was awarded to Henri B. Kagan
              and Kenso Soai for the discovery of non-linear effects and
              autocatalysis in asymmetric organic synthesis.
            </p>
          </div>

          <div className={styles.side}>
            <blockquote className={styles.citation}>
              <span className={styles.citationLabel}>Official citation</span>“
              {CITATION}”
            </blockquote>
            <Link href="/nobel-prize-chemistry-2026" className={styles.cta}>
              <span>Explore the Discovery</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
