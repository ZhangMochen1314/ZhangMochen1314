import React, { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { themes, applyTheme } from '@/lib/themes';

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'default';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const handleThemeChange = (themeKey: string) => {
    setCurrentTheme(themeKey);
    applyTheme(themeKey);
    localStorage.setItem('app-theme', themeKey);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 left-0 mb-2 w-64 bg-[var(--theme-light)] border border-[var(--theme-border)] shadow-2xl rounded-2xl p-4 overflow-hidden backdrop-blur-lg">
          <h3 className="text-sm font-semibold text-[var(--theme-dark)] mb-3 font-heading border-b border-[var(--theme-border)] pb-2">
            主题风格 (Themes)
          </h3>
          <div className="max-h-60 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-body flex items-center gap-3 transition-colors ${
                  currentTheme === key
                    ? 'bg-[var(--theme-accent1)] text-[var(--theme-light)]'
                    : 'text-[var(--theme-dark)] hover:bg-[var(--theme-border)]'
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full border shadow-sm flex-shrink-0"
                  style={{ backgroundColor: theme.colors.bg, borderColor: theme.colors.accent1 }}
                />
                <span className="truncate">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-[var(--theme-dark)] text-[var(--theme-light)] shadow-xl flex items-center justify-center hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-[var(--theme-accent1)]"
        title="切换主题"
      >
        <Palette size={20} />
      </button>
    </div>
  );
}