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
      "Structure-reactivity relation in the oxidation of some aliphatic aldehydes by Tripropylammonium chlorochromate",
    thumbnail: "assets/research-papers/photo/ResearchPublication2.png",
    viewLink: "/assets/research-papers/ResearchPublication2.pdf",
    downloadLink: "/assets/research-papers/ResearchPublication2.pdf",
  },
  {
    id: 3,
    title: "Mechanistic Study of Sulfide Oxidation",
    journal: "Chemical Science International Journal",
    author: "Dr. Ketul kumawat",
    date: "Publised: March 21, 2026",
    description:
      "A Mechanistic and Correlative Study on Sulfide Oxidation by Diethylammonium Chlorochromate",
    thumbnail: "assets/research-papers/photo/ResearchPublication3.png",
    viewLink: "/assets/research-papers/ResearchPublication3.pdf",
    downloadLink: "/assets/research-papers/ResearchPublication3.pdf",
  },
  {
    id: 4,
    title: "Correlation Study of Aromatic Aldehyde Oxidation",
    journal: "Turkish Computational and Theoretical Chemistry",
    author: "Dr. Ketul kumawat",
    date: "Published: July 23, 2024",
    description:
      "Correlation Analysis of Structure & Reactivity In The Oxidation of Aromatic Aldehydes By 2-Picolinium Chlorochromate",
    thumbnail: "assets/research-papers/photo/ResearchPublication4.png",
    viewLink: "/assets/research-papers/ResearchPublication4.pdf",
    downloadLink: "/assets/research-papers/ResearchPublication4.pdf",
  },
  {
    id: 5,
    title: "Kinetic and Mechanistic Study of Organic Acid Oxidation",
    journal: "Journal of Applicable Chemistry",
    author: "Dr. Ketul kumawat",
    date: "Published: October 21, 2025",
    description:
      "Oxidation Kinetics and Mechanistic Studies of Organic Acids by Tripropylammonium Chlorochromate",
    thumbnail: "assets/research-papers/photo/ResearchPublication5.png",
    viewLink: "/assets/research-papers/ResearchPublication5.pdf",
    downloadLink: "/assets/research-papers/ResearchPublication5.pdf",
  },
  {
    id: 6,
    title: "Reactivity Study of Diol Oxidation",
    journal: "G P Globalize Research Journal of Chemistry",
    author: "Dr. Ketul kumawat",
    date: "Published: ---",
    description:
      "Correlation Analysis of Reactivity in the Oxidation of some Vicinal and Non-vicinal Diols by Picolinium Chlorochromate",
    thumbnail: "assets/research-papers/photo/ResearchPublication6.png",
    viewLink: "/assets/research-papers/ResearchPublication6.pdf",
    downloadLink: "/assets/research-papers/ResearchPublication6.pdf",
  },
  // {
  //   id: 7,
  //   title: "Structure–Reactivity Correlation of Aliphatic Primary Alcohol Oxidation",
  //   journal: "Journal of Applicable Chemistry",
  //   author: "Dr. Ketul kumawat",
  //   date: "Published: March 04, 2025",
  //   description:
  //     "Experimental evidence on how group heuristics diverge from individual rational choice models under time pressure.",
  //   thumbnail: "assets/research-papers/photo/ResearchPublication7.png",
  //   viewLink: "/assets/research-papers/ResearchPublication7.pdf",
  //   downloadLink: "/assets/research-papers/ResearchPublication7.pdf",
  // }, // this is same of id 1.
  {
    id: 8,
    title: "Kinetic Study of DL-Methionine Oxidation",
    journal: "Journal of Chemical, Biological and Physical Sciences",
    author: "Dr. Ketul kumawat",
    date: "Published: March 25, 2025",
    description:
      "Oxidation Kinetics of DL-Methionine, a Sulphur containing Amino acid by Tripropylammonium Chlorochromate",
    thumbnail: "assets/research-papers/photo/ResearchPublication8.png",
    viewLink: "/assets/research-papers/ResearchPublication8.pdf",
    downloadLink: "/assets/research-papers/ResearchPublication8.pdf",
  },
  {
    id: 9,
    title: "Oxidation of Phosphorus Oxyacids",
    journal: "Journal of Emerging Technologies and Innovative Research",
    author: "Dr. Ketul kumawat",
    date: "Published: ---",
    description:
      "OXIDATION STUDIES OF SOME PHOSPHORUS OXYACIDS BY TRIPROPYLAMMONIUM CHLOROCHROMATE: ESTABLISHMENT OF REACTIVE REDUCING SPECIES",
    thumbnail: "assets/research-papers/photo/ResearchPublication9.png",
    viewLink: "/assets/research-papers/ResearchPublication9.pdf",
    downloadLink: "/assets/research-papers/ResearchPublication9.pdf",
  },
  {
    id: 10,
    title: "Structure–Reactivity Study of Aliphatic Aldehyde Oxidation",
    journal: "Research Journal of Chemistry and Environment",
    author: "Dr. Ketul kumawat",
    date: "Published: March 03, 2023",
    description:
      "Structure-reactivity relation in the oxidation of some aliphatic aldehydes by Tripropylammonium chlorochromate",
    thumbnail: "assets/research-papers/photo/ResearchPublication10.png",
    viewLink: "/assets/research-papers/ResearchPublication10.pdf",
    downloadLink: "/assets/research-papers/ResearchPublication10.pd4",
  },
  {
    id: 11,
    title: "Kinetic and Mechanistic Study of Carbonyl Compound Regeneration",
    journal: "Research Journal of Chemistry and Environment",
    author: "Dr. Ketul kumawat",
    date: "Published: September 09, 2025",
    description:
      "Kinetic and mechanistic studies in the Oxidative regeneration of carbonyl compounds from oximes by diethylammonium chlorochromate",
    thumbnail: "assets/research-papers/photo/ResearchPublication11.png",
    viewLink: "/assets/research-papers/ResearchPublication11.pdf",
    downloadLink: "/assets/research-papers/ResearchPublication11.pd4",
  },
];

export default function Publications() {
  return (
    <section className="pub-section" aria-labelledby="pub-heading">
      {/* <Navbar /> */}
      <div className="back-button-container">
        <Link href="/#research-publications">
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
