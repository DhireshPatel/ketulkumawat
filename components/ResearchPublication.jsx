"use client";

import { useEffect, useRef } from "react";
import {
  FiExternalLink,
  FiDownload,
  FiBookOpen,
  FiCalendar,
  FiHash,
  FiLayers,
  FiBookmark,
  FiAward,
} from "react-icons/fi";

/**
 * Dummy publication data.
 * Replace with CMS / API data as needed.
 */
const PUBLICATIONS = [
  {
    id: 1,
    year: "2025",
    type: "Journal",
    title:
      "Oxidation of Aliphatic Primary Alcohols",
    authors: "Dr. Ketul Kumawat",
    journal: "Journal of Applicable Chemistry",
    // volume: "41",
    // issue: "3",
    // pages: "512–528",
    // publisher: "IEEE",
    doi: "assets/applicable.pdf",
    date: "March 04, 2025",
  },
  {
    id: 2,
    year: "2024",
    type: "Conference",
    title:
      "Oxidation of some aliphatic aldehydes",
    authors: "Dr. Ketul Kumawat",
    journal: "Research Journal of Chemistry and Environment",
    // volume: "—",
    // issue: "—",
    // pages: "1102–1114",
    // publisher: "PMLR",
    doi: "assets/ResearchPublication2.pdf",
    date: "---",
  },
];

/**
 * Single publication card.
 */
function PublicationCard({ publication, index }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("rp-card--visible");
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={cardRef}
      className="rp-card"
      style={{ transitionDelay: `${(index % 6) * 90}ms` }}
    >
      <span className="rp-card__icon" aria-hidden="true">
        <FiAward />
      </span>

      {/* <header className="rp-card__header">
        <span className="rp-badge rp-badge--year">
          <FiCalendar aria-hidden="true" />
          {publication.year}
        </span>
        <span className="rp-badge rp-badge--type">{publication.type}</span>
      </header> */}

      <h3 className="rp-card__title">{publication.title}</h3>

      <p className="rp-card__authors">{publication.authors}</p>

      <p className="rp-card__journal">{publication.journal}</p>

      {/* <dl className="rp-card__meta">
        <div className="rp-card__meta-item">
          <dt>
            <FiLayers aria-hidden="true" /> Volume
          </dt>
          <dd>{publication.volume}</dd>
        </div>
        <div className="rp-card__meta-item">
          <dt>
            <FiBookOpen aria-hidden="true" /> Issue
          </dt>
          <dd>{publication.issue}</dd>
        </div>
        <div className="rp-card__meta-item">
          <dt>
            <FiHash aria-hidden="true" /> Pages
          </dt>
          <dd>{publication.pages}</dd>
        </div>
        <div className="rp-card__meta-item">
          <dt>
            <FiBookmark aria-hidden="true" /> Publisher
          </dt>
          <dd>{publication.publisher}</dd>
        </div>
      </dl> */}

      {/* <p className="rp-card__doi">
        DOI: <span>{publication.doi}</span>
      </p> */}
      <p className="rp-card__date">Published: {publication.date}</p>

      <div className="rp-card__actions">
        <a
          href={publication.doi}
          target="_blank"
          rel="noopener noreferrer"
          className="rp-btn rp-btn--primary"
        >
          <FiExternalLink aria-hidden="true" />
          <span>View Paper</span>
        </a>
        <a href={publication.doi} className="rp-btn rp-btn--secondary" download>
          <FiDownload aria-hidden="true" />
          <span>Download PDF</span>
        </a>
      </div>
    </article>
  );
}

/**
 * Research Publications Section
 */
export default function ResearchPublications() {
  return (
    <section className="rp-section" id="publications">
      <div className="rp-container">
        <header className="rp-heading">
          <span className="rp-heading__eyebrow">Publications</span>
          <h2 className="rp-heading__title">Research Publications</h2>
          <p className="rp-heading__subtitle">
            A collection of peer-reviewed journal articles, conference papers
            and research contributions.
          </p>
          <div className="rp-heading__divider" aria-hidden="true" />
        </header>

        <div className="rp-grid">
          {PUBLICATIONS.map((publication, index) => (
            <PublicationCard
              key={publication.id}
              publication={publication}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
