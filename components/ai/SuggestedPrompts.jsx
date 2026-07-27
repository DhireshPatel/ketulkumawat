'use client';

import { motion } from 'framer-motion';
import { Atom, FlaskConical, ListChecks, GitCompare, NotebookPen } from 'lucide-react';

const PROMPTS = [
  { icon: Atom, text: 'Explain Chemical Bonding' },
  { icon: FlaskConical, text: 'Summarize Thermodynamics' },
  { icon: ListChecks, text: 'Generate 20 NEET MCQs' },
  { icon: GitCompare, text: 'Explain SN1 vs SN2' },
  { icon: NotebookPen, text: 'Revision Notes for Haloalkanes' },
];

/**
 * Clicking a card fills (not sends) the input, via onSelect.
 */
export default function SuggestedPrompts({ onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
      {PROMPTS.map(({ icon: Icon, text }, i) => (
        <motion.button
          key={text}
          type="button"
          onClick={() => onSelect(text)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i, duration: 0.3 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="group flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-colors"
          style={{
            backgroundColor: 'var(--ai-bg-elevated)',
            border: '1px solid var(--ai-border-color)',
            padding: "0 12px"
          }}
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--ai-bg-subtle)' }}
          >
            <Icon className="h-4 w-4" style={{ color: 'var(--ai-accent)' }} />
          </span>
          <span className="text-sm font-medium leading-snug" style={{ color: 'var(--ai-text)' }}>
            {text}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
