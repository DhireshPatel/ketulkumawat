import styles from "./NobelPrize2026.module.css";

const CITATION =
  "For the discovery of non-linear effects and autocatalysis in asymmetric organic synthesis";

const laureates = [
  {
    key: "kagan",
    name: "Henri B. Kagan",
    initials: "HK",
    rows: [
      ["Country", "France"],
      ["Affiliation", "Université Paris-Sud / Paris-Saclay"],
      ["Born", "1930, Boulogne-Billancourt, France"],
      ["Academic background", "PhD, 1960, Collège de France"],
      ["Status", "Professor Emeritus"],
    ],
    bio: "Henri B. Kagan is a pioneer of asymmetric synthesis. His work made foundational contributions to understanding and controlling molecular handedness, and he is widely known for developing chiral ligands for asymmetric catalysis.",
  },
  {
    key: "soai",
    name: "Kenso Soai",
    initials: "KS",
    rows: [
      ["Country", "Japan"],
      ["Affiliation", "Tokyo University of Science"],
      ["Born", "1950, Hiroshima, Japan"],
      ["Academic background", "PhD, 1979, University of Tokyo"],
      ["Status", "Professor Emeritus"],
    ],
    bio: "Kenso Soai is known for asymmetric autocatalysis. The reaction that bears his name, the Soai reaction, showed how a chiral product can catalyse its own formation and amplify a tiny initial imbalance.",
  },
];

const matters = [
  {
    mark: "Rx",
    title: "Pharmaceuticals",
    text: "Biological systems are chiral, so two mirror-image forms of a molecule can interact with them differently.",
  },
  {
    mark: "Fl",
    title: "Flavours",
    text: "Enantiomers of a compound can differ in how they are perceived, making stereochemical control valuable.",
  },
  {
    mark: "Fr",
    title: "Fragrances",
    text: "Mirror-image forms can have different odours, so producing the desired form matters.",
  },
  {
    mark: "Ag",
    title: "Agricultural chemicals",
    text: "Chirality can influence how a molecule behaves, so selective synthesis of one form is useful.",
  },
  {
    mark: "Mt",
    title: "Advanced materials",
    text: "Specialised materials and chemical products can depend on a defined molecular handedness.",
  },
];

const impact = [
  {
    n: "01",
    title: "Pharmaceutical Chemistry",
    text: "Controlling molecular handedness is important when designing molecules that interact with biological systems.",
  },
  {
    n: "02",
    title: "Organic Synthesis",
    text: "Asymmetric synthesis lets chemists selectively produce the desired enantiomer.",
  },
  {
    n: "03",
    title: "Origin of Homochirality",
    text: "The Soai reaction has inspired research into how molecular handedness could emerge.",
  },
  {
    n: "04",
    title: "Flavours & Fragrances",
    text: "Different enantiomers can have different properties, making stereochemical control useful.",
  },
  {
    n: "05",
    title: "New Materials & Chemicals",
    text: "Asymmetric synthesis can also contribute to the preparation of specialised materials and chemical products.",
  },
];

const homochiralitySteps = [
  "Molecular symmetry",
  "Small asymmetry",
  "Non-linear effects",
  "Autocatalysis",
  "Amplified chirality",
  "Homochirality",
];

const journey = [
  { title: "Early understanding", text: "Molecular chirality recognised" },
  { title: "Asymmetric synthesis", text: "Methods to favour one enantiomer" },
  { title: "Kagan", text: "Work on non-linear effects" },
  { title: "Soai", text: "Discovery of asymmetric autocatalysis" },
  { title: "Homochirality", text: "Growing research into its origins" },
  { title: "2026", text: "Nobel Prize in Chemistry" },
];

