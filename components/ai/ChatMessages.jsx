'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import WelcomeScreen from './WelcomeScreen';

export default function ChatMessages({ messages, isLoading, onSelectPrompt, onRegenerate, onReact }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to the latest message whenever the list or loading state changes.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto ai-scroll">
        <WelcomeScreen onSelectPrompt={onSelectPrompt} />
      </div>
    );
  }

  const lastAssistantId = [...messages].reverse().find((m) => m.role === 'assistant')?.id;

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto ai-scroll py-4 space-y-4" style={{padding: "16px 0"}}>
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLast={message.id === lastAssistantId && !isLoading}
            onRegenerate={onRegenerate}
            onReact={(liked) => onReact(message.id, liked)}
          />
        ))}
        {isLoading && <TypingIndicator key="typing-indicator" />}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}
