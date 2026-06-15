'use client'

import ViewAllButton from "./ViewAllButton"

const newsItems = [
  {
    img: 'assets/news/news1.jpeg',
    // source: '📰 [Newspaper Name] · [Date]',
    caption: 'Young Scientist from Rajasthan Receives Prestigious Recognition for Chemical Research',
    placeholder: 'News Photo 1',
    placeholderNote: 'Place news-1.jpg in assets/news/',
  },
  {
    img: 'assets/news/news2.jpeg',
    // source: '📰 [Newspaper Name] · [Date]',
    caption: 'Book publication by Dr. Ketul Kumawat and Dr. O. P. Bishnoi celebrated by the scientific community.',
    placeholder: 'News Photo 2',
    placeholderNote: 'Place news-2.jpg in assets/news/',
  },
  {
    img: 'assets/news/news4.jpeg',
    // source: '📰 [Newspaper Name] · [Date]',
    caption: 'Dr. Ketul Kumawat awarded a patent for his research innovation, bringing pride to Rajasthan.',
    placeholder: 'News Photo 3',
    placeholderNote: 'Place news-3.jpg in assets/news/',
  },
]

function NewsCard({ item, onOpenLightbox }) {
  const handleImgError = (e) => {
    e.currentTarget.parentElement.innerHTML = `
      <div class="news-img-placeholder">
        <span class="news-placeholder-emoji">🗞️</span>
        <br/>${item.placeholder}<br/>
        <small>${item.placeholderNote}</small>
      </div>`
  }

  return (
    <div className="news-card reveal" onClick={() => onOpenLightbox(item.img)}>
      <div className="news-img-wrap">
        <img src={item.img} onError={handleImgError} alt={item.placeholder} />
      </div>
      <div className="news-card-body">
        <div className="news-source">{item.source}</div>
        <p className="news-caption">{item.caption}</p>
        <span className="news-view-btn">View Article →</span>
      </div>
    </div>
  )
}

export default function News({ onOpenLightbox }) {
  return (
    <section id="news" style={{ background: 'var(--section-bg)' }}>
      <div className="section-inner">
        <div className="section-label">Media Coverage</div>
        <h2 className="section-title">Media Highlights</h2>
        <p className="section-sub">A collection of newspaper features and media recognitions showcasing research excellence, awards, patents, and impactful scientific contributions.</p>

        <div className="news-grid">
          {newsItems.map((item, i) => (
            <NewsCard key={i} item={item} onOpenLightbox={onOpenLightbox} />
          ))}
          {/* <a href="/news" className="View-news">View all</a> */}
          <ViewAllButton />

        </div>

        {/* <div className="news-story reveal">
          <div className="news-story-text">
            <h3>A Milestone Moment — Recognized as Youngest Scientist</h3>
            <p>In a proud moment for Rajasthan&apos;s scientific community, news features highlighted the remarkable journey of this young researcher who, at a notably early age, earned a Doctorate in Chemical Sciences and secured a patent — all while continuing to serve as an educator and mentor.</p>
            <p>The coverage drew attention to the rare combination of academic excellence and practical innovation: holding CSIR NET JRF, SRF, GATE, CGSET, and DST INSPIRE qualifications while simultaneously contributing original research and teaching NEET and JEE aspirants.</p>
            <p>The Young Scientist Award from the Indian Chemical Society (ICS 2025) further cemented the recognition as a trailblazer in chemical research — inspiring a generation of young scientists from Rajasthan and beyond.</p>
          </div>
          <div className="news-quote-block">
            <div className="news-quote-mark">&quot;</div>
            <p className="news-quote">Behind every recognition lies a journey of hard work, sacrifice, and the determination to never give up.</p>
            <div className="news-quote-author">— Dr. Ketul Kumawat</div>
          </div>
        </div> */}

        {/* <p className="gallery-note">
          📸 Place your newspaper images (news-1.jpg, news-2.jpg, etc.) inside the <code>public/assets/news/</code> folder
        </p> */}
      </div>
    </section>
  )
}
