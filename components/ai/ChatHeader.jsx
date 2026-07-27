"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles, X, SquarePen, Trash2 } from "lucide-react";

export default function ChatHeader({ onClose, onNewChat }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  return (
    <div
      className="flex shrink-0 items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b"
      style={{
        borderColor: "var(--ai-border-color)",
        backgroundColor: "var(--ai-bg)",
        padding: "14px"
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, var(--ai-accent), var(--ai-brown))",
          }}
        >
          <Sparkles
            className="h-4.5 w-4.5"
            style={{ color: "var(--ai-warm-white)" }}
          />
        </div>
        <div className="min-w-0">
          <h1
            className="text-sm font-bold truncate"
            style={{ color: "var(--ai-text)" }}
          >
            Chemistry AI Tutor
          </h1>
          <p
            className="text-xs truncate"
            style={{ color: "var(--ai-text-muted)" }}
          >
            Ask anything about Chemistry
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <motion.button
          type="button"
          onClick={onNewChat}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Start new chat"
          title="New chat"
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
          style={{
            color: "var(--ai-text-muted)",
            backgroundColor: "var(--ai-bg-subtle)",
          }}
        >
          <SquarePen className="h-4 w-4" />
        </motion.button>

        <motion.button
          type="button"
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Close assistant"
          title="Close"
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
          style={{
            color: "var(--ai-text-muted)",
            backgroundColor: "var(--ai-bg-subtle)",
          }}
        >
          <X className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}
