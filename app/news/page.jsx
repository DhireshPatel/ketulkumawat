"use client"
import React, { useState } from "react";
import Link from 'next/link';

const BEST_NEWS = [
  { id: 1, paper: "Times of India", title: "Youngest scientist recognition — front page story", date: "January 2024", category: "youngest", image: "assets/news/news1.jpeg" },
  { id: 2, paper: "Dainik Bhaskar", title: "Exclusive interview on research journey", date: "January 2024", category: "", image: "assets/news/news2.jpeg" },
  { id: 3, paper: "Rajasthan Patrika", title: "Rajasthan ka sabse yuva vaigyanik", date: "January 2024", category: "patent", image: "assets/news/news4.jpeg" },
  { id: 4, paper: "Hindustan Times", title: "Research breakthrough covered nationally", date: "March 2024", category: "patent", image: "assets/news/news3.jpeg" },
  { id: 5, paper: "Navbharat Times", title: "Award ceremony feature story", date: "February 2024", category: "youngest", image: "assets/news/news5.jpeg" },
  { id: 6, paper: "Amar Ujala", title: "Science conference highlight", date: "April 2024", category: "Book", image: "assets/news/news6.jpeg" },
];

const ALL_NEWS = [
  { id: 7, paper: "Patrika", title: "Special report on innovation", date: "May 2024", category: "youngest", image: "assets/news/news7.jpeg" },
  { id: 8, paper: "Jan Satta", title: "Rising star in science", date: "Mar 2024", category: "youngest", image: "assets/news/news8.jpeg" },
  { id: 9, paper: "Divya Bhaskar", title: "Young achiever profile", date: "Feb 2024", category: "youngest", image: "assets/news/news9.jpeg" },
  { id: 10, paper: "The Hindu", title: "Academic excellence mention", date: "Jan 2024", category: "youngest", image: "assets/news/news10.jpeg" },
  { id: 11, paper: "Tribune", title: "Science award coverage", date: "Jun 2024", category: "youngest", image: "assets/news/news11.jpeg" },
  { id: 12, paper: "Lokmat", title: "Regional pride story", date: "Apr 2024", category: "Book", image: "assets/news/news12.jpeg" },

];

const FILTERS = [
  { key: "all", label: "All (12+)" },
  { key: "youngest", label: "Youngest Scientist" },
  { key: "Book", label: "Book" },
  { key: "patent", label: "Patent" },
];

/* category → badge class */
const BADGE = {
  youngest: "np-badge np-badge--gold",
  research: "np-badge np-badge--green",
  patent: "np-badge np-badge--brown",
};

