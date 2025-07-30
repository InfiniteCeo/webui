import React from 'react';
import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-4 justify-start">
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-5 h-5 text-white" />
      </div>
      
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            AI is typing...
          </span>
        </div>
      </div>
    </div>
  );
}