"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav id="navbar" className={scrolled ? "scrolled" : ""}>
      <div className="nav-logo">Dr. Ketul Kumawat</div>
      <button
        className={`hamburger${menuOpen ? " open" : ""}`}
        aria-label="Menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul className={`nav-links${menuOpen ? " open" : ""}`}>
        {/* <li><Link href="#about" onClick={closeMenu}>About</Link></li> */}
        {/* <li><a href="#achievements" onClick={closeMenu}>Achievements</a></li> */}
        {/* <li><a href="#book" onClick={closeMenu}>Publications</a></li>
                <li><a href="#gallery" onClick={closeMenu}>Gallery</a></li>
                <li><a href="#news" onClick={closeMenu}>Media</a></li>
                <li><a href="#education" onClick={closeMenu}>Education</a></li>
                <li><a href="#certificates" onClick={closeMenu}>Certificates</a></li>
                <li><a href="#teaching" onClick={closeMenu}>Teaching</a></li> */}
        {/* <li><a href="#contact" onClick={closeMenu}>Contact</a></li> */}
        {/* New Page link adding ->  */}
        <li>
          <Link href="/" onClick={closeMenu}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/Ebooks" onClick={closeMenu}>
            E books
          </Link>
        </li>
        <li>
          <Link href="/HireMe" onClick={closeMenu}>
            Hire Me
          </Link>
        </li>
        <li>
          <Link href="/research-consulting" onClick={closeMenu}>
            Research Consulting
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
