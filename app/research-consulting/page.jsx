// new2

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  PenTool,
  LayoutTemplate,
  FileCheck2,
  BookMarked,
  Compass,
  GraduationCap,
  FlaskConical,
  BookOpenCheck,
  ShieldCheck,
  Clock,
  Lock,
  MessageCircle,
  Eye,
  Send,
  MessagesSquare,
  SearchCheck,
  Edit3,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Quote,
} from "lucide-react";
import { IoIosArrowBack } from "react-icons/io";

/* ------------------------------------------------------------------ */
/* Shared Data                                                       */
/* ------------------------------------------------------------------ */

const services = [
  {
    index: "01",
    icon: PenTool,
    title: "Manuscript Editing",
    description:
      "Line-by-line refinement that keeps your voice intact while bringing the prose up to journal standard.",
    features: [
      "Grammar correction",
      "Scientific language improvement",
      "Sentence restructuring",
      "Clarity enhancement",
    ],
  },
  {
    index: "02",
    icon: LayoutTemplate,
    title: "Research Paper Formatting",
    description:
      "Precise formatting to the exact specification of your target journal or conference, first submission ready.",
    features: ["APA", "IEEE", "Vancouver", "Nature", "Journal templates"],
  },
  {
    index: "03",
    icon: FileCheck2,
    title: "Thesis Proofreading",
    description:
      "A full pass across every chapter for grammar, formatting and voice, so your committee reads argument, not errors.",
    features: ["Grammar", "Formatting", "Consistency", "Academic language"],
  },
  {
    index: "04",
    icon: BookMarked,
    title: "Reference Management",
    description:
      "Citation libraries built and checked so every reference resolves correctly, in the style your field expects.",
    features: ["EndNote", "Zotero", "Mendeley", "Citation styles"],
  },
  {
    index: "05",
    icon: Compass,
    title: "Journal Selection",
    description:
      "A shortlist of realistic, well-matched journals, weighed against scope, indexing and your publication timeline.",
    features: [
      "Journal matching",
      "Scope analysis",
      "Indexing check",
      "Publication strategy",
    ],
  },
];

const whyChoose = [
  { icon: GraduationCap, title: "Experienced Researcher" },
  { icon: FlaskConical, title: "Scientific Writing Expertise" },
  { icon: BookOpenCheck, title: "Publication Support" },
  { icon: ShieldCheck, title: "High Quality Review" },
  { icon: Clock, title: "Timely Delivery" },
  { icon: Lock, title: "100% Confidentiality" },
  { icon: MessageCircle, title: "Responsive Communication" },
  { icon: Eye, title: "Attention to Detail" },
];

const processSteps = [
  {
    icon: Send,
    title: "Submit Requirement",
    description: "Share your manuscript, thesis, or project brief.",
  },
  {
    icon: MessagesSquare,
    title: "Initial Discussion",
    description: "We align on scope, timeline, and target outcome.",
  },
  {
    icon: SearchCheck,
    title: "Research Review",
    description: "A close read of your work and its research context.",
  },
  {
    icon: Edit3,
    title: "Editing & Consulting",
    description: "Structured edits and guidance, explained as we go.",
  },
  {
    icon: CheckCircle2,
    title: "Final Delivery",
    description: "A polished, submission-ready document, on time.",
  },
];

const stats = [
  { value: 100, suffix: "+", label: "Projects Supported" },
  { value: 50, suffix: "+", label: "Research Papers" },
  { value: 20, suffix: "+", label: "Journal Publications Assisted" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
];

const faqs = [
  {
    question: "How long does manuscript editing take?",
    answer:
      "Most manuscripts are returned within 3–5 business days. Longer documents such as full theses may take up to 10 days, and I will confirm an exact timeline before starting.",
  },
  {
    question: "Can you proofread my thesis?",
    answer:
      "Yes. Thesis proofreading covers every chapter for grammar, formatting consistency, and academic tone, delivered with tracked changes so you can review every suggestion.",
  },
  {
    question: "Do you help with journal selection?",
    answer:
      "Yes. I assess your manuscript's scope and quality against realistic journal options, checking indexing status and fit so you submit to the right venue the first time.",
  },
  {
    question: "Which reference styles do you support?",
    answer:
      "APA, IEEE, Vancouver, Nature, and most journal-specific templates, along with library management in EndNote, Zotero, and Mendeley.",
  },
  {
    question: "Will my research remain confidential?",
    answer:
      "Always. Every project is treated as strictly confidential, and materials are shared only between us unless you request otherwise.",
  },
  {
    question: "Can you format papers according to journal guidelines?",
    answer:
      "Yes. I format manuscripts to match the exact author guidelines of your target journal, including structure, citation style, and figure or table presentation.",
  },
];

/* ------------------------------------------------------------------ */
/* Small Components                                                   */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow__line" />
      {children}
    </div>
  );
}

