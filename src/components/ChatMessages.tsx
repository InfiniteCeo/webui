import React, { useEffect, useRef } from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '../types';
import { TypingIndicator } from './TypingIndicator';

interface ChatMessagesProps {
  messages: Message[];
  isStreaming: boolean;
}

export function ChatMessages({ messages, isStreaming }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Welcome to Ollama Chat
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Start a conversation by typing a message below. I'm here to help with any questions or tasks you have.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {message.role === 'assistant' && (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}
          
          <div
            className={`max-w-3xl px-4 py-3 rounded-2xl ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {message.content.split('\n').map((line, index) => {
                if (line.startsWith('```')) {
                  return null; // Handle code blocks separately if needed
                }
                return (
                  <p key={index} className={index === 0 ? 'mt-0' : ''}>
                    {line || '\u00A0'}
                  </p>
                );
              })}
            </div>
            <div className={`text-xs mt-2 ${
              message.role === 'user' 
                ? 'text-blue-100' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
          
          {message.role === 'user' && (
            <div className="w-8 h-8 bg-gray-600 dark:bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white dark:text-gray-800" />
            </div>
          )}
        </div>
      ))}
      
      {isStreaming && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
}