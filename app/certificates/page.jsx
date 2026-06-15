'use client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { IoIosArrowBack } from "react-icons/io";
// import { useState } from 'react'
// import { FaAngleDown } from "react-icons/fa6";
// import { FaChevronUp } from "react-icons/fa";

const certificates = [
  {
    image: '/assets/certificates/cer-images/cer1.png',
    name: 'Research Problem Formulation Webinar',
    year: '18 Dec 2021',
    issuer: 'Research Graduate',

    file: 'assets/certificates/cer-pdf/cer1.pdf'
  },
  {
    image: 'assets/certificates/cer-images/cer2.png',
    name: 'National Voters Day Participation',
    year: '19 January 2022',
    issuer: 'Bell IHMCT',

    file: 'assets/certificates/cer-pdf/cer2.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer3.png',
    name: 'Emerging Innovations in Biotechnology',
    year: '22 December 2021',
    issuer: 'MS University',

    file: 'assets/certificates/cer-pdf/cer3.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer5.png',
    name: 'Artificial Intelligence Webinar 5',
    year: '17 Dec 2021',
    issuer: 'Aristocrat Research',

    file: 'assets/certificates/cer-pdf/cer5.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer6.png',
    name: 'Chemical Sciences e-Conference',
    year: '28 Apr 2022',
    issuer: 'Indira Gandhi Kala Mahavidyalaya',

    file: 'assets/certificates/cer-pdf/cer6.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer7.png',
    name: 'Environmental Conference',
    year: 'Jun 2022',
    issuer: 'Jai Narain Vyas University',

    file: 'assets/certificates/cer-pdf/cer7.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer8.png',
    name: 'Diversity in Science Webinar',
    year: '16 Feb 2022',
    issuer: 'Kamla Nehru Mahavidyalaya',

    file: 'assets/certificates/cer-pdf/cer8.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer9.png',
    name: 'National Science Quiz',
    year: '24 Jul 2022',
    issuer: 'Chaudhary Charan Singh University',

    file: 'assets/certificates/cer-pdf/cer9.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer10.png',
    name: 'Data Collection Workshop',
    year: '25 Dec 2021',
    issuer: 'Research Foundation of India',

    file: 'assets/certificates/cer-pdf/cer10.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer11.png',
    name: 'Nanoparticles Workshop',
    year: '11 Feb 2022',
    issuer: 'Poddar International College',

    file: 'assets/certificates/cer-pdf/cer11.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer12.png',
    name: 'IP Rights Workshop',
    year: '12 Jan 2022',
    issuer: 'Poddar International College',

    file: 'assets/certificates/cer-pdf/cer12.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer13.png',
    name: 'Environmental Conference',
    year: 'Jun 2023',
    issuer: 'Jai Narain Vyas University',

    file: 'assets/certificates/cer-pdf/cer13.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer15.png',
    name: 'Feminism Conference',
    year: '13 Jan 2023',
    issuer: 'Research Foundation of India',

    file: 'assets/certificates/cer-pdf/cer15.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer16.png',
    name: 'Environmental & Agricultural Sciences Conference',
    year: '22–24 Jan 2023',
    issuer: 'Voice of Indian Concern for Environment',

    file: 'assets/certificates/cer-pdf/cer16.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer17.png',
    name: 'Chemistry Conference Presentation',
    year: '19–21 Dec 2024',
    issuer: 'Indian Chemical Society',

    file: 'assets/certificates/cer-pdf/cer17.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer19.png',
    name: 'Variables & Hypotheses Webinar',
    year: '01 Jan 2022',
    issuer: 'Research Graduate',

    file: 'assets/certificates/cer-pdf/cer19.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer20.png',
    name: 'SFM-2021 Conference',
    year: '29–30 Nov 2021',
    issuer: 'Kalasalingam Academy of Research and Education (KARE)',

    file: 'assets/certificates/cer-pdf/cer20.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer21.png',
    name: 'Research Problem Formulation Webinar',
    year: '25 Dec 2021',
    issuer: 'Research Graduate',

    file: 'assets/certificates/cer-pdf/cer21.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer23.png',
    name: 'Environmental Conservation Conference',
    year: '5–6 Jun 2022',
    issuer: 'Jai Narain Vyas University (JNVU), Jodhpur',

    file: 'assets/certificates/cer-pdf/cer23.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer24.png',
    name: 'Educational Virtual Visit',
    year: '07 Feb 2022',
    issuer: 'Poddar International College, Jaipur',

    file: 'assets/certificates/cer-pdf/cer24.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer25.png',
    name: 'Intellectual Property Rights Seminar',
    year: '22 Apr 2025',
    issuer: 'Amity University, Madhya Pradesh',

    file: 'assets/certificates/cer-pdf/cer25.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer26.png',
    name: 'Nanoparticles Seminar',
    year: '11 Feb 2022',
    issuer: 'Poddar International College, Jaipur',

    file: 'assets/certificates/cer-pdf/cer26.pdf'
  },
  // {
  //   image: '/assets/certificates/cer-images/cer27.png',
  //   name: '[Name of certificate]',
  //   year: '2019',
  //   issuer: '[issuer name]',
  //   category: 'participation',
  //   file: 'assets/certificates/cer-pdf/cer27.pdf'
  // },
  {
    image: '/assets/certificates/cer-images/cer28.png',
    name: 'Research Proposal Writing Webinar',
    year: '12 Dec 2021',
    issuer: 'Research Graduate',

    file: 'assets/certificates/cer-pdf/cer28.pdf'
  },
  {
    image: '/assets/certificates/cer-images/cer29.png',
    name: 'High Impact Research Writing Workshop',
    year: '18 Dec 2021',
    issuer: 'Aristocrat Research',

    file: 'assets/certificates/cer-pdf/cer29.pdf'
  },


  {
    image: '/assets/certificates/cer-images/cer4.png',
    name: 'Young Scientist Award (Oral Presentation)',
    year: '21 Dec 2024',
    issuer: 'Indian Chemical Society',
    category: 'exam',
    file: 'assets/certificates/cer-pdf/cer4.pdf'
  },
  // {
  //   image: '/assets/certificates/cer-images/cer4.png',
  //   name: '[Name of certificate]',
  //   year: '2020',
  //   issuer: '[issuer name]',
  //   category: 'exam',
  //   file: 'assets/certificates/cer-pdf/cer14.pdf'
  // },

  // {
  //   image: '/assets/certificates/cer-images/cer18.png',
  //   name: '[Name of certificate]',
  //   year: '2025',
  //   issuer: '[issuer name]',
  //   category: 'award',
  //   file: 'assets/certificates/cer-pdf/cer18.pdf'
  // },
  {
    image: '/assets/certificates/cer-images/cer22.png',
    name: 'Climate Change Webinar',
    year: '17 Dec 2021',
    issuer: 'Nanoland',
    category: 'award',
    file: 'assets/certificates/cer-pdf/cer22.pdf'
  },
  // {
  //   image: '/assets/certificates/cer-images/cer30.png',
  //   name: '[Name of certificate]',
  //   year: '2022',
  //   issuer: '[issuer name]',
  //   category: 'workshop',
  //   file: 'assets/certificates/cer-pdf/cer30.pdf'
  // },
]