export default function NewsPage() {
  const [active, setActive] = useState("all");
  const [openImage, setOpenImage] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState("50% 50%");

  const filteredBest = active === "all"
    ? BEST_NEWS
    : BEST_NEWS.filter((n) => n.category === active);

  const filteredAll = active === "all"
    ? ALL_NEWS
    : ALL_NEWS.filter((n) => n.category === active);

  const noResults = filteredBest.length === 0 && filteredAll.length === 0;

  const handleWheel = (e) => {
    e.preventDefault();

    setZoom((prev) => {
      const next = e.deltaY < 0 ? prev + 0.2 : prev - 0.2;
      return Math.min(Math.max(next, 1), 5);
    });
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setOrigin(`${x}% ${y}%`);
  };

  return (
    <main className="news-page">

      {/* Breadcrumb */}
      <nav className="np-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="np-breadcrumb__sep" aria-hidden="true">›</span>
        <span className="np-breadcrumb__current">In the news</span>
      </nav>

      {/* Page header */}
      <header className="np-header">
        <p className="np-header__label">Media coverage</p>
        <h1 className="np-header__title">In the news</h1>
        <p className="np-header__sub">
          27 coverages across national &amp; regional publications
        </p>
      </header>

      {/* Stats */}
      <div className="np-stats">
        <div className="np-stat">
          <div className="np-stat__number">12+</div>
          <div className="np-stat__label">Total coverages</div>
        </div>
        <div className="np-stat">
          <div className="np-stat__number">7+</div>
          <div className="np-stat__label">Youngest scientist</div>
        </div>
        <div className="np-stat">
          <div className="np-stat__number">3</div>
          <div className="np-stat__label">PATENT HOLDING</div>
        </div>
      </div>

      {/* Collage hero */}
      {/* <section className="np-collage" aria-label="Newspaper collage">
        <div className="np-collage__header">
          <span className="np-collage__label">
            Youngest Scientist — all newspaper clippings
          </span>
          <span className="np-collage__count">10+ newspapers</span>
        </div>

        <div className="np-collage__placeholder">

          <div
            className="np-collage__placeholder-text"
            onClick={() => setOpenImage("/assets/news/collage1.jpeg")}
          >
            <img
              src="/assets/news/collage1.jpeg"
              alt="Newspaper collage"
              className="np-collage__img"
            />
          </div>

          <p className="np-collage__placeholder-sub">
            Times of India · Dainik Bhaskar · Rajasthan Patrika · Navbharat Times · +6 more
          </p>
        </div>
      </section> */}

      {/* Filters */}
      <div className="np-filters" role="group" aria-label="Filter by category">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            className={`np-filter${active === key ? " active" : ""}`}
            onClick={() => setActive(key)}
            aria-pressed={active === key}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Best 6 cards */}
      {filteredBest.length > 0 && (
        <section className="sectionOfNews">
          <div className="np-section-head">
            <h2 className="np-section-head__title">Best coverages</h2>
            <span className="np-section-head__count">{filteredBest.length} selected</span>
          </div>
          <div className="np-best-grid">
            {filteredBest.map((item) => (
              <article
                key={item.id}
                // className={`np-card np-card--best${item.category === "youngest" ? " np-card--highlight" : ""}`}
                className="np-card np-card--best np-card--highlight"
                onClick={() => {
                  if (item.image) {
                    setOpenImage(item.image);
                    setZoom(1);
                  }
                }}
              >
                <div className="np-card__img">
                  {item.image
                    ? <img src={item.image} alt={item.title} />
                    : <div className="np-card__img-placeholder">📰</div>
                  }
                </div>
                <div className="np-card__body">
                  <span className={BADGE[item.category]}>{item.paper}</span>
                  <h3 className="np-card__title">{item.title}</h3>
                  <p className="np-card__meta">{item.date}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Divider between sections */}
      {filteredBest.length > 0 && filteredAll.length > 0 && (
        <hr className="np-divider" />
      )}

      {/* All remaining news */}
      {filteredAll.length > 0 && (
        <section className="sectionOfNews">
          <div className="np-section-head">
            <h2 className="np-section-head__title">All other coverages</h2>
            <span className="np-section-head__count">{filteredAll.length} more</span>
          </div>
          <div className="np-all-grid">
            {filteredAll.map((item) => (
              <article
                key={item.id}
                className="np-card np-card--small"
                onClick={() => {
                  if (item.image) {
                    setOpenImage(item.image);
                    setZoom(1);
                  }
                }}
              >
                <div className="np-card__img np-card__img--small">
                  {item.image
                    ? <img src={item.image} alt={item.title} />
                    : <div className="np-card__img-placeholder">📰</div>
                  }
                </div>
                <div className="np-card__body np-card__body--small">
                  <span className="np-card__paper">{item.paper}</span>
                  <h3 className="np-card__title np-card__title--small">{item.title}</h3>
                  <p className="np-card__meta">{item.date}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {noResults && (
        <p className="np-empty">Is category mein koi coverage nahi mili.</p>
      )}

      {openImage && (
        <div
          className="image-modal"
          onClick={() => {
            setOpenImage(null);
            setZoom(1);
          }}
        >
          <div
            className="image-modal__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="image-modal__close"
              onClick={() => {
                setOpenImage(null);
                setZoom(1);
              }}
            >
              ✕
            </button>

            <img
              src={openImage}
              alt="Full Image"
              className="image-modal__img"
              onWheel={handleWheel}
              onMouseMove={handleMouseMove}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: origin,
                transition: "transform 0.1s ease",
              }}
            />
          </div>
        </div>
      )}

    </main>
  );
}
