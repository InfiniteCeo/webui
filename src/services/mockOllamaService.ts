import { OllamaModel, Message, ChatSettings } from '../types';

const MOCK_MODELS: OllamaModel[] = [
  {
    name: 'llama3.2:latest',
    displayName: 'Llama 3.2 Latest',
    size: '4.7GB',
    modified: new Date('2024-01-15'),
    parameters: {
      temperature: 0.7,
      top_p: 0.9,
      top_k: 40,
      repeat_penalty: 1.1,
    },
  },
  {
    name: 'codellama:latest',
    displayName: 'Code Llama',
    size: '3.8GB',
    modified: new Date('2024-01-10'),
    parameters: {
      temperature: 0.3,
      top_p: 0.95,
      top_k: 50,
      repeat_penalty: 1.0,
    },
  },
  {
    name: 'mistral:latest',
    displayName: 'Mistral 7B',
    size: '4.1GB',
    modified: new Date('2024-01-08'),
    parameters: {
      temperature: 0.8,
      top_p: 0.9,
      top_k: 40,
      repeat_penalty: 1.1,
    },
  },
  {
    name: 'neural-chat:latest',
    displayName: 'Neural Chat',
    size: '4.3GB',
    modified: new Date('2024-01-05'),
    parameters: {
      temperature: 0.7,
      top_p: 0.9,
      top_k: 40,
      repeat_penalty: 1.1,
    },
  },
];

const SAMPLE_RESPONSES = [
  "I'd be happy to help you with that! Let me break this down for you...",
  "That's an interesting question. Based on what you're asking, I think...",
  "Here's a comprehensive approach to solving this problem...",
  "Let me provide you with a detailed explanation of this concept...",
  "I understand what you're looking for. Here's how we can approach this...",
];

class MockOllamaService {
  private baseUrl = 'http://localhost:11434';

  async getModels(): Promise<OllamaModel[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_MODELS;
  }

  async *streamChat(
    messages: Message[],
    settings: ChatSettings,
    onToken?: (token: string) => void
  ): AsyncGenerator<string, void, unknown> {
    const lastMessage = messages[messages.length - 1];
    const response = this.generateMockResponse(lastMessage.content);
    
    // Simulate streaming response
    const words = response.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i] + (i < words.length - 1 ? ' ' : '');
      
      // Random delay between 50-200ms per word to simulate realistic streaming
      await new Promise(resolve => 
        setTimeout(resolve, Math.random() * 150 + 50)
      );
      
      if (onToken) {
        onToken(word);
      }
      
      yield word;
    }
  }

  private generateMockResponse(prompt: string): string {
    const baseResponse = SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)];
    
    // Generate contextual responses based on prompt keywords
    if (prompt.toLowerCase().includes('code') || prompt.toLowerCase().includes('programming')) {
      return `${baseResponse}\n\nHere's a code example:\n\n\`\`\`javascript\nfunction example() {\n  console.log("This is a sample code snippet");\n  return "Hello, World!";\n}\n\`\`\`\n\nThis demonstrates the basic structure and can be adapted for your specific needs.`;
    }
    
    if (prompt.toLowerCase().includes('explain') || prompt.toLowerCase().includes('what is')) {
      return `${baseResponse}\n\n1. **First Point**: This is the foundational concept you need to understand.\n\n2. **Second Point**: Building on that, we can see how this relates to the broader topic.\n\n3. **Third Point**: Finally, this practical application shows how it all comes together.\n\nWould you like me to elaborate on any of these points?`;
    }
    
    // Default response with some variation
    const elaborations = [
      "\n\nThis approach has several advantages and is widely used in the industry.",
      "\n\nLet me know if you'd like me to dive deeper into any specific aspect.",
      "\n\nI hope this helps clarify things! Feel free to ask any follow-up questions.",
      "\n\nThis should give you a solid foundation to work with. What would you like to explore next?",
    ];
    
    return baseResponse + elaborations[Math.floor(Math.random() * elaborations.length)];
  }

  async checkConnection(): Promise<boolean> {
    // Simulate connection check
    await new Promise(resolve => setTimeout(resolve, 300));
    return true; // Always return true for mock service
  }
}

export const ollamaService = new MockOllamaService();