// const filters = [
//   { label: 'All', value: 'all' },
//   { label: 'participations', value: 'participation' },
//   { label: 'Exams', value: 'exam' },
//   { label: 'Workshops', value: 'workshop' },
//   { label: 'Awards', value: 'award' },
// ]



export default function Certificates() {
  // const [activeFilter, setActiveFilter] = useState('all')

  // const filtered = certificates.filter(
  //   c => activeFilter === 'all' || c.category === activeFilter
  // )

  // const [openSection, setOpenSection] = useState('participation')

  // const certificateGroups = [
  //   {
  //     title: 'Certificates of Participation',
  //     key: 'participation',
  //   },
  //   {
  //     title: 'Certificates of Appreciation',
  //     key: 'exam',
  //   },
  //   {
  //     title: 'Name of Category 3',
  //     key: 'award',
  //   },
  //   {
  //     title: 'Name of Category 4',
  //     key: 'workshop',
  //   },
  // ]



  return (
    <>

      {/* <Navbar /> */}
      {/* <nav className="np-breadcrumb" aria-label="Breadcrumb">
        <Link href="/#certificates">
          <IoIosArrowBack className='back-arrow' />
        </Link>
        <span className="np-breadcrumb__current">Certificates</span>
      </nav> */}
      <Link href="/">
        <button className='Back-btn' title='Back to Home'>
          <IoIosArrowBack className='back-arrow' />
        </button>
      </Link>

      <section id="certificates" style={{ background: 'var(--section-bg)' }}>
        <div className="section-inner">
          {/* <button className='Back-btn'>
            <Link href="/#certificates">BACK</Link>
          </button> */}
          <div className="section-label">Credentials &amp; Certifications</div>
          <h2 className="section-title">Professional Credentials</h2>
          <p className="section-sub">A curated collection of certifications, workshops, and research activities that reflect academic excellence, continuous learning, and professional growth.</p>

          <div className="cert-grid">

            {certificates.map((cert, i) => (
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
      </section>
    </>
  )
}



