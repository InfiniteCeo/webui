# Ollama Web UI

A modern, responsive web interface for interacting with Ollama large language models. This application provides a ChatGPT-like experience for local AI models with advanced features and a polished user interface.

## Features

### 🎯 Core Functionality
- **Real-time Chat Interface**: Smooth, responsive chat with streaming AI responses
- **Multiple Model Support**: Easy switching between different Ollama models
- **Conversation Management**: Create, save, search, and organize conversations
- **Advanced Settings**: Fine-tune model parameters (temperature, top-p, top-k, etc.)
- **System Prompts**: Customize AI behavior with custom system prompts

### 🎨 User Experience
- **Modern UI/UX**: Clean, professional interface inspired by leading AI chat applications
- **Dark/Light Theme**: Automatic theme detection with manual override
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Thoughtful micro-interactions and transitions
- **Typing Indicators**: Real-time feedback during AI response generation

### 📱 Additional Features
- **Export Conversations**: Save chats as Markdown or JSON files
- **Search & Filter**: Find specific conversations quickly
- **Persistent Storage**: Conversations saved locally in browser
- **Keyboard Shortcuts**: Efficient navigation and message sending
- **Connection Status**: Monitor Ollama connection health

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React hooks with localStorage persistence
- **API Integration**: Mock Ollama service (easily replaceable with real API)

## Getting Started

### Prerequisites
- Node.js 18+ 
- Ollama installed and running locally (for production use)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ollama-web-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Serve the built files**
   ```bash
   npm run preview
   ```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_OLLAMA_API_URL=http://localhost:11434
VITE_APP_NAME=Ollama Web UI
```

### Connecting to Real Ollama Instance

To connect to a real Ollama instance, replace the mock service in `src/services/mockOllamaService.ts` with a real implementation:

```typescript
// src/services/ollamaService.ts
class OllamaService {
  private baseUrl = import.meta.env.VITE_OLLAMA_API_URL || 'http://localhost:11434';

  async getModels(): Promise<OllamaModel[]> {
    const response = await fetch(`${this.baseUrl}/api/tags`);
    const data = await response.json();
    return data.models;
  }

  async *streamChat(messages: Message[], settings: ChatSettings) {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: settings.model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: true,
        options: {
          temperature: settings.temperature,
          top_p: settings.top_p,
          top_k: settings.top_k,
          repeat_penalty: settings.repeat_penalty,
        },
      }),
    });

    const reader = response.body?.getReader();
    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              yield data.message.content;
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }
    }
  }
}
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Layout.tsx      # Main layout component
│   ├── Sidebar.tsx     # Conversation sidebar
│   ├── ChatArea.tsx    # Main chat interface
│   ├── ChatMessages.tsx # Message display
│   ├── ChatInput.tsx   # Message input
│   ├── SettingsPanel.tsx # Configuration panel
│   ├── ThemeToggle.tsx # Theme switcher
│   └── TypingIndicator.tsx # Loading animation
├── hooks/              # Custom React hooks
│   ├── useLocalStorage.ts # Persistent storage
│   └── useTheme.ts     # Theme management
├── services/           # API services
│   └── mockOllamaService.ts # Mock Ollama API
├── types/              # TypeScript type definitions
│   └── index.ts        # Main type exports
├── utils/              # Utility functions
│   └── exportUtils.ts  # Export functionality
└── App.tsx             # Main application component
```

## Customization

### Themes
The application supports custom themes through Tailwind CSS. Modify `tailwind.config.js` to add custom colors:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom color palette
      },
    },
  },
},
```

### Models
Add or modify available models in `src/services/mockOllamaService.ts`:

```typescript
const MOCK_MODELS: OllamaModel[] = [
  {
    name: 'your-model:latest',
    displayName: 'Your Custom Model',
    size: '7.2GB',
    modified: new Date(),
    parameters: {
      temperature: 0.7,
      top_p: 0.9,
      top_k: 40,
      repeat_penalty: 1.1,
    },
  },
  // ... more models
];
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Ollama](https://ollama.ai/) for the excellent local LLM runtime
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icon set
- [React](https://reactjs.org/) for the robust UI framework