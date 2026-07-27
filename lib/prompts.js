export const PROMPTS = {
  MCQ: (topic) => `
Generate 20 high-quality NEET/JEE Chemistry MCQs on "${topic}".

Requirements:
- 4 options
- Correct answer
- Short explanation
- Medium difficulty
`,

  SUMMARY: (topic) => `
Generate concise revision notes on "${topic}" suitable for NEET and JEE students.
`,

  REVISION: (topic) => `
Create one-page revision notes on "${topic}".
`,

  FORMULA: (topic) => `
List all important formulas related to "${topic}" with short explanations.
`,
};