const facts = [
  ["Award", "Nobel Prize in Chemistry"],
  ["Year", "2026"],
  ["Laureates", ["Henri B. Kagan", "Kenso Soai"]],
  ["Countries", ["France", "Japan"]],
  ["Scientific field", "Asymmetric Organic Synthesis"],
  [
    "Key concepts",
    ["Non-linear Effects", "Autocatalysis", "Chirality", "Homochirality"],
  ],
  ["Prize", "12 million Swedish kronor, shared equally"],
];

const sources = [
  {
    label: "The Nobel Prize in Chemistry 2026 (NobelPrize.org)",
    href: "https://www.nobelprize.org/prizes/chemistry/2026/summary/",
  },
  {
    label: "The Nobel Prize in Chemistry (all laureates)",
    href: "https://www.nobelprize.org/prizes/chemistry/",
  },
  {
    label: "The Royal Swedish Academy of Sciences",
    href: "https://www.kva.se/en/",
  },
];

function Flow({ steps, label }) {
  return (
    <ol className={styles.flow} aria-label={label}>
      {steps.map((s, i) => (
        <li key={s} className={styles.flowItem}>
          <span className={styles.flowBox}>{s}</span>
          {i < steps.length - 1 && (
            <span className={styles.flowArrow} aria-hidden="true">
              ↓
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

function MirrorDiagram() {
  // A simple stereocentre drawn twice, mirrored across a dashed plane.
  const Centre = ({ flip }) => (
    <g transform={flip ? "translate(300 0) scale(-1 1)" : undefined}>
      <line x1="75" y1="90" x2="75" y2="35" className={styles.bond} />
      <line x1="75" y1="90" x2="30" y2="125" className={styles.bond} />
      <line x1="75" y1="90" x2="125" y2="125" className={styles.bond} />
      <line x1="75" y1="90" x2="75" y2="135" className={styles.bondDash} />
      <circle cx="75" cy="35" r="13" className={styles.dotA} />
      <circle cx="30" cy="125" r="13" className={styles.dotB} />
      <circle cx="125" cy="125" r="13" className={styles.dotC} />
      <circle cx="75" cy="140" r="9" className={styles.dotD} />
      <circle cx="75" cy="90" r="9" className={styles.centre} />
    </g>
  );
  return (
    <svg
      viewBox="0 0 300 170"
      className={styles.mirrorSvg}
      role="img"
      aria-label="A chiral molecule and its mirror image, shown on either side of a dashed mirror plane"
    >
      <Centre />
      <line x1="150" y1="12" x2="150" y2="160" className={styles.plane} />
      <Centre flip />
    </svg>
  );
}

function Hand({ mirrored }) {
  return (
    <svg
      viewBox="0 0 80 100"
      className={styles.handSvg}
      aria-hidden="true"
      style={mirrored ? { transform: "scaleX(-1)" } : undefined}
    >
      <g className={styles.handShape}>
        <rect x="12" y="30" width="9" height="34" rx="4.5" />
        <rect x="24" y="14" width="9" height="46" rx="4.5" />
        <rect x="36" y="8" width="9" height="52" rx="4.5" />
        <rect x="48" y="16" width="9" height="44" rx="4.5" />
        <path d="M14 56 H58 V70 Q58 92 36 94 Q16 92 14 72 Z" />
        <rect
          x="56"
          y="52"
          width="9"
          height="30"
          rx="4.5"
          transform="rotate(-38 60 66)"
        />
      </g>
    </svg>
  );
}

export default function NobelPrize2026({ images = {} }) {
  return (
    <main className={styles.page}>
      {/* 1. HERO */}
      <section className={styles.hero} aria-labelledby="nobel-title">
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>
                ✦ NOBEL PRIZE IN CHEMISTRY · 2026
              </p>
              <h1 id="nobel-title" className={styles.h1}>
                Nobel Prize in <em>Chemistry 2026</em>
              </h1>
              <p className={styles.subtitle}>Henri B. Kagan and Kenso Soai</p>
              <p className={styles.lead}>
                The 2026 Nobel Prize in Chemistry has been awarded to Henri B.
                Kagan and Kenso Soai for their discovery of non-linear effects
                and autocatalysis in asymmetric organic synthesis.
              </p>
              <div className={styles.chips}>
                <span className={styles.chip}>Chirality</span>
                <span className={styles.chip}>Non-linear effects</span>
                <span className={styles.chip}>Autocatalysis</span>
                <span className={styles.chip}>Homochirality</span>
              </div>
            </div>
            <aside
              className={styles.citationCard}
              aria-label="Official prize citation"
            >
              <p className={styles.cardLabel}>Prize citation</p>
              <blockquote className={styles.citation}>“{CITATION}”</blockquote>
              <div className={styles.citationMeta}>
                <span>
                  <strong>2026</strong>
                  Year
                </span>
                <span>
                  <strong>Chemistry</strong>
                  Category
                </span>
                <span>
                  <strong>2</strong>
                  Laureates
                </span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <article>
        {/* 2. LAUREATES */}
        <section className={styles.section} aria-labelledby="laureates">
          <div className={styles.container}>
            <h2 id="laureates" className={styles.h2}>
              The Laureates
            </h2>
            <div className={styles.laureateGrid}>
              {laureates.map((l) => (
                <div key={l.key} className={styles.laureateCard}>
                  <div className={styles.portrait}>
                    {images[l.key] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={images[l.key]} alt={`Portrait of ${l.name}`} />
                    ) : (
                      <span
                        className={styles.portraitPlaceholder}
                        aria-hidden="true"
                      >
                        {l.initials}
                      </span>
                    )}
                  </div>
                  <h3 className={styles.h3}>{l.name}</h3>
                  <dl className={styles.dl}>
                    {l.rows.map(([k, v]) => (
                      <div key={k} className={styles.dlRow}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className={styles.p}>{l.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. CHEMISTRY BEHIND THE PRIZE */}
        <section
          className={`${styles.section} ${styles.alt}`}
          aria-labelledby="chem"
        >
          <div className={styles.container}>
            <h2 id="chem" className={styles.h2}>
              The Chemistry Behind the Nobel Prize
            </h2>
            <div className={styles.twoCol}>
              <div>
                <p className={styles.pLead}>
                  Many molecules exist in two forms that are mirror images of
                  each other. These forms are called enantiomers.
                </p>
                <p className={styles.p}>
                  This property is called <strong>chirality</strong>, from the
                  Greek word for hand. Your left and right hands are mirror
                  images, yet you cannot place one perfectly on top of the
                  other. A glove made for one hand does not fit the other.
                </p>
                <p className={styles.p}>
                  Chiral molecules behave the same way: they can exist as two
                  mirror-image forms that cannot be perfectly superimposed.
                </p>
              </div>
              <div className={styles.visualCard}>
                <div className={styles.handsRow}>
                  <div className={styles.handCol}>
                    <Hand />
                    <span>Left hand</span>
                  </div>
                  <span className={styles.swap} aria-hidden="true">
                    ↔
                  </span>
                  <div className={styles.handCol}>
                    <Hand mirrored />
                    <span>Right hand</span>
                  </div>
                </div>
                <MirrorDiagram />
                <Flow
                  label="From chiral molecule to enantiomers"
                  steps={[
                    "Chiral molecule",
                    "Two mirror images",
                    "Enantiomers",
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. WHY ASYMMETRIC SYNTHESIS MATTERS */}
        <section className={styles.section} aria-labelledby="why-asym">
          <div className={styles.container}>
            <h2 id="why-asym" className={styles.h2}>
              Why Asymmetric Synthesis Matters
            </h2>
            <div className={styles.narrow}>
              <p className={styles.p}>
                When ordinary chemical reactions create chiral molecules, they
                can often produce both mirror-image forms. Chemists therefore
                developed asymmetric synthesis to favour the formation of one
                desired enantiomer. This matters especially in:
              </p>
            </div>
            <div className={styles.cardGrid5}>
              {matters.map((m) => (
                <div key={m.title} className={styles.miniCard}>
                  <span className={styles.mark} aria-hidden="true">
                    {m.mark}
                  </span>
                  <h3 className={styles.h3s}>{m.title}</h3>
                  <p className={styles.small}>{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. KAGAN */}
        <section
          className={`${styles.section} ${styles.alt}`}
          aria-labelledby="kagan"
        >
          <div className={styles.container}>
            <h2 id="kagan" className={styles.h2}>
              Henri B. Kagan: Understanding Non-Linear Effects
            </h2>
            <div className={styles.twoCol}>
              <div>
                <p className={styles.p}>
                  In a simple picture, you might expect the purity of a chiral
                  product to rise in direct proportion to the purity of the
                  chiral catalyst or auxiliary used to make it. That is a{" "}
                  <strong>linear</strong> relationship.
                </p>
                <p className={styles.p}>
                  Kagan demonstrated that this is not always so. In some
                  systems, a small imbalance in chirality can lead to a much
                  larger imbalance in the products than a simple linear
                  relationship would predict. These are called{" "}
                  <strong>non-linear effects</strong>.
                </p>
                <p className={styles.p}>
                  This became an important tool for chemists: it helps in
                  interpreting how asymmetric catalysts work and in designing
                  asymmetric reactions.
                </p>
              </div>
              <div className={styles.visualCard}>
                <Flow
                  label="Non-linear amplification"
                  steps={[
                    "Small chiral imbalance",
                    "Non-linear amplification",
                    "Stronger preference for one enantiomer",
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 6. SOAI */}
        <section className={styles.section} aria-labelledby="soai">
          <div className={styles.container}>
            <h2 id="soai" className={styles.h2}>
              Kenso Soai: The Power of Autocatalysis
            </h2>
            <div className={styles.twoCol}>
              <div>
                <p className={styles.pLead}>
                  In an autocatalytic reaction, a product of the reaction helps
                  catalyse the formation of more of that same product.
                </p>
                <p className={styles.p}>
                  Soai&apos;s work demonstrated a remarkable example of{" "}
                  <strong>asymmetric autocatalysis</strong>, now known as the{" "}
                  <strong>Soai reaction</strong>. Here the product is chiral,
                  and it catalyses its own formation in a way that favours its
                  own handedness. A very small initial imbalance can therefore
                  be amplified.
                </p>
                <p className={styles.p}>
                  This work became especially important in discussions about how
                  molecular asymmetry, and ultimately homochirality, might
                  arise.
                </p>
              </div>
              <div className={`${styles.visualCard} ${styles.featured}`}>
                <Flow
                  label="The Soai reaction as a cycle of amplification"
                  steps={[
                    "Small initial chiral imbalance",
                    "Chiral product forms",
                    "Product acts as catalyst",
                    "More of the same chiral form forms",
                    "Chirality is amplified",
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 7. HOMOCHIRALITY */}
        <section
          className={`${styles.section} ${styles.alt}`}
          aria-labelledby="homo"
        >
          <div className={styles.container}>
            <h2 id="homo" className={styles.h2}>
              The Mystery of Homochirality
            </h2>
            <div className={styles.narrow}>
              <p className={styles.p}>
                Living systems are strongly biased toward one molecular
                handedness. For example, the amino acids in proteins are
                predominantly found in one enantiomeric form.
              </p>
              <p className={styles.pLead}>
                How could such molecular asymmetry emerge?
              </p>
              <p className={styles.p}>
                The discoveries recognised by the 2026 Nobel Prize provided
                important chemical tools and insights relevant to this
                long-standing puzzle. They show how a small imbalance can, in
                principle, be amplified by chemistry itself.
              </p>
            </div>
            <ol
              className={styles.stepper}
              aria-label="Path from symmetry to homochirality"
            >
              {homochiralitySteps.map((s, i) => (
                <li key={s} className={styles.stepperItem}>
                  <span className={styles.stepperNum}>{i + 1}</span>
                  <span className={styles.stepperText}>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 8. WHY IT MATTERS */}
        <section className={styles.section} aria-labelledby="matters">
          <div className={styles.container}>
            <h2 id="matters" className={styles.h2}>
              Why the 2026 Nobel Prize Matters
            </h2>
            <div className={styles.cardGrid5b}>
              {impact.map((c) => (
                <div key={c.n} className={styles.impactCard}>
                  <span className={styles.num}>{c.n}</span>
                  <h3 className={styles.h3s}>{c.title}</h3>
                  <p className={styles.small}>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. SIMPLE TERMS */}
        <section className={styles.section} aria-labelledby="simple">
          <div className={styles.container}>
            <div className={styles.simpleCard}>
              <p className={styles.cardLabel}>Plain-language summary</p>
              <h2 id="simple" className={styles.h2Plain}>
                In Simple Terms
              </h2>
              <p className={styles.simpleText}>
                Imagine that chemistry can make both a left-handed and a
                right-handed version of a molecule. Kagan showed how chemical
                reactions can strongly favour one side, while Soai demonstrated
                how a chiral product can help create more of the same
                handedness. Together, these discoveries helped chemists
                understand and control molecular asymmetry.
              </p>
            </div>
          </div>
        </section>

        {/* 10. KEY FACTS */}
        <section
          className={`${styles.section} ${styles.alt}`}
          aria-labelledby="facts"
        >
          <div className={styles.container}>
            <h2 id="facts" className={styles.h2}>
              Nobel Prize 2026 — Key Facts
            </h2>
            <div className={styles.factsGrid}>
              {facts.map(([k, v]) => (
                <div key={k} className={styles.fact}>
                  <p className={styles.factLabel}>{k}</p>
                  {Array.isArray(v) ? (
                    <ul className={styles.factList}>
                      {v.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.factValue}>{v}</p>
                  )}
                </div>
              ))}
              <div className={`${styles.fact} ${styles.factWide}`}>
                <p className={styles.factLabel}>Citation</p>
                <p className={styles.factValue}>“{CITATION}”</p>
              </div>
            </div>
          </div>
        </section>

        {/* 11. TIMELINE */}
        <section className={styles.section} aria-labelledby="journey">
          <div className={styles.container}>
            <h2 id="journey" className={styles.h2}>
              A Journey Toward Understanding Molecular Handedness
            </h2>
            <ol className={styles.timeline}>
              {journey.map((j, i) => (
                <li key={j.title} className={styles.tlItem}>
                  <span className={styles.tlDot} aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className={styles.h3s}>{j.title}</h3>
                  <p className={styles.small}>{j.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 12. FINAL TAKEAWAY */}
        <section
          className={`${styles.section} ${styles.alt}`}
          aria-labelledby="takeaway"
        >
          <div className={styles.container}>
            <div className={styles.narrow}>
              <h2 id="takeaway" className={styles.h2}>
                A New Way to Think About Molecular Handedness
              </h2>
              <p className={styles.p}>
                The work of Kagan and Soai gave chemists powerful tools for
                understanding and controlling chirality, and helped illuminate
                one of chemistry&apos;s long-standing questions: how molecular
                handedness arises and how it can be amplified.
              </p>
              <blockquote className={styles.callout}>
                Chemistry does not always produce a perfect mirror image.
                Sometimes, a tiny imbalance can become the beginning of
                something much larger.
              </blockquote>
            </div>
          </div>
        </section>
      </article>

      {/* SOURCES */}
      <section className={styles.sources} aria-labelledby="sources">
        <div className={styles.container}>
          <h2 id="sources" className={styles.h2Small}>
            Sources &amp; Further Reading
          </h2>
          <ul className={styles.sourceList}>
            {sources.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
