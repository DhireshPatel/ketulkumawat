'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * Shown while the assistant is "thinking". Combines a bouncing-dot
 * indicator with a shimmering placeholder that hints at streaming text,
 * so the swap to real token-by-token streaming later feels natural.
 */
export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-start gap-2.5 px-4 sm:px-5"
      aria-live="polite"
      aria-label="Assistant is typing"
    >
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: 'var(--ai-accent)' }}
      >
        <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--ai-accent-text)' }} />
      </div>

      <div
        className="max-w-[75%] rounded-2xl rounded-tl-sm px-4 py-3"
        style={{ backgroundColor: 'var(--ai-assistant-bubble)', border: '1px solid var(--ai-border-color)' }}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <span
            className="ai-typing-dot h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: 'var(--ai-accent)' }}
          />
          <span
            className="ai-typing-dot h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: 'var(--ai-accent)' }}
          />
          <span
            className="ai-typing-dot h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: 'var(--ai-accent)' }}
          />
        </div>

        <div className="space-y-1.5 w-40">
          <div className="ai-shimmer-line h-2 w-full" />
          <div className="ai-shimmer-line h-2 w-4/5" />
        </div>
      </div>
    </motion.div>
  );
}
