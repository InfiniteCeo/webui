import React from 'react';
import { Menu, Settings, Download } from 'lucide-react';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ThemeToggle } from './ThemeToggle';
import { Conversation } from '../types';

interface ChatAreaProps {
  conversation: Conversation | null;
  isStreaming: boolean;
  sidebarOpen: boolean;
  onSendMessage: (message: string) => void;
  onToggleSidebar: () => void;
  onToggleSettingsPanel: () => void;
  onExportConversation: (format: 'json' | 'markdown') => void;
}

export function ChatArea({
  conversation,
  isStreaming,
  sidebarOpen,
  onSendMessage,
  onToggleSidebar,
  onToggleSettingsPanel,
  onExportConversation,
}: ChatAreaProps) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {conversation?.title || 'New Conversation'}
            </h1>
            {conversation && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {conversation.messages.length} messages • Model: {conversation.model}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {conversation && conversation.messages.length > 0 && (
            <div className="relative group">
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                <Download size={20} />
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => onExportConversation('markdown')}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Export as Markdown
                  </button>
                  <button
                    onClick={() => onExportConversation('json')}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Export as JSON
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={onToggleSettingsPanel}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <Settings size={20} />
          </button>
          
          <ThemeToggle />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-0 md:px-8 py-2">
        <ChatMessages 
          messages={conversation?.messages || []} 
          isStreaming={isStreaming}
        />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-inner">
        <ChatInput 
          onSendMessage={onSendMessage} 
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}