import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isStreaming: boolean;
}

export function ChatInput({ onSendMessage, isStreaming }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isStreaming) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-end gap-3 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            className="flex-1 px-4 py-3 bg-transparent border-none outline-none resize-none max-h-32 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            rows={1}
            disabled={isStreaming}
          />
          
          <button
            type="submit"
            disabled={!message.trim() || isStreaming}
            className="m-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl transition-colors duration-200 disabled:cursor-not-allowed"
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>
            Press Enter to send, Shift+Enter for new line
          </span>
          <span>
            {message.length}/4000
          </span>
        </div>
      </form>
    </div>
  );
}