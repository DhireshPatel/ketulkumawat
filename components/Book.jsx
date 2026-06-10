'use client'
import { useState } from 'react'

export default function Book() {
  const [imgError, setImgError] = useState(false)

  return (
    <section id="book" style={{ background: 'var(--section-bg)' }}>
      <div className="section-inner">
        <div className="section-label">Authored Work</div>
        <h2 className="section-title">Published Book</h2>
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
                  <span>📗</span>
                  <p>Book Cover</p>
                </div>
              )}
            </div>
          </div>
          <div className="book-info reveal">
            <div className="book-badge">📚 Available on Major Platforms</div>
            <h3 className="book-title">Applied Chemistry in Modern Research</h3>
            <p className="book-subtitle">A Comprehensive Guide for Students &amp; Researchers</p>
            <p className="book-author">by <strong>Dr. Ketul Kumawat</strong></p>
            <p className="book-desc">
              This book bridges fundamental chemical principles with modern research methodologies. Written for undergraduate, postgraduate students and competitive examination aspirants, it covers core topics in physical, organic, and inorganic chemistry with practical insights from the author&apos;s own research experience. An essential companion for CSIR-NET, GATE, and PhD aspirants.
            </p>
            <div className="book-meta">
              <span className="book-meta-item">🏷 ISBN: XXXX-XXXX-XXXX</span>
              <span className="book-meta-item">🏢 Publisher: [Publisher Name]</span>
              <span className="book-meta-item">📅 Year: 2024</span>
              <span className="book-meta-item">📄 Pages: [XXX]</span>
            </div>
            <div className="book-links">
              <a href="https://www.amazon.in/dp/1968436030" target="_blank" rel="noopener" className="book-buy amazon">
                <span>🛒</span> Buy on Amazon
              </a>
              <a href="https://dl.flipkart.com/dl/molecular-insights-spectroscopic-tools-kinetic-reaction-studies/p/itm2ae9ce5330e60?pid=9781968436032&lid=LSTBOK9781968436032HVV2WL&marketplace=FLIPKART&hl_lid=&q=molecular+insights+spectroscopic+tools+for+kinetic+reaction+studies&store=bks&ctx=eyJkZWxpdmVyZWRCeSI6IiIsImRpc3BsYXlQcmljZSI6IjY4OSJ9&fm=eyJ3dHAiOiJwcm9kdWN0Q2FyZExpc3QiLCJwcnB0Ijoic3AiLCJtaWQiOiJQUk9EVUNUIn0&_refId=&_appId=CL" target="_blank" rel="noopener" className="book-buy flipkart">
                <span>🛍</span> Buy on Flipkart
              </a>
              <a href="https://store.pothi.com/book/mr-ketul-kumawat-molecular-insights-spectroscopic-tools-kinetic-reaction-studies/" target="_blank" rel="noopener" className="book-buy pothi">
                <span>📖</span> Buy on Pothi.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
