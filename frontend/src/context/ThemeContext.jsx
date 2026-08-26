import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = [
  { id: 'dark-ink', name: 'Midnight Ink', bg: 'bg-[#121214]', text: 'text-stone-200', cardBg: 'bg-[#1a191d]', border: 'border-stone-800', accent: 'amber-500' },
  { id: 'amber-dusk', name: 'Amber Dusk', bg: 'bg-[#181412]', text: 'text-amber-100', cardBg: 'bg-[#221c18]', border: 'border-amber-900/40', accent: 'amber-400' },
  { id: 'parchment', name: 'Warm Parchment', bg: 'bg-[#fcfaf4]', text: 'text-stone-800', cardBg: 'bg-[#f5f0e6]', border: 'border-stone-300', accent: 'amber-700' },
  { id: 'emerald-moss', name: 'Emerald Moss', bg: 'bg-[#0a1512]', text: 'text-emerald-100', cardBg: 'bg-[#10231e]', border: 'border-emerald-900/40', accent: 'emerald-400' },
];

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('poetverse_theme');
    return THEMES.find(t => t.id === saved) || THEMES[0];
  });

  const [readerFont, setReaderFont] = useState('font-serif-reading'); // 'font-serif-reading', 'font-serif-display', 'font-sans-modern'
  const [fontSize, setFontSize] = useState('text-lg'); // 'text-base', 'text-lg', 'text-xl'

  useEffect(() => {
    localStorage.setItem('poetverse_theme', currentTheme.id);
  }, [currentTheme]);

  const setTheme = (themeId) => {
    const found = THEMES.find(t => t.id === themeId);
    if (found) setCurrentTheme(found);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        setTheme,
        themes: THEMES,
        readerFont,
        setReaderFont,
        fontSize,
        setFontSize,
      }}
    >
      <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
