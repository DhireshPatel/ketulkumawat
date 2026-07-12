import Link from "next/link";

const featuredPublications = [
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
];

export default function FeaturedPublications() {
  return (
    <section id="research-publications" className="fpub-section" aria-labelledby="fpub-heading">
      <div className="fpub-container">
        <header className="fpub-header">
          <span className="fpub-eyebrow">Publications</span>
          <h2 id="fpub-heading" className="fpub-title">
            Research Publications
          </h2>
          <div className="fpub-divider" aria-hidden="true"></div>
          <p className="fpub-intro">
            A collection of peer-reviewed journal articles, conference papers
            and research contributions.
          </p>
        </header>

        <ul className="fpub-grid">
          {featuredPublications.map((pub) => (
            <li className="fpub-card" key={pub.id}>
              <div className="fpub-thumb-wrap">
                <img
                  src={pub.thumbnail}
                  alt={`First page preview of "${pub.title}"`}
                  className="fpub-thumb"
                  loading="lazy"
                  width="180"
                  height="240"
                />
              </div>

              <div className="fpub-content">
                <div className="fpub-text">
                  <h3 className="fpub-card-title">{pub.title}</h3>
                  <p className="fpub-journal">{pub.journal}</p>
                  <p className="fpub-author">{pub.author}</p>
                  <p className="fpub-date">{pub.date}</p>
                  <p className="fpub-description">{pub.description}</p>
                </div>

                <div className="fpub-actions">
                  <a href={pub.viewLink} className="fpub-btn fpub-btn-filled">
                    View Paper
                  </a>
                  <a
                    href={pub.downloadLink}
                    className="fpub-btn fpub-btn-outline"
                    download
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="fpub-cta-wrap">
          <Link href="/research-papers" className="fpub-cta">
            View All Publications
            <span className="fpub-cta-arrow" aria-hidden="true">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
