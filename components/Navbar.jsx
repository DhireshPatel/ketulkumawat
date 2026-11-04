// "use client";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";

// const Navbar = () => {
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 40);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const closeMenu = () => setMenuOpen(false);

//   return (
//     <nav id="navbar" className={scrolled ? "scrolled" : ""}>
//       <div className="nav-logo">Dr. Ketul Kumawat</div>
//       <button
//         className={`hamburger${menuOpen ? " open" : ""}`}
//         aria-label="Menu"
//         onClick={() => setMenuOpen(!menuOpen)}
//       >
//         <span></span>
//         <span></span>
//         <span></span>
//       </button>
//       <ul className={`nav-links${menuOpen ? " open" : ""}`}>
//         {/* <li><Link href="#about" onClick={closeMenu}>About</Link></li> */}
//         {/* <li><a href="#achievements" onClick={closeMenu}>Achievements</a></li> */}
//         {/* <li><a href="#book" onClick={closeMenu}>Publications</a></li>
//                 <li><a href="#gallery" onClick={closeMenu}>Gallery</a></li>
//                 <li><a href="#news" onClick={closeMenu}>Media</a></li>
//                 <li><a href="#education" onClick={closeMenu}>Education</a></li>
//                 <li><a href="#certificates" onClick={closeMenu}>Certificates</a></li>
//                 <li><a href="#teaching" onClick={closeMenu}>Teaching</a></li> */}
//         {/* <li><a href="#contact" onClick={closeMenu}>Contact</a></li> */}
//         {/* New Page link adding ->  */}
//         <li>
//           <Link href="/" onClick={closeMenu}>
//             Home
//           </Link>
//         </li>
//         <li>
//           <Link href="/Ebooks" onClick={closeMenu}>
//             E books
//           </Link>
//         </li>
//         <li>
//           <Link href="/HireMe" onClick={closeMenu}>
//             Hire Me
//           </Link>
//         </li>
//         <li>
//           <Link href="/exam-alerts" onClick={closeMenu}>
//             Exam alerts
//           </Link>
//         </li>
//         {/* <li>
//           <Link href="/research-consulting" onClick={closeMenu}>
//             Research Consulting
//           </Link>
//         </li> */}
//         <li>
//           <Link href="/nobel-prize-chemistry-2026" onClick={closeMenu}>
//             NOBEL 2026
//           </Link>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;

"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoBookSharp } from "react-icons/io5";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <nav id="navbar" className={scrolled ? "scrolled" : ""}>
      <Link href="/" className="nav-logo" onClick={closeMenu}>
        Dr. Ketul Kumawat
      </Link>

      <button
        className={`hamburger${menuOpen ? " open" : ""}`}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`nav-links${menuOpen ? " open" : ""}`}>
        {/* HOME */}
        <li>
          <Link href="/" onClick={closeMenu}>
            Home
          </Link>
        </li>

        {/* RESOURCES */}
        <li
          className={`nav-dropdown ${
            activeDropdown === "resources" ? "active" : ""
          }`}
        >
          <button
            className="dropdown-toggle"
            onClick={() => toggleDropdown("resources")}
            aria-expanded={activeDropdown === "resources"}
          >
            Resources{" "}
            <span className="dropdown-arrow">
              <IoMdArrowDropdown />
            </span>
          </button>

          <ul className="dropdown-menu">
            <li>
              <Link href="/Ebooks" onClick={closeMenu}>
                <span className="dropdown-icon">
                  <IoBookSharp />
                </span>
                <span>
                  <strong>E Books</strong>
                  <small>Explore educational books</small>
                </span>
              </Link>
            </li>
          </ul>
        </li>

        {/* SERVICES */}
        <li
          className={`nav-dropdown ${
            activeDropdown === "services" ? "active" : ""
          }`}
        >
          <button
            className="dropdown-toggle"
            onClick={() => toggleDropdown("services")}
            aria-expanded={activeDropdown === "services"}
          >
            Services{" "}
            <span className="dropdown-arrow">
              <IoMdArrowDropdown />
            </span>
          </button>

          <ul className="dropdown-menu">
            <li>
              <Link href="/HireMe" onClick={closeMenu}>
                <span className="dropdown-icon">💼</span>
                <span>
                  <strong>Hire Me</strong>
                  <small>Work with me</small>
                </span>
              </Link>
            </li>

            <li>
              <Link href="/research-consulting" onClick={closeMenu}>
                <span className="dropdown-icon">🔬</span>
                <span>
                  <strong>Research Consulting</strong>
                  <small>Research guidance and consulting</small>
                </span>
              </Link>
            </li>
          </ul>
        </li>

        {/* EXAMS */}
        <li
          className={`nav-dropdown ${
            activeDropdown === "exams" ? "active" : ""
          }`}
        >
          <button
            className="dropdown-toggle"
            onClick={() => toggleDropdown("exams")}
            aria-expanded={activeDropdown === "exams"}
          >
            Exams{" "}
            <span className="dropdown-arrow">
              <IoMdArrowDropdown />
            </span>
          </button>

          <ul className="dropdown-menu">
            <li>
              <Link href="/exam-alerts" onClick={closeMenu}>
                <span className="dropdown-icon">🔔</span>
                <span>
                  <strong>Exam Alerts</strong>
                  <small>Latest exam notifications and updates</small>
                </span>
              </Link>
            </li>

            <li>
              <Link href="/pyq" onClick={closeMenu}>
                <span className="dropdown-icon">📝</span>
                <span>
                  <strong>Exam PYQ</strong>
                  <small>Previous year question papers</small>
                </span>
              </Link>
            </li>
          </ul>
        </li>

        {/* RESEARCH */}
        <li
          className={`nav-dropdown ${
            activeDropdown === "research" ? "active" : ""
          }`}
        >
          <button
            className="dropdown-toggle"
            onClick={() => toggleDropdown("research")}
            aria-expanded={activeDropdown === "research"}
          >
            Research{" "}
            <span className="dropdown-arrow">
              <IoMdArrowDropdown />
            </span>
          </button>

          <ul className="dropdown-menu">
            <li>
              <Link href="/nobel-prize-chemistry-2026" onClick={closeMenu}>
                <span className="dropdown-icon">🏆</span>
                <span>
                  <strong>Nobel Prize 2026</strong>
                  <small>Nobel Prize in Chemistry · 2026</small>
                </span>
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
