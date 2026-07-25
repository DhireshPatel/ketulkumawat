"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";

export default function AIDrawer({
  isOpen,
  onClose,
  onNewChat,
  messages,
  isLoading,
  inputValue,
  onInputChange,
  onSend,
  onSelectPrompt,
  onRegenerate,
  onReact,
}) {
  const drawerRef = useRef(null);

  // Escape key closes the drawer.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Move focus into the drawer when it opens (basic accessibility support).
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => drawerRef.current?.focus(), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — website stays visible/dimmed behind the drawer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(18, 16, 13, 0.45)" }}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <motion.div
            ref={drawerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Chemistry AI Tutor assistant"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed top-0 right-0 z-50 h-dvh w-full sm:w-105 lg:w-120 flex flex-col outline-none"
            style={{
              backgroundColor: "var(--ai-bg)",
              boxShadow: "var(--ai-shadow)",
              borderLeft: "1px solid var(--ai-border-color)",
            }}
          >
            <ChatHeader onClose={onClose} onNewChat={onNewChat} />

            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              onSelectPrompt={onSelectPrompt}
              onRegenerate={onRegenerate}
              onReact={onReact}
            />

            <MessageInput
              value={inputValue}
              onChange={onInputChange}
              onSend={onSend}
              disabled={isLoading}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
