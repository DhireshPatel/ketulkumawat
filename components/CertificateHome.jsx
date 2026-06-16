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
  // { icon: '📐', name: 'GATE Chemistry', year: '2016', issuer: 'IIT / IISC — Graduate Aptitude Test', category: 'exam', file: 'assets/certificates/gate.pdf' },
  // { icon: '🎓', name: 'CGSET Certificate', year: '2020', issuer: 'Chhattisgarh State Eligibility Test', category: 'exam', file: 'assets/certificates/cgset.pdf' },
  // { icon: '🏅', name: 'Young Scientist Award — ICS', year: '2025', issuer: 'Indian Chemical Society', category: 'award', file: 'assets/certificates/ics-young-scientist-2025.pdf' },
  // { icon: '📜', name: 'Patent Certificate', year: '2023', issuer: 'Indian Patent Office', category: 'award', file: 'assets/certificates/patent.pdf' },
  // { icon: '🧪', name: 'Workshop on Advanced Spectroscopy', year: '2022', issuer: 'IIT / National Institute', category: 'workshop', file: 'assets/certificates/workshop-spectroscopy.pdf' },
]

// const filters = [
//   { label: 'All', value: 'all' },
//   { label: 'Fellowships', value: 'fellowship' },
//   { label: 'Exams', value: 'exam' },
//   { label: 'Workshops', value: 'workshop' },
//   { label: 'Awards', value: 'award' },
// ]

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

        {/* <div className="cert-filters">
          {filters.map(f => (
            <button
              key={f.value}
              className={`cert-filter${activeFilter === f.value ? ' active' : ''}`}
              onClick={() => setActiveFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div> */}


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
                {/* <a href={cert.file} download className="cert-dl">⬇ Download</a> */}
              </div>
            </div>
          ))}
        </div>

        {/* <Link href="/certificates">View all</Link> */}
        <ViewAllButton
          href='/certificates'
        />



        {/* <div className="cert-download-all">
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>
            📁 All certificates are available as individual PDF files
          </p>
          <a href="assets/certificates/" className="btn-primary" download>⬇ Browse All Certificates</a>
        </div> */}
      </div>
    </section>
  )
}

