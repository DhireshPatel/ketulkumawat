"use client";

import { useState } from "react";

const SERVICES = [
    {
        id: "data",
        title: "Research Data Analysis",
        description:
            "Analyze research datasets using statistical methods and present meaningful insights.",
        features: [
            "Statistical Analysis",
            "Data Interpretation",
            "Graphs & Charts",
            "Research Reports",
        ],
        icon: (
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 40V22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M18 40V14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M28 40V26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M38 40V8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M6 12L18 6L28 12L40 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "writing",
        title: "Scientific Writing",
        description:
            "Professional writing for journals, dissertations, conference papers and academic publications.",
        features: [
            "Research Articles",
            "Review Papers",
            "Technical Writing",
            "Academic Content",
        ],
        icon: (
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6H30L38 14V42H10V6Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M30 6V14H38" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M16 24H32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M16 31H32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M16 38H26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: "proofreading",
        title: "Proofreading",
        description:
            "Improve grammar, readability and consistency of scientific documents.",
        features: [
            "Grammar Check",
            "Formatting",
            "Language Improvement",
            "Final Proofreading",
        ],
        icon: (
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 8L40 18L18 40L6 42L8 30L30 8Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M25 13L35 23" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: "patent",
        title: "Patent Draft Support",
        description:
            "Professional support in preparing patent draft documentation.",
        features: [
            "Patent Structure",
            "Technical Description",
            "Claims Support",
            "Documentation Review",
        ],
        icon: (
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2.5" />
                <path d="M29 29L42 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M20 14V26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M14 20H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: "tutoring",
        title: "Chemistry Tutoring",
        description:
            "One-to-one chemistry tutoring for undergraduate, postgraduate and research students.",
        features: [
            "Organic Chemistry",
            "Physical Chemistry",
            "Inorganic Chemistry",
            "Exam Preparation",
        ],
        icon: (
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6H29" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M21 6V19L9 39C8 41 9.5 43 12 43H36C38.5 43 40 41 39 39L27 19V6" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M14 32H34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        ),
    },
];

const WHY_HIRE_ME = [
    { title: "Experienced Researcher", desc: "Years of hands-on academic and laboratory research experience." },
    { title: "Professional Scientific Writing", desc: "Clear, precise writing suited for peer-reviewed publication." },
    { title: "Reliable Communication", desc: "Prompt replies and transparent updates at every stage." },
    { title: "Confidential Projects", desc: "Your data and manuscripts are always handled with discretion." },
    { title: "Affordable Pricing", desc: "Fair, transparent rates for students and institutions alike." },
    { title: "On-Time Delivery", desc: "Deadlines are treated as commitments, not suggestions." },
    { title: "Client Satisfaction", desc: "Revisions and feedback loops until you are fully satisfied." },
    { title: "Quality Focus", desc: "Every deliverable is checked against academic rigor and accuracy." },
];

const PROCESS_STEPS = [
    { title: "Share Requirement", desc: "Tell me about your project, topic and goals." },
    { title: "Project Discussion", desc: "We discuss scope, references and expected outcome." },
    { title: "Receive Quote", desc: "A transparent quote based on scope and timeline." },
    { title: "Work Starts", desc: "Research, writing or analysis begins on schedule." },
    { title: "Review", desc: "You review the draft and share feedback." },
    { title: "Final Delivery", desc: "Polished, final work delivered on time." },
];

const WHO_CAN_HIRE = [
    "Students",
    "PhD Scholars",
    "Researchers",
    "Universities",
    "Colleges",
    "Academic Professionals",
    "Research Organizations",
    "Startups",
];

const FAQS = [
    {
        q: "What services do you provide?",
        a: "I provide research data analysis, scientific writing, proofreading, patent draft support and one-to-one chemistry tutoring for students and researchers.",
    },
    {
        q: "How do I hire you?",
        a: "Simply fill out the contact form below or click any \"Hire Me\" button, share your requirement, and I will get back to you with a quote.",
    },
    {
        q: "How long does a project take?",
        a: "Timelines vary by scope. Most proofreading tasks take 1-3 days, while writing and analysis projects typically take 5-14 days.",
    },
    {
        q: "Do you maintain confidentiality?",
        a: "Yes, absolutely. All research data, manuscripts and personal information are treated as strictly confidential.",
    },
    {
        q: "Can you work on urgent projects?",
        a: "Yes, urgent and priority projects can be accommodated depending on current workload. Please mention your deadline when reaching out.",
    },
    {
        q: "How does payment work?",
        a: "Payment terms are agreed upon before work begins, typically as a milestone or upfront arrangement depending on project size.",
    },
];

function IconCheck() {
    return (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="hm-check">
            <circle cx="10" cy="10" r="10" fill="var(--gold)" opacity="0.15" />
            <path d="M6 10.5L8.5 13L14 7" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function HireMePage() {
    const [openFaq, setOpenFaq] = useState(0);
    const [form, setForm] = useState({
        name: "",
        email: "",
        projectType: "",
        service: "",
        budget: "",
        deadline: "",
        description: "",
    });
    const [submitted, setSubmitted] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
    }

    function scrollToId(id) {
        if (typeof document !== "undefined") {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }
    }

    return (
        <main className="hm-root">
            {/* 1. HERO */}
            <section className="hm-hero">
                <div className="hm-hero-inner">
                    <div className="hm-hero-text">
                        <span className="hm-eyebrow">Available for Freelance Projects</span>
                        <h1 className="hm-hero-title">Hire Me</h1>
                        <p className="hm-hero-para">
                            Professional research, scientific writing, data analysis, proofreading,
                            patent drafting support, and chemistry tutoring tailored to your
                            academic and research needs.
                        </p>
                        <div className="hm-hero-actions">
                            <button className="hm-btn hm-btn-primary" onClick={() => scrollToId("hm-contact")}>
                                Hire Me
                            </button>
                            <button className="hm-btn hm-btn-outline" onClick={() => scrollToId("hm-services")}>
                                View Services
                            </button>
                        </div>
                    </div>

                    <div className="hm-hero-visual" aria-hidden="true">
                        <svg viewBox="0 0 420 420" className="hm-hero-svg" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="210" cy="210" r="180" fill="var(--section-bg)" />
                            <circle cx="210" cy="210" r="180" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="2 6" />
                            <rect x="120" y="150" width="120" height="150" rx="6" fill="var(--card-bg)" stroke="var(--border)" strokeWidth="1.5" />
                            <rect x="140" y="175" width="80" height="6" rx="3" fill="var(--gold)" opacity="0.5" />
                            <rect x="140" y="192" width="80" height="6" rx="3" fill="var(--brown)" opacity="0.3" />
                            <rect x="140" y="209" width="55" height="6" rx="3" fill="var(--brown)" opacity="0.3" />
                            <path d="M250 260 L250 320 Q250 335 265 335 Q280 335 280 320 L280 260 Z" fill="none" stroke="var(--gold)" strokeWidth="2.5" />
                            <path d="M245 260 L285 260" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M255 295 L275 295 L280 320 Q280 330 265 330 Q250 330 250 320 Z" fill="var(--gold-light)" opacity="0.35" />
                            <circle cx="150" cy="120" r="5" fill="var(--gold)" />
                            <circle cx="290" cy="150" r="4" fill="var(--brown)" opacity="0.5" />
                            <circle cx="300" cy="280" r="6" fill="var(--gold-light)" opacity="0.6" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* 2. SERVICES */}
            <section className="hm-section hm-section-alt" id="hm-services">
                <div className="hm-container">
                    <p className="hm-kicker">Freelance Services</p>
                    <h2 className="hm-section-title">What I Can Do For You</h2>
                    <div className="hm-services-grid">
                        {SERVICES.map((s) => (
                            <div className="hm-service-card" key={s.id}>
                                <div className="hm-service-icon">{s.icon}</div>
                                <h3 className="hm-service-title">{s.title}</h3>
                                <p className="hm-service-desc">{s.description}</p>
                                <ul className="hm-feature-list">
                                    {s.features.map((f) => (
                                        <li key={f}>
                                            <IconCheck />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button className="hm-btn hm-btn-ghost" onClick={() => scrollToId("hm-contact")}>
                                    Hire Me
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. WHY HIRE ME */}
            <section className="hm-section">
                <div className="hm-container">
                    <p className="hm-kicker">Why Hire Me</p>
                    <h2 className="hm-section-title">Built On Trust &amp; Rigor</h2>
                    <div className="hm-why-grid">
                        {WHY_HIRE_ME.map((item) => (
                            <div className="hm-why-card" key={item.title}>
                                <h3 className="hm-why-title">{item.title}</h3>
                                <p className="hm-why-desc">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. WORK PROCESS */}
            <section className="hm-section hm-section-alt">
                <div className="hm-container">
                    <p className="hm-kicker">Work Process</p>
                    <h2 className="hm-section-title">How We'll Work Together</h2>
                    <div className="hm-timeline">
                        {PROCESS_STEPS.map((step, idx) => (
                            <div className="hm-timeline-item" key={step.title}>
                                <div className="hm-timeline-marker">
                                    <span>{String(idx + 1).padStart(2, "0")}</span>
                                </div>
                                <div className="hm-timeline-content">
                                    <h3>{step.title}</h3>
                                    <p>{step.desc}</p>
                                </div>
                                {idx < PROCESS_STEPS.length - 1 && <div className="hm-timeline-line" aria-hidden="true" />}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. WHO CAN HIRE ME */}
            <section className="hm-section">
                <div className="hm-container">
                    <p className="hm-kicker">Who Can Hire Me</p>
                    <h2 className="hm-section-title">Built For The Academic Community</h2>
                    <div className="hm-who-grid">
                        {WHO_CAN_HIRE.map((who) => (
                            <div className="hm-who-card" key={who}>
                                <span>{who}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. FAQ */}
            <section className="hm-section hm-section-alt">
                <div className="hm-container hm-container-narrow">
                    <p className="hm-kicker">FAQ</p>
                    <h2 className="hm-section-title">Frequently Asked Questions</h2>
                    <div className="hm-faq-list">
                        {FAQS.map((item, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div className={`hm-faq-item ${isOpen ? "hm-faq-open" : ""}`} key={item.q}>
                                    <button
                                        className="hm-faq-question"
                                        onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                                        aria-expanded={isOpen}
                                    >
                                        <span>{item.q}</span>
                                        <span className="hm-faq-icon">{isOpen ? "−" : "+"}</span>
                                    </button>
                                    {isOpen && <p className="hm-faq-answer">{item.a}</p>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 7. FINAL CTA */}
            <section className="hm-cta">
                <div className="hm-container hm-cta-inner">
                    <h2 className="hm-cta-title">Let's Work Together</h2>
                    <p className="hm-cta-para">
                        Ready to collaborate on your next research or academic project? Get in touch today.
                    </p>
                    <div className="hm-hero-actions hm-cta-actions">
                        <button className="hm-btn hm-btn-primary" onClick={() => scrollToId("hm-contact")}>
                            Hire Me
                        </button>
                        <button className="hm-btn hm-btn-outline hm-btn-outline-dark" onClick={() => scrollToId("hm-contact")}>
                            Contact Me
                        </button>
                    </div>
                </div>
            </section>

            {/* 8. CONTACT FORM */}
            <section className="hm-section" id="hm-contact">
                <div className="hm-container hm-container-narrow">
                    <p className="hm-kicker">Get In Touch</p>
                    <h2 className="hm-section-title">Start Your Project</h2>

                    {submitted ? (
                        <div className="hm-form-success">
                            Thank you! Your request has been noted. I will get back to you shortly.
                        </div>
                    ) : (
                        <form className="hm-form" onSubmit={handleSubmit}>
                            <div className="hm-form-row">
                                <div className="hm-form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Your full name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="hm-form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="hm-form-row">
                                <div className="hm-form-group">
                                    <label htmlFor="projectType">Project Type</label>
                                    <input
                                        id="projectType"
                                        name="projectType"
                                        type="text"
                                        placeholder="e.g. Dissertation, Data Analysis"
                                        value={form.projectType}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="hm-form-group">
                                    <label htmlFor="service">Select Service</label>
                                    <select id="service" name="service" value={form.service} onChange={handleChange}>
                                        <option value="">Choose a service</option>
                                        {SERVICES.map((s) => (
                                            <option value={s.title} key={s.id}>
                                                {s.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="hm-form-row">
                                <div className="hm-form-group">
                                    <label htmlFor="budget">Budget</label>
                                    <input
                                        id="budget"
                                        name="budget"
                                        type="text"
                                        placeholder="Approximate budget"
                                        value={form.budget}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="hm-form-group">
                                    <label htmlFor="deadline">Deadline</label>
                                    <input
                                        id="deadline"
                                        name="deadline"
                                        type="text"
                                        placeholder="Expected deadline"
                                        value={form.deadline}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="hm-form-group">
                                <label htmlFor="description">Project Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={5}
                                    placeholder="Tell me more about your project..."
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button type="submit" className="hm-btn hm-btn-primary hm-btn-full">
                                Submit
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
}
