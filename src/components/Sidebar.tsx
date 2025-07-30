import React, { useState } from 'react';
import { Plus, Search, MessageSquare, Trash2, X } from 'lucide-react';
import { Conversation } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onClose: () => void;
}

export function Sidebar({
  conversations,
  currentConversation,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onClose,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conversation =>
    conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.messages.some(message =>
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedConversations = filteredConversations.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="w-80 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Conversations
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <button
          onClick={onNewConversation}
          className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          <Plus size={20} />
          New Conversation
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {sortedConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          <div className="p-2">
            {sortedConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative mb-2 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentConversation?.id === conversation.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                    : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <MessageSquare 
                    size={18} 
                    className={`mt-0.5 flex-shrink-0 ${
                      currentConversation?.id === conversation.id
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {conversation.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {conversation.messages.length > 0 
                        ? conversation.messages[conversation.messages.length - 1].content
                        : 'No messages'
                      }
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {conversation.messages.length} messages
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-all duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}