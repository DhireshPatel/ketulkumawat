"use client"
import { useEffect } from 'react'

const ScrollReveal = () => {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible')
            }, i * 70)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    reveals.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Active nav highlight on scroll
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const navAnchors = document.querySelectorAll('.nav-links a')

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navAnchors.forEach((a) => {
              a.style.color = ''
              if (a.getAttribute('href') === `#${entry.target.id}`) {
                a.style.color = 'var(--gold)'
              }
            })
          }
        })
      },
      { threshold: 0.4 }
    )
    sections.forEach((s) => sectionObserver.observe(s))
    return () => sectionObserver.disconnect()
  }, [])

  return null

}

export default ScrollReveal