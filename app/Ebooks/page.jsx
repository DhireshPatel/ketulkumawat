//new2

"use client";

import { useState, useEffect, useCallback } from "react";

const LEARN_POINTS = [
  "Complete Concepts",
  "Exam Preparation",
  "Research Tips",
  "Practice Questions",
  "Easy Language",
  "Professional Notes",
];

const PREVIEW_FEATURES = [
  "Instant Download",
  "High Quality PDF",
  "Mobile Friendly",
  "Printable",
  "Lifetime Access",
  "Expert Prepared",
];

const TABLE_OF_CONTENTS = [
  "Introduction",
  "Basic Concepts",
  "Advanced Topics",
  "Solved Examples",
  "Practice Questions",
  "Summary",
];

const AUDIENCE = [
  "Students",
  "Researchers",
  "PhD Scholars",
  "Faculty",
  "Chemistry Aspirants",
  "Competitive Exam Students",
];

const FEATURES = [
  {
    title: "Expertly Prepared",
    description:
      "Every page is compiled and reviewed with care, drawing on years of academic and research experience.",
  },
  {
    title: "Easy to Understand",
    description:
      "Concepts are broken down into clear, structured explanations suited for every level of learner.",
  },
  {
    title: "Research Based Content",
    description:
      "Material is grounded in credible sources and real research practice, not generic summaries.",
  },
  {
    title: "Lifetime Access After Purchase",
    description:
      "Download once and keep it forever — revisit your notes anytime you need a refresher.",
  },
];

const CATEGORIES = [
  "Chemistry",
  "Research",
  "Scientific Writing",
  "Patent",
  "Study Guides",
  "Practice Books",
];

const STEPS = [
  {
    step: "01",
    title: "Browse E-book",
    description: "Explore the collection and find the resource you need.",
  },
  {
    step: "02",
    title: "View Details",
    description: "Check the contents, pages, and category before deciding.",
  },
  {
    step: "03",
    title: "Secure Payment",
    description: "Complete your purchase through a safe checkout.",
  },
  {
    step: "04",
    title: "Instant PDF Download",
    description: "Get immediate access to your e-book after purchase.",
  },
];

const FAQS = [
  {
    question: "Can I download the PDF immediately?",
    answer:
      "Yes. Once your purchase is confirmed, the PDF is made available for instant download.",
  },
  {
    question: "Will I receive lifetime access?",
    answer:
      "Yes. Every purchase includes lifetime access, so you can revisit the material anytime.",
  },
  {
    question: "Are these notes suitable for beginners?",
    answer:
      "Absolutely. Each resource is written to be approachable for beginners while remaining useful for advanced learners.",
  },
  {
    question: "Can I contact you before purchasing?",
    answer:
      "Of course. Feel free to reach out with any questions before you make a decision.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "A range of standard payment methods will be supported at checkout.",
  },
];

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className={`faq-item ${isOpen ? "faq-item--open" : ""}`}>
      <button
        className="faq-question"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{faq.question}</span>
        <span className="faq-icon" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <div className="faq-answer-wrapper">
        <p className="faq-answer">{faq.answer}</p>
      </div>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <span className="preview-stars" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

