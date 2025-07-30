import { Conversation } from '../types';

export function exportToMarkdown(conversation: Conversation): string {
  const header = `# ${conversation.title}\n\n**Model:** ${conversation.model}\n**Created:** ${conversation.createdAt.toLocaleDateString()}\n\n---\n\n`;
  
  const messages = conversation.messages.map(message => {
    const role = message.role === 'user' ? '🧑 **You**' : '🤖 **Assistant**';
    const timestamp = message.timestamp.toLocaleTimeString();
    return `## ${role} (${timestamp})\n\n${message.content}\n\n`;
  }).join('');

  return header + messages;
}

export function exportToJSON(conversation: Conversation): string {
  return JSON.stringify(conversation, null, 2);
}

export function downloadFile(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}