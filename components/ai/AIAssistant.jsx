'use client';

/**
 * AIAssistant.jsx
 * -----------------------------------------------------------------------
 * Drop-in, self-contained AI chat assistant. Usage:
 *
 *   import AIAssistant from '@/components/ai/AIAssistant';
 *   ...
 *   <AIAssistant />
 *
 * That's it — it renders its own floating trigger button and manages
 * its own open/closed + conversation state internally. Nothing else in
 * your app needs to change.
 *
 * To wire up a real model later, edit ONLY components/ai/MockAI.js.
 * -----------------------------------------------------------------------
 */

import { useState, useCallback } from 'react';
import AIButton from './AIButton';
import AIDrawer from './AIDrawer';
import { useChat } from '../../hooks/useChat';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, sendMessage, regenerateLast, setReaction, newChat } = useChat();

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
    setInputValue('');
  }, [inputValue, isLoading, sendMessage]);

  const handleSelectPrompt = useCallback((text) => {
    setInputValue(text);
  }, []);

  const handleNewChat = useCallback(() => {
    newChat();
    setInputValue('');
  }, [newChat]);

  return (
    <>
      <AIButton onOpen={handleOpen} isOpen={isOpen} />
      <AIDrawer
        isOpen={isOpen}
        onClose={handleClose}
        onNewChat={handleNewChat}
        messages={messages}
        isLoading={isLoading}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSend={handleSend}
        onSelectPrompt={handleSelectPrompt}
        onRegenerate={regenerateLast}
        onReact={setReaction}
      />
    </>
  );
}
