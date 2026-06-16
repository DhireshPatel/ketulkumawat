'use client'
import { useState } from 'react'
import Link from 'next/link'
import ViewAllButton from './ViewAllButton'

const certificates = [
  {
    image: '/assets/certificates/cer-images/cer1.png',
    name: 'Research Problem Formulation Webinar',
    year: '18 December 2021',
    issuer: 'Research Graduate Organization',
    category: 'fellowship',
    file: 'assets/certificates/cer-pdf/cer1.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer4.png',
    name: 'Young Scientist Award – Oral Presentation',
    year: '21 December 2024',
    issuer: 'Indian Chemical Society',
    category: 'exam',
    file: 'assets/certificates/cer-pdf/cer4.pdf'
  },
  {
    image: 'assets/certificates/cer-images/cer2.png',
    name: 'Participation in National Voters Day',
    year: '19 January 2022',
    issuer: 'Bell IHMCT',
    category: 'fellowship',
    file: 'assets/certificates/cer-pdf/cer2.pdf'
  },
  {
    image: 'assets/certificates/cer-images/cer3.png',
    name: 'Emerging Innovations in Biotechnology',
    year: '22 December 2021',
    issuer: 'Manonmaniam Sundaranar University',
    category: 'fellowship',
    file: 'assets/certificates/cer-pdf/cer3.pdf'
  },
]


export default function CertificateHome() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = certificates.filter(
    c => activeFilter === 'all' || c.category === activeFilter
  )

  return (
    <section id="certificates" style={{ background: 'var(--section-bg)' }}>
      <div className="section-inner reveal">
        <div className="section-label">Credentials &amp; Certifications</div>
        <h2 className="section-title">Academic & Professional Certifications</h2>
        <p className="section-sub">A showcase of certifications, workshops, and research activities that reflect academic excellence and continuous professional growth.</p>


        <div className="cert-grid">
          {filtered.map((cert, i) => (
            <div className="cert-card reveal visible" key={i}>
              <div className="cert-image">
                <img
                  src={cert.image}
                  alt={cert.name}
                />
              </div>
              <div className="cert-name">{cert.name}</div>
              <div className="cert-year">{cert.year}</div>
              <div className="cert-issuer">{cert.issuer}</div>
              <div className="cert-actions">
                <a href={cert.file} target="_blank" className="cert-view" rel="noopener"> View Certificate</a>
              </div>
            </div>
          ))}
        </div>
        <ViewAllButton
          href='/certificates'
        />
      </div>
    </section>
  )
}

