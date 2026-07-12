import Link from "next/link";
import { BiLibrary } from "react-icons/bi";
import ResearchPublications from "./ResearchPublication";

// const FEATURES = [
//   { icon: "⚡", label: "Instant Access" },
//   { icon: "📄", label: "High Quality PDFs" },
//   { icon: "🎓", label: "Expert Content" },
//   { icon: "⬇️", label: "Easy Download" },
// ];

export default function EbookSection() {
  return (
    <section id="ebooks" className="ebook-section" aria-label="Ebooks Promotion">
      <div className="ebook-container">
        {/* Decorative CSS-only book illustration */}
        <div className="ebook-illustration" aria-hidden="true">
          <div className="book-stack">
            <span className="book book-1" />
            <span className="book book-2" />
            <span className="book book-3" />
            <span className="book-glow" />
          </div>
        </div>

        <div className="ebook-content">
          <span className="ebook-badge">
            <BiLibrary /> Digital Library
          </span>

          <h2 className="ebook-heading">Explore Our Premium Ebooks</h2>

          <p className="ebook-description">
            Discover a carefully curated collection of ebooks covering valuable
            topics, practical knowledge, and proven learning resources. Built to
            support your personal growth and help you master new skills at your
            own pace.
          </p>

          {/* <ul className="ebook-features">
            {FEATURES.map((feature) => (
              <li className="ebook-feature-item" key={feature.label}>
                <span className="feature-icon">{feature.icon}</span>
                <span className="feature-label">{feature.label}</span>
              </li>
            ))}
          </ul> */}

          <Link href="/Ebooks" className="ebook-cta">
            <span>Explore Ebooks</span>
            <svg
              className="cta-arrow"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
