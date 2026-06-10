'use client'
import { useState } from 'react'
import Navbar from './Navbar'

const certificates = [
  {
    image: '/assets/certificates/cer-images/cer1.png',
    name: 'DST INSPIRE Fellowship',
    year: '2013',
    issuer: 'Dept. of Science & Technology, Govt. of India',
    category: 'fellowship',
    file: 'assets/certificates/dst-inspire-2013.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer1.png',
    name: 'CSIR NET JRF Certificate',
    year: '2017',
    issuer: 'Council of Scientific & Industrial Research',
    category: 'fellowship',
    file: 'assets/certificates/csir-jrf.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer1.png',
    name: 'CSIR NET SRF Certificate',
    year: '2019',
    issuer: 'Council of Scientific & Industrial Research',
    category: 'fellowship',
    file: 'assets/certificates/csir-srf.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer1.png',
    name: 'GATE Chemistry',
    year: '2016',
    issuer: 'IIT / IISC — Graduate Aptitude Test',
    category: 'exam',
    file: 'assets/certificates/gate.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer1.png',
    name: 'CGSET Certificate',
    year: '2020',
    issuer: 'Chhattisgarh State Eligibility Test',
    category: 'exam',
    file: 'assets/certificates/cgset.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer1.png',
    name: 'Young Scientist Award — ICS',
    year: '2025',
    issuer: 'Indian Chemical Society',
    category: 'award',
    file: 'assets/certificates/ics-young-scientist-2025.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer1.png',
    name: 'Patent Certificate',
    year: '2023', issuer: 'Indian Patent Office',
    category: 'award',
    file: 'assets/certificates/patent.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer1.png',
    name: 'Workshop on Advanced Spectroscopy',
    year: '2022',
    issuer: 'IIT / National Institute',
    category: 'workshop',
    file: 'assets/certificates/workshop-spectroscopy.pdf'
  },
]

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Fellowships', value: 'fellowship' },
  { label: 'Exams', value: 'exam' },
  { label: 'Workshops', value: 'workshop' },
  { label: 'Awards', value: 'award' },
]

export default function Certificates() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = certificates.filter(
    c => activeFilter === 'all' || c.category === activeFilter
  )

  return (
    <>

      <Navbar />
      <section id="certificates" style={{ background: 'var(--section-bg)' }}>
        <div className="section-inner">
          <button>
            <a href="/">BACK</a>
          </button>
          <div className="section-label">Credentials &amp; Certifications</div>
          <h2 className="section-title">30+ Certificates</h2>
          <p className="section-sub">A collection of certificates earned across competitive examinations, fellowships, workshops, and research achievements.</p>

          <div className="cert-filters">
            {filters.map(f => (
              <button
                key={f.value}
                className={`cert-filter${activeFilter === f.value ? ' active' : ''}`}
                onClick={() => setActiveFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

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
                  <a href={cert.file} target="_blank" className="cert-view" rel="noopener">👁 View PDF</a>
                  <a href={cert.file} download className="cert-dl">⬇ Download</a>
                </div>
              </div>
            ))}
          </div>

          <div className="cert-download-all">
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>
              📁 All certificates are available as individual PDF files
            </p>
            <a href="assets/certificates/" className="btn-primary" download>⬇ Browse All Certificates</a>
          </div>
        </div>
      </section>
    </>
  )
}






// 'use client'
// import { useState, useEffect } from 'react'

// const ITEMS_PER_PAGE = 9

// const certificates = [
//   {
//     image: '/assets/certificates/cert1.jpg',
//     name: 'DST INSPIRE Fellowship',
//     year: '2013',
//     issuer: 'Govt. of India',
//     category: 'fellowship',
//     file: '/assets/certificates/cert1.pdf',
//   },

//   {
//     image: '/assets/certificates/cert2.jpg',
//     name: 'CSIR NET JRF',
//     year: '2017',
//     issuer: 'CSIR',
//     category: 'exam',
//     file: '/assets/certificates/cert2.pdf',
//   },
//   {
//     image: '/assets/certificates/cert1.jpg',
//     name: 'DST INSPIRE Fellowship',
//     year: '2013',
//     issuer: 'Govt. of India',
//     category: 'fellowship',
//     file: '/assets/certificates/cert1.pdf',
//   },

//   {
//     image: '/assets/certificates/cert2.jpg',
//     name: 'CSIR NET JRF',
//     year: '2017',
//     issuer: 'CSIR',
//     category: 'exam',
//     file: '/assets/certificates/cert2.pdf',
//   },
//   {
//     image: '/assets/certificates/cert1.jpg',
//     name: 'DST INSPIRE Fellowship',
//     year: '2013',
//     issuer: 'Govt. of India',
//     category: 'fellowship',
//     file: '/assets/certificates/cert1.pdf',
//   },

//   {
//     image: '/assets/certificates/cert2.jpg',
//     name: 'CSIR NET JRF',
//     year: '2017',
//     issuer: 'CSIR',
//     category: 'exam',
//     file: '/assets/certificates/cert2.pdf',
//   },
//   {
//     image: '/assets/certificates/cert1.jpg',
//     name: 'DST INSPIRE Fellowship',
//     year: '2013',
//     issuer: 'Govt. of India',
//     category: 'fellowship',
//     file: '/assets/certificates/cert1.pdf',
//   },

