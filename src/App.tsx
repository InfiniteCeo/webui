import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { ollamaService } from './services/mockOllamaService';
import { exportToMarkdown, exportToJSON, downloadFile } from './utils/exportUtils';
import { Conversation, Message, OllamaModel, ChatSettings } from './types';

function App() {
  // Initialize theme
  useTheme();

  // State management
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('ollama-conversations', []);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [availableModels, setAvailableModels] = useState<OllamaModel[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  
  const [settings, setSettings] = useLocalStorage<ChatSettings>('ollama-settings', {
    model: 'llama3.2:latest',
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 0.9,
    top_k: 40,
    repeat_penalty: 1.1,
    system_prompt: '',
  });

  // Load available models on startup
  useEffect(() => {
    const loadModels = async () => {
      try {
        const models = await ollamaService.getModels();
        setAvailableModels(models);
        
        // Update settings with first available model if current model doesn't exist
        if (!models.find(m => m.name === settings.model)) {
          setSettings(prev => ({ ...prev, model: models[0]?.name || 'llama3.2:latest' }));
        }
      } catch (error) {
        console.error('Failed to load models:', error);
      }
    };

    loadModels();
  }, [settings.model, setSettings]);

  // Set current conversation to the most recent one on startup
  useEffect(() => {
    if (conversations.length > 0 && !currentConversation) {
      const mostRecent = [...conversations].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
      setCurrentConversation(mostRecent);
    }
  }, [conversations, currentConversation]);

  const generateConversationTitle = (firstMessage: string): string => {
    const words = firstMessage.split(' ');
    if (words.length <= 6) return firstMessage;
    return words.slice(0, 6).join(' ') + '...';
  };

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      model: settings.model,
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    setSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
      setSidebarOpen(false);
    }
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversation?.id === id) {
      const remaining = conversations.filter(c => c.id !== id);
      setCurrentConversation(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversation || isStreaming) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage],
      title: currentConversation.messages.length === 0 
        ? generateConversationTitle(content)
        : currentConversation.title,
      updatedAt: new Date(),
      model: settings.model,
    };

    setCurrentConversation(updatedConversation);
    setConversations(prev => 
      prev.map(c => c.id === currentConversation.id ? updatedConversation : c)
    );

    setIsStreaming(true);

    try {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        model: settings.model,
      };

      // Add empty assistant message
      const conversationWithAssistant = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
        updatedAt: new Date(),
      };

      setCurrentConversation(conversationWithAssistant);

      // Stream the response
      let fullResponse = '';
      const stream = ollamaService.streamChat(
        updatedConversation.messages,
        settings
      );

      for await (const token of stream) {
        fullResponse += token;
        
        const updatedAssistantMessage = {
          ...assistantMessage,
          content: fullResponse,
        };

        const finalConversation = {
          ...conversationWithAssistant,
          messages: [
            ...conversationWithAssistant.messages.slice(0, -1),
            updatedAssistantMessage,
          ],
          updatedAt: new Date(),
        };

        setCurrentConversation(finalConversation);
        setConversations(prev => 
          prev.map(c => c.id === currentConversation.id ? finalConversation : c)
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error appropriately
    } finally {
      setIsStreaming(false);
    }
  };

  const handleUpdateSettings = (newSettings: Partial<ChatSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleExportConversation = (format: 'json' | 'markdown') => {
    if (!currentConversation) return;

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${currentConversation.title.replace(/[^a-z0-9]/gi, '-')}-${timestamp}`;

    if (format === 'markdown') {
      const content = exportToMarkdown(currentConversation);
      downloadFile(content, `${filename}.md`, 'text/markdown');
    } else {
      const content = exportToJSON(currentConversation);
      downloadFile(content, `${filename}.json`, 'application/json');
    }
  };

  return (
    <Layout
      conversations={conversations}
      currentConversation={currentConversation}
      availableModels={availableModels}
      settings={settings}
      isStreaming={isStreaming}
      sidebarOpen={sidebarOpen}
      settingsPanelOpen={settingsPanelOpen}
      onNewConversation={handleNewConversation}
      onSelectConversation={handleSelectConversation}
      onDeleteConversation={handleDeleteConversation}
      onSendMessage={handleSendMessage}
      onUpdateSettings={handleUpdateSettings}
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      onToggleSettingsPanel={() => setSettingsPanelOpen(!settingsPanelOpen)}
      onExportConversation={handleExportConversation}
    />
  );
}

export default App;