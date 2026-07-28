"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SendHorizontal, Paperclip, Mic } from "lucide-react";

const MAX_LENGTH = 2000;

export default function MessageInput({ value, onChange, onSend, disabled }) {
  const textareaRef = useRef(null);

  // Auto-grow the textarea up to a max height, then let it scroll internally.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  };

  const remaining = MAX_LENGTH - value.length;

  return (
    <div
      className="shrink-0 px-3 sm:px-4 py-3 border-t"
      style={{
        backgroundColor: "var(--ai-bg)",
        borderColor: "var(--ai-border-color)",
        marginBottom: "0px",
        margin: "5px",
      }}
    >
      <div
        className="flex items-end gap-2 rounded-2xl px-2.5 py-2 transition-colors"
        style={{
          backgroundColor: "var(--ai-bg-elevated)",
          border: "1px solid var(--ai-border-color)",
        }}
      >
        {/* <button
          type="button"
          disabled
          aria-label="Attach file (coming soon)"
          title="Attachments coming soon"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg cursor-not-allowed opacity-40"
          style={{ color: 'var(--ai-text-muted)' }}
        >
          <Paperclip className="h-4 w-4" />
        </button> */}

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          maxLength={MAX_LENGTH}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask any Chemistry question..."
          aria-label="Message input"
          className="flex-1 resize-none bg-transparent text-sm leading-relaxed py-1.5 outline-none placeholder:opacity-60 disabled:opacity-50"
          style={{
            color: "var(--ai-text)",
            maxHeight: 160,
            padding: "6px 12px",
          }}
        />

        {/* <button
          type="button"
          disabled
          aria-label="Voice input (coming soon)"
          title="Voice input coming soon"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg cursor-not-allowed opacity-40"
          style={{ color: 'var(--ai-text-muted)' }}
        >
          <Mic className="h-4 w-4" />
        </button> */}

        <motion.button
          type="button"
          onClick={onSend}
          disabled={disabled || !value.trim()}
          whileHover={!disabled && value.trim() ? { scale: 1.06 } : {}}
          whileTap={!disabled && value.trim() ? { scale: 0.94 } : {}}
          aria-label="Send message"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--ai-accent)",
            color: "var(--ai-accent-text)",
            margin: "0 5px 0 0",
          }}
        >
          <SendHorizontal className="h-4 w-4" />
        </motion.button>
      </div>

      <div
        className="flex items-center justify-between px-1.5 mt-1.5"
        style={{ padding: " 0 3px", marginTop: "6px" }}
      >
        <span className="text-[11px]" style={{ color: "var(--ai-text-muted)" }}>
          {/* Enter to send · Shift+Enter for new line */}
        </span>
        <span
          className="text-[11px] tabular-nums"
          style={{
            color: remaining < 100 ? "#c0392b" : "var(--ai-text-muted)",
            marginRight: "6px",
          }}
        >
          {value.length}/{MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}
