'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SuggestedPrompts from './SuggestedPrompts';

/**
 * Empty-state view: large icon, heading, description, and suggestion
 * cards. Selecting a suggestion fills the composer via onSelectPrompt.
 */
export default function WelcomeScreen({ onSelectPrompt }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, var(--ai-accent), var(--ai-brown))',
          boxShadow: 'var(--ai-shadow)',
        }}
      >
        <Sparkles className="h-8 w-8" style={{ color: 'var(--ai-warm-white)' }} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-xl font-bold mb-2"
        style={{ color: 'var(--ai-text)' }}
      >
        How can I help you today?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-sm mb-7 max-w-xs"
        style={{ color: 'var(--ai-text-muted)' }}
      >
        Ask chemistry doubts, generate summaries, revise chapters, create MCQs, and much more.
      </motion.p>

      <SuggestedPrompts onSelect={onSelectPrompt} />
    </div>
  );
}
