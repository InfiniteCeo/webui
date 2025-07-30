export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date | string;
  model?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  model: string;
}

export interface OllamaModel {
  name: string;
  displayName: string;
  size: string;
  modified: Date;
  parameters: {
    temperature: number;
    top_p: number;
    top_k: number;
    repeat_penalty: number;
  };
}

export interface ChatSettings {
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  top_k: number;
  repeat_penalty: number;
  system_prompt: string;
}

export interface Theme {
  mode: 'light' | 'dark';
}

export interface AppState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  availableModels: OllamaModel[];
  settings: ChatSettings;
  theme: Theme;
  isStreaming: boolean;
  sidebarOpen: boolean;
}