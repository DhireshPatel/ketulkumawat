"use client";

import { useState } from "react";

const BOOKS = [
    {
        id: 1,
        title: "Organic Chemistry Notes",
        description:
            "Complete handwritten notes covering all important concepts.",
        pages: 120,
        category: "Chemistry",
        price: "₹199",
    },
    {
        id: 2,
        title: "Research Methodology Guide",
        description:
            "Learn research design and methodology from basics to advanced.",
        pages: 180,
        category: "Research",
        price: "₹499",
    },
    {
        id: 3,
        title: "Scientific Writing Handbook",
        description: "Professional guide for writing research papers.",
        pages: 95,
        category: "Writing",
        price: "₹299",
    },
    {
        id: 4,
        title: "Patent Drafting Basics",
        description: "Beginner-friendly patent drafting guide.",
        pages: 140,
        category: "Patent",
        price: "₹399",
    },
    {
        id: 5,
        title: "Analytical Chemistry Notes",
        description: "Comprehensive notes with examples and diagrams.",
        pages: 160,
        category: "Chemistry",
        price: "₹199",
    },
    {
        id: 6,
        title: "Chemistry MCQ Practice Book",
        description: "Practice questions for competitive exams.",
        pages: 210,
        category: "Practice",
        price: "₹99",
    },
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

export default function EbooksPage() {
    const [openFaqIndex, setOpenFaqIndex] = useState(0);

    const handleFaqToggle = (index) => {
        setOpenFaqIndex((prev) => (prev === index ? -1 : index));
    };

    return (
        <main className="ebooks-page">
            {/* ================= HERO ================= */}
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-content">
                        <span className="badge">Premium Study Resources</span>
                        <h1 className="hero-heading">Paid Notes &amp; E-books</h1>
                        <p className="hero-paragraph">
                            Explore high-quality research notes, chemistry study
                            materials, academic guides, and premium e-books carefully
                            prepared to support students, researchers, and professionals.
                        </p>
                        <div className="hero-buttons">
                            <a href="#collection" className="btn btn-primary">
                                Browse Collection
                            </a>
                            <a href="#contact" className="btn btn-secondary">
                                Contact Me
                            </a>
                        </div>
                    </div>
                    <div className="hero-visual" aria-hidden="true">
                        <div className="hero-illustration">
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

            {/* ================= FEATURED E-BOOKS ================= */}
            <section className="section" id="collection">
                <div className="section-inner">
                    <div className="section-header">
                        <span className="eyebrow">Featured Collection</span>
                        <h2 className="section-heading">Featured E-books</h2>
                        <p className="section-subheading">
                            Carefully curated academic material, ready for instant
                            download.
                        </p>
                    </div>

                    <div className="books-grid">
                        {BOOKS.map((book) => (
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
                                        <span className="book-meta-item">
                                            {book.pages} Pages
                                        </span>
                                        <span className="book-meta-divider" />
                                        <span className="book-meta-item">{book.category}</span>
                                    </div>
                                    <div className="book-price">{book.price}</div>
                                    <div className="book-actions">
                                        <a href="#" className="btn btn-outline btn-small">
                                            Preview
                                        </a>
                                        <a href="#" className="btn btn-primary btn-small">
                                            Buy Now
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= WHY CHOOSE ================= */}
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

            {/* ================= CATEGORIES ================= */}
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

            {/* ================= PURCHASE PROCESS ================= */}
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

            {/* ================= FAQ ================= */}
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

            {/* ================= FINAL CTA ================= */}
            <section className="cta" id="contact">
                <div className="cta-inner">
                    <h2 className="cta-heading">Start Learning Today</h2>
                    <p className="cta-paragraph">
                        Invest in premium academic resources and improve your research
                        and learning journey.
                    </p>
                    <div className="cta-buttons">
                        <a href="#collection" className="btn btn-primary">
                            Browse Collection
                        </a>
                        <a href="#contact" className="btn btn-secondary btn-on-dark">
                            Contact Me
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}