import React, { useEffect, useRef, useState } from 'react';
import { User, Bot, MessageSquare, ChevronDown, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Message } from '../types';
import { TypingIndicator } from './TypingIndicator';
import { TextToSpeechButton } from './TextToSpeechButton';
import { CodeBlock } from './CodeBlock';

interface ChatMessagesProps {
  messages: Message[];
  isStreaming: boolean;
}

export function ChatMessages({ messages, isStreaming }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showThoughts, setShowThoughts] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const renderMessageContent = (message: Message) => {
    const [thoughts, userMessage] = message.content.includes('---') 
      ? message.content.split('---')
      : [null, message.content];

    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {thoughts && (
          <div>
            <button 
              onClick={() => setShowThoughts(!showThoughts)}
              className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2"
            >
              {showThoughts ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              {showThoughts ? 'Hide Thoughts' : 'Show Thoughts'}
            </button>
            {showThoughts && (
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2">
                <ReactMarkdown>{thoughts}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {userMessage || ''}
        </ReactMarkdown>
      </div>
    );
  };

  const getTextToSpeechContent = (content: string) => {
    if (content.includes('---')) {
      return content.split('---')[1];
    }
    return content;
  };

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
    <div className="flex-1 p-2 md:p-4 space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {message.role === 'assistant' && (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}

          <div
            className={`max-w-3xl px-5 py-4 rounded-3xl shadow-md transition-all duration-200 ${
              message.role === 'user'
                ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-2xl'
                : 'bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
            }`}
          >
            {renderMessageContent(message)}
            <div className={`flex items-center justify-between text-xs mt-2 ${
              message.role === 'user' 
                ? 'text-blue-100' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              <span>
              {typeof message.timestamp === 'string'
                ? new Date(message.timestamp).toLocaleTimeString()
                : message.timestamp.toLocaleTimeString()}
              </span>
              <TextToSpeechButton text={getTextToSpeechContent(message.content)} />
            </div>
          </div>

          {message.role === 'user' && (
            <div className="w-8 h-8 bg-gray-600 dark:bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
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