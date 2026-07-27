"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

/**
 * Fixed floating action button used to open the assistant. Hidden while
 * the drawer is open (the drawer itself provides a close button).
 */
export default function AIButton({ onOpen, isOpen }) {
  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            onClick={onOpen}
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            aria-label="Open Chemistry AI Tutor"
            className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 rounded-full pl-3.5 pr-4 py-3 sm:pl-4 sm:pr-5"
            style={{
              background:
                "linear-gradient(135deg, var(--ai-accent), var(--ai-brown))",
              boxShadow: "var(--ai-shadow)",
              color: "var(--ai-warm-white)",
              padding: "15px "
            }}
          >
            <Sparkles className="ai-button-icon" />
            <span className="text-sm font-semibold hidden sm:inline">
              Ask AI Tutor
            </span>
          </motion.button>
        )}
      </AnimatePresence>
      <style jsx>{`
        .ai-button-icon {
          width: 20px;
          height: 20px;
        }
      `}</style>
    </>
  );
}