function Counter({ value, suffix, isInView }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let raf;
    const duration = 1400;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value]);

  return (
    <span className="counter-value">
      {display}
      {suffix}
    </span>
  );
}

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="faq-item">
      <button onClick={onToggle} className="faq-item__trigger">
        <span className="faq-item__question">{item.question}</span>
        <span
          className={`faq-item__icon ${isOpen ? "faq-item__icon--open" : ""}`}
        >
          <ChevronDown size={16} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="faq-item__content-wrapper"
          >
            <p className="faq-item__answer">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ResearchConsultingPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    area: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // function handleSubmit(e) {
  //   e.preventDefault();
  //   setSubmitted(true);
  // }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);

        setFormData({
          name: "",
          email: "",
          phone: "",
          area: "",
          service: "",
          message: "",
        });
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  }

  return (
    <main className="consulting-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="back-button-container">
          <Link href="/#about">
            <button className="back-button" title="Back to Home">
              <IoIosArrowBack className="back-button__icon" />
            </button>
          </Link>
        </div>
        <div className="hero-grid-bg" />
        <div className="hero-blur-effect" />

        <div className="hero-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="hero-content"
          >
            <div className="badge1 ">
              <FlaskConical size={14} />
              Professional Research Consulting
            </div>

            <h1 className="hero-title1">
              Research Consulting
              <span className="hero-title1__highlight">Services</span>
            </h1>

            <p className="hero-description">
              Professional support for researchers, academicians, students, and
              professionals to improve the quality, presentation, and
              publication success of their research.
            </p>

            <div className="hero-actions">
              <a href="#contact" className="btn btn--primary">
                Book Consultation
                <ArrowRight size={16} className="btn__arrow" />
              </a>
              <a href="#services" className="btn btn--secondary">
                Explore Services
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="hero-illustration"
          >
            <div className="illustration-bg" />
            <svg viewBox="0 0 400 400" className="illustration-svg" fill="none">
              <circle
                cx="200"
                cy="200"
                r="150"
                stroke="#BFDBFE"
                strokeWidth="1.5"
              />
              <circle
                cx="200"
                cy="200"
                r="105"
                stroke="#93C5FD"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />
              <rect
                x="130"
                y="120"
                width="140"
                height="180"
                rx="10"
                fill="white"
                stroke="#1D4ED8"
                strokeWidth="2"
              />
              <line
                x1="150"
                y1="150"
                x2="250"
                y2="150"
                stroke="#1D4ED8"
                strokeWidth="2"
              />
              <line
                x1="150"
                y1="170"
                x2="250"
                y2="170"
                stroke="#93C5FD"
                strokeWidth="2"
              />
              <line
                x1="150"
                y1="190"
                x2="220"
                y2="190"
                stroke="#93C5FD"
                strokeWidth="2"
              />
              <line
                x1="150"
                y1="220"
                x2="250"
                y2="220"
                stroke="#93C5FD"
                strokeWidth="2"
              />
              <line
                x1="150"
                y1="240"
                x2="230"
                y2="240"
                stroke="#93C5FD"
                strokeWidth="2"
              />
              <line
                x1="150"
                y1="260"
                x2="250"
                y2="260"
                stroke="#93C5FD"
                strokeWidth="2"
              />
              <circle cx="290" cy="110" r="26" fill="#1D4ED8" />
              <path
                d="M280 110l7 7 14-14"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="105" cy="290" r="20" fill="#38BDF8" opacity="0.85" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="services-section">
        <div className="section-header">
          <Eyebrow>What I Offer</Eyebrow>
          <h2 className="section-title">Research Consulting Services</h2>
          <p className="section-subtitle">
            Five focused services, each built around a single stage of getting
            your research publication-ready.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="service-card"
              >
                <span className="service-card__index">{service.index}</span>
                <div className="service-card__icon-box">
                  <Icon size={22} />
                </div>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__desc">{service.description}</p>
                <ul className="service-card__features">
                  {service.features.map((f) => (
                    <li key={f} className="service-card__feature-item">
                      <span className="service-card__bullet" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="service-card__link">
                  Book Consultation
                  <ArrowRight size={14} className="service-card__link-arrow" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="why-choose-section">
        <div className="why-choose-container">
          <div className="section-header">
            <Eyebrow>Why Work With Me</Eyebrow>
            <h2 className="section-title">Why Choose My Consulting</h2>
          </div>

          <div className="why-choose-grid">
            {whyChoose.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
                  className="why-card"
                >
                  <div className="why-card__icon-box">
                    <Icon size={20} />
                  </div>
                  <p className="why-card__title">{item.title}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="process-section">
        <div className="section-header">
          <Eyebrow>How It Works</Eyebrow>
          <h2 className="section-title">Work Process</h2>
        </div>

        <div className="process-timeline">
          <div className="process-timeline__line" />
          <div className="process-steps-container">
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className={`process-step ${isEven ? "process-step--left" : "process-step--right"}`}
                >
                  <div className="process-step__icon-box">
                    <Icon size={18} />
                  </div>
                  <div className="process-step__content">
                    <span className="process-step__number">Step {i + 1}</span>
                    <h3 className="process-step__title">{step.title}</h3>
                    <p className="process-step__desc">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      {/* <section ref={statsRef} className="stats-section">
        <div className="stats-grid-bg" />
        <div className="stats-container">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-box">
              <Counter value={stat.value} suffix={stat.suffix} isInView={statsInView} />
              <p className="stat-box__label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* FAQ SECTION */}
      <section className="faq-section">
        <div className="section-header">
          <Eyebrow>Questions</Eyebrow>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>

        <div className="faq-list">
          {faqs.map((item, i) => (
            <FaqItem
              key={item.question}
              item={item}
              isOpen={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
            />
          ))}
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="cta-section">
        <Quote className="cta-section__quote-bg" />
        <div className="cta-container">
          <h2 className="cta-title">Need Professional Research Support?</h2>
          <p className="cta-desc">
            Let&apos;s discuss your research project and find the best solution
            for your academic or publication needs.
          </p>
          <div className="cta-actions">
            <a href="#contact" className="btn btn--cta-white">
              Book Consultation
            </a>
            <a href="#contact" className="btn btn--cta-outline">
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section id="contact" className="contact-section">
        <div className="section-header">
          <Eyebrow>Get In Touch</Eyebrow>
          <h2 className="section-title">Start Your Consultation</h2>
          <p className="section-subtitle">
            Fill in a few details and I&apos;ll get back to you with next steps.
          </p>
        </div>

        <div className="contact-box">
          {submitted ? (
            <div className="success-message">
              <CheckCircle2 className="success-message__icon" size={40} />
              <h3 className="success-message__title">
                Thank you for reaching out
              </h3>
              <p className="success-message__desc">
                Your message has been received. I&apos;ll be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name" className="form-group__label">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="form-group__input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-group__label">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="form-group__input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-group__label">
                  Contact Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="number"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="form-group__input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="area" className="form-group__label">
                  Research Area
                </label>
                <input
                  id="area"
                  name="area"
                  type="text"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. Molecular Biology"
                  className="form-group__input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="service" className="form-group__label">
                  Select Service
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="form-group__select"
                >
                  <option value="">Choose a service</option>
                  <option value="manuscript-editing">Manuscript Editing</option>
                  <option value="paper-formatting">
                    Research Paper Formatting
                  </option>
                  <option value="thesis-proofreading">
                    Thesis Proofreading
                  </option>
                  <option value="reference-management">
                    Reference Management
                  </option>
                  <option value="journal-selection">Journal Selection</option>
                </select>
              </div>

              <div className="form-group form-group--full-width">
                <label htmlFor="message" className="form-group__label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me a little about your project..."
                  className="form-group__textarea"
                />
              </div>

              <button type="submit" className="btn btn--submit">
                Submit
                <ArrowRight size={16} className="btn__arrow" />
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
