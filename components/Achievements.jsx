'use client'
import { useRef, useState, useEffect } from 'react'
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

const achievements = [
  {
    icon: '🏅',
    title: 'Young Scientist Award — ICS 2025',
    desc: 'Awarded the prestigious Young Scientist Award by the Indian Chemical Society (ICS), recognizing outstanding contribution to chemical research at an early career stage.',
  },
  {
    icon: '📜',
    title: 'Patent Holder',
    desc: 'Holds a patent in the field of Chemical Sciences, reflecting innovative and applied research with real-world impact and intellectual property recognition.',
  },
  {
    icon: '📖',
    title: 'Published Author',
    desc: 'Research work has been published in scientific journals, contributing original insights and experimental findings to the broader chemical science literature.',
  },
  {
    icon: '🔬',
    title: 'CSIR NET JRF & SRF',
    desc: 'Qualified both Junior Research Fellowship (JRF) and Senior Research Fellowship (SRF) under CSIR-NET, one of India\'s most competitive research fellowships in science.',
  },
  {
    icon: '⭐',
    title: 'DST INSPIRE Fellow — 2013',
    desc: "Awarded the Department of Science & Technology INSPIRE Fellowship in 2013, one of India's flagship programs to attract young talent to scientific research.",
  },
  {
    icon: '📐',
    title: 'GATE Qualified',
    desc: 'Successfully qualified the Graduate Aptitude Test in Engineering (GATE) in Chemistry, demonstrating thorough command of core chemical sciences concepts.',
  },
  {
    icon: '🎓',
    title: 'CGSET Qualified',
    desc: 'Qualified the Chhattisgarh State Eligibility Test (CGSET), validating eligibility for Assistant Professor positions in state universities.',
  },
  {
    icon: '🧪',
    title: 'Research in Chemical Sciences',
    desc: 'Extensive hands-on experimental research experience ranging from synthesis and analysis to applied chemistry projects with real-world applications.',
  },
]

export default function Achievements({ onOpenLightbox }) {


  const scrollRef = useRef(null)

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

        <div className="section-label">Recognition &amp; Credentials</div>
        <h2 className="section-title">Achievements &amp; Qualifications</h2>
        <div ref={scrollRef} className="achievements-grid">
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
          ← Swipe to explore achievements →
        </div>
      </div>

    </section>
  )
}
