import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const;

  return (
    <div className="relative group">
      <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
        {theme === 'light' && <Sun size={20} />}
        {theme === 'dark' && <Moon size={20} />}
        {theme === 'system' && <Monitor size={20} />}
      </button>
      
      <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        <div className="py-1">
          {themes.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm transition-colors ${
                theme === value
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}