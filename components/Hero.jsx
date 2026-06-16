'use client'
import { useState } from 'react'

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

import React from 'react'

const Hero = ({ onOpenLightbox }) => {
  const [imgError, setImgError] = useState(false)

  return (
    <div>
      <section className="hero" id="about">
        <div className="hero-noise"></div>
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-tag">✦ Researcher · Patent Holder · Young Scientist</div>
            <h1 className="hero-name">
              Dr. <em>Ketul Kumawat</em>
            </h1>
            <p className="hero-title">Doctorate in Chemical Sciences | Research & Innovation</p>
            <p className="hero-desc">
              Young Scientist and Chemical Sciences researcher dedicated to innovation, patents, and impactful academic research, committed to advancing scientific knowledge and education.
            </p>
            <div className="hero-badges">
              <span className="badge">ICS Young Scientist 2025</span>
              <span className="badge">Patent Innovator</span>
              <span className="badge">Research Author</span>
              <span className="badge">CSIR NET JRF &amp; SRF</span>
              <span className="badge">DST INSPIRE Fellow &apos;13</span>
              <span className="badge">GATE Qualified</span>
              <span className="badge">CGSET Qualified</span>
            </div>
            <div className="hero-ctas">
              {/* <a href="assets/resume.pdf" download className="btn-primary">⬇ Download Resume</a> */}
              <a
                href="assets/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                View CV
              </a>
              <a href="https://www.linkedin.com/in/dr-ketul-kumawat-3b3591181/" target="_blank" rel="noopener" className="btn-linkedin">
                <LinkedInIcon /> LinkedIn
              </a>
            </div>
          </div>

          <div className="hero-card">
            <div className="avatar-ring">
              <div className="avatar">
                {!imgError ? (
                  <img
                    className="face"
                    src="assets/photos/face.png"
                    onError={() => setImgError(true)}
                    alt="Dr. Ketul Kumawat"
                  />
                ) : (
                  <div className="face-fallback show">Dr.KK</div>
                )}
              </div>
            </div>
            <div className="card-name">Dr. KETUL KUMAWAT</div>
            <div className="card-sub">Chemical Science Researcher<br />Jai Narain Vyas University, Jodhpur</div>
            <div className="card-stats">
              <div className="stat-box">
                <div className="stat-num">3</div>
                <div className="stat-lbl">Patent</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">ICS</div>
                <div className="stat-lbl">Young Scientist &apos;25</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">PhD</div>
                <div className="stat-lbl">Research</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">25+</div>
                <div className="stat-lbl">Certifications</div>
              </div>
            </div>
            <div className="card-social">
              <a href="https://www.linkedin.com/in/dr-ketul-kumawat-3b3591181/" target="_blank" className="social-link li">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
              {/* <a href="assets/resume.pdf" download className="social-link resume">📄 Resume</a> (This is for download resume pdf) */}
              <a
                href="assets/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link resume"
              >
                Resume
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
