import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Bot, MessageSquare, X } from 'lucide-react';

const FloatingChatBubbles = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Bonjour 👋, comment puis-je vous aider ?");
    window.open(`https://wa.me/+2250565868786?text=${message}`, '_blank');
  };

  const handleOpenAI = () => {
    window.open('/assistant-ia', '_blank');
  };

  const handleChatbot = () => {
    window.open('/chatbot', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat bubbles */}
      {isOpen && (
        <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-2 fade-in duration-300">
          {/* WhatsApp Bubble */}
          <Button
            onClick={handleWhatsApp}
            variant="glass"
            size="icon"
            className="w-12 h-12 rounded-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/20 group"
            title="WhatsApp Support"
          >
            <MessageCircle className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
          </Button>

          {/* OpenAI Bubble */}
          <Button
            onClick={handleOpenAI}
            variant="glass"
            size="icon"
            className="w-12 h-12 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/20 group"
            title="Assistant IA OpenAI"
          >
            <Bot className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          </Button>

          {/* Chatbot RAG Bubble */}
          <Button
            onClick={handleChatbot}
            variant="glass"
            size="icon"
            className="w-12 h-12 rounded-full bg-accent/20 hover:bg-accent/30 border border-accent/20 group"
            title="Chatbot QuickJob CI"
          >
            <MessageSquare className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
          </Button>
        </div>
      )}

      {/* Main toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="hero"
        size="icon"
        className="w-14 h-14 rounded-full shadow-glow"
        title={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};

export default FloatingChatBubbles;