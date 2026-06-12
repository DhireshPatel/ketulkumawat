'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useState } from 'react'
import { FaAngleDown } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa";

const certificates = [
  {
    image: '/assets/certificates/cer-images/cer1.png',
    name: 'DST INSPIRE Fellowship',
    year: '2013',
    issuer: 'Dept. of Science & Technology, Govt. of India',
    category: 'fellowship',
    file: 'assets/certificates/cer-pdf/cer1.pdf'
  },
  {
    image: 'assets/certificates/cer-images/cer2.png',
    name: 'CSIR NET JRF Certificate',
    year: '2017',
    issuer: 'Council of Scientific & Industrial Research',
    category: 'fellowship',
    file: 'assets/certificates/cer-pdf/cer2.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer3.png',
    name: 'CSIR NET SRF Certificate',
    year: '2019',
    issuer: 'Council of Scientific & Industrial Research',
    category: 'fellowship',
    file: 'assets/certificates/cer-pdf/cer3.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer4.png',
    name: 'GATE Chemistry',
    year: '2016',
    issuer: 'IIT / IISC — Graduate Aptitude Test',
    category: 'exam',
    file: 'assets/certificates/cer-pdf/cer4.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer5.png',
    name: 'CGSET Certificate',
    year: '2020',
    issuer: 'Chhattisgarh State Eligibility Test',
    category: 'exam',
    file: 'assets/certificates/cer-pdf/cer5.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer6.png',
    name: 'Young Scientist Award — ICS',
    year: '2025',
    issuer: 'Indian Chemical Society',
    category: 'award',
    file: 'assets/certificates/cer-pdf/cer6.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer7.png',
    name: 'Patent Certificate',
    year: '2023', issuer: 'Indian Patent Office',
    category: 'award',
    file: 'assets/certificates/cer-pdf/cer7.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer8.png',
    name: 'Workshop on Advanced Spectroscopy',
    year: '2022',
    issuer: 'IIT / National Institute',
    category: 'workshop',
    file: 'assets/certificates/cer-pdf/cer8.pdf'
  },
]

// const filters = [
//   { label: 'All', value: 'all' },
//   { label: 'Fellowships', value: 'fellowship' },
//   { label: 'Exams', value: 'exam' },
//   { label: 'Workshops', value: 'workshop' },
//   { label: 'Awards', value: 'award' },
// ]



export default function Certificates() {
  // const [activeFilter, setActiveFilter] = useState('all')

  // const filtered = certificates.filter(
  //   c => activeFilter === 'all' || c.category === activeFilter
  // )

  const [openSection, setOpenSection] = useState('fellowship')

  const certificateGroups = [
    {
      title: 'Fellowships',
      key: 'fellowship',
    },
    {
      title: 'Competitive Exams',
      key: 'exam',
    },
    {
      title: 'Awards & Recognition',
      key: 'award',
    },
    {
      title: 'Workshops & Training',
      key: 'workshop',
    },
  ]



  return (
    <>

      {/* <Navbar /> */}
      {/* Breadcrumb */}
      <nav className="np-breadcrumb" aria-label="Breadcrumb">
        <a href="/#certificates">Home</a>
        {/* <span className="np-breadcrumb__sep" aria-hidden="true">›</span> */}
        <span className="np-breadcrumb__current">Certificates</span>
      </nav>

      <section id="certificates" style={{ background: 'var(--section-bg)' }}>
        <div className="section-inner">
          {/* <button className='Back-btn'>
            <Link href="/#certificates">BACK</Link>
          </button> */}
          <div className="section-label">Credentials &amp; Certifications</div>
          <h2 className="section-title">30+ Certificates</h2>
          <p className="section-sub">A collection of certificates earned across competitive examinations, fellowships, workshops, and research achievements.</p>

          <div className="cert-accordion">

            {certificateGroups.map((group) => {
              const groupCertificates = certificates.filter(
                cert => cert.category === group.key
              )

              return (
                <div
                  className="accordion-item"
                  key={group.key}
                  id={`section-${group.key}`}
                >

                  <button
                    className="accordion-header"
                    onClick={() => {

                      const isOpening = openSection !== group.key

                      setOpenSection(
                        isOpening ? group.key : null
                      )

                      if (isOpening) {
                        setTimeout(() => {
                          document
                            .getElementById(`section-${group.key}`)
                            ?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start'
                            })
                        }, 100)
                      }
                    }}
                  >
                    <span>
                      {group.title} ({groupCertificates.length})
                    </span>

                    <span>
                      {openSection === group.key ? <FaChevronUp /> : <FaAngleDown />}
                    </span>
                  </button>

                  <div
                    className={`accordion-content ${openSection === group.key ? 'open' : ''
                      }`}
                  >

                    <div>
                      <div className="cert-grid">

                        {groupCertificates.map((cert, i) => (
                          <div className="cert-card reveal visible" key={i}>

                            <div className="cert-image">
                              <img
                                src={cert.image}
                                alt={cert.name}
                              />
                            </div>

                            <div className="cert-name">
                              {cert.name}
                            </div>

                            <div className="cert-year">
                              {cert.year}
                            </div>

                            <div className="cert-issuer">
                              {cert.issuer}
                            </div>

                            <div className="cert-actions">
                              <a
                                href={cert.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cert-view"
                              >
                                View Certificate
                              </a>
                            </div>

                          </div>
                        ))}

                      </div>
                    </div>

                  </div>

                </div>
              )
            })}

          </div>

          {/* <div className="cert-grid">
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
                  <a href={cert.file} target="_blank" className="cert-view" rel="noopener"> View Certificates</a>
                </div>
              </div>
            ))}
          </div> */}

          {/* <div className="cert-download-all">
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>
              📁 All certificates are available as individual PDF files
            </p>
            <a href="assets/certificates/" className="btn-primary" download>⬇ Browse All Certificates</a>
          </div> */}
        </div>
      </section>
    </>
  )
}