//   {
//     image: '/assets/certificates/cert2.jpg',
//     name: 'CSIR NET JRF',
//     year: '2017',
//     issuer: 'CSIR',
//     category: 'exam',
//     file: '/assets/certificates/cert2.pdf',
//   },
//   {
//     image: '/assets/certificates/cert1.jpg',
//     name: 'DST INSPIRE Fellowship',
//     year: '2013',
//     issuer: 'Govt. of India',
//     category: 'fellowship',
//     file: '/assets/certificates/cert1.pdf',
//   },

//   {
//     image: '/assets/certificates/cert2.jpg',
//     name: 'CSIR NET JRF',
//     year: '2017',
//     issuer: 'CSIR',
//     category: 'exam',
//     file: '/assets/certificates/cert2.pdf',
//   },
//   {
//     image: '/assets/certificates/cert1.jpg',
//     name: 'DST INSPIRE Fellowship',
//     year: '2013',
//     issuer: 'Govt. of India',
//     category: 'fellowship',
//     file: '/assets/certificates/cert1.pdf',
//   },

//   {
//     image: '/assets/certificates/cert2.jpg',
//     name: 'CSIR NET JRF',
//     year: '2017',
//     issuer: 'CSIR',
//     category: 'exam',
//     file: '/assets/certificates/cert2.pdf',
//   },

//   // ... 30 certificates
// ]

// const filters = [
//   { label: 'All', value: 'all' },
//   { label: 'Fellowships', value: 'fellowship' },
//   { label: 'Exams', value: 'exam' },
//   { label: 'Workshops', value: 'workshop' },
//   { label: 'Awards', value: 'award' },
// ]


// export default function Certificates() {

//   const [activeFilter, setActiveFilter] = useState('all')
//   const [currentPage, setCurrentPage] = useState(1)

//   const filteredCertificates =
//     activeFilter === 'all'
//       ? certificates
//       : certificates.filter(
//         cert => cert.category === activeFilter
//       )

//   const totalPages = Math.ceil(
//     filteredCertificates.length / ITEMS_PER_PAGE
//   )

//   const currentCertificates =
//     filteredCertificates.slice(
//       (currentPage - 1) * ITEMS_PER_PAGE,
//       currentPage * ITEMS_PER_PAGE
//     )

//   useEffect(() => {
//     setCurrentPage(1)
//   }, [activeFilter])

//   return (
//     <section id="certificates">

//       <div className="section-inner">

//         <div className="section-label">
//           Credentials & Certifications
//         </div>

//         <h2 className="section-title">
//           30+ Certificates
//         </h2>

//         <p className="section-sub">
//           Academic achievements, fellowships,
//           examinations and workshops.
//         </p>

//         {/* FILTERS */}

//         <div className="cert-filters">

//           <button
//             onClick={() => setActiveFilter('all')}
//             className={activeFilter === 'all'
//               ? 'cert-filter active'
//               : 'cert-filter'}
//           >
//             All Certificates
//           </button>

//           <button
//             onClick={() => setActiveFilter('exam')}
//             className={activeFilter === 'exam'
//               ? 'cert-filter active'
//               : 'cert-filter'}
//           >
//             Exams
//           </button>

//           <button
//             onClick={() => setActiveFilter('award')}
//             className={activeFilter === 'award'
//               ? 'cert-filter active'
//               : 'cert-filter'}
//           >
//             Awards
//           </button>

//           <button
//             onClick={() => setActiveFilter('workshop')}
//             className={activeFilter === 'workshop'
//               ? 'cert-filter active'
//               : 'cert-filter'}
//           >
//             Workshops
//           </button>

//           <button
//             onClick={() => setActiveFilter('fellowship')}
//             className={activeFilter === 'fellowship'
//               ? 'cert-filter active'
//               : 'cert-filter'}
//           >
//             Fellowships
//           </button>

//         </div>

//         {/* GRID */}

//         <div className="cert-grid">

//           {currentCertificates.map((cert, index) => (

//             <div
//               className="cert-card"
//               key={index}
//             >

//               <div className="cert-image">

//                 <img
//                   src={cert.image}
//                   alt={cert.name}
//                 />

//               </div>

//               <div className="cert-content">

//                 <div className="cert-name">
//                   {cert.name}
//                 </div>

//                 <div className="cert-issuer">
//                   {cert.issuer}
//                 </div>

//                 <div className="cert-year">
//                   {cert.year}
//                 </div>

//                 <a
//                   href={cert.file}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="cert-view"
//                 >
//                   View Certificate
//                 </a>

//               </div>

//             </div>

//           ))}

//         </div>

//         {/* PAGINATION */}

//         <div className="pagination">

//           <button
//             disabled={currentPage === 1}
//             onClick={() =>
//               setCurrentPage(prev => prev - 1)
//             }
//           >
//             ←
//           </button>

//           {[...Array(totalPages)].map((_, i) => (

//             <button
//               key={i}
//               onClick={() =>
//                 setCurrentPage(i + 1)
//               }
//               className={
//                 currentPage === i + 1
//                   ? 'page-btn active'
//                   : 'page-btn'
//               }
//             >
//               {i + 1}
//             </button>

//           ))}

//           <button
//             disabled={currentPage === totalPages}
//             onClick={() =>
//               setCurrentPage(prev => prev + 1)
//             }
//           >
//             →
//           </button>

//         </div>

//       </div>

//     </section>
//   )
// }
