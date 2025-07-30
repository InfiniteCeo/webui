import React from 'react';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { SettingsPanel } from './SettingsPanel';
import { Conversation, OllamaModel, ChatSettings } from '../types';

interface LayoutProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  availableModels: OllamaModel[];
  settings: ChatSettings;
  isStreaming: boolean;
  sidebarOpen: boolean;
  settingsPanelOpen: boolean;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onSendMessage: (message: string) => void;
  onUpdateSettings: (settings: Partial<ChatSettings>) => void;
  onToggleSidebar: () => void;
  onToggleSettingsPanel: () => void;
  onExportConversation: (format: 'json' | 'markdown') => void;
}

export function Layout({
  conversations,
  currentConversation,
  availableModels,
  settings,
  isStreaming,
  sidebarOpen,
  settingsPanelOpen,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onSendMessage,
  onUpdateSettings,
  onToggleSidebar,
  onToggleSettingsPanel,
  onExportConversation,
}: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:relative z-30 transition-transform duration-300 ease-in-out`}>
        <Sidebar
          conversations={conversations}
          currentConversation={currentConversation}
          onNewConversation={onNewConversation}
          onSelectConversation={onSelectConversation}
          onDeleteConversation={onDeleteConversation}
          onClose={() => onToggleSidebar()}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatArea
          conversation={currentConversation}
          isStreaming={isStreaming}
          sidebarOpen={sidebarOpen}
          onSendMessage={onSendMessage}
          onToggleSidebar={onToggleSidebar}
          onToggleSettingsPanel={onToggleSettingsPanel}
          onExportConversation={onExportConversation}
        />
      </div>

      {/* Settings Panel */}
      <div className={`${
        settingsPanelOpen ? 'translate-x-0' : 'translate-x-full'
      } fixed right-0 top-0 z-40 transition-transform duration-300 ease-in-out`}>
        <SettingsPanel
          settings={settings}
          availableModels={availableModels}
          onUpdateSettings={onUpdateSettings}
          onClose={onToggleSettingsPanel}
        />
      </div>

      {/* Overlay */}
      {(sidebarOpen || settingsPanelOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => {
            if (sidebarOpen) onToggleSidebar();
            if (settingsPanelOpen) onToggleSettingsPanel();
          }}
        />
      )}
    </div>
  );
}