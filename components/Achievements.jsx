'use client'
import { useRef, useState, useEffect } from 'react'
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { RiAwardLine } from "react-icons/ri";
import { GrCertificate } from "react-icons/gr";
import { FaBookOpen } from "react-icons/fa";
import { TbMicroscope } from "react-icons/tb";
import { FaGraduationCap } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { BsFlask } from "react-icons/bs";
import { FaRegStar } from "react-icons/fa6";

const achievements = [
  {
    icon: <RiAwardLine />,
    title: 'ICS Young Scientist Award 2025',
    desc: 'Recognized by the Indian Chemical Society (ICS) for outstanding contribution and excellence in Chemical Sciences research and innovation.',
  },
  {
    icon: <GrCertificate />,
    title: 'Patent Holder',
    desc: 'Holder of patents in Chemical Sciences, reflecting innovative research, scientific problem-solving, and real-world applications.',
  },
  {
    icon: <FaBookOpen />,
    title: 'Research Author',
    desc: 'Published research work in scientific journals, contributing valuable insights and advancements in the field of Chemical Sciences.',
  },
  {
    icon: <TbMicroscope />,
    title: 'CSIR NET JRF & SRF',
    desc: 'Qualified CSIR NET-JRF & SRF, demonstrating research excellence and strong academic proficiency in Chemical Sciences.',
  },
  {
    icon: <FaRegStar />,
    title: 'DST INSPIRE Fellow — 2013',
    desc: "Selected for the DST INSPIRE Fellowship in recognition of academic excellence and potential in scientific research.",
  },
  {
    icon: <FaGraduationCap />,
    title: 'GATE Qualified',
    desc: 'Successfully qualified GATE in Chemistry, reflecting strong subject expertise and analytical understanding in Chemical Sciences.',
  },
  {
    icon: <GiCheckMark />,
    title: 'CGSET Qualified',
    desc: 'Qualified CGSET, demonstrating academic proficiency and subject expertise in Chemical Sciences.',
  },
  {
    icon: <BsFlask />,
    title: 'Research in Chemical Sciences',
    desc: 'Dedicated to experimental research in Chemical Sciences with a focus on innovation, scientific analysis, and applied research.',
  },
]

export default function Achievements({ onOpenLightbox }) {


  const scrollRef = useRef(null)

  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startScrollLeft, setStartScrollLeft] = useState(0)

  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  const checkButtons = () => {
    const el = scrollRef.current
    if (!el) return

    setShowLeft(el.scrollLeft > 10)

    setShowRight(
      el.scrollLeft <
      el.scrollWidth - el.clientWidth - 10
    )
  }

  useEffect(() => {
    checkButtons()

    const el = scrollRef.current
    if (!el) return

    el.addEventListener('scroll', checkButtons)

    return () => {
      el.removeEventListener('scroll', checkButtons)
    }
  }, [])

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -300,
      behavior: 'smooth',
    })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 300,
      behavior: 'smooth',
    })
  }

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return

    setIsDragging(true)
    setStartX(e.pageX)
    setStartScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return

    e.preventDefault()

    const walk = (e.pageX - startX) * 1.5
    scrollRef.current.scrollLeft = startScrollLeft - walk
  }

  const stopDragging = () => {
    setIsDragging(false)
  }


  return (
    <section id="achievements">
      <div className="section-inner">

        {showLeft && (
          <button
            className="carousel-btn left"
            onClick={scrollLeft}
          >
            <GrPrevious />
          </button>
        )}

        {showRight && (
          <button
            className="carousel-btn right"
            onClick={scrollRight}
          >
            <GrNext />
          </button>
        )}

        <div className="section-label">ACADEMIC ACHIEVEMENTS &amp; RECOGNITION </div>
        <h2 className="section-title">Achievements &amp; Recognition</h2>
        <div
          ref={scrollRef}
          className="achievements-grid"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
        >
          {achievements.map((ach, i) => (
            <div className="ach-card reveal" key={i}>
              <div className="ach-icon">{ach.icon}</div>
              <div className="ach-title">{ach.title}</div>
              <div className="ach-desc">{ach.desc}</div>
              {/* {ach.img && ( 
                <div className="ach-img-wrap">
                  <img
                    src={ach.img}
                    alt={ach.title}
                    className="ach-img"
                    onClick={() => onOpenLightbox(ach.img)}
                    onError={e => { e.currentTarget.parentElement.style.display = 'none' }}
                  />
                </div>
              )} */}
            </div>
          ))}
        </div>
        <div className="ach-scroll-hint">
          ← Swipe to View More →
        </div>

      </div>


      <div className="featured-letter reveal visible">
        <div className="featured-letter-content reveal">
          <span className="featured-tag">AICTE INVITATION</span>

          <h3>AICTE IIC Regional Meet Invitation 2025</h3>

          <p>
            Official invitation issued by AICTE for participation in the
            IIC Regional Meet 2025, recognizing involvement in innovation,
            entrepreneurship, and academic activities.
          </p>

          <div className="featured-meta">
            <span>Issued by AICTE</span>
            <span>14 Nov 2025</span>
          </div>

          <a
            href="assets/invitation.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="featured-btn"
          >
            View Letter
          </a>
        </div>
      </div>
      

    </section>
  )
}
