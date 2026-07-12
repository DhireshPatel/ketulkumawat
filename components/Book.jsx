"use client";
import { useState } from "react";
import { FaBook } from "react-icons/fa6";

export default function Book() {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="book" style={{ background: "var(--section-bg)" }}>
      <div className="section-inner">
        <div className="section-label">AUTHORED PUBLICATION</div>
        <h2 className="section-title">Featured Book</h2>
        <div className="book-block">
          <div className="book-cover-wrap reveal">
            <div className="book-3d">
              {!imgError ? (
                <img
                  src="assets/photos/book.jpeg"
                  onError={() => setImgError(true)}
                  alt="Book Cover"
                  className="book-img"
                />
              ) : (
                <div className="book-placeholder">
                  <span>
                    <FaBook />
                  </span>
                  <p>Book Cover</p>
                </div>
              )}
            </div>
          </div>
          <div className="book-info reveal">
            <div className="book-badge"> Available on Major Platforms</div>
            <h3 className="book-title">MOLECULAR &nbsp;INSIGHTS</h3>
            <p className="book-subtitle">
              Spectroscopic Tools for Kinetic Reaction Studies
            </p>
            <p className="book-author">
              by <strong>Dr. Ketul Kumawat</strong>
            </p>
            <p className="book-desc">
              A valuable contribution to molecular science, offering clear
              insights into advanced molecular research and practical
              applications for students, researchers, and chemistry enthusiasts.
            </p>
            <div className="book-meta">
              <span className="book-meta-item">ISBN: 978-1-968436-03-2</span>
              <span className="book-meta-item">Author: Dr. Ketul Kumawat</span>
              {/* <span className="book-meta-item">Year: 2024</span> */}
              <span className="book-meta-item">Pages: 352</span>
            </div>
            <div className="book-links">
              <a
                href="https://www.amazon.in/dp/1968436030"
                target="_blank"
                rel="noopener"
                className="book-buy amazon"
              >
                Buy on Amazon
              </a>
              <a
                href="https://dl.flipkart.com/dl/molecular-insights-spectroscopic-tools-kinetic-reaction-studies/p/itm2ae9ce5330e60?pid=9781968436032&lid=LSTBOK9781968436032HVV2WL&marketplace=FLIPKART&hl_lid=&q=molecular+insights+spectroscopic+tools+for+kinetic+reaction+studies&store=bks&ctx=eyJkZWxpdmVyZWRCeSI6IiIsImRpc3BsYXlQcmljZSI6IjY4OSJ9&fm=eyJ3dHAiOiJwcm9kdWN0Q2FyZExpc3QiLCJwcnB0Ijoic3AiLCJtaWQiOiJQUk9EVUNUIn0&_refId=&_appId=CL"
                target="_blank"
                rel="noopener"
                className="book-buy flipkart"
              >
                Buy on Flipkart
              </a>
              <a
                href="https://store.pothi.com/book/mr-ketul-kumawat-molecular-insights-spectroscopic-tools-kinetic-reaction-studies/"
                target="_blank"
                rel="noopener"
                className="book-buy pothi"
              >
                Pothi.com
              </a>
            </div>
          </div>
        </div>
      </div>
      

      {/* <section className="featured-paper reveal">
        <div className="paper-card">

          <div className="paper-right">
            <span className="paper-tag">
              RESEARCH PUBLICATION
            </span>

            <h3 className="paper-title">
              Oxidation of Aliphatic Primary Alcohols
            </h3>

            <p className="paper-journal">
              Journal of Applicable Chemistry • 2025
            </p>

            <a
              href="assets/applicable.pdf"
              target="_blank"
              className="paper-btn"
            >
              View Paper 1
            </a>
            <a
              href="assets/ResearchPublication2.pdf"
              target="_blank"
              className="paper-btn"
            >
              View Paper 2
            </a>
          </div>

        </div>
      </section> */}
    </section>
  );
}
