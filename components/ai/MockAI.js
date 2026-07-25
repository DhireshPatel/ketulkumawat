/**
 * MockAI.js
 * -----------------------------------------------------------------------
 * Fake "AI" response generator. This is the ONLY file you need to replace
 * when you wire up a real model (Gemini, OpenAI, Claude, etc).
 *
 * Contract:
 *   getMockResponse(userText: string) -> Promise<string>  (markdown)
 *
 * Keep that contract identical in your real implementation and nothing
 * else in the component tree has to change — see the integration guide
 * at the bottom of the README for the drop-in replacement.
 * -----------------------------------------------------------------------
 */

// Small helper so responses don't feel robotic/instant when swapped for
// a real streaming API later — callers already await this.
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Each entry: a list of keyword triggers + a builder function that
 * returns a markdown string. First match wins.
 */
const TOPIC_HANDLERS = [
  {
    keywords: ['hybridization', 'hybridisation'],
    build: () => `## Hybridization

Hybridization is the mixing of atomic orbitals to form new, equivalent hybrid orbitals suited for pairing in a chemical bond.

**Common types:**

| Hybridization | Geometry | Bond Angle | Example |
|---|---|---|---|
| sp | Linear | 180° | BeCl₂ |
| sp² | Trigonal planar | 120° | BF₃ |
| sp³ | Tetrahedral | 109.5° | CH₄ |
| sp³d | Trigonal bipyramidal | 90°/120° | PCl₅ |
| sp³d² | Octahedral | 90° | SF₆ |

**Key idea:** the number of hybrid orbitals formed always equals the number of atomic orbitals mixed.

\`\`\`
Steps to find hybridization:
1. Count sigma bonds around the central atom
2. Count lone pairs on the central atom
3. Add them → steric number
4. SN = 2 → sp, SN = 3 → sp², SN = 4 → sp³
\`\`\`

Want me to walk through a specific molecule, like NH₃ or SF₄?`,
  },
  {
    keywords: ['sn1', 'sn2', 'nucleophilic substitution'],
    build: () => `## SN1 vs SN2 Reactions

Both are nucleophilic substitution mechanisms, but they differ in almost every mechanistic detail.

**SN1 (Substitution Nucleophilic Unimolecular)**
- Two-step mechanism via a carbocation intermediate
- Rate depends only on substrate: Rate = k[substrate]
- Favored by **3° substrates**, polar protic solvents
- Leads to **racemization** (loss of stereochemistry)

**SN2 (Substitution Nucleophilic Bimolecular)**
- Single concerted step — backside attack
- Rate depends on both: Rate = k[substrate][nucleophile]
- Favored by **1° substrates**, polar aprotic solvents
- Leads to **inversion of configuration** (Walden inversion)

| Feature | SN1 | SN2 |
|---|---|---|
| Steps | 2 | 1 |
| Intermediate | Carbocation | None |
| Stereochemistry | Racemization | Inversion |
| Best substrate | 3° | 1° |
| Solvent | Polar protic | Polar aprotic |

A useful shortcut: **"SN1 likes stability, SN2 likes space."** Bulky, stable carbocations favor SN1; open, unhindered carbons favor SN2.

Want a few practice questions to test this?`,
  },
  {
    keywords: ['thermodynamics'],
    build: () => `## Thermodynamics — Chapter Summary

**1. System & Surroundings**
The system is the part of the universe under study; everything else is the surroundings.

**2. First Law**
Energy can neither be created nor destroyed:
$$\\Delta U = q + w$$

**3. Enthalpy (H)**
$$H = U + PV$$
At constant pressure, $\\Delta H = q_p$

**4. Entropy (S)**
A measure of disorder. For a spontaneous process in an isolated system, $\\Delta S_{universe} > 0$.

**5. Gibbs Free Energy**
$$\\Delta G = \\Delta H - T\\Delta S$$

- $\\Delta G < 0$ → spontaneous
- $\\Delta G = 0$ → equilibrium
- $\\Delta G > 0$ → non-spontaneous

**Quick revision list:**
- First law → energy conservation
- Second law → entropy of universe increases
- Third law → entropy of a perfect crystal at 0 K is zero
- Hess's Law → enthalpy change is path-independent

Would you like a set of numerical problems on this chapter?`,
  },
  {
    keywords: ['haloalkane', 'haloalkanes', 'alkyl halide'],
    build: () => `## Revision Notes — Haloalkanes

**Preparation**
- From alcohols: $ROH + HX \\rightarrow RX + H_2O$
- From alkenes: addition of HX or X₂
- Free radical halogenation of alkanes

**Physical Properties**
- Polar C–X bond, weak dipole-dipole forces
- Boiling point: RI > RBr > RCl > RF (for same R)
- Denser than water (except fluorides)

**Chemical Reactions**
1. Nucleophilic substitution (SN1 / SN2)
2. Elimination (E1 / E2) → forms alkenes
3. Reaction with metals (Wurtz reaction, Grignard reagent formation)

**Important Named Reactions**
- **Wurtz reaction:** $2RX + 2Na \\rightarrow R{-}R + 2NaX$
- **Finkelstein reaction:** exchange of Cl/Br with I using NaI in acetone
- **Swarts reaction:** exchange of Cl/Br with F using AgF/SbF₃

**Quick memory hook:** *substitution needs a nucleophile, elimination needs a base* — the same reagent (like OH⁻) can act as either depending on conditions.

Want a diagram-style comparison of E1 vs E2 next?`,
  },
  {
    keywords: ['chemical bonding', 'ionic bond', 'covalent bond'],
    build: () => `## Chemical Bonding — Explained

Chemical bonding is the force that holds atoms together in a compound, driven by the tendency to achieve a stable (usually octet) electron configuration.

**1. Ionic Bonding**
- Formed by complete transfer of electrons
- Between a metal and a non-metal
- Example: $NaCl$ — Na loses 1e⁻, Cl gains 1e⁻

**2. Covalent Bonding**
- Formed by sharing of electron pairs
- Between two non-metals
- Can be single, double, or triple bonds

**3. Coordinate (Dative) Bonding**
- Both shared electrons come from one atom
- Example: $NH_4^+$

**4. Metallic Bonding**
- Delocalized "sea of electrons" holding metal cations together

**VSEPR quick reference:**

| Electron pairs | Shape |
|---|---|
| 2 | Linear |
| 3 | Trigonal planar |
| 4 | Tetrahedral |
| 5 | Trigonal bipyramidal |
| 6 | Octahedral |

Want me to go deeper into VSEPR theory or molecular orbital theory next?`,
  },
];