// ===== PREVIEW MODAL COMPONENT (FIXED HOOKS) =====
function PreviewModal({ book, onClose }) {
  const [activeImage, setActiveImage] = useState(0);
  const totalImages = 4; // Constant length to avoid rule of hooks violation

  const goToPrev = useCallback(() => {
    setActiveImage((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setActiveImage((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowLeft") {
        goToPrev();
      }
      if (event.key === "ArrowRight") {
        goToNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, goToPrev, goToNext]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview of ${book.title}`}
    >
      <div className="modal-container">
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close preview"
        >
          ×
        </button>

        <div className="modal-scroll">
          <div className="modal-top">
            {/* Gallery */}
            <div className="modal-gallery">
              <div className="modal-gallery-main">
                <button
                  className="gallery-arrow gallery-arrow--left"
                  onClick={goToPrev}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <div className="gallery-main-image">
                  <span className="gallery-placeholder-label">
                    {book.title}
                  </span>
                  <span className="gallery-placeholder-index">
                    Image {activeImage + 1} of {totalImages}
                  </span>
                </div>
                <button
                  className="gallery-arrow gallery-arrow--right"
                  onClick={goToNext}
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>

              <div className="modal-gallery-thumbs">
                {Array.from({ length: totalImages }).map((_, imgIndex) => (
                  <button
                    key={imgIndex}
                    className={`gallery-thumb ${activeImage === imgIndex ? "gallery-thumb--active" : ""}`}
                    onClick={() => setActiveImage(imgIndex)}
                    aria-label={`View image ${imgIndex + 1}`}
                  >
                    {imgIndex + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="modal-info">
              <span className="modal-category-badge">{book.category}</span>
              <h2 className="modal-title">{book.title}</h2>
              <p className="modal-author">
                by <strong>{book.author}</strong>
              </p>

              <div className="modal-rating-row">
                <StarRating rating={book.rating} />
                <span className="modal-stock">In Stock</span>
              </div>

              <ul className="modal-quick-facts">
                <li>
                  <span>Pages</span>
                  <strong>{book.pages}</strong>
                </li>
                <li>
                  <span>Language</span>
                  <strong>{book.language}</strong>
                </li>
                <li>
                  <span>Format</span>
                  <strong>PDF</strong>
                </li>
                <li>
                  <span>Download</span>
                  <strong>Instant</strong>
                </li>
                <li>
                  <span>Access</span>
                  <strong>Lifetime</strong>
                </li>
              </ul>

              <p className="modal-short-description">{book.description}</p>
              <div className="modal-price-inline">{book.price}</div>
            </div>
          </div>

          <div className="modal-section">
            <h3 className="modal-section-title">About This E-book</h3>
            <p className="modal-description">{book.longDescription}</p>
          </div>

          <div className="modal-section">
            <h3 className="modal-section-title">What You Will Learn</h3>
            <ul className="modal-checklist">
              {LEARN_POINTS.map((point) => (
                <li key={point}>
                  <span className="check-icon">✔</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="modal-section">
            <h3 className="modal-section-title">Features</h3>
            <div className="modal-feature-grid">
              {PREVIEW_FEATURES.map((feature) => (
                <div className="modal-feature-card" key={feature}>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="modal-section">
            <h3 className="modal-section-title">Table of Contents</h3>
            <ol className="modal-toc">
              {TABLE_OF_CONTENTS.map((item, index) => (
                <li key={item}>
                  <span className="toc-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <div className="modal-section">
            <h3 className="modal-section-title">Who Should Buy This?</h3>
            <div className="modal-audience-grid">
              {AUDIENCE.map((audience) => (
                <div className="modal-audience-card" key={audience}>
                  {audience}
                </div>
              ))}
            </div>
          </div>

          <div className="modal-cta">
            <div className="modal-cta-price">
              <span className="modal-cta-price-label">Price</span>
              <span className="modal-cta-price-value">{book.price}</span>
            </div>
            <div className="modal-cta-buttons">
              {/* <a
                href={book.pdfUrl}
                download={`${book.title}.pdf`}
                className="btn btn-primary1"
              >
                Buy Now
              </a> */}
              <a
                href={book.pdf_path}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary1 btn-small"
              >
                Buy Now
              </a>
              <a
                href="#contact"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EbooksPage() {
  const [books, setBooks] = useState([]);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [previewBook, setPreviewBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1.
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/admin/books");
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleFaqToggle = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? -1 : index));
  };

  const openPreview = (book) => {
    setPreviewBook(book);
  };

  const closePreview = () => {
    setPreviewBook(null);
  };

  return (
    <main className="ebooks-page">
      {/* HERO */}
      <section className="hero1">
        <div className="hero1-inner">
          <div className="hero1-content">
            <span className="badge2">Premium Study Resources</span>
            <h1 className="hero1-heading">Paid Notes &amp; E-books</h1>
            <p className="hero1-paragraph">
              Explore high-quality research notes, chemistry study materials,
              academic guides, and premium e-books carefully prepared to support
              students, researchers, and professionals.
            </p>
            <div className="hero1-buttons">
              <a href="#collection" className="btn btn-primary1">
                Browse Collection
              </a>
              <a href="#contact" className="btn btn-secondary">
                Contact Me
              </a>
            </div>
          </div>
          <div className="hero1-visual" aria-hidden="true">
            <div className="hero1-illustration">
              <div className="illustration-book illustration-book--back" />
              <div className="illustration-book illustration-book--front">
                <div className="illustration-lines">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="illustration-seal">
                <span>PDF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED E-BOOKS */}
      <section className="section" id="collection">
        <div className="section-inner">
          <div className="section-header">
            <span className="eyebrow">Featured Collection</span>
            <h2 className="section-heading">Featured E-books</h2>
            <p className="section-subheading">
              Carefully curated academic material, ready for instant download.
            </p>
          </div>

          {loading ? (
            <p style={{ textAlign: "center", padding: "2rem" }}>
              Loading books...
            </p>
          ) : (
            <div className="books-grid">
              {books.map((book) => (
                <article className="book-card" key={book.id}>
                  <div className="book-cover">
                    <div className="book-cover-inner">
                      <span className="book-cover-category">
                        {book.category}
                      </span>
                      <span className="book-cover-title">{book.title}</span>
                    </div>
                  </div>
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-description">{book.description}</p>
                    <div className="book-meta">
                      <span className="book-meta-item">{book.pages} Pages</span>
                      <span className="book-meta-divider" />
                      <span className="book-meta-item">{book.category}</span>
                    </div>
                    <div className="book-price">{book.price}</div>
                    <div className="book-actions">
                      <button
                        type="button"
                        className="btn btn-outline btn-small"
                        onClick={() => openPreview(book)}
                      >
                        Preview
                      </button>
                      {/* <a
                        href={book.pdfUrl}
                        download={`${book.title}.pdf`}
                        className="btn btn-primary1 btn-small"
                      >
                        Buy Now
                      </a> */}
                      <a
                        href={book.pdf_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary1 btn-small"
                      >
                        Buy Now
                      </a>
                    </div>
                  </div>
                </article>
              ))}
              {!loading && books.length === 0 && (
                <p
                  style={{
                    textAlign: "center",
                    gridColumn: "1/-1",
                    color: "#666",
                  }}
                >
                  No books available right now.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="section section--muted">
        <div className="section-inner">
          <div className="section-header">
            <span className="eyebrow">Our Promise</span>
            <h2 className="section-heading">Why Choose These Notes</h2>
          </div>

          <div className="features-grid">
            {FEATURES.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <span className="eyebrow">Explore by Topic</span>
            <h2 className="section-heading">Categories</h2>
          </div>

          <div className="categories-grid">
            {CATEGORIES.map((category) => (
              <a href="#collection" className="category-card" key={category}>
                <span className="category-name">{category}</span>
                <span className="category-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PURCHASE PROCESS */}
      <section className="section section--muted">
        <div className="section-inner">
          <div className="section-header">
            <span className="eyebrow">How It Works</span>
            <h2 className="section-heading">Purchase Process</h2>
          </div>

          <div className="timeline">
            {STEPS.map((item, index) => (
              <div className="timeline-step" key={item.step}>
                <div className="timeline-node">
                  <span className="timeline-number">{item.step}</span>
                </div>
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-description">{item.description}</p>
                {index < STEPS.length - 1 && (
                  <span className="timeline-connector" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="section-inner section-inner--narrow">
          <div className="section-header">
            <span className="eyebrow">Need to Know</span>
            <h2 className="section-heading">Frequently Asked Questions</h2>
          </div>

          <div className="faq-list">
            {FAQS.map((faq, index) => (
              <FaqItem
                key={faq.question}
                faq={faq}
                isOpen={openFaqIndex === index}
                onToggle={() => handleFaqToggle(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta" id="contact">
        <div className="cta-inner">
          <h2 className="cta-heading">Start Learning Today</h2>
          <p className="cta-paragraph">
            Invest in premium academic resources and improve your research and
            learning journey.
          </p>
          <div className="cta-buttons">
            <a href="#collection" className="btn btn-primary1">
              Browse Collection
            </a>
            <a href="#contact" className="btn btn-secondary btn-on-dark">
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {previewBook && (
        <PreviewModal book={previewBook} onClose={closePreview} />
      )}
    </main>
  );
}
