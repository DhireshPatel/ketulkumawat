const LinkedInIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
)

export default function Contact() {
    return (
        <section id="contact" style={{ background: 'var(--section-bg)' }}>
            <div className="section-inner">
                <div className="section-label">Get in Touch</div>
                <h2 className="section-title">Contact</h2>
                <div className="contact-block">
                    <div className="contact-info reveal">
                        <div className="contact-item">
                            <span className="contact-icon">🏛</span>
                            <div>
                                <div className="contact-label">Institution</div>
                                <div className="contact-value">Jai Narain Vyas University, Jodhpur, Rajasthan</div>
                            </div>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">📧</span>
                            <div>
                                <div className="contact-label">Email</div>
                                <div className="contact-value">
                                    <a href="mailto:ketulkumawat@gmail.com">ketulkumawat@gmail.com</a>
                                </div>
                            </div>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">💼</span>
                            <div>
                                <div className="contact-label">LinkedIn</div>
                                <div className="contact-value">
                                    <a href="https://www.linkedin.com/in/dr-ketul-kumawat" target="_blank" rel="noopener">
                                        linkedin.com/in/dr-ketul-kumawat
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">🔬</span>
                            <div>
                                <div className="contact-label">Specialization</div>
                                <div className="contact-value">Chemical Sciences, Research &amp; Education</div>
                            </div>
                        </div>
                    </div>
                    <div className="contact-cta reveal">
                        <div className="cta-card">
                            <h3>Open for Collaborations</h3>
                            <p>Research partnerships, invited lectures, academic collaborations, and mentorship opportunities.</p>
                            <div className="cta-buttons">
                                <a href="https://www.linkedin.com/in/dr-ketul-kumawat" target="_blank" rel="noopener" className="btn-linkedin">
                                    <LinkedInIcon /> Connect on LinkedIn
                                </a>
                                <a href="assets/resume.pdf" download className="btn-primary">⬇ Download Resume</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
