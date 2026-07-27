"use client";

/**
 * useChat.js
 * -----------------------------------------------------------------------
 * All conversation state lives here: messages, loading state, sending,
 * regenerating, liking/disliking, and starting a new chat.
 *
 * Swap `getMockResponse` for a real API call and nothing in the UI layer
 * needs to change — see MockAI.js for the contract.
 * -----------------------------------------------------------------------
 */

import { useState, useCallback, useRef, useEffect } from "react";
// import { getMockResponse } from '../components/ai/MockAI';

let idCounter = 0;
const nextId = () => `msg_${Date.now()}_${idCounter++}`;

const createMessage = (role, content) => ({
  id: nextId(),
  role, // 'user' | 'assistant'
  content,
  createdAt: new Date().toISOString(),
  liked: null, // null | true | false
});

export function useChat() {
  // const [messages, setMessages] = useState([]);

  const [messages, setMessages] = useState(() => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("chem_ai_chat");

    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState(false);
  // Keep the last user message around so "Regenerate" works.
  const lastUserMessageRef = useRef(null);

  const requestAssistantReply = useCallback(
    async (userText) => {
      setIsLoading(true);
      try {
        // const replyText = await getMockResponse(userText);

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userText,
            history: messages,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.reply || "AI service unavailable");
        }

        setMessages((prev) => [
          ...prev,
          createMessage("assistant", data.reply),
        ]);

        // setMessages((prev) => [...prev, createMessage("assistant", replyText)]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          createMessage(
            "assistant",
            // "Sorry, something went wrong generating a response. Please try again.",
            err.message ||
              `⚠️ Sorry! The AI assistant is temporarily unavailable.

This may happen because the AI usage limit has been reached or the service is temporarily busy.

Please try again after some time.`,
          ),
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages],
  );

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      lastUserMessageRef.current = trimmed;
      setMessages((prev) => [...prev, createMessage("user", trimmed)]);
      await requestAssistantReply(trimmed);
    },
    [isLoading, requestAssistantReply],
  );

  const regenerateLast = useCallback(async () => {
    if (!lastUserMessageRef.current || isLoading) return;
    // Drop the last assistant message before regenerating.
    setMessages((prev) => {
      const lastAssistantIndex = [...prev]
        .reverse()
        .findIndex((m) => m.role === "assistant");
      if (lastAssistantIndex === -1) return prev;
      const indexToRemove = prev.length - 1 - lastAssistantIndex;
      return prev.filter((_, i) => i !== indexToRemove);
    });
    await requestAssistantReply(lastUserMessageRef.current);
  }, [isLoading, requestAssistantReply]);

  const setReaction = useCallback((messageId, liked) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, liked: m.liked === liked ? null : liked }
          : m,
      ),
    );
  }, []);

  const newChat = useCallback(() => {
    localStorage.removeItem("chem_ai_chat");
    setMessages([]);
    setIsLoading(false);
    lastUserMessageRef.current = null;
  }, []);

  useEffect(() => {
    localStorage.setItem("chem_ai_chat", JSON.stringify(messages));
  }, [messages]);

  return {
    messages,
    isLoading,
    sendMessage,
    regenerateLast,
    setReaction,
    newChat,
  };
}