/**
 * Generates a small set of MCQs. Used whenever the user asks for
 * "MCQs", "questions", "test", "quiz", etc.
 */
function buildMCQs(userText) {
  const countMatch = userText.match(/(\d+)\s*(mcq|question)/i);
  const count = countMatch ? Math.min(parseInt(countMatch[1], 10), 5) : 5;

  const bank = [
    {
      q: 'Which of the following has sp³ hybridization at the central atom?',
      options: ['BF₃', 'CH₄', 'BeCl₂', 'C₂H₂'],
      answer: 'CH₄',
    },
    {
      q: 'The SN1 reaction proceeds through which intermediate?',
      options: ['Carbanion', 'Free radical', 'Carbocation', 'Carbene'],
      answer: 'Carbocation',
    },
    {
      q: 'For a spontaneous process at constant T and P, ΔG is:',
      options: ['Positive', 'Zero', 'Negative', 'Infinite'],
      answer: 'Negative',
    },
    {
      q: 'Wurtz reaction is used to prepare:',
      options: ['Alcohols', 'Alkanes', 'Alkenes', 'Alkynes'],
      answer: 'Alkanes',
    },
    {
      q: 'Which solvent favors SN2 reactions?',
      options: ['Polar protic', 'Polar aprotic', 'Non-polar', 'Any solvent'],
      answer: 'Polar aprotic',
    },
  ];

  const selected = bank.slice(0, count);
  const lines = [`## Practice MCQs (${selected.length})`, ''];

  selected.forEach((item, i) => {
    lines.push(`**${i + 1}. ${item.q}**`);
    item.options.forEach((opt, j) => {
      lines.push(`   ${String.fromCharCode(65 + j)}. ${opt}`);
    });
    lines.push('');
  });

  lines.push('---');
  lines.push('**Answer Key:** ' + selected.map((item, i) => `${i + 1}. ${item.answer}`).join(' · '));

  return lines.join('\n');
}

function buildGenericResponse(userText) {
  const trimmed = userText.trim();
  return `Here's what I can tell you about **"${trimmed}"**:

This looks like a great topic to break down step by step. In a full integration, this is where a live model would generate a tailored explanation, complete with definitions, examples, and diagrams where useful.

For now, here's a general study approach you can apply:

1. **Define the core concept** in your own words first
2. **Identify the underlying principle** (law, rule, or mechanism)
3. **Work through one solved example**
4. **Try a related problem** on your own

\`\`\`
Tip: Chemistry rewards pattern recognition —
once you see the "shape" of a problem type,
similar questions become much faster to solve.
\`\`\`

Try asking about a specific topic like *hybridization*, *SN1 vs SN2*, *thermodynamics*, or *haloalkanes* — or ask me to generate MCQs or revision notes!`;
}

/**
 * Main entry point. Simulates network latency, then returns a markdown
 * string based on lightweight keyword matching against the user's message.
 */
export async function getMockResponse(userText) {
  await wait(1500);

  const lower = userText.toLowerCase();

  if (/(mcq|quiz|questions?\s*(on|for|about))/i.test(lower) && /\d+|mcq|quiz/i.test(lower)) {
    return buildMCQs(userText);
  }

  for (const handler of TOPIC_HANDLERS) {
    if (handler.keywords.some((kw) => lower.includes(kw))) {
      return handler.build();
    }
  }

  return buildGenericResponse(userText);
}
