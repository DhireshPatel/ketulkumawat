import Navbar from "@/components/Navbar";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

const publications = [
  {
    id: 1,
    title: "Oxidation of Aliphatic Primary Alcohols",
    journal: "Journal of Applicable Chemistry",
    author: "Dr. Ketul Kumawat",
    date: "Published: March 04, 2025",
    description:
      "Structure-Reactivity Correlation in the Oxidation of Aliphatic Primary Alcohols by Tripropylammonium chlorochromate",
    thumbnail: "assets/research-papers/photo/applicable.png",
    viewLink: "/assets/research-papers/applicable.pdf",
    downloadLink: "/assets/research-papers/applicable.pdf",
  },
  {
    id: 2,
    title: "Oxidation of some aliphatic aldehydes",
    journal: "Research Journal of Chemistry and Environment",
    author: "Dr. Ketul kumawat",
    date: "Published: ---",
    description:
      "We benchmark ensemble deep learning architectures against traditional numerical models for regional precipitation forecasting.",
    thumbnail: "assets/research-papers/photo/ResearchPublication2.png",
    viewLink: "/assets/research-papers/ResearchPublication2.pdf",
    downloadLink: "/assets/research-papers/ResearchPublication2.pdf",
  },
  // {
  //   id: 3,
  //   title: "Sustainable Polymer Synthesis from Biomass Feedstocks",
  //   journal: "Green Chemistry Letters",
  //   author: "Dr. Priya Ramanathan",
  //   date: "July 2023",
  //   description:
  //     "A comparative analysis of catalytic pathways for converting lignocellulosic biomass into biodegradable polymer precursors.",
  //   thumbnail: "/thumbnails/pub3.svg",
  //   viewLink: "#",
  //   downloadLink: "#",
  // },
  // {
  //   id: 4,
  //   title: "Machine Learning Approaches to Climate Prediction",
  //   journal: "Environmental Data Science Review",
  //   author: "Dr. Marcus Feldman",
  //   date: "January 2024",
  //   description:
  //     "We benchmark ensemble deep learning architectures against traditional numerical models for regional precipitation forecasting.",
  //   thumbnail: "/thumbnails/pub4.svg",
  //   viewLink: "#",
  //   downloadLink: "#",
  // },
  // {
  //   id: 5,
  //   title: "Genomic Markers of Cellular Senescence",
  //   journal: "Molecular Biology and Aging",
  //   author: "Prof. Hana Kobayashi",
  //   date: "September 2023",
  //   description:
  //     "Identification of epigenetic signatures associated with irreversible cell-cycle arrest across diverse human tissue samples.",
  //   thumbnail: "/thumbnails/pub5.svg",
  //   viewLink: "#",
  //   downloadLink: "#",
  // },
  // {
  //   id: 6,
  //   title: "Topological Insulators in Condensed Matter Physics",
  //   journal: "Physical Review Materials",
  //   author: "Dr. Alexei Petrov",
  //   date: "May 2024",
  //   description:
  //     "A theoretical framework describing protected surface states in three-dimensional topological insulator heterostructures.",
  //   thumbnail: "/thumbnails/pub6.svg",
  //   viewLink: "#",
  //   downloadLink: "#",
  // },
  // {
  //   id: 7,
  //   title: "Behavioral Economics of Collective Decision Making",
  //   journal: "Quarterly Journal of Social Behavior",
  //   author: "Prof. Isabelle Laurent",
  //   date: "February 2024",
  //   description:
  //     "Experimental evidence on how group heuristics diverge from individual rational choice models under time pressure.",
  //   thumbnail: "/thumbnails/pub7.svg",
  //   viewLink: "#",
  //   downloadLink: "#",
  // },
  // {
  //   id: 8,
  //   title: "Photonic Crystals for Next-Gen Optical Computing",
  //   journal: "Optics and Photonics Research",
  //   author: "Dr. Samuel Whitfield",
  //   date: "October 2023",
  //   description:
  //     "Design principles for engineered photonic bandgap structures enabling low-loss optical signal routing at nanoscale.",
  //   thumbnail: "/thumbnails/pub8.svg",
  //   viewLink: "#",
  //   downloadLink: "#",
  // },
  // {
  //   id: 9,
  //   title: "Microbiome Diversity and Host Immune Response",
  //   journal: "Frontiers in Microbial Ecology",
  //   author: "Dr. Fatima Al-Sayed",
  //   date: "April 2024",
  //   description:
  //     "A longitudinal study linking gut microbial composition shifts to modulation of adaptive immune signaling pathways.",
  //   thumbnail: "/thumbnails/pub9.svg",
  //   viewLink: "#",
  //   downloadLink: "#",
  // },
  // {
  //   id: 10,
  //   title: "Algebraic Structures in Cryptographic Protocols",
  //   journal: "International Journal of Cryptology",
  //   author: "Prof. Thomas Reinholt",
  //   date: "December 2023",
  //   description:
  //     "An examination of lattice-based algebraic constructions as a foundation for post-quantum secure key exchange.",
  //   thumbnail: "/thumbnails/pub10.svg",
  //   viewLink: "#",
  //   downloadLink: "#",
  // },
];

export default function Publications() {
  return (
    <section className="pub-section" aria-labelledby="pub-heading">
      {/* <Navbar /> */}
      <div className="back-button-container">
        <Link href="/#about">
          <button className="back-button" title="Back to Home">
            <IoIosArrowBack className="back-button__icon" />
          </button>
        </Link>
      </div>
      <div className="pub-container">
        <header className="pub-header">
          <span className="pub-eyebrow">Publications</span>
          <h2 id="pub-heading" className="pub-title">
            Research Publications
          </h2>
          <div className="pub-divider" aria-hidden="true"></div>
          <p className="pub-intro">
            A collection of peer-reviewed journal articles, conference papers
            and research contributions.
          </p>
        </header>

        <ul className="pub-grid">
          {publications.map((pub) => (
            <li className="pub-card" key={pub.id}>
              <div className="pub-thumb-wrap">
                <img
                  src={pub.thumbnail}
                  alt={`First page preview of "${pub.title}"`}
                  className="pub-thumb"
                  loading="lazy"
                  width="180"
                  height="240"
                />
              </div>

              <div className="pub-content">
                <div className="pub-text">
                  <h3 className="pub-card-title">{pub.title}</h3>
                  <p className="pub-journal">{pub.journal}</p>
                  <p className="pub-author">{pub.author}</p>
                  <p className="pub-date">{pub.date}</p>
                  <p className="pub-description">{pub.description}</p>
                </div>

                <div className="pub-actions">
                  <a href={pub.viewLink} className="pub-btn pub-btn-filled">
                    View Paper
                  </a>
                  <a
                    href={pub.downloadLink}
                    className="pub-btn pub-btn-outline"
                    download
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
