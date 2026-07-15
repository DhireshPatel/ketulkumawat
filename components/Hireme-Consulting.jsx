"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const services = [
  {
    id: "research-consulting",
    title: "Research Consulting",
    description:
      "Expert guidance for manuscript editing, journal selection, paper formatting, thesis proofreading and publication support.",
    features: [
      "Manuscript Editing",
      "Journal Selection",
      "Thesis Proofreading",
      "Publication Support",
    ],
    buttonText: "Explore Consulting",
    href: "/research-consulting",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M27 6h10"
          stroke="var(--gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M29 6v14.5c0 1.2-.4 2.4-1.1 3.4L14.8 44.6c-2.6 3.7 0 8.8 4.5 8.8h25.4c4.5 0 7.1-5.1 4.5-8.8L36.1 23.9c-.7-1-1.1-2.2-1.1-3.4V6"
          stroke="var(--gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 38c3-2 6-2 9 0s6 2 9 0 6-2 9 0"
          stroke="var(--gold-light)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="26" cy="34" r="1.6" fill="var(--gold-light)" />
        <circle cx="34" cy="40" r="1.3" fill="var(--gold-light)" />
        <circle cx="40" cy="33" r="1.1" fill="var(--gold-light)" />
      </svg>
    ),
  },
  {
    id: "hire-me",
    title: "Hire Me",
    description:
      "Need assistance with scientific writing, research analysis, proofreading, patent drafting or chemistry tutoring? Let's work together.",
    features: [
      "Research Writing",
      "Data Analysis",
      "Patent Draft Support",
      "Chemistry Tutoring",
    ],
    buttonText: "Hire Me",
    href: "/HireMe",
    icon: (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="32" cy="20" r="9" stroke="var(--gold)" strokeWidth="2.5" />
        <path
          d="M14 50c1.5-10 8.5-16 18-16s16.5 6 18 16"
          stroke="var(--gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M40 15l4-4 4 4"
          stroke="var(--gold-light)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M44 11v9"
          stroke="var(--gold-light)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

function CheckIcon() {
  return (
    <svg
      className="ps-check"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="11" stroke="var(--gold)" strokeWidth="1.5" />
      <path
        d="M7.5 12.5l3 3 6-6.5"
        stroke="var(--gold)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProfessionalServicesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ps-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    const targets = node.querySelectorAll(".ps-fade");
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="ps-section"
      ref={sectionRef}
      aria-labelledby="ps-heading"
    >
      <div className="ps-container">
        <header className="ps-header ps-fade">
          <h2 id="ps-heading" className="ps-title">
            Professional Services
          </h2>
          <p className="ps-subtitle">
            Helping Researchers, Students &amp; Institutions with professional
            academic and research support.
          </p>
        </header>

        <div className="ps-grid">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="ps-card ps-fade"
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              <div className="ps-icon-wrap">{service.icon}</div>

              <h3 className="ps-card-title">{service.title}</h3>
              <p className="ps-card-desc">{service.description}</p>

              <ul className="ps-features">
                {service.features.map((feature) => (
                  <li key={feature} className="ps-feature-item">
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={service.href} className="ps-button">
                <span>{service.buttonText}</span>
                <svg
                  className="ps-arrow"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
