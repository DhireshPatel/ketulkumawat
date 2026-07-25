'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { renderMarkdown } from './renderMarkdown';

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function IconButton({ onClick, active, activeColor, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={!!active}
      className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:opacity-100"
      style={{
        color: active ? activeColor : 'var(--ai-text-muted)',
        backgroundColor: active ? 'var(--ai-bg-subtle)' : 'transparent',
        opacity: active ? 1 : 0.7,
      }}
    >
      {children}
    </button>
  );
}

export default function ChatMessage({ message, isLast, onRegenerate, onReact }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — fail silently, non-critical.
    }
  };

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex items-start justify-end gap-2.5 px-4 sm:px-5"
      >
        <div className="flex max-w-[80%] flex-col items-end">
          <div
            className="rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words"
            style={{ backgroundColor: 'var(--ai-user-bubble)', color: 'var(--ai-user-bubble-text)' }}
          >
            {message.content}
          </div>
          <span className="mt-1 mr-1 text-[11px]" style={{ color: 'var(--ai-text-muted)' }}>
            {formatTime(message.createdAt)}
          </span>
        </div>
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: 'var(--ai-bg-subtle)' }}
        >
          <User className="h-3.5 w-3.5" style={{ color: 'var(--ai-text-muted)' }} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex items-start gap-2.5 px-4 sm:px-5"
    >
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: 'var(--ai-accent)' }}
      >
        <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--ai-accent-text)' }} />
      </div>

      <div className="flex max-w-[85%] flex-col items-start">
        <div
          className="ai-markdown rounded-2xl rounded-tl-sm px-4 py-3 text-sm"
          style={{
            backgroundColor: 'var(--ai-assistant-bubble)',
            color: 'var(--ai-text)',
            border: '1px solid var(--ai-border-color)',
          }}
        >
          {renderMarkdown(message.content)}
        </div>

        <div className="mt-1.5 ml-1 flex items-center gap-1">
          <span className="text-[11px] mr-1.5" style={{ color: 'var(--ai-text-muted)' }}>
            {formatTime(message.createdAt)}
          </span>

          <IconButton onClick={handleCopy} label="Copy response">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </IconButton>

          {isLast && (
            <IconButton onClick={onRegenerate} label="Regenerate response">
              <RotateCcw className="h-3.5 w-3.5" />
            </IconButton>
          )}

          <IconButton
            onClick={() => onReact(true)}
            active={message.liked === true}
            activeColor="var(--ai-accent)"
            label="Like response"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </IconButton>

          <IconButton
            onClick={() => onReact(false)}
            active={message.liked === false}
            activeColor="#c0392b"
            label="Dislike response"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>
    </motion.div>
  );
}
