import React from 'react';
import { X, Sliders } from 'lucide-react';
import { OllamaModel, ChatSettings } from '../types';

interface SettingsPanelProps {
  settings: ChatSettings;
  availableModels: OllamaModel[];
  onUpdateSettings: (settings: Partial<ChatSettings>) => void;
  onClose: () => void;
}

export function SettingsPanel({
  settings,
  availableModels,
  onUpdateSettings,
  onClose,
}: SettingsPanelProps) {
  return (
    <div className="w-80 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Settings
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Settings Content */}
      <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Model
          </label>
          <select
            value={settings.model}
            onChange={(e) => onUpdateSettings({ model: e.target.value })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            {availableModels.map((model) => (
              <option key={model.name} value={model.name}>
                {model.displayName} ({model.size})
              </option>
            ))}
          </select>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Temperature: {settings.temperature}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => onUpdateSettings({ temperature: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Focused</span>
            <span>Balanced</span>
            <span>Creative</span>
          </div>
        </div>

        {/* Max Tokens */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Tokens
          </label>
          <input
            type="number"
            min="1"
            max="4000"
            value={settings.max_tokens}
            onChange={(e) => onUpdateSettings({ max_tokens: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>

        {/* Top P */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Top P: {settings.top_p}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.top_p}
            onChange={(e) => onUpdateSettings({ top_p: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Top K */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Top K
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={settings.top_k}
            onChange={(e) => onUpdateSettings({ top_k: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>

        {/* Repeat Penalty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Repeat Penalty: {settings.repeat_penalty}
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.repeat_penalty}
            onChange={(e) => onUpdateSettings({ repeat_penalty: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* System Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            System Prompt
          </label>
          <textarea
            value={settings.system_prompt}
            onChange={(e) => onUpdateSettings({ system_prompt: e.target.value })}
            placeholder="Enter a system prompt to set the AI's behavior..."
            rows={4}
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
          />
        </div>

        {/* Connection Status */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Connected to Ollama
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}