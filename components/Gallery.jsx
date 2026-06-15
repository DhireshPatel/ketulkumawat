'use client'

const galleryItems = [
  { src: 'assets/photos/gallery1.jpeg', caption: 'Award Ceremony' },
  { src: 'assets/photos/gallery2.jpeg', caption: 'Research Lab' },
  // { src: 'assets/photos/gallery-3.jpg', caption: 'Conference' },
  // { src: 'assets/photos/gallery-4.jpg', caption: 'Teaching' },
  // { src: 'assets/photos/gallery-5.jpg', caption: 'ICS 2025' },
  // { src: 'assets/photos/gallery-6.jpg', caption: 'Patent Award' },
]

export default function Gallery({ onOpenLightbox }) {
  const handleImgError = (e) => {
    e.currentTarget.parentElement.style.display = 'none'
  }

  return (
    <section id="gallery">
      <div className="section-inner">
        <div className="section-label">ACADEMIC MOMENTS & MILESTONES</div>
        <h2 className="section-title">Journey in Frames</h2>
        <p className="section-sub">A collection of memorable moments highlighting academic achievements, research milestones, and professional recognition.</p>

        <div className="gallery-grid">
          {galleryItems.map((item, i) => (
            <div
              className="gal-item reveal"
              key={i}
              onClick={() => onOpenLightbox(item.src)}
            >
              <img
                src={item.src}
                alt={`Photo ${i + 1}`}
                onError={handleImgError}
              />
              {/* <div className="gal-overlay">
                <span>🔍 View</span>
                <p>{item.caption}</p>
              </div> */}
            </div>
          ))}
        </div>

        <p className="gallery-note">
          Highlights from a journey of research, academic excellence, and professional achievements.
        </p>
      </div>
    </section>
  )
}